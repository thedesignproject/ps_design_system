// scripts/transform-tokens.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Figma tokens
const tokensPath = path.join(__dirname, '../design-tokens/figma-tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Helper function to flatten nested objects with proper naming
function flattenTokens(obj, prefix = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}-${key}` : key;
      
      if (value && typeof value === 'object' && value.$type) {
        // This is a token with $type and $value
        result[newKey] = {
          type: value.$type,
          value: value.$value,
          description: value.$description || ''
        };
      } else if (value && typeof value === 'object' && !value.$type) {
        // This is a nested object, recurse
        flattenTokens(value, newKey, result);
      }
    }
  }
  return result;
}

// Transform tokens to CSS variables
function transformTokensToCSS(tokens) {
  let css = '/* Auto-generated from figma-tokens.json - DO NOT EDIT MANUALLY */\n:root {\n';
  
  // Process global/core tokens
  if (tokens.global) {
    const coreTokens = flattenTokens(tokens.global);
    Object.entries(coreTokens).forEach(([key, token]) => {
      if (token.type === 'color') {
        css += `  --${key}: ${token.value};\n`;
      }
    });
  }
  
  // Process light theme semantic tokens
  if (tokens.light && tokens.light.colors) {
    Object.entries(tokens.light.colors).forEach(([key, token]) => {
      if (token.$type === 'color' || token.type === 'color') {
        const value = token.$value || token.value;
        css += `  --${key}: ${value};\n`;
      }
    });
  }
  
  css += '}\n';
  
  // Add dark theme
  css += '\n.dark {\n';
  if (tokens.dark && tokens.dark.colors) {
    Object.entries(tokens.dark.colors).forEach(([key, token]) => {
      if (token.$type === 'color' || token.type === 'color') {
        const value = token.$value || token.value;
        css += `  --${key}: ${value};\n`;
      }
    });
  }
  css += '}\n';
  
  return css;
}

// Transform tokens to TypeScript
function transformTokensToTS(tokens) {
  let ts = '// Auto-generated from figma-tokens.json - DO NOT EDIT MANUALLY\n\n';
  
  const colorGroups = {};
  const semanticGroups = {
    brand: [],
    text: [],
    background: [],
    border: [],
    feedback: {
      success: [],
      error: [],
      warning: [],
      info: []
    }
  };
  
  // Helper function to resolve CSS variable values
  const resolveCSSValue = (value) => {
    // If it's a CSS variable reference, try to resolve it from global tokens
    if (value.includes('var(')) {
      const varMatch = value.match(/var\(--([^)]+)\)/);
      if (varMatch && tokens.global) {
        const varName = varMatch[1];
        const globalTokens = flattenTokens(tokens.global);
        
        // Handle different variable name formats
        if (globalTokens[varName]) {
          return globalTokens[varName].value;
        }
        
        // Try with different naming patterns
        const altNames = [
          varName.replace('color-', 'colors-'),
          varName.replace('colors-', 'color-'),
          varName
        ];
        
        for (const altName of altNames) {
          if (globalTokens[altName]) {
            return globalTokens[altName].value;
          }
        }
      }
      
      // If we can't resolve the variable, return the variable itself for CSS to handle
      return value;
    }
    return value;
  };
  
  // Process core colors from global tokens
  if (tokens.global) {
    const globalTokens = flattenTokens(tokens.global);
    Object.entries(globalTokens).forEach(([key, token]) => {
      if (token.type === 'color') {
        const category = key.split('-')[0];
        if (!colorGroups[category]) {
          colorGroups[category] = [];
        }
        
        colorGroups[category].push({
          name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          variable: `--${key}`,
          hex: token.value,
          description: token.description || `${key} color`
        });
      }
    });
  }
  
  // Process semantic colors from light theme
  if (tokens.light && tokens.light.colors) {
    Object.entries(tokens.light.colors).forEach(([key, token]) => {
      if (token.type === 'color') {
        const value = resolveCSSValue(token.value);
        const hexValue = value.startsWith('#') ? value : value;
        
        // Categorize semantic tokens
        if (key.startsWith('color-primary')) {
          semanticGroups.brand.push({
            name: key.replace(/color-/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            variable: `--${key}`,
            hex: hexValue,
            description: token.description || `${key} color`
          });
        }
        else if (key.startsWith('color-text-')) {
          semanticGroups.text.push({
            name: key.replace(/color-text-/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            variable: `--${key}`,
            hex: hexValue,
            description: token.description || `${key} color`
          });
        }
        else if (key.startsWith('color-background') || key.startsWith('color-surface')) {
          semanticGroups.background.push({
            name: key.replace(/color-/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            variable: `--${key}`,
            hex: hexValue,
            description: token.description || `${key} color`
          });
        }
        else if (key.startsWith('color-border')) {
          semanticGroups.border.push({
            name: key.replace(/color-border-?/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Border',
            variable: `--${key}`,
            hex: hexValue,
            description: token.description || `${key} color`
          });
        }
        else if (key.startsWith('color-success')) {
          semanticGroups.feedback.success.push({
            name: key.replace(/color-success-?/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Success',
            variable: `--${key}`,
            hex: hexValue,
            description: token.description || `${key} color`
          });
        }
        else if (key.startsWith('color-error')) {
          semanticGroups.feedback.error.push({
            name: key.replace(/color-error-?/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Error',
            variable: `--${key}`,
            hex: hexValue,
            description: token.description || `${key} color`
          });
        }
        else if (key.startsWith('color-warning')) {
          semanticGroups.feedback.warning.push({
            name: key.replace(/color-warning-?/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Warning',
            variable: `--${key}`,
            hex: hexValue,
            description: token.description || `${key} color`
          });
        }
        else if (key.startsWith('color-info')) {
          semanticGroups.feedback.info.push({
            name: key.replace(/color-info-?/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Info',
            variable: `--${key}`,
            hex: hexValue,
            description: token.description || `${key} color`
          });
        }
      }
    });
  }
  
  // Create TypeScript export
  ts += 'export const designTokens = {\n';
  ts += '  colors: {\n';
  
  Object.entries(colorGroups).forEach(([group, colors]) => {
    ts += `    '${group}': [\n`;
    colors.forEach(color => {
      ts += `      { name: '${color.name}', variable: '${color.variable}', hex: '${color.hex}', description: '${color.description}' },\n`;
    });
    ts += '    ],\n';
  });
  
  ts += '  },\n';
  ts += '  semantic: {\n';
  ts += `    brand: ${JSON.stringify(semanticGroups.brand, null, 6)},\n`;
  ts += `    text: ${JSON.stringify(semanticGroups.text, null, 6)},\n`;
  ts += `    background: ${JSON.stringify(semanticGroups.background, null, 6)},\n`;
  ts += `    border: ${JSON.stringify(semanticGroups.border, null, 6)},\n`;
  ts += `    feedback: ${JSON.stringify(semanticGroups.feedback, null, 6)}\n`;
  ts += '  }\n';
  ts += '};\n';
  
  return ts;
}

// Ensure output directories exist
const stylesDir = path.join(__dirname, '../styles');
const libDir = path.join(__dirname, '../lib');

if (!fs.existsSync(stylesDir)) {
  fs.mkdirSync(stylesDir, { recursive: true });
}

if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

// Write CSS file
const cssOutput = transformTokensToCSS(tokens);
fs.writeFileSync(path.join(__dirname, '../styles/tokens.css'), cssOutput);

// Write TypeScript file
const tsOutput = transformTokensToTS(tokens);
fs.writeFileSync(path.join(__dirname, '../lib/design-tokens.ts'), tsOutput);

console.log('✅ Tokens transformed successfully!');