#!/usr/bin/env node

/**
 * Figma-Code Sync Manager
 * Keeps design tokens, components, and documentation synchronized between code and Figma
 */

import dotenv from 'dotenv';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  // Figma file information (you'll need to fill these in)
  figmaFileKey: process.env.FIGMA_FILE_KEY || '', // Get from Figma URL
  figmaToken: process.env.FIGMA_TOKEN || '', // Personal access token
  
  // Paths
  tokensPath: join(__dirname, '../design-tokens'),
  componentsPath: join(__dirname, '../src/components/ui'),
  docsPath: join(__dirname, '../src/components/documentation'),
  
  // Sync settings
  autoCommit: process.env.AUTO_COMMIT === 'true',
  webhookUrl: process.env.SLACK_WEBHOOK || '', // Optional Slack notifications
};

// Sync strategies
const SYNC_STRATEGIES = {
  TOKENS_TO_FIGMA: 'tokens-to-figma',
  FIGMA_TO_TOKENS: 'figma-to-tokens', 
  BIDIRECTIONAL: 'bidirectional',
  VALIDATE_ONLY: 'validate-only'
};

function getCurrentGitHash() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

function getLastModifiedTime(filePath) {
  try {
    return statSync(filePath).mtime;
  } catch (error) {
    return new Date(0);
  }
}

function generateSyncManifest() {
  const manifest = {
    timestamp: new Date().toISOString(),
    gitHash: getCurrentGitHash(),
    syncVersion: '1.0.0',
    
    // Track file changes
    files: {
      tokens: {
        lastModified: getLastModifiedTime(join(CONFIG.tokensPath, 'figma-tokens.json')),
        checksum: generateFileChecksum(join(CONFIG.tokensPath, 'figma-tokens.json'))
      },
      components: {},
      documentation: {}
    },
    
    // Component tracking
    components: getComponentInventory(),
    
    // Sync metadata
    figmaFileKey: CONFIG.figmaFileKey,
    lastFigmaSync: null, // Will be updated when we sync with Figma
    syncConflicts: [],
    
    // Validation status
    validation: {
      tokensValid: false,
      componentsValid: false,
      documentationComplete: false
    }
  };
  
  return manifest;
}

function generateFileChecksum(filePath) {
  if (!existsSync(filePath)) return null;
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    // Simple checksum - in production you might want crypto.createHash
    return Buffer.from(content).toString('base64').slice(0, 32);
  } catch (error) {
    return null;
  }
}

function getComponentInventory() {
  const components = {};
  
  if (!existsSync(CONFIG.componentsPath)) return components;
  
  const files = readdirSync(CONFIG.componentsPath);
  
  files.forEach(file => {
    if (file.endsWith('.tsx') && !file.startsWith('use-')) {
      const componentName = file.replace('.tsx', '');
      const filePath = join(CONFIG.componentsPath, file);
      
      components[componentName] = {
        file: file,
        lastModified: getLastModifiedTime(filePath),
        checksum: generateFileChecksum(filePath),
        hasDocumentation: hasComponentDocumentation(componentName),
        variants: extractComponentVariants(filePath),
        props: extractComponentProps(filePath)
      };
    }
  });
  
  return components;
}

function hasComponentDocumentation(componentName) {
  // Check if component has corresponding documentation
  const docsFile = join(CONFIG.docsPath, `${componentName}Showcase.tsx`);
  return existsSync(docsFile);
}

function extractComponentVariants(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Look for variant definitions (simplified extraction)
    const variantMatches = content.match(/variants:\s*{([^}]+)}/gs);
    if (!variantMatches) return [];
    
    const variants = [];
    variantMatches.forEach(match => {
      const variantNames = match.match(/(\w+):\s*{/g);
      if (variantNames) {
        variants.push(...variantNames.map(v => v.replace(':', '').replace('{', '').trim()));
      }
    });
    
    return [...new Set(variants)];
  } catch (error) {
    return [];
  }
}

function extractComponentProps(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Look for interface definitions (simplified)
    const interfaceMatches = content.match(/interface\s+\w+Props[^{]*{([^}]+)}/gs);
    if (!interfaceMatches) return [];
    
    const props = [];
    interfaceMatches.forEach(match => {
      const propMatches = match.match(/(\w+)[\?:]?\s*:/g);
      if (propMatches) {
        props.push(...propMatches.map(p => p.replace(/[?:].*/, '').trim()));
      }
    });
    
    return [...new Set(props)].filter(p => p !== 'children');
  } catch (error) {
    return [];
  }
}

