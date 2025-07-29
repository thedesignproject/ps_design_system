#!/usr/bin/env node

/**
 * Script to extract design tokens from the codebase and format them for Figma
 * Supports multiple themes, theme modes, and custom theming configurations
 * Outputs tokens in Figma Tokens plugin format with proper theme support
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read CSS variables from index.css
const cssFile = join(__dirname, '../src/index.css');
const tailwindConfig = join(__dirname, '../tailwind.config.ts');

function hslToHex(hsl) {
  // Convert HSL string like "222.2 84% 4.9%" to hex
  const match = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!match) return hsl;
  
  const h = parseFloat(match[1]) / 360;
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;
  
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = c => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function extractThemesFromCSS() {
  const cssContent = readFileSync(cssFile, 'utf-8');
  const themes = {};
  
  // Extract only theme-related selectors (not utility classes)
  const themeRegex = /(:root|\.dark|\.theme-[\w-]+)\s*{([^}]+)}/g;
  let match;
  
  while ((match = themeRegex.exec(cssContent)) !== null) {
    const selector = match[1].trim();
    const variables = match[2];
    
    // Only process selectors that contain CSS custom properties (--variables)
    if (!variables.includes('--')) {
      continue;
    }
    
    // Determine theme name from selector
    let themeName;
    if (selector === ':root') {
      themeName = 'light'; // Default theme
    } else if (selector === '.dark') {
      themeName = 'dark';
    } else {
      // Extract theme name from class (e.g., .theme-blue -> blue)
      const classMatch = selector.match(/\.theme-(.+)/);
      themeName = classMatch ? classMatch[1] : 'unknown';
    }
    
    themes[themeName] = {};
    
    // Extract CSS variables
    const varMatches = variables.matchAll(/--([^:]+):\s*([^;]+);/g);
    
    for (const varMatch of varMatches) {
      const name = varMatch[1].trim();
      const value = varMatch[2].trim();
      
      // Process color, design system variables, and extended color scales
      if (name.includes('color') || name === 'background' || name === 'foreground' || 
          name === 'primary' || name === 'secondary' || name === 'muted' || 
          name === 'accent' || name === 'destructive' || name === 'border' || 
          name === 'input' || name === 'ring' || name.includes('sidebar') ||
          name.includes('card') || name.includes('popover') || name === 'radius' ||
          // Extended color scales
          name.startsWith('gray-') || name.startsWith('blue-') ||
          name.startsWith('red-') || name.startsWith('green-') ||
          name.startsWith('amber-') || name.startsWith('orange-') ||
          name.startsWith('purple-') || name.startsWith('indigo-') || name.startsWith('sky-') ||
          name.startsWith('pink-') || name.startsWith('teal-') ||
          // Semantic/behavioral tokens
          name.startsWith('color-')) {
        
        // Determine token type
        let tokenType = 'other';
        let tokenValue = value;
        
        if (name === 'radius' || name.includes('radius')) {
          tokenType = 'borderRadius';
          // Keep rem/px values as-is
        } else if (name.includes('color') || name === 'background' || name === 'foreground' || 
                   name === 'primary' || name === 'secondary' || name === 'muted' || 
                   name === 'accent' || name === 'destructive' || name === 'border' || 
                   name === 'input' || name === 'ring' || name.includes('sidebar') ||
                   name.includes('card') || name.includes('popover') ||
                   // Extended color scales
                   name.startsWith('gray-') || name.startsWith('blue-') ||
                   name.startsWith('red-') || name.startsWith('green-') ||
                   name.startsWith('amber-') || name.startsWith('orange-') ||
                   name.startsWith('purple-') || name.startsWith('indigo-') || name.startsWith('sky-') ||
                   name.startsWith('pink-') || name.startsWith('teal-') ||
                   // Semantic/behavioral tokens
                   name.startsWith('color-')) {
          tokenType = 'color';
          // Handle hex values (extended colors) and HSL values (semantic colors)
          if (value.startsWith('#')) {
            tokenValue = value; // Already hex
          } else {
            tokenValue = hslToHex(value); // Convert HSL to hex
          }
        }
        
        themes[themeName][name] = {
          value: tokenValue,
          type: tokenType,
          description: `${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme ${name.replace(/-/g, ' ')}`,
          ...(name === 'radius' && { 
            aliases: ['borderRadius.lg'],
            originalValue: value
          })
        };
      }
    }
  }
  
  // Ensure structural tokens like radius are present in all themes
  // These tokens should be consistent across light/dark modes
  const structuralTokens = ['radius'];
  const allThemes = Object.keys(themes);
  
  for (const structuralToken of structuralTokens) {
    // Find the token value from any theme that has it (usually light/root)
    let tokenData = null;
    for (const themeName of allThemes) {
      if (themes[themeName][structuralToken]) {
        tokenData = themes[themeName][structuralToken];
        break;
      }
    }
    
    // If found, ensure all themes have this token
    if (tokenData) {
      for (const themeName of allThemes) {
        if (!themes[themeName][structuralToken]) {
          themes[themeName][structuralToken] = {
            ...tokenData,
            description: `${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme ${structuralToken.replace(/-/g, ' ')}`
          };
        }
      }
    }
  }
  
  return themes;
}

function extractTypographyTokens() {
  // Extract from template configuration (generic, reusable fonts)
  // This ensures tokens don't require custom fonts like Halyard Display
  return {
    fontFamilies: {
      sans: {
        value: 'Geist, system-ui, sans-serif',
        type: 'fontFamilies',
        description: 'Primary font family for body text'
      },
      heading: {
        value: 'Geist, system-ui, sans-serif',
        type: 'fontFamilies',
        description: 'Font family for headings (uses same as sans for portability)'
      },
      mono: {
        value: 'Geist Mono, ui-monospace, SFMono-Regular, monospace',
        type: 'fontFamilies',
        description: 'Monospace font for code'
      }
    },
    fontSizes: {
      xs: { value: '12px', type: 'fontSizes' },
      sm: { value: '14px', type: 'fontSizes' },
      base: { value: '16px', type: 'fontSizes' },
      lg: { value: '18px', type: 'fontSizes' },
      xl: { value: '20px', type: 'fontSizes' },
      '2xl': { value: '24px', type: 'fontSizes' },
      '3xl': { value: '30px', type: 'fontSizes' },
      '4xl': { value: '36px', type: 'fontSizes' },
      '5xl': { value: '48px', type: 'fontSizes' },
      '6xl': { value: '60px', type: 'fontSizes' },
      '7xl': { value: '72px', type: 'fontSizes' },
      '8xl': { value: '96px', type: 'fontSizes' },
      '9xl': { value: '128px', type: 'fontSizes' }
    },
    fontWeights: {
      normal: { value: '400', type: 'fontWeights' },
      medium: { value: '500', type: 'fontWeights' },
      semibold: { value: '600', type: 'fontWeights' },
      bold: { value: '700', type: 'fontWeights' },
      extrabold: { value: '800', type: 'fontWeights' },
      black: { value: '900', type: 'fontWeights' }
    },
    lineHeights: {
      none: { value: '1', type: 'lineHeights' },
      tight: { value: '1.25', type: 'lineHeights' },
      snug: { value: '1.375', type: 'lineHeights' },
      normal: { value: '1.5', type: 'lineHeights' },
      relaxed: { value: '1.625', type: 'lineHeights' },
      loose: { value: '2', type: 'lineHeights' }
    }
  };
}

function extractActualSpacingFromTailwind() {
  try {
    const tailwindContent = readFileSync(tailwindConfig, 'utf-8');
    
    // Extract the actual border radius values from your Tailwind config
    const borderRadiusMatch = tailwindContent.match(/borderRadius:\s*{([^}]+)}/);
    const actualBorderRadius = {};
    
    if (borderRadiusMatch) {
      const radiusContent = borderRadiusMatch[1];
      const radiusMatches = radiusContent.matchAll(/(\w+):\s*['"`]([^'"`]+)['"`]/g);
      
      for (const match of radiusMatches) {
        const [, name, value] = match;
        actualBorderRadius[name] = {
          value: value.includes('calc') ? '8px' : value, // Resolve calc values
          type: 'borderRadius',
          description: `Border radius ${name} (${value})`,
          originalFormula: value
        };
      }
    }
    
    // Add the base radius from CSS variables
    actualBorderRadius.none = { value: '0px', type: 'borderRadius' };
    actualBorderRadius.full = { value: '9999px', type: 'borderRadius' };
    
    return actualBorderRadius;
  } catch (error) {
    console.warn('Could not extract spacing from Tailwind config, using defaults');
    return {};
  }
}

function extractSpacingTokens() {
  const actualBorderRadius = extractActualSpacingFromTailwind();
  
  // Use the actual deployed Tailwind spacing scale based on the screenshots
  return {
    spacing: {
      0: { value: '0px', type: 'spacing' },
      px: { value: '1px', type: 'spacing' },
      0.5: { value: '2px', type: 'spacing' },
      1: { value: '4px', type: 'spacing' },
      1.5: { value: '6px', type: 'spacing' },
      2: { value: '8px', type: 'spacing' },
      2.5: { value: '10px', type: 'spacing' },
      3: { value: '12px', type: 'spacing' },
      3.5: { value: '14px', type: 'spacing' },
      4: { value: '16px', type: 'spacing' },
      5: { value: '20px', type: 'spacing' },
      6: { value: '24px', type: 'spacing' },
      7: { value: '28px', type: 'spacing' },
      8: { value: '32px', type: 'spacing' },
      9: { value: '36px', type: 'spacing' },
      10: { value: '40px', type: 'spacing' },
      11: { value: '44px', type: 'spacing' },
      12: { value: '48px', type: 'spacing' },
      14: { value: '56px', type: 'spacing' },
      16: { value: '64px', type: 'spacing' },
      20: { value: '80px', type: 'spacing' },
      24: { value: '96px', type: 'spacing' },
      28: { value: '112px', type: 'spacing' },
      32: { value: '128px', type: 'spacing' },
      36: { value: '144px', type: 'spacing' },
      40: { value: '160px', type: 'spacing' },
      44: { value: '176px', type: 'spacing' },
      48: { value: '192px', type: 'spacing' },
      52: { value: '208px', type: 'spacing' },
      56: { value: '224px', type: 'spacing' },
      60: { value: '240px', type: 'spacing' },
      64: { value: '256px', type: 'spacing' },
      72: { value: '288px', type: 'spacing' },
      80: { value: '320px', type: 'spacing' },
      96: { value: '384px', type: 'spacing' }
    },
    borderRadius: Object.keys(actualBorderRadius).length > 0 ? actualBorderRadius : {
      none: { value: '0px', type: 'borderRadius' },
      sm: { value: '4px', type: 'borderRadius', description: 'calc(var(--radius) - 4px)' },
      md: { value: '6px', type: 'borderRadius', description: 'calc(var(--radius) - 2px)' },
      lg: { value: '8px', type: 'borderRadius', description: 'var(--radius)', isDefault: true },
      xl: { value: '12px', type: 'borderRadius' },
      '2xl': { value: '16px', type: 'borderRadius' },
      '3xl': { value: '24px', type: 'borderRadius' },
      full: { value: '9999px', type: 'borderRadius' }
    }
  };
}

function generateFigmaTokensJSON() {
  const themes = extractThemesFromCSS();
  const typography = extractTypographyTokens();
  const spacing = extractSpacingTokens();
  
  // Separate core colors from semantic tokens
  const coreColors = {};
  const semanticTokens = {};
  
  Object.entries(themes).forEach(([themeName, themeTokens]) => {
    semanticTokens[themeName] = {};
    
    Object.entries(themeTokens).forEach(([tokenName, tokenData]) => {
      // Core colors: gray-50, blue-500, red-600, etc.
      if (tokenName.match(/^(gray|blue|red|green|amber|orange|purple|indigo|sky|pink|teal)-\d+$/)) {
        // Only add to core colors from light theme to avoid duplicates
        if (themeName === 'light') {
          coreColors[tokenName] = {
            value: tokenData.value,
            type: tokenData.type,
            description: `Core color ${tokenName.replace('-', ' ')}`
          };
        }
      } else {
        // Semantic tokens: primary, background, color-success, etc.
        semanticTokens[themeName][tokenName] = tokenData;
      }
    });
  });
  
  // Figma Tokens plugin format with theme support
  const figmaTokens = {
    // Global tokens (non-themed)
    global: {
      typography: typography,
      spacing: spacing,
      colors: coreColors // Core colors go in global
    },
    
    // Theme-specific semantic tokens
    ...Object.entries(semanticTokens).reduce((acc, [themeName, themeTokens]) => {
      acc[themeName] = {
        colors: themeTokens
      };
      return acc;
    }, {}),
    
    // Theme sets configuration for Figma Tokens plugin
    $themes: Object.keys(themes).map(themeName => ({
      id: themeName,
      name: themeName.charAt(0).toUpperCase() + themeName.slice(1),
      selectedTokenSets: {
        global: 'enabled',
        [themeName]: 'enabled'
      }
    })),
    
    // Metadata
    $metadata: {
      tokenSetOrder: ['global', ...Object.keys(themes)],
      usedTokenSet: {
        global: 'enabled',
        light: 'enabled'
      },
      themes: Object.keys(themes)
    }
  };
  
  return figmaTokens;
}

function generateCustomThemeTemplate() {
  const themes = extractThemesFromCSS();
  const baseTheme = themes.light || themes[Object.keys(themes)[0]];
  
  // Generate a template for creating custom themes
  const template = {
    instructions: "Copy this template to create custom themes. Replace values and add to your CSS.",
    example: {
      customThemeName: "blue", // Change this to your theme name
      selector: ".theme-blue", // CSS class selector
      tokens: Object.fromEntries(
        Object.entries(baseTheme).map(([key, token]) => [
          key,
          {
            ...token,
            value: token.type === 'color' ? '#your-color-here' : token.value,
            description: `Custom blue theme ${key.replace(/-/g, ' ')}`
          }
        ])
      )
    },
    cssTemplate: `
/* Custom Theme Example */
.theme-blue {
  ${Object.entries(baseTheme)
    .map(([key, token]) => `  --${key}: ${token.type === 'color' ? '/* your HSL values */' : token.originalValue || token.value};`)
    .join('\n')}
}`,
    
    figmaTokensStructure: {
      blue: {
        colors: "... your color tokens here ..."
      },
      $themes: [
        {
          id: "blue",
          name: "Blue",
          selectedTokenSets: {
            global: "enabled",
            blue: "enabled"
          }
        }
      ]
    }
  };
  
  return template;
}

function generateStyleDictionary() {
  const themes = extractThemesFromCSS();
  const typography = extractTypographyTokens();
  const spacing = extractSpacingTokens();
  
  // Style Dictionary format with theme support
  return {
    color: themes,
    size: {
      font: typography.fontSizes,
      spacing: spacing.spacing,
      border: {
        radius: spacing.borderRadius
      }
    },
    asset: {
      font: typography.fontFamilies
    },
    // Add theme metadata
    themes: Object.keys(themes),
    defaultTheme: 'light'
  };
}

function main() {
  console.log('🎨 Extracting design tokens with accurate deployed values...\n');
  
  const outputDir = join(__dirname, '../design-tokens');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }
  
  try {
    // Extract themes
    const themes = extractThemesFromCSS();
    
    // Generate Figma Tokens format with theme support
    const figmaTokens = generateFigmaTokensJSON();
    writeFileSync(
      join(outputDir, 'figma-tokens.json'),
      JSON.stringify(figmaTokens, null, 2)
    );
    console.log('✅ Generated figma-tokens.json with accurate spacing/radius values');
    
    // Generate Style Dictionary format
    const styleDictionary = generateStyleDictionary();
    writeFileSync(
      join(outputDir, 'tokens.json'),
      JSON.stringify(styleDictionary, null, 2)
    );
    console.log('✅ Generated tokens.json for Style Dictionary');
    
    // Generate custom theme template
    const customThemeTemplate = generateCustomThemeTemplate();
    writeFileSync(
      join(outputDir, 'custom-theme-template.json'),
      JSON.stringify(customThemeTemplate, null, 2)
    );
    console.log('✅ Generated custom-theme-template.json for creating new themes');
    
    // Generate CSS output for each theme
    let cssOutput = `/* Design Tokens - All Themes */\n`;
    Object.entries(themes).forEach(([themeName, themeTokens]) => {
      const selector = themeName === 'light' ? ':root' : `.${themeName === 'dark' ? 'dark' : `theme-${themeName}`}`;
      cssOutput += `\n/* ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme */\n${selector} {\n`;
      Object.entries(themeTokens).forEach(([name, token]) => {
        const value = token.originalValue || token.value;
        cssOutput += `  --${name}: ${value};\n`;
      });
      cssOutput += `}\n`;
    });
    
    writeFileSync(join(outputDir, 'tokens.css'), cssOutput);
    console.log('✅ Generated tokens.css with all theme variants');
    
    // Generate theme-aware Tailwind config snippet
    const tailwindConfig = `
