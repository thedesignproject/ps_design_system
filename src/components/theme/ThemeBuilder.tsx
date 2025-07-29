
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
  };
  spacing: {
    scale: number;
  };
  borderRadius: string;
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#0f172a',
    secondary: '#64748b',
    accent: '#3b82f6',
    background: '#ffffff',
    foreground: '#0f172a',
  },
  typography: {
    fontFamily: 'Inter',
    fontSize: '16px',
  },
  spacing: {
    scale: 1,
  },
  borderRadius: '0.5rem',
};

export const ThemeBuilder = () => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  const updateTheme = (section: keyof ThemeConfig, key: string, value: string | number) => {
    setTheme(prev => {
      if (section === 'borderRadius') {
        return {
          ...prev,
          [section]: String(value),
        };
      }
      
      const currentSection = prev[section] as Record<string, any>;
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [key]: value,
        },
      };
    });
  };

  const exportTheme = () => {
    const cssVariables = `
:root {
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-background: ${theme.colors.background};
  --color-foreground: ${theme.colors.foreground};
  --font-family: ${theme.typography.fontFamily};
  --font-size: ${theme.typography.fontSize};
  --spacing-scale: ${theme.spacing.scale};
  --border-radius: ${theme.borderRadius};
}`;
    
    navigator.clipboard.writeText(cssVariables);
    alert('Theme exported to clipboard as CSS variables!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Theme Controls */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Configuration</CardTitle>
            <CardDescription>
              Customize your design tokens to create a unique theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="spacing">Spacing</TabsTrigger>
                <TabsTrigger value="borders">Borders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="colors" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="primary">Primary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="primary"
                        type="color"
                        value={theme.colors.primary}
                        onChange={(e) => updateTheme('colors', 'primary', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme.colors.primary}
                        onChange={(e) => updateTheme('colors', 'primary', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondary">Secondary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="secondary"
                        type="color"
                        value={theme.colors.secondary}
                        onChange={(e) => updateTheme('colors', 'secondary', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme.colors.secondary}
                        onChange={(e) => updateTheme('colors', 'secondary', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="accent">Accent Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="accent"
                        type="color"
                        value={theme.colors.accent}
                        onChange={(e) => updateTheme('colors', 'accent', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme.colors.accent}
                        onChange={(e) => updateTheme('colors', 'accent', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="typography" className="space-y-4">
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Input
                    id="fontFamily"
                    value={theme.typography.fontFamily}
                    onChange={(e) => updateTheme('typography', 'fontFamily', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fontSize">Base Font Size</Label>
                  <Input
                    id="fontSize"
                    value={theme.typography.fontSize}
                    onChange={(e) => updateTheme('typography', 'fontSize', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="spacing" className="space-y-4">
                <div>
                  <Label htmlFor="spacingScale">Spacing Scale</Label>
                  <Input
                    id="spacingScale"
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="2"
                    value={theme.spacing.scale}
                    onChange={(e) => updateTheme('spacing', 'scale', parseFloat(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="borders" className="space-y-4">
                <div>
                  <Label htmlFor="borderRadius">Border Radius</Label>
                  <Input
                    id="borderRadius"
                    value={theme.borderRadius}
                    onChange={(e) => setTheme(prev => ({ ...prev, borderRadius: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Button onClick={exportTheme} className="w-full">
          Export Theme as CSS Variables
        </Button>
      </div>
      
      {/* Preview Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              See how your theme looks in practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="space-y-4 p-6 rounded-lg border"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.fontSize,
                borderRadius: theme.borderRadius,
              }}
            >
              <h3 className="text-lg font-semibold" style={{ color: theme.colors.primary }}>
                Sample Component
              </h3>
              <p style={{ color: theme.colors.secondary }}>
                This is a preview of how your theme will look when applied to components.
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded text-white"
                  style={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius,
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded text-white"
                  style={{
                    backgroundColor: theme.colors.accent,
                    borderRadius: theme.borderRadius,
                  }}
                >
                  Accent Button
                </button>
              </div>
              <Separator />
              <div 
                className="p-4 rounded"
                style={{
                  backgroundColor: theme.colors.secondary + '20',
                  borderRadius: theme.borderRadius,
                }}
              >
                <p>Card component with secondary background</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
