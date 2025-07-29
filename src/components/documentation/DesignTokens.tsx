import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  getCoreColorsByCategory, 
  getSemanticTokensByCategory,
  typographyTokens,
  spacingTokens,
  shadowTokens,
  borderTokens
} from '@/lib/design-tokens';

// Color format types and utilities
type ColorFormat = 'hex' | 'rgb' | 'hsl';
type ShadowFormat = 'css-value' | 'css-property' | 'tailwind' | 'css-variable';
type RadiusFormat = 'name' | 'css-value' | 'css-property' | 'css-variable';

const formatLabels: Record<ColorFormat, string> = {
  hex: 'Hex Codes',
  rgb: 'RGB Codes', 
  hsl: 'HSL Codes'
};

const shadowFormatLabels: Record<ShadowFormat, string> = {
  'tailwind': 'Name',
  'css-value': 'CSS Values',
  'css-property': 'CSS Properties',
  'css-variable': 'CSS Variables'
};

const radiusFormatLabels: Record<RadiusFormat, string> = {
  'name': 'Name',
  'css-value': 'CSS Values',
  'css-property': 'CSS Properties',
  'css-variable': 'CSS Variables'
};

// Utility functions for color format conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function getColorValue(hex: string, format: ColorFormat): string {
  switch (format) {
    case 'hex':
      return hex.toUpperCase();
    case 'rgb': {
      const rgb = hexToRgb(hex);
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : hex;
    }
    case 'hsl': {
      const hsl = hexToHsl(hex);
      return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : hex;
    }
    default:
      return hex;
  }
}

function getShadowValue(shadow: any, format: ShadowFormat): string {
  switch (format) {
    case 'css-value':
      return shadow.value;
    case 'css-property':
      return `box-shadow: ${shadow.value};`;
    case 'tailwind':
      return shadow.tokenName;
    case 'css-variable':
      return shadow.token;
    default:
      return shadow.value;
  }
}

function getRadiusValue(radius: any, format: RadiusFormat): string {
  switch (format) {
    case 'name':
      return radius.tokenName;
    case 'css-value':
      return radius.value;
    case 'css-property':
      return `border-radius: ${radius.value};`;
    case 'css-variable':
      return radius.token;
    default:
      return radius.tokenName;
  }
}

// Create a lookup map for resolving semantic token values
function createColorLookup(coreColorsByCategory: Record<string, any[]>) {
  const lookup: Record<string, string> = {};
  Object.values(coreColorsByCategory).flat().forEach(color => {
    lookup[color.name.toLowerCase().replace(' ', '-')] = color.value;
  });
  return lookup;
}

