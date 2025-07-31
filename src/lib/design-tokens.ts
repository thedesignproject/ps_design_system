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
  
  // Define PureSpectrum colors from tokens.css
  const pureSpectrumColors = [
    // Neutral Colors
    { name: 'Neutral 50', value: '#FCFCFD', class: 'bg-gray-50', category: 'Neutral', cssVar: 'var(--gray-50)' },
    { name: 'Neutral 100', value: '#f1f2f4', class: 'bg-gray-100', category: 'Neutral', cssVar: 'var(--gray-100)' },
    { name: 'Neutral 200', value: '#dfe2e7', class: 'bg-gray-200', category: 'Neutral', cssVar: 'var(--gray-200)' },
    { name: 'Neutral 300', value: '#c2c8d1', class: 'bg-gray-300', category: 'Neutral', cssVar: 'var(--gray-300)' },
    { name: 'Neutral 400', value: '#a9b0bc', class: 'bg-gray-400', category: 'Neutral', cssVar: 'var(--gray-400)' },
    { name: 'Neutral 500', value: '#9299ab', class: 'bg-gray-500', category: 'Neutral', cssVar: 'var(--gray-500)' },
    { name: 'Neutral 600', value: '#818798', class: 'bg-gray-600', category: 'Neutral', cssVar: 'var(--gray-600)' },
    { name: 'Neutral 700', value: '#75798a', class: 'bg-gray-700', category: 'Neutral', cssVar: 'var(--gray-700)' },
    { name: 'Neutral 800', value: '#656772', class: 'bg-gray-800', category: 'Neutral', cssVar: 'var(--gray-800)' },
    { name: 'Neutral 900', value: '#57585c', class: 'bg-gray-900', category: 'Neutral', cssVar: 'var(--gray-900)' },
    { name: 'Neutral 950', value: '#333333', class: 'bg-gray-950', category: 'Neutral', cssVar: 'var(--gray-950)' },
    
    // Light Blue
    { name: 'Light Blue 10', value: '#fafcfd', class: 'bg-ps-lightblue-10', category: 'Light Blue', cssVar: 'var(--ps-lightblue-10)' },
    { name: 'Light Blue 30', value: '#f0f7fa', class: 'bg-ps-lightblue-30', category: 'Light Blue', cssVar: 'var(--ps-lightblue-30)' },
    { name: 'Light Blue 50', value: '#cee4ef', class: 'bg-ps-lightblue-50', category: 'Light Blue', cssVar: 'var(--ps-lightblue-50)' },
    { name: 'Light Blue 65', value: '#dfedf5', class: 'bg-ps-lightblue-65', category: 'Light Blue', cssVar: 'var(--ps-lightblue-65)' },
    { name: 'Light Blue 120', value: '#9acadf', class: 'bg-ps-lightblue-120', category: 'Light Blue', cssVar: 'var(--ps-lightblue-120)' },
    
    // Ocean Blue
    { name: 'Ocean Blue 10', value: '#eff4f9', class: 'bg-ps-ocean-blue-10', category: 'Ocean Blue', cssVar: 'var(--ps-ocean-blue-10)' },
    { name: 'Ocean Blue 30', value: '#cedeec', class: 'bg-ps-ocean-blue-30', category: 'Ocean Blue', cssVar: 'var(--ps-ocean-blue-30)' },
    { name: 'Ocean Blue 50', value: '#5b90c0', class: 'bg-ps-ocean-blue-50', category: 'Ocean Blue', cssVar: 'var(--ps-ocean-blue-50)' },
    { name: 'Ocean Blue 65', value: '#94b7d6', class: 'bg-ps-ocean-blue-65', category: 'Ocean Blue', cssVar: 'var(--ps-ocean-blue-65)' },
    { name: 'Ocean Blue 120', value: '#4878ad', class: 'bg-ps-ocean-blue-120', category: 'Ocean Blue', cssVar: 'var(--ps-ocean-blue-120)' },
    
    // Brown Earth
    { name: 'Brown Earth 10', value: '#f6f1f1', class: 'bg-ps-brown-earth-10', category: 'Brown Earth', cssVar: 'var(--ps-brown-earth-10)' },
    { name: 'Brown Earth 30', value: '#e3d6d4', class: 'bg-ps-brown-earth-30', category: 'Brown Earth', cssVar: 'var(--ps-brown-earth-30)' },
    { name: 'Brown Earth 50', value: '#a37871', class: 'bg-ps-brown-earth-50', category: 'Brown Earth', cssVar: 'var(--ps-brown-earth-50)' },
    { name: 'Brown Earth 65', value: '#c3a7a3', class: 'bg-ps-brown-earth-65', category: 'Brown Earth', cssVar: 'var(--ps-brown-earth-65)' },
    { name: 'Brown Earth 120', value: '#825a53', class: 'bg-ps-brown-earth-120', category: 'Brown Earth', cssVar: 'var(--ps-brown-earth-120)' },
    
    // Dark Storm Blue
    { name: 'Dark Storm Blue 10', value: '#e9ebec', class: 'bg-ps-dark-stormblue-10', category: 'Dark Storm Blue', cssVar: 'var(--ps-dark-stormblue-10)' },
    { name: 'Dark Storm Blue 30', value: '#bec2c7', class: 'bg-ps-dark-stormblue-30', category: 'Dark Storm Blue', cssVar: 'var(--ps-dark-stormblue-30)' },
    { name: 'Dark Storm Blue 50', value: '#253446', class: 'bg-ps-dark-stormblue-50', category: 'Dark Storm Blue', cssVar: 'var(--ps-dark-stormblue-50)' },
    { name: 'Dark Storm Blue 65', value: '#717b87', class: 'bg-ps-dark-stormblue-65', category: 'Dark Storm Blue', cssVar: 'var(--ps-dark-stormblue-65)' },
    { name: 'Dark Storm Blue 120', value: '#1c2735', class: 'bg-ps-dark-stormblue-120', category: 'Dark Storm Blue', cssVar: 'var(--ps-dark-stormblue-120)' },
    
    // Sand Brown
    { name: 'Sand Brown 10', value: '#fbf9f6', class: 'bg-ps-sand-brown-10', category: 'Sand Brown', cssVar: 'var(--ps-sand-brown-10)' },
    { name: 'Sand Brown 30', value: '#f3ece5', class: 'bg-ps-sand-brown-30', category: 'Sand Brown', cssVar: 'var(--ps-sand-brown-30)' },
    { name: 'Sand Brown 50', value: '#d8bfaa', class: 'bg-ps-sand-brown-50', category: 'Sand Brown', cssVar: 'var(--ps-sand-brown-50)' },
    { name: 'Sand Brown 65', value: '#e6d5c8', class: 'bg-ps-sand-brown-65', category: 'Sand Brown', cssVar: 'var(--ps-sand-brown-65)' },
    { name: 'Sand Brown 120', value: '#c09477', class: 'bg-ps-sand-brown-120', category: 'Sand Brown', cssVar: 'var(--ps-sand-brown-120)' },
    
    // Stone Blue
    { name: 'Stone Blue 10', value: '#eceff4', class: 'bg-ps-stone-blue-10', category: 'Stone Blue', cssVar: 'var(--ps-stone-blue-10)' },
    { name: 'Stone Blue 30', value: '#c6d0dd', class: 'bg-ps-stone-blue-30', category: 'Stone Blue', cssVar: 'var(--ps-stone-blue-30)' },
    { name: 'Stone Blue 50', value: '#40628d', class: 'bg-ps-stone-blue-50', category: 'Stone Blue', cssVar: 'var(--ps-stone-blue-50)' },
    { name: 'Stone Blue 65', value: '#8399b5', class: 'bg-ps-stone-blue-65', category: 'Stone Blue', cssVar: 'var(--ps-stone-blue-65)' },
    { name: 'Stone Blue 120', value: '#2a5183', class: 'bg-ps-stone-blue-120', category: 'Stone Blue', cssVar: 'var(--ps-stone-blue-120)' },
    
    // Basic Colors
    { name: 'Gray', value: '#9299ab', class: 'bg-ps-gray', category: 'Basic', cssVar: 'var(--ps-gray)' },
    { name: 'Light Gray', value: '#f6f6f6', class: 'bg-ps-light-gray', category: 'Basic', cssVar: 'var(--ps-light-gray)' },
    { name: 'White', value: '#ffffff', class: 'bg-ps-white', category: 'Basic', cssVar: 'var(--ps-white)' },
    { name: 'Blue', value: '#142a3d', class: 'bg-ps-blue', category: 'Basic', cssVar: 'var(--ps-blue)' },
    { name: 'Black', value: '#272727', class: 'bg-ps-black', category: 'Basic', cssVar: 'var(--ps-black)' }
  ];

  pureSpectrumColors.forEach(colorData => {
        colors.push({
      name: colorData.name,
          value: colorData.value,
      class: colorData.class,
      category: colorData.category,
      cssVar: colorData.cssVar
    });
  });

  return colors;
}

