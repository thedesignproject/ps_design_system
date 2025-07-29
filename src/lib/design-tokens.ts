import figmaTokens from '../../design-tokens/figma-tokens.json';
import typographyStyles from '../../design-tokens/typography-styles.json';
import tokens from '../../design-tokens/tokens.json';

// Types for our parsed tokens
export interface ColorToken {
  name: string;
  value: string;
  class: string;
  category: string;
  cssVar: string;
}

export interface SemanticToken {
  name: string;
  token: string;
  light: string;
  dark: string;
  usage: string;
  category: string;
}

export interface TypographyToken {
  name: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  tailwind: string;
  displayName: string;
  description?: string;
  usage?: string[];
  category?: string;
}

export interface SpacingToken {
  name: string;
  value: string;
  pixels: string;
  tailwind: string;
}

export interface ShadowToken {
  name: string;
  value: string;
  class: string;
  token: string;
  tokenName: string;
}

export interface BorderToken {
  name: string;
  value: string;
  class: string;
  description: string;
  token: string;
  tokenName: string;
}

// Utility functions to transform tokens
function parseCoreColors(): ColorToken[] {
  const colors: ColorToken[] = [];
  const globalColors = figmaTokens.global.colors;
  
  // Define color categories and their order
  const colorCategories = [
    { name: 'Neutral', prefix: 'gray' },
    { name: 'Blue', prefix: 'blue' },
    { name: 'Red', prefix: 'red' },
    { name: 'Green', prefix: 'green' },
    { name: 'Amber', prefix: 'amber' },
    { name: 'Orange', prefix: 'orange' },
    { name: 'Purple', prefix: 'purple' },
    { name: 'Indigo', prefix: 'indigo' },
    { name: 'Sky', prefix: 'sky' },
    { name: 'Pink', prefix: 'pink' },
    { name: 'Teal', prefix: 'teal' },
  ];

  colorCategories.forEach(category => {
    Object.entries(globalColors).forEach(([key, colorData]) => {
      if (key.startsWith(category.prefix + '-')) {
        const shade = key.split('-')[1];
        colors.push({
          name: `${category.name} ${shade}`,
          value: colorData.value,
          class: `bg-${key}`,
          category: category.name,
          cssVar: `var(--${key})`
        });
      }
    });
  });

  return colors;
}