function getSemanticTokenValue(lightRef: string, darkRef: string, format: ColorFormat, coreColorsByCategory: Record<string, any[]>): string {
  const colorLookup = createColorLookup(coreColorsByCategory);
  
  // Try to resolve the light theme reference to get actual hex value
  const lightColor = colorLookup[lightRef.toLowerCase().replace(' ', '-')];
  const darkColor = colorLookup[darkRef.toLowerCase().replace(' ', '-')];
  
  if (lightColor) {
    return getColorValue(lightColor, format);
  }
  
  // Fallback to showing the reference
  return `${lightRef} / ${darkRef}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toast.success('Copied to clipboard!');
  }
}

export const DesignTokens: React.FC<{ activeToken: string }> = ({ activeToken }) => {
  const [activeFormat, setActiveFormat] = useState<ColorFormat>('hex');
  const [activeColorTab, setActiveColorTab] = useState<'core' | 'semantic'>('core');
  const [activeShadowFormat, setActiveShadowFormat] = useState<ShadowFormat>('tailwind');
  const [activeRadiusFormat, setActiveRadiusFormat] = useState<RadiusFormat>('name');

  // 🔧 FIX: Move all function calls outside conditionals
  const coreColorsByCategory = getCoreColorsByCategory();
  const semanticTokensByCategory = getSemanticTokensByCategory();

  if (activeToken === 'Colors') {

    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Color System</h1>
          <p className="text-muted-foreground">
            Our color system follows a two-tier approach: <strong>core tokens</strong> (primitive values) and <strong>semantic tokens</strong> (behavioral meanings) for maximum flexibility and consistency.
          </p>
          
          {/* Color Type Segmented Control and Format Dropdown */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
              <Button
                variant={activeColorTab === 'core' ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveColorTab('core')}
                className={`
                  text-sm font-medium transition-all duration-200
                  ${activeColorTab === 'core' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }
                `}
              >
                Core Color Palette
              </Button>
              <Button
                variant={activeColorTab === 'semantic' ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveColorTab('semantic')}
                className={`
                  text-sm font-medium transition-all duration-200
                  ${activeColorTab === 'semantic' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }
                `}
              >
                Semantic Tokens
              </Button>
            </div>
            
            {/* Color Format Dropdown */}
            <Select value={activeFormat} onValueChange={(value: ColorFormat) => setActiveFormat(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(formatLabels) as ColorFormat[]).map((format) => (
                  <SelectItem 
                    key={format} 
                    value={format} 
                    className="py-3 [&_svg]:hidden flex justify-start items-center text-left"
                    style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  >
                    {formatLabels[format]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Core Tokens Section */}
        {activeColorTab === 'core' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-800">Primitive color values with 11 shades each (50-950). These are the foundation that semantic tokens reference.</span>
              </div>
            </div>
          
          {Object.entries(coreColorsByCategory).map(([category, colors]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-medium">{category}</h3>
              
              {/* Enhanced grid layout with individual bordered items */}
              <div className="grid grid-cols-6 gap-3">
                {colors.map((color) => {
                  const formatValue = getColorValue(color.value, activeFormat);
                  return (
                    <div 
                      key={color.name} 
                      className="group cursor-pointer border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow" 
                      title={`Click to copy: ${formatValue}`}
                      onClick={() => copyToClipboard(formatValue)}
                    >
                      <div className={`h-16 ${color.class} transition-all duration-200 group-hover:scale-105`} />
                      <div className="p-2 bg-background text-left space-y-1">
                        <div className="text-xs font-medium text-foreground">
                          {color.name.toLowerCase().replace(' ', '-')}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono truncate">
                          {color.cssVar}
                        </div>
                        <div className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 text-foreground w-fit">
                          {formatValue}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Semantic/Behavioral Tokens Section */}
        {activeColorTab === 'semantic' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-800">Behavioral tokens that reference core colors and adapt to light/dark themes automatically.</span>
              </div>
            </div>
          
          {Object.entries(semanticTokensByCategory).map(([category, tokens]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-medium">{category}</h3>
              
              {/* Enhanced grid layout with individual bordered items */}
              <div className="grid grid-cols-6 gap-3">
                {tokens.map((token) => {
                  // Show both light and dark core token names
                  const lightTokenName = token.light.toLowerCase().replace(' ', '-');
                  const darkTokenName = token.dark.toLowerCase().replace(' ', '-');
                  
                  // Get color values for each token
                  const colorLookup = createColorLookup(coreColorsByCategory);
                  const lightColorValue = colorLookup[lightTokenName];
                  const darkColorValue = colorLookup[darkTokenName];
                  const lightFormatValue = lightColorValue ? getColorValue(lightColorValue, activeFormat) : lightTokenName;
                  const darkFormatValue = darkColorValue ? getColorValue(darkColorValue, activeFormat) : darkTokenName;
                  
                  const isAdaptive = lightTokenName !== darkTokenName;
                  
                  return (
                    <div 
                      key={token.name} 
                      className={`group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${!isAdaptive ? 'cursor-pointer' : ''}`} 
                      title={`${token.name}: ${token.usage}${!isAdaptive ? ` - Click to copy: ${lightFormatValue}` : ''}`}
                      onClick={!isAdaptive ? () => copyToClipboard(lightFormatValue) : undefined}
                    >
                      {lightTokenName === darkTokenName ? (
                        // Single color for brand tokens (same in light/dark)
                        <div 
                          className="h-16 transition-all duration-200 group-hover:scale-105"
                          style={{ backgroundColor: `var(--${lightTokenName})` }}
                        />
                      ) : (
                        // Split color for adaptive tokens (different in light/dark)
                        <div className="h-16 flex transition-all duration-200 group-hover:scale-105">
                          <div 
                            className="flex-1"
                            style={{ backgroundColor: `var(--${lightTokenName})` }}
                          />
                          <div 
                            className="flex-1"
                            style={{ backgroundColor: `var(--${darkTokenName})` }}
                          />
                        </div>
                      )}
                      <div className="p-2 bg-background text-left space-y-1">
                        <div className="text-xs font-medium text-foreground truncate">
                          {token.name.replace(category + ' ', '').replace(category, '').trim() || 'Default'}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono truncate">
                          {token.token}
                        </div>
                        {lightTokenName === darkTokenName ? (
                          // Single token badge for brand tokens
                          <div className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 text-foreground w-fit">
                            {lightTokenName}
                          </div>
                        ) : (
                          // Two token badges for adaptive tokens - individually clickable
                          <>
                            <div 
                              className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 text-foreground w-fit cursor-pointer hover:bg-muted/80 transition-colors"
                              title={`Click to copy light mode: ${lightFormatValue}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(lightFormatValue);
                              }}
                            >
                              {lightTokenName}
                            </div>
                            <div 
                              className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 text-foreground w-fit cursor-pointer hover:bg-muted/80 transition-colors"
                              title={`Click to copy dark mode: ${darkFormatValue}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(darkFormatValue);
                              }}
                            >
                              {darkTokenName}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          </div>
        )}
        
        <div className="mt-8 p-6 rounded-lg bg-muted/50 space-y-4">
          <h3 className="font-semibold">Token Architecture & Usage</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-medium">Semantic Tokens (Recommended)</h4>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-green-600">/* Use for components */</div>
                <div>color: var(--color-text-primary);</div>
                <div>background: var(--color-primary);</div>
                <div>border: 1px solid var(--color-border);</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Core Tokens (Design System)</h4>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-amber-600">/* Direct color access */</div>
                <div>background: var(--blue-600);</div>
                <div>&lt;div className="bg-emerald-500"&gt;</div>
                <div>&lt;div className="text-gray-950"&gt;</div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Best Practice:</strong> Use semantic tokens for components and layouts. They automatically adapt to theme changes and provide consistent meaning across your application.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeToken === 'Typography') {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Typography</h1>
          <p className="text-muted-foreground">
            Our typography scale ensures consistent hierarchy and readability across all interface elements.
          </p>
        </div>
        
        <div className="space-y-8 border-t border-b border-border py-8">
          {typographyTokens.map((token, index) => (
            <div key={token.name} className={`space-y-4 ${index !== typographyTokens.length - 1 ? 'pb-8 border-b border-border' : ''}`}>
              <div className="text-sm text-muted-foreground font-mono">
                {token.tailwind}
              </div>
              
              <div className="space-y-6">
                <div 
                  className={token.tailwind}
                  style={{ 
                    fontWeight: token.weight,
                    fontSize: token.size,
                    lineHeight: token.lineHeight,
                    letterSpacing: token.letterSpacing
                  }}
                >
                  {token.displayName}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-muted/50 rounded px-2 py-1 text-xs text-muted-foreground">
                    <span className="font-medium">Weight:</span> {token.weight === '400' ? 'Regular' : token.weight === '500' ? 'Medium' : token.weight === '600' ? 'Semibold' : token.weight === '700' ? 'Bold' : token.weight === '800' ? 'Extrabold' : token.weight === '900' ? 'Black' : token.weight} / {token.weight}
                  </div>
                  <div className="bg-muted/50 rounded px-2 py-1 text-xs text-muted-foreground">
                    <span className="font-medium">Font Size:</span> {token.size}
                  </div>
                  <div className="bg-muted/50 rounded px-2 py-1 text-xs text-muted-foreground">
                    <span className="font-medium">Line Height:</span> {token.lineHeight}
                  </div>
                  <div className="bg-muted/50 rounded px-2 py-1 text-xs text-muted-foreground">
                    <span className="font-medium">Letter Spacing:</span> {token.letterSpacing}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 rounded-lg bg-muted/50 space-y-4">
          <h3 className="font-semibold">Typography Usage</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-medium">Utility Classes</h4>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-green-600">/* Direct class usage */</div>
                <div>&lt;h1 className="text-4xl font-bold"&gt;</div>
                <div>&lt;p className="text-base"&gt;</div>
                <div>&lt;span className="text-sm text-muted-foreground"&gt;</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">CSS Custom Properties</h4>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-amber-600">/* Font size variables */</div>
                <div>font-size: var(--font-size-lg);</div>
                <div>line-height: var(--line-height-normal);</div>
                <div>font-weight: var(--font-weight-medium);</div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Font Family:</strong> Our design system uses Geist as the primary typeface, with system fallbacks for optimal performance and accessibility.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeToken === 'Spacing') {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Spacing</h1>
          <p className="text-muted-foreground">
            Our spacing scale follows a consistent 0.25rem (4px) base unit for harmonious layouts.
          </p>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted">
                <th className="text-left py-4 pl-4 pr-8 text-foreground font-medium text-xs font-mono w-24">Name</th>
                <th className="text-left py-4 px-4 text-foreground font-medium text-xs font-mono w-32">Value</th>
                <th className="text-left py-4 px-4 text-foreground font-medium text-xs font-mono w-32">Pixels</th>
              </tr>
            </thead>
            <tbody>
              {spacingTokens.slice(0, 20).map((token, index) => (
                <tr key={token.name} className={index !== spacingTokens.slice(0, 20).length - 1 ? 'border-b' : ''}>
                  <td className="py-3 pl-4 pr-8 font-mono text-sm w-24">{token.name}</td>
                  <td className="py-3 px-4 text-sm font-mono w-32">{token.value}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground w-32">{token.pixels}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> This shows the first 20 spacing values. The complete scale continues up to p-96 (384px). 
            These values can be used with margin (m-*), padding (p-*), width (w-*), height (h-*), and other spacing utilities.
          </p>
        </div>
      </div>
    );
  }

  if (activeToken === 'Shadows') {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Shadows</h1>
          <p className="text-muted-foreground">
            Shadows add depth and hierarchy to interface elements.
          </p>
          
          {/* Shadow Format Segmented Control */}
          <div className="flex justify-start">
            <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
              {(Object.keys(shadowFormatLabels) as ShadowFormat[]).map((format) => (
                <Button
                  key={format}
                  variant={activeShadowFormat === format ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveShadowFormat(format)}
                  className={`
                    text-sm font-medium transition-all duration-200
                    ${activeShadowFormat === format 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }
                  `}
                >
                  {shadowFormatLabels[format]}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Grid layout matching color swatches */}
        <div className="grid grid-cols-4 gap-6">
          {shadowTokens.map((shadow) => {
            const formatValue = getShadowValue(shadow, activeShadowFormat);
            return (
              <div 
                key={shadow.name} 
                className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Visual shadow preview */}
                <div className="p-6 bg-muted/20 flex items-center justify-center">
                  <div 
                    className={`w-20 h-20 rounded-lg bg-background border transition-all duration-200 group-hover:scale-105 ${shadow.class}`} 
                  />
                </div>
                
                {/* Shadow information */}
                <div className="p-2 bg-background text-left space-y-1">
                  <div className="text-xs font-medium text-foreground">
                    {shadow.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {shadow.token}
                  </div>
                  <div 
                    className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 text-foreground w-fit cursor-pointer hover:bg-muted/80 transition-colors"
                    title={`Click to copy: ${formatValue}`}
                    onClick={() => copyToClipboard(formatValue)}
                  >
                    {formatValue.length > 30 ? `${formatValue.substring(0, 30)}...` : formatValue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 p-6 rounded-lg bg-muted/50 space-y-4">
          <h3 className="font-semibold">Shadow Usage</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-medium">CSS Custom Properties</h4>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-green-600">/* Use semantic tokens */</div>
                <div>box-shadow: var(--shadow-medium);</div>
                <div>filter: drop-shadow(var(--shadow-large));</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Utility Classes</h4>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-amber-600">/* Direct classes */</div>
                <div>&lt;div className="shadow-lg"&gt;</div>
                <div>&lt;div className="shadow-xl hover:shadow-2xl"&gt;</div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Best Practice:</strong> Use CSS custom properties for consistent theming and easier maintenance across your design system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeToken === 'Borders' || activeToken === 'Radius') {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Border Radius</h1>
          <p className="text-muted-foreground">
            Our border radius system provides a comprehensive scale from sharp (0px) to fully rounded (9999px), with consistent increments for harmonious design.
          </p>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted">
                <th className="text-left py-4 pl-4 pr-8 text-foreground font-medium text-xs font-mono w-24">Name</th>
                <th className="text-left py-4 px-4 text-foreground font-medium text-xs font-mono w-32">Value</th>
                <th className="text-left py-4 px-4 text-foreground font-medium text-xs font-mono w-32">Pixels</th>
              </tr>
            </thead>
            <tbody>
              {borderTokens.map((token, index) => (
                <tr key={token.name} className={index !== borderTokens.length - 1 ? 'border-b' : ''}>
                  <td className="py-3 pl-4 pr-8 font-mono text-sm w-24">{token.tokenName}</td>
                  <td className="py-3 px-4 text-sm font-mono w-32">{token.value}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground w-32">{token.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Usage:</strong> Use the CSS custom properties (e.g., <code>var(--radius-lg)</code>) in your styles, or apply the corresponding utility classes directly in your components.
            The <code>--radius</code> variable is set to <code>var(--radius-lg)</code> (8px) by default for component consistency.
          </p>
        </div>
      </div>
    );
  }

  return (
          <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Design Tokens</h1>
          <p className="text-muted-foreground">
            Select a token category from the sidebar to explore our design system foundations.
          </p>
        </div>
    </div>
  );
};