function parseSemanticTokens(): SemanticToken[] {
  const semanticTokens: SemanticToken[] = [];

  // Define PureSpectrum semantic token mappings
  const semanticMappings = [
    // Alert Colors
    { key: 'alert-05', name: 'Alert 05', usage: 'Alert color lightest shade', category: 'Alert', cssVar: 'var(--alert-05)' },
    { key: 'alert-10', name: 'Alert 10', usage: 'Alert color light shade', category: 'Alert', cssVar: 'var(--alert-10)' },
    { key: 'alert-30', name: 'Alert 30', usage: 'Alert color medium-light shade', category: 'Alert', cssVar: 'var(--alert-30)' },
    { key: 'alert-50', name: 'Alert 50', usage: 'Alert color base shade', category: 'Alert', cssVar: 'var(--alert-50)' },
    { key: 'alert-70', name: 'Alert 70', usage: 'Alert color medium-dark shade', category: 'Alert', cssVar: 'var(--alert-70)' },
    { key: 'alert-90', name: 'Alert 90', usage: 'Alert color darkest shade', category: 'Alert', cssVar: 'var(--alert-90)' },

    // Warning Colors
    { key: 'warning-05', name: 'Warning 05', usage: 'Warning color lightest shade', category: 'Warning', cssVar: 'var(--warning-05)' },
    { key: 'warning-30', name: 'Warning 30', usage: 'Warning color light shade', category: 'Warning', cssVar: 'var(--warning-30)' },
    { key: 'warning-50', name: 'Warning 50', usage: 'Warning color base shade', category: 'Warning', cssVar: 'var(--warning-50)' },
    { key: 'warning-70', name: 'Warning 70', usage: 'Warning color medium-dark shade', category: 'Warning', cssVar: 'var(--warning-70)' },
    { key: 'warning-90', name: 'Warning 90', usage: 'Warning color darkest shade', category: 'Warning', cssVar: 'var(--warning-90)' },

    // Success Colors
    { key: 'success-05', name: 'Success 05', usage: 'Success color lightest shade', category: 'Success', cssVar: 'var(--success-05)' },
    { key: 'success-10', name: 'Success 10', usage: 'Success color light shade', category: 'Success', cssVar: 'var(--success-10)' },
    { key: 'success-30', name: 'Success 30', usage: 'Success color medium-light shade', category: 'Success', cssVar: 'var(--success-30)' },
    { key: 'success-50', name: 'Success 50', usage: 'Success color base shade', category: 'Success', cssVar: 'var(--success-50)' },
    { key: 'success-65', name: 'Success 65', usage: 'Success color medium shade', category: 'Success', cssVar: 'var(--success-65)' },
    { key: 'success-120', name: 'Success 120', usage: 'Success color dark shade', category: 'Success', cssVar: 'var(--success-120)' },
  ];

  semanticMappings.forEach(mapping => {
    semanticTokens.push({
      name: mapping.name,
      token: mapping.cssVar,
      light: mapping.name,
      dark: mapping.name,
      usage: mapping.usage,
      category: mapping.category
    });
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

// Export the designTokens object expected by ColorsPage.tsx
export const designTokens = {
  colors: {
    neutral: parseCoreColors().filter(color => color.category === 'Neutral'),
    'light-blue': parseCoreColors().filter(color => color.category === 'Light Blue'),
    'ocean-blue': parseCoreColors().filter(color => color.category === 'Ocean Blue'),
    'brown-earth': parseCoreColors().filter(color => color.category === 'Brown Earth'),
    'dark-stormblue': parseCoreColors().filter(color => color.category === 'Dark Storm Blue'),
    'sand-brown': parseCoreColors().filter(color => color.category === 'Sand Brown'),
    'stone-blue': parseCoreColors().filter(color => color.category === 'Stone Blue'),
    gray: parseCoreColors().filter(color => color.category === 'Gray'),
    'light-gray': parseCoreColors().filter(color => color.category === 'Light Gray'),
    white: parseCoreColors().filter(color => color.category === 'White'),
    blue: parseCoreColors().filter(color => color.category === 'Blue'),
    black: parseCoreColors().filter(color => color.category === 'Black')
  },
  semantic: {
    alert: parseSemanticTokens().filter(token => token.category === 'Alert'),
    warning: parseSemanticTokens().filter(token => token.category === 'Warning'),
    success: parseSemanticTokens().filter(token => token.category === 'Success')
  }
}; 