function parseSemanticTokens(): SemanticToken[] {
  const semanticTokens: SemanticToken[] = [];
  const lightColors = figmaTokens.light.colors;
  const darkColors = figmaTokens.dark.colors;

  // Define semantic token categories and their mappings
  const semanticMappings = [
    // Brand Colors
    { key: 'color-primary', name: 'Primary', usage: 'Main brand color, CTA buttons', category: 'Brand' },
    { key: 'color-primary-hover', name: 'Primary Hover', usage: 'Primary button hover state', category: 'Brand' },
    { key: 'color-primary-active', name: 'Primary Active', usage: 'Primary button active state', category: 'Brand' },
    { key: 'color-primary-disabled', name: 'Primary Disabled', usage: 'Primary button disabled state', category: 'Brand' },
    { key: 'color-primary-subtle', name: 'Primary Subtle', usage: 'Primary background tints', category: 'Brand' },

    // Text Colors
    { key: 'color-text-primary', name: 'Text Primary', usage: 'Main body text, headings', category: 'Text' },
    { key: 'color-text-secondary', name: 'Text Secondary', usage: 'Secondary text, descriptions', category: 'Text' },
    { key: 'color-text-tertiary', name: 'Text Tertiary', usage: 'Placeholder text, captions', category: 'Text' },
    { key: 'color-text-disabled', name: 'Text Disabled', usage: 'Disabled text labels', category: 'Text' },
    { key: 'color-text-inverse', name: 'Text Inverse', usage: 'Text on dark backgrounds', category: 'Text' },
    { key: 'color-text-link', name: 'Text Link', usage: 'Link text', category: 'Text' },
    { key: 'color-text-link-hover', name: 'Text Link Hover', usage: 'Link text hover state', category: 'Text' },

    // Background Colors
    { key: 'color-background', name: 'Background', usage: 'Main page background', category: 'Background' },
    { key: 'color-background-subtle', name: 'Background Subtle', usage: 'Subtle background areas', category: 'Background' },
    { key: 'color-surface', name: 'Surface', usage: 'Cards, modals, dropdowns', category: 'Background' },
    { key: 'color-surface-subtle', name: 'Surface Subtle', usage: 'Secondary surface areas', category: 'Background' },
    { key: 'color-surface-hover', name: 'Surface Hover', usage: 'Hoverable surface areas', category: 'Background' },
    { key: 'color-surface-pressed', name: 'Surface Pressed', usage: 'Pressed surface areas', category: 'Background' },

    // Border Colors
    { key: 'color-border', name: 'Border', usage: 'Default borders', category: 'Border' },
    { key: 'color-border-subtle', name: 'Border Subtle', usage: 'Subtle dividers', category: 'Border' },
    { key: 'color-border-strong', name: 'Border Strong', usage: 'Emphasized borders', category: 'Border' },
    { key: 'color-border-focus', name: 'Border Focus', usage: 'Focus ring borders', category: 'Border' },

    // Success
    { key: 'color-success', name: 'Success', usage: 'Success messages', category: 'Success' },
    { key: 'color-success-background', name: 'Success Background', usage: 'Success alert backgrounds', category: 'Success' },
    { key: 'color-success-border', name: 'Success Border', usage: 'Success alert borders', category: 'Success' },
    { key: 'color-success-hover', name: 'Success Hover', usage: 'Success button hover', category: 'Success' },

    // Error
    { key: 'color-error', name: 'Error', usage: 'Error messages', category: 'Error' },
    { key: 'color-error-background', name: 'Error Background', usage: 'Error alert backgrounds', category: 'Error' },
    { key: 'color-error-border', name: 'Error Border', usage: 'Error alert borders', category: 'Error' },
    { key: 'color-error-hover', name: 'Error Hover', usage: 'Error button hover', category: 'Error' },

    // Warning
    { key: 'color-warning', name: 'Warning', usage: 'Warning messages', category: 'Warning' },
    { key: 'color-warning-background', name: 'Warning Background', usage: 'Warning alert backgrounds', category: 'Warning' },
    { key: 'color-warning-border', name: 'Warning Border', usage: 'Warning alert borders', category: 'Warning' },
    { key: 'color-warning-hover', name: 'Warning Hover', usage: 'Warning button hover', category: 'Warning' },

    // Info
    { key: 'color-info', name: 'Info', usage: 'Info messages', category: 'Info' },
    { key: 'color-info-background', name: 'Info Background', usage: 'Info alert backgrounds', category: 'Info' },
    { key: 'color-info-border', name: 'Info Border', usage: 'Info alert borders', category: 'Info' },
    { key: 'color-info-hover', name: 'Info Hover', usage: 'Info button hover', category: 'Info' },
  ];

  semanticMappings.forEach(mapping => {
    const lightToken = lightColors[mapping.key];
    const darkToken = darkColors[mapping.key];
    
    if (lightToken && darkToken) {
      // Extract color references from var() values
      const lightRef = lightToken.value.match(/var\(--([^)]+)\)/)?.[1] || lightToken.value;
      const darkRef = darkToken.value.match(/var\(--([^)]+)\)/)?.[1] || darkToken.value;
      
      semanticTokens.push({
        name: mapping.name,
        token: `--${mapping.key}`,
        light: lightRef.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        dark: darkRef.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        usage: mapping.usage,
        category: mapping.category
      });
    }
  });

  return semanticTokens;
}