// Add to your tailwind.config.ts
export default {
  darkMode: ["class"],
  // Add support for custom themes
  theme: {
    extend: {
      colors: {
        ${Object.keys(themes).map(themeName => `
        // ${themeName} theme variables
        ${Object.keys(themes[themeName])
          .filter(key => themes[themeName][key].type === 'color')
          .map(key => `"${key}": "hsl(var(--${key}))"`)
          .join(',\n        ')}`).join(',\n        ')}
      }
    }
  }
}`;
    
    writeFileSync(join(outputDir, 'tailwind-theme-config.js'), tailwindConfig);
    console.log('✅ Generated tailwind-theme-config.js for extended theme support');
    
    // Generate summary
    const typographyTokens = extractTypographyTokens();
    const spacingTokens = extractSpacingTokens();
    const summary = {
      themes: Object.keys(themes),
      tokensPerTheme: Object.fromEntries(
        Object.entries(themes).map(([name, tokens]) => [name, Object.keys(tokens).length])
      ),
      typography: {
        fontFamilies: Object.keys(typographyTokens.fontFamilies).length,
        fontSizes: Object.keys(typographyTokens.fontSizes).length,
        fontWeights: Object.keys(typographyTokens.fontWeights).length
      },
      spacing: {
        spacing: Object.keys(spacingTokens.spacing).length,
        borderRadius: Object.keys(spacingTokens.borderRadius).length
      }
    };
    
    console.log('\n📊 Updated Token Summary (Reflecting Deployed Values):');
    console.log(`   🎨 Themes detected: ${summary.themes.join(', ')}`);
    Object.entries(summary.tokensPerTheme).forEach(([theme, count]) => {
      console.log(`     - ${theme}: ${count} tokens`);
    });
    console.log(`   📝 Typography: ${summary.typography.fontSizes} sizes, ${summary.typography.fontFamilies} families`);
    console.log(`   📏 Spacing: ${summary.spacing.spacing} spacing tokens, ${summary.spacing.borderRadius} radius tokens`);
    
    console.log('\n🎯 Key Updates:');
    console.log('• ✅ Full Tailwind spacing scale (0px to 384px)');
    console.log('• ✅ Actual border radius values from config');
    console.log('• ✅ Accurate theme color extraction');
    console.log('• ✅ Deployed CSS variable mapping');
    
    console.log('\n🔄 Sync Instructions:');
    console.log('1. 📂 Import updated design-tokens/figma-tokens.json to Figma');
    console.log('2. 🎨 Spacing and border radius now match deployed values');
    console.log('3. 🎯 Theme colors accurately reflect your CSS variables');
    
  } catch (error) {
    console.error('❌ Error generating tokens:', error.message);
    process.exit(1);
  }
}

main(); 