import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { designTokens } from '@/lib/design-tokens';

interface ColorSwatch {
  name: string;
  variable?: string;
  hex?: string;
  value?: string;
  cssVar?: string;
  description?: string;
  computedValue?: string;
}

type ViewMode = 'css' | 'hex' | 'rgb';

// Helper function for color conversion
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
};

// Function to get computed CSS value
const getComputedColorValue = (cssVariable: string): string => {
  if (typeof window === 'undefined') return '#000000';
  
  // Handle both full CSS variable strings (var(--name)) and just variable names
  let variableName = cssVariable;
  if (cssVariable.startsWith('var(--') && cssVariable.endsWith(')')) {
    variableName = cssVariable.replace('var(--', '').replace(')', '');
  } else if (cssVariable.startsWith('--')) {
    variableName = cssVariable.substring(2);
  }
  
  const root = document.documentElement;
  const computedValue = getComputedStyle(root).getPropertyValue(variableName);
  
  if (!computedValue) {
    return '#000000';
  }
  
  return computedValue.trim();
};

export const ColorsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('hex');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [dynamicColors, setDynamicColors] = useState<ColorSwatch[]>([]);

  // Update colors with computed values
  useEffect(() => {
    const updateColorsWithComputedValues = () => {
      const updatedColors: ColorSwatch[] = [];
      
      // Process core colors
      Object.entries(designTokens.colors).forEach(([groupName, colors]) => {
        (colors as ColorSwatch[]).forEach(color => {
          const cssVar = color.cssVar || color.variable || '';
          const computedValue = cssVar ? getComputedColorValue(cssVar) : (color.hex || color.value || '#000000');
          
          updatedColors.push({
            ...color,
            computedValue: computedValue
          });
        });
      });
      
      // Process semantic colors - create proper ColorSwatch objects
      const semanticTokens = designTokens.semantic;
      
      // Alert Colors
      if (semanticTokens.alert) {
        semanticTokens.alert.forEach((token: any) => {
          const cssVar = token.token || token.cssVar || '';
          const computedValue = cssVar ? getComputedColorValue(cssVar) : '#000000';
          
          updatedColors.push({
            name: token.name,
            cssVar: cssVar,
            hex: computedValue,
            value: computedValue,
            variable: cssVar,
            description: token.usage,
            computedValue: computedValue
          });
        });
      }
      
      // Warning Colors
      if (semanticTokens.warning) {
        semanticTokens.warning.forEach((token: any) => {
          const cssVar = token.token || token.cssVar || '';
          const computedValue = cssVar ? getComputedColorValue(cssVar) : '#000000';
          
          updatedColors.push({
            name: token.name,
            cssVar: cssVar,
            hex: computedValue,
            value: computedValue,
            variable: cssVar,
            description: token.usage,
            computedValue: computedValue
          });
        });
      }
      
      // Success Colors
      if (semanticTokens.success) {
        semanticTokens.success.forEach((token: any) => {
          const cssVar = token.token || token.cssVar || '';
          const computedValue = cssVar ? getComputedColorValue(cssVar) : '#000000';
          
          updatedColors.push({
            name: token.name,
            cssVar: cssVar,
            hex: computedValue,
            value: computedValue,
            variable: cssVar,
            description: token.usage,
            computedValue: computedValue
          });
        });
      }
      
      setDynamicColors(updatedColors);
    };

    updateColorsWithComputedValues();

    // Set up mutation observer to detect CSS variable changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          updateColorsWithComputedValues();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => observer.disconnect();
  }, []);

  const copyToClipboard = async (color: ColorSwatch) => {
    let textToCopy = '';
    const hexValue = color.computedValue || color.hex || color.value || '#000000';
    const cssVar = color.cssVar || color.variable || '';
    
    switch (viewMode) {
      case 'css':
        textToCopy = cssVar ? `var(${cssVar})` : hexValue;
        break;
      case 'hex':
        textToCopy = hexValue;
        break;
      case 'rgb':
        textToCopy = `rgb(${hexToRgb(hexValue)})`;
        break;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedColor(color.cssVar || color.variable || color.name);
      setToastMessage(`${textToCopy} copied to clipboard`);
      setShowToast(true);
      setTimeout(() => {
        setCopiedColor(null);
        setShowToast(false);
      }, 2000);
    } catch (err) {
      setToastMessage('Failed to copy color to clipboard');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const ColorSwatchGrid: React.FC<{ colors: ColorSwatch[]; title: string; description?: string }> = ({ colors, title, description }) => (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {colors.map((color) => {
          const hexValue = color.computedValue || color.hex || color.value || '#000000';
          return (
            <div
              key={color.cssVar || color.variable || color.name}
              className="group relative"
            >
              <div
                className="w-full h-16 rounded-md mb-2 border transition-transform hover:scale-105"
                style={{ backgroundColor: hexValue }}
              />
              <div className="text-xs">
                <div className="font-medium mb-1 truncate">{color.name}</div>
                <div className="text-muted-foreground mb-1 font-mono text-[10px]">{color.cssVar || color.variable || ''}</div>
                <div className="font-mono text-xs">{hexValue}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(color)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              >
                {copiedColor === (color.cssVar || color.variable || color.name) ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Color System</h1>
        <p className="text-muted-foreground mt-2">
          Our color system is automatically synced with Figma tokens. Core colors provide the foundation, while semantic tokens ensure consistent usage across components.
        </p>
      </div>

      <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted/50">
        <Palette className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Colors are automatically synced from figma-tokens.json
        </p>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="core">Core Colors</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="mt-6">
          <div className="mb-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Core color values that serve as the foundation for all UI elements. These are the raw color values from your design system.
            </p>
          </div>
          
          {/* Dynamically render color groups from design tokens */}
          {Object.entries(designTokens.colors).map(([groupName, colors]) => {
            const groupColors = dynamicColors.filter(color => 
              (colors as ColorSwatch[]).some(originalColor => 
                originalColor.cssVar === color.cssVar || originalColor.name === color.name
              )
            );
            
            return (
              <ColorSwatchGrid
                key={groupName}
                title={groupName.charAt(0).toUpperCase() + groupName.slice(1) + ' Colors'}
                description={`${groupName} color palette`}
                colors={groupColors}
              />
            );
          })}
        </TabsContent>

        <TabsContent value="semantic" className="mt-6">
          <div className="mb-6 p-4 border rounded-lg bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              Semantic tokens provide meaningful names for colors based on their usage, ensuring consistency across all components.
            </p>
          </div>

          {/* Alert Colors */}
          {designTokens.semantic.alert && designTokens.semantic.alert.length > 0 && (
            <ColorSwatchGrid
              title="Alert Colors"
              description="Colors for indicating important information or errors"
              colors={dynamicColors.filter(color => 
                designTokens.semantic.alert.some((alertColor: any) => 
                  alertColor.cssVar === color.cssVar || alertColor.name === color.name
                )
              )}
            />
          )}

          {/* Warning Colors */}
          {designTokens.semantic.warning && designTokens.semantic.warning.length > 0 && (
            <ColorSwatchGrid
              title="Warning Colors"
              description="Colors for indicating warnings or caution"
              colors={dynamicColors.filter(color => 
                designTokens.semantic.warning.some((warningColor: any) => 
                  warningColor.cssVar === color.cssVar || warningColor.name === color.name
                )
              )}
            />
          )}

          {/* Success Colors */}
          {designTokens.semantic.success && designTokens.semantic.success.length > 0 && (
            <ColorSwatchGrid
              title="Success Colors"
              description="Colors for indicating successful actions or positive feedback"
              colors={dynamicColors.filter(color => 
                designTokens.semantic.success.some((successColor: any) => 
                  successColor.cssVar === color.cssVar || successColor.name === color.name
                )
              )}
            />
          )}
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-2 mt-6">
        <span className="text-sm text-muted-foreground">Display format:</span>
        <div className="flex gap-1">
          <Badge 
            variant={viewMode === 'css' ? 'default' : 'outline'} 
            className="cursor-pointer" 
            onClick={() => setViewMode('css')}
          >
            CSS
          </Badge>
          <Badge 
            variant={viewMode === 'hex' ? 'default' : 'outline'} 
            className="cursor-pointer" 
            onClick={() => setViewMode('hex')}
          >
            HEX
          </Badge>
          <Badge 
            variant={viewMode === 'rgb' ? 'default' : 'outline'} 
            className="cursor-pointer" 
            onClick={() => setViewMode('rgb')}
          >
            RGB
          </Badge>
        </div>
      </div>

      {/* Simple Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 rounded-md shadow-lg transition-opacity z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};