function parseTypographyTokens(): TypographyToken[] {
  const fontSizes = figmaTokens.global.typography.fontSizes;
  const fontWeights = figmaTokens.global.typography.fontWeights;
  const lineHeights = figmaTokens.global.typography.lineHeights;
  const letterSpacingMapping = typographyStyles.letterSpacingMapping;

  const allTypographyTokens: TypographyToken[] = [];
  
  // Process all typography style categories (display, headings, body)
  Object.values(typographyStyles.typographyStyles).forEach(category => {
    Object.entries(category).forEach(([styleKey, style]) => {
      const fontSize = fontSizes?.[style.fontSize];
      const fontWeight = fontWeights?.[style.fontWeight];
      const lineHeight = lineHeights?.[style.lineHeight];
      const letterSpacing = letterSpacingMapping[style.letterSpacing as keyof typeof letterSpacingMapping] || '0em';

      allTypographyTokens.push({
        name: `text-${style.fontSize}`,
        size: fontSize?.value || '1rem',
        weight: `${fontWeight?.value || '400'}`,
        lineHeight: `${Math.round((parseFloat(lineHeight?.value || '1.5') * 100))}%`,
        letterSpacing: letterSpacing,
        tailwind: `text-${style.fontSize}`,
        displayName: style.displayName,
        description: style.description,
        usage: style.usage,
        category: style.category
      });
    });
  });

  // Sort by font size (largest to smallest)
  const sizeOrder = ['9xl', '8xl', '7xl', '6xl', '5xl', '4xl', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'];
  
  return allTypographyTokens.sort((a, b) => {
    const aIndex = sizeOrder.findIndex(size => a.name.includes(size));
    const bIndex = sizeOrder.findIndex(size => b.name.includes(size));
    return aIndex - bIndex;
  });
}

function parseSpacingTokens(): SpacingToken[] {
  const spacing = figmaTokens.global.spacing.spacing;
  const spacingTokens: SpacingToken[] = [];

  Object.entries(spacing).forEach(([key, data]) => {
    if (typeof data === 'object' && 'value' in data) {
      const pixels = data.value;
      const rem = `${parseFloat(pixels) / 16}rem`;
      
      spacingTokens.push({
        name: key,
        value: rem,
        pixels: pixels,
        tailwind: `p-${key}`
      });
    }
  });

  return spacingTokens.sort((a, b) => {
    const aNum = parseFloat(a.pixels);
    const bNum = parseFloat(b.pixels);
    return aNum - bNum;
  });
}

function parseShadowTokens(): ShadowToken[] {
  const shadowTokens: ShadowToken[] = [];

  // Use standard Tailwind shadow values since shadows aren't in figma tokens yet
  const shadowsData = [
    { key: 'none', name: 'None', class: 'shadow-none', value: '0 0 #0000' },
    { key: 'sm', name: 'Small', class: 'shadow-sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    { key: 'default', name: 'Default', class: 'shadow', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
    { key: 'md', name: 'Medium', class: 'shadow-md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
    { key: 'lg', name: 'Large', class: 'shadow-lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
    { key: 'xl', name: 'Extra Large', class: 'shadow-xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
    { key: '2xl', name: '2X Large', class: 'shadow-2xl', value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' },
    { key: 'inner', name: 'Inner', class: 'shadow-inner', value: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' },
  ];

  shadowsData.forEach(shadowData => {
    shadowTokens.push({
      name: shadowData.name,
      value: shadowData.value,
      class: shadowData.class,
      token: `var(--shadow-${shadowData.key})`,
      tokenName: shadowData.key
    });
  });

  return shadowTokens;
}

function parseBorderTokens(): BorderToken[] {
  const borderRadius = figmaTokens.global.spacing.borderRadius;
  const borderTokens: BorderToken[] = [];

  const borderMapping = [
    { key: 'none', name: 'none', class: 'rounded-none', description: 'Border radius none - no rounding' },
    { key: 'sm', name: 'sm', class: 'rounded-sm', description: 'Border radius sm - 2px' },
    { key: 'base', name: 'base', class: 'rounded', description: 'Border radius base - 4px' },
    { key: 'md', name: 'md', class: 'rounded-md', description: 'Border radius md - 6px' },
    { key: 'lg', name: 'lg', class: 'rounded-lg', description: 'Border radius lg - 8px' },
    { key: 'xl', name: 'xl', class: 'rounded-xl', description: 'Border radius xl - 12px' },
    { key: '2xl', name: '2xl', class: 'rounded-2xl', description: 'Border radius 2xl - 16px' },
    { key: '3xl', name: '3xl', class: 'rounded-3xl', description: 'Border radius 3xl - 24px' },
    { key: 'full', name: 'full', class: 'rounded-full', description: 'Border radius full - fully rounded' },
  ];

  borderMapping.forEach(mapping => {
    const border = borderRadius[mapping.key];
    if (border) {
      borderTokens.push({
        name: mapping.name,
        value: border.value,
        class: mapping.class,
        description: border.description || mapping.description,
        token: `var(--radius-${mapping.key})`,
        tokenName: mapping.key
      });
    }
  });

  return borderTokens;
}

// Export parsed tokens
export const coreColorTokens = parseCoreColors();
export const semanticTokens = parseSemanticTokens();
export const typographyTokens = parseTypographyTokens();
export const spacingTokens = parseSpacingTokens();
export const shadowTokens = parseShadowTokens();
export const borderTokens = parseBorderTokens();

// Helper function to group core colors by category
export function getCoreColorsByCategory() {
  return coreColorTokens.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {} as Record<string, ColorToken[]>);
}

// Helper function to group semantic tokens by category
export function getSemanticTokensByCategory() {
  return semanticTokens.reduce((acc, token) => {
    if (!acc[token.category]) {
      acc[token.category] = [];
    }
    acc[token.category].push(token);
    return acc;
  }, {} as Record<string, SemanticToken[]>);
} 