function validateTokenSync() {
  const issues = [];
  
  // Check if tokens exist
  const tokensFile = join(CONFIG.tokensPath, 'figma-tokens.json');
  if (!existsSync(tokensFile)) {
    issues.push({
      type: 'missing-tokens',
      severity: 'error',
      message: 'Figma tokens file missing. Run npm run extract-tokens first.'
    });
    return issues;
  }
  
  try {
    const tokens = JSON.parse(readFileSync(tokensFile, 'utf-8'));
    
    // Validate token structure
    if (!tokens.global) {
      issues.push({
        type: 'invalid-structure',
        severity: 'error',
        message: 'Missing global token set in figma-tokens.json'
      });
    }
    
    if (!tokens.$themes || !Array.isArray(tokens.$themes)) {
      issues.push({
        type: 'invalid-themes',
        severity: 'error',
        message: 'Missing or invalid $themes configuration'
      });
    }
    
    // Check theme completeness
    const themes = Object.keys(tokens).filter(key => !key.startsWith('$') && key !== 'global');
    if (themes.length < 2) {
      issues.push({
        type: 'insufficient-themes',
        severity: 'warning',
        message: 'Consider adding more theme variants (current: ' + themes.join(', ') + ')'
      });
    }
    
    // Validate color token format
    themes.forEach(themeName => {
      if (tokens[themeName]?.colors) {
        Object.entries(tokens[themeName].colors).forEach(([tokenName, token]) => {
          if (token.type === 'color' && !token.value.match(/^#[0-9a-fA-F]{6}$/)) {
            issues.push({
              type: 'invalid-color-format',
              severity: 'warning',
              message: `Color token ${themeName}.${tokenName} has invalid hex format: ${token.value}`
            });
          }
        });
      }
    });
    
  } catch (error) {
    issues.push({
      type: 'parse-error',
      severity: 'error',
      message: `Cannot parse figma-tokens.json: ${error.message}`
    });
  }
  
  return issues;
}

function validateComponentSync() {
  const issues = [];
  const components = getComponentInventory();
  
  Object.entries(components).forEach(([name, component]) => {
    // Check documentation coverage
    if (!component.hasDocumentation) {
      issues.push({
        type: 'missing-documentation',
        severity: 'warning',
        message: `Component ${name} missing documentation/showcase`
      });
    }
    
    // Check if component has variants (good practice)
    if (component.variants.length === 0) {
      issues.push({
        type: 'no-variants',
        severity: 'info',
        message: `Component ${name} has no variants defined`
      });
    }
    
    // Check for common accessibility props
    const accessibilityProps = ['aria-label', 'aria-describedby', 'role'];
    const hasA11yProps = component.props.some(prop => 
      accessibilityProps.some(a11yProp => prop.includes(a11yProp))
    );
    
    if (!hasA11yProps && !['badge', 'separator', 'skeleton'].includes(name.toLowerCase())) {
      issues.push({
        type: 'accessibility-concern',
        severity: 'info',
        message: `Component ${name} might benefit from accessibility props`
      });
    }
  });
  
  return issues;
}

function generateFigmaDevModeMapping() {
  const components = getComponentInventory();
  
  // Generate mapping file for Figma Dev Mode
  const devModeMapping = {
    version: '1.0',
    mappings: Object.entries(components).map(([name, component]) => ({
      figmaNodeId: '', // Will need to be filled manually or via Figma API
      componentName: name,
      filePath: `src/components/ui/${component.file}`,
      props: component.props,
      variants: component.variants,
      documentation: component.hasDocumentation ? `src/components/documentation/${name}Showcase.tsx` : null,
      storybook: null, // Could add Storybook links if applicable
      playground: `/components/${name.toLowerCase()}` // Your design system playground
    }))
  };
  
  return devModeMapping;
}

function createGitHook() {
  const hookContent = `#!/bin/sh
# Pre-commit hook to sync design tokens

echo "🎨 Checking design token sync..."

# Run token extraction
npm run extract-tokens

# Check if tokens changed
if git diff --cached --name-only | grep -q "design-tokens/"; then
  echo "✅ Design tokens updated"
  git add design-tokens/
  
  # Optional: Run sync validation
  node scripts/sync-figma.js --validate-only
  
  if [ $? -ne 0 ]; then
    echo "❌ Token validation failed"
    exit 1
  fi
else
  echo "ℹ️  No token changes detected"
fi

echo "✅ Pre-commit checks passed"
`;

  const hooksDir = join(__dirname, '../.git/hooks');
  if (existsSync(hooksDir)) {
    writeFileSync(join(hooksDir, 'pre-commit'), hookContent, { mode: 0o755 });
    console.log('✅ Git pre-commit hook installed');
  }
}

function generateSyncInstructions() {
  return {
    setup: {
      title: "Initial Setup",
      steps: [
        "1. Get Figma Personal Access Token from Figma → Account Settings → Personal Access Tokens",
        "2. Get Figma File Key from your design system file URL",
        "3. Set environment variables: FIGMA_TOKEN and FIGMA_FILE_KEY",
        "4. Install Figma Tokens plugin in your Figma file",
        "5. Run initial sync: npm run sync-figma"
      ]
    },
    
    dailyWorkflow: {
      title: "Daily Sync Workflow",
      steps: [
        "🔄 Code → Figma:",
        "  1. Make changes to CSS variables or components",
        "  2. Run: npm run extract-tokens",
        "  3. Import updated design-tokens/figma-tokens.json to Figma",
        "  4. Update component documentation in Figma",
        "",
        "🔄 Figma → Code:",
        "  1. Export tokens from Figma Tokens plugin",
        "  2. Compare with current tokens for conflicts",
        "  3. Update CSS variables if needed",
        "  4. Run: npm run extract-tokens to verify"
      ]
    },
    
    automation: {
      title: "Automation Options",
      options: [
        "• Git hooks (pre-commit): Auto-extract tokens on commit",
        "• GitHub Actions: Auto-update tokens on main branch changes",
        "• Figma Webhooks: Get notified when design files change",
        "• Slack Integration: Team notifications for sync events"
      ]
    },
    
    troubleshooting: {
      title: "Common Issues",
      solutions: [
        "Token conflicts: Use npm run sync-figma --validate-only to check",
        "Missing components: Ensure all UI components have proper exports",
        "Theme issues: Verify CSS variable format matches expectations",
        "Figma API errors: Check token permissions and file access"
      ]
    }
  };
}

async function main() {
  const args = process.argv.slice(2);
  const strategy = args[0] || SYNC_STRATEGIES.VALIDATE_ONLY;
  
  console.log('🔄 Figma-Code Sync Manager\n');
  
  // Ensure output directory exists
  if (!existsSync(CONFIG.tokensPath)) {
    mkdirSync(CONFIG.tokensPath, { recursive: true });
  }
  
  try {
    // Generate sync manifest
    const manifest = generateSyncManifest();
    writeFileSync(
      join(CONFIG.tokensPath, 'sync-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    console.log('✅ Generated sync manifest');
    
    // Validate current state
    const tokenIssues = validateTokenSync();
    const componentIssues = validateComponentSync();
    
    // Generate Figma Dev Mode mapping
    const devModeMapping = generateFigmaDevModeMapping();
    writeFileSync(
      join(CONFIG.tokensPath, 'figma-dev-mode-mapping.json'),
      JSON.stringify(devModeMapping, null, 2)
    );
    console.log('✅ Generated Figma Dev Mode mapping');
    
    // Generate sync instructions
    const instructions = generateSyncInstructions();
    writeFileSync(
      join(CONFIG.tokensPath, 'sync-instructions.md'),
      `# Figma-Code Sync Guide\n\n${Object.entries(instructions).map(([key, section]) => 
        `## ${section.title}\n\n${Array.isArray(section.steps || section.options || section.solutions) 
          ? (section.steps || section.options || section.solutions).join('\n') 
          : section}\n\n`
      ).join('')}`
    );
    console.log('✅ Generated sync instructions');
    
    // Install git hooks
    if (args.includes('--install-hooks')) {
      createGitHook();
    }
    
    // Report validation results
    console.log('\n📊 Sync Validation Results:');
    
    if (tokenIssues.length === 0) {
      console.log('✅ Tokens: All valid');
    } else {
      console.log(`⚠️  Tokens: ${tokenIssues.length} issues found`);
      tokenIssues.forEach(issue => {
        const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`   ${icon} ${issue.message}`);
      });
    }
    
    if (componentIssues.length === 0) {
      console.log('✅ Components: All valid');
    } else {
      console.log(`ℹ️  Components: ${componentIssues.length} suggestions`);
      componentIssues.slice(0, 5).forEach(issue => {
        const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`   ${icon} ${issue.message}`);
      });
      if (componentIssues.length > 5) {
        console.log(`   ... and ${componentIssues.length - 5} more`);
      }
    }
    
    // Summary
    const componentCount = Object.keys(manifest.components).length;
    const documentedComponents = Object.values(manifest.components).filter(c => c.hasDocumentation).length;
    
    console.log('\n📈 Sync Summary:');
    console.log(`   🎨 Themes: ${manifest.$metadata?.themes?.length || 0}`);
    console.log(`   🧩 Components: ${componentCount} total, ${documentedComponents} documented`);
    console.log(`   📝 Documentation Coverage: ${Math.round(documentedComponents / componentCount * 100)}%`);
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Review sync-instructions.md for setup details');
    console.log('2. Set FIGMA_TOKEN and FIGMA_FILE_KEY environment variables');
    console.log('3. Import design-tokens/figma-tokens.json to Figma Tokens plugin');
    console.log('4. Use figma-dev-mode-mapping.json to connect Figma components to code');
    console.log('5. Run with --install-hooks to set up automatic syncing');
    
    if (strategy === SYNC_STRATEGIES.VALIDATE_ONLY) {
      console.log('\n💡 Run with different strategies:');
      console.log('   npm run sync-figma tokens-to-figma    # Push tokens to Figma');
      console.log('   npm run sync-figma figma-to-tokens    # Pull tokens from Figma');
      console.log('   npm run sync-figma bidirectional      # Two-way sync');
    }
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

if (process.argv[1] === __filename) {
  main();
} 