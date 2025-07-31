
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ColorSwatch {
  name: string;
  variable: string;
  hex: string;
  description?: string;
}

// Helper function for color conversion
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
};

// Function to get CSS variable value
const getCSSVariableValue = (variableName: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }
  return '';
};

// PureSpectrum Core Colors with dynamic CSS variable reading
const usePureSpectrumCoreColors = () => {
  const [colors, setColors] = useState({
    'neutral': [
      { name: 'Neutral 50', variable: '--gray-50', hex: '#FCFCFD', description: 'Very light neutral' },
      { name: 'Neutral 100', variable: '--gray-100', hex: '#f1f2f4', description: 'Very light neutral' },
      { name: 'Neutral 200', variable: '--gray-200', hex: '#dfe2e7', description: 'Light neutral' },
      { name: 'Neutral 300', variable: '--gray-300', hex: '#c2c8d1', description: 'Medium light neutral' },
      { name: 'Neutral 400', variable: '--gray-400', hex: '#a9b0bc', description: 'Medium neutral' },
      { name: 'Neutral 500', variable: '--gray-500', hex: '#9299ab', description: 'Medium dark neutral' },
      { name: 'Neutral 600', variable: '--gray-600', hex: '#818798', description: 'Dark neutral' },
      { name: 'Neutral 700', variable: '--gray-700', hex: '#75798a', description: 'Darker neutral' },
      { name: 'Neutral 800', variable: '--gray-800', hex: '#656772', description: 'Very dark neutral' },
      { name: 'Neutral 900', variable: '--gray-900', hex: '#57585c', description: 'Almost black neutral' },
      { name: 'Neutral 950', variable: '--gray-950', hex: '#333333', description: 'Rich black neutral' }
    ],
    'light-blue': [
      { name: 'Light Blue 10', variable: '--ps-lightblue-10', hex: '#fafcfd', description: 'Very light blue for subtle backgrounds' },
      { name: 'Light Blue 30', variable: '--ps-lightblue-30', hex: '#f0f7fa', description: 'Light blue for hover states' },
      { name: 'Light Blue 50', variable: '--ps-lightblue-50', hex: '#cee4ef', description: 'Medium light blue for primary elements' },
      { name: 'Light Blue 65', variable: '--ps-lightblue-65', hex: '#dfedf5', description: 'Light blue for active states' },
      { name: 'Light Blue 120', variable: '--ps-lightblue-120', hex: '#9acadf', description: 'Deeper light blue for emphasis' }
    ],
    'ocean-blue': [
      { name: 'Ocean Blue 10', variable: '--ps-ocean-blue-10', hex: '#eff4f9', description: 'Very light ocean blue for backgrounds' },
      { name: 'Ocean Blue 30', variable: '--ps-ocean-blue-30', hex: '#cedeec', description: 'Light ocean blue for hover states' },
      { name: 'Ocean Blue 50', variable: '--ps-ocean-blue-50', hex: '#5b90c0', description: 'Main ocean blue for primary actions' },
      { name: 'Ocean Blue 65', variable: '--ps-ocean-blue-65', hex: '#94b7d6', description: 'Ocean blue for active states' },
      { name: 'Ocean Blue 120', variable: '--ps-ocean-blue-120', hex: '#4878ad', description: 'Deep ocean blue for emphasis' }
    ],
    'brown-earth': [
      { name: 'Brown Earth 10', variable: '--ps-brown-earth-10', hex: '#f6f1f1', description: 'Very light brown for backgrounds' },
      { name: 'Brown Earth 30', variable: '--ps-brown-earth-30', hex: '#e3d6d4', description: 'Light brown for hover states' },
      { name: 'Brown Earth 50', variable: '--ps-brown-earth-50', hex: '#a37871', description: 'Main brown for primary elements' },
      { name: 'Brown Earth 65', variable: '--ps-brown-earth-65', hex: '#c3a7a3', description: 'Brown for active states' },
      { name: 'Brown Earth 120', variable: '--ps-brown-earth-120', hex: '#825a53', description: 'Deep brown for emphasis' }
    ],
    'dark-stormblue': [
      { name: 'Dark Storm Blue 10', variable: '--ps-dark-stormblue-10', hex: '#e9ebec', description: 'Very light storm blue for backgrounds' },
      { name: 'Dark Storm Blue 30', variable: '--ps-dark-stormblue-30', hex: '#bec2c7', description: 'Light storm blue for hover states' },
      { name: 'Dark Storm Blue 50', variable: '--ps-dark-stormblue-50', hex: '#253446', description: 'Main storm blue for primary elements' },
      { name: 'Dark Storm Blue 65', variable: '--ps-dark-stormblue-65', hex: '#717b87', description: 'Storm blue for active states' },
      { name: 'Dark Storm Blue 120', variable: '--ps-dark-stormblue-120', hex: '#1c2735', description: 'Deep storm blue for emphasis' }
    ],
    'sand-brown': [
      { name: 'Sand Brown 10', variable: '--ps-sand-brown-10', hex: '#fbf9f6', description: 'Very light sand for backgrounds' },
      { name: 'Sand Brown 30', variable: '--ps-sand-brown-30', hex: '#f3ece5', description: 'Light sand for hover states' },
      { name: 'Sand Brown 50', variable: '--ps-sand-brown-50', hex: '#d8bfaa', description: 'Main sand for secondary elements' },
      { name: 'Sand Brown 65', variable: '--ps-sand-brown-65', hex: '#e6d5c8', description: 'Sand for active states' },
      { name: 'Sand Brown 120', variable: '--ps-sand-brown-120', hex: '#c09477', description: 'Deep sand for emphasis' }
    ],
    'stone-blue': [
      { name: 'Stone Blue 10', variable: '--ps-stone-blue-10', hex: '#eceff4', description: 'Very light stone blue for backgrounds' },
      { name: 'Stone Blue 30', variable: '--ps-stone-blue-30', hex: '#c6d0dd', description: 'Light stone blue for hover states' },
      { name: 'Stone Blue 50', variable: '--ps-stone-blue-50', hex: '#40628d', description: 'Main stone blue for secondary elements' },
      { name: 'Stone Blue 65', variable: '--ps-stone-blue-65', hex: '#8399b5', description: 'Stone blue for active states' },
      { name: 'Stone Blue 120', variable: '--ps-stone-blue-120', hex: '#2a5183', description: 'Deep stone blue for emphasis' }
    ],
    'basic': [
      { name: 'Gray', variable: '--ps-gray', hex: '#9299ab', description: 'Neutral gray for text and subtle elements' },
      { name: 'Light Gray', variable: '--ps-light-gray', hex: '#f6f6f6', description: 'Light gray for backgrounds and subtle surfaces' },
      { name: 'White', variable: '--ps-white', hex: '#ffffff', description: 'Pure white for backgrounds and light surfaces' },
      { name: 'Blue', variable: '--ps-blue', hex: '#142a3d', description: 'Deep blue for primary text and important elements' },
      { name: 'Black', variable: '--ps-black', hex: '#272727', description: 'Rich black for high contrast text and elements' }
    ]
  });

  useEffect(() => {
    const updateColors = () => {
      setColors(prevColors => ({
        ...prevColors,
        'neutral': prevColors.neutral.map(color => ({
          ...color,
          hex: getCSSVariableValue(color.variable) || color.hex
        })),
        'light-blue': prevColors['light-blue'].map(color => ({
          ...color,
          hex: getCSSVariableValue(color.variable) || color.hex
        })),
        'ocean-blue': prevColors['ocean-blue'].map(color => ({
          ...color,
          hex: getCSSVariableValue(color.variable) || color.hex
        })),
        'brown-earth': prevColors['brown-earth'].map(color => ({
          ...color,
          hex: getCSSVariableValue(color.variable) || color.hex
        })),
        'dark-stormblue': prevColors['dark-stormblue'].map(color => ({
          ...color,
          hex: getCSSVariableValue(color.variable) || color.hex
        })),
        'sand-brown': prevColors['sand-brown'].map(color => ({
          ...color,
          hex: getCSSVariableValue(color.variable) || color.hex
        })),
        'stone-blue': prevColors['stone-blue'].map(color => ({
          ...color,
          hex: getCSSVariableValue(color.variable) || color.hex
        })),
        'basic': prevColors.basic.map(color => ({
          ...color,
          hex: getCSSVariableValue(color.variable) || color.hex
        }))
      }));
    };

    // Update colors immediately
    updateColors();

    // Set up a mutation observer to watch for CSS changes
    if (typeof window !== 'undefined') {
      const observer = new MutationObserver(updateColors);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style']
      });

      return () => observer.disconnect();
    }
  }, []);

  return colors;
};

// Semantic Tokens (as defined in tokens.css)
const semanticTokens = {
  'brand': [
    { name: 'Primary', variable: '--color-primary', hex: '#5b90c0', description: 'Main brand color for primary actions' },
    { name: 'Primary Hover', variable: '--color-primary-hover', hex: '#4878ad', description: 'Primary color for hover states' },
    { name: 'Primary Active', variable: '--color-primary-active', hex: '#253446', description: 'Primary color for active states' },
    { name: 'Primary Disabled', variable: '--color-primary-disabled', hex: '#cedeec', description: 'Primary color for disabled states' },
    { name: 'Primary Subtle', variable: '--color-primary-subtle', hex: '#eff4f9', description: 'Subtle primary color for backgrounds' }
  ],
  'text': [
    { name: 'Text Primary', variable: '--color-text-primary', hex: '#142a3d', description: 'Main text color for primary content' },
    { name: 'Text Secondary', variable: '--color-text-secondary', hex: '#57585c', description: 'Secondary text color for less important content' },
    { name: 'Text Tertiary', variable: '--color-text-tertiary', hex: '#75798a', description: 'Tertiary text color for subtle content' },
    { name: 'Text Disabled', variable: '--color-text-disabled', hex: '#9299ab', description: 'Text color for disabled elements' },
    { name: 'Text Inverse', variable: '--color-text-inverse', hex: '#ffffff', description: 'Inverse text color for dark backgrounds' },
    { name: 'Text Link', variable: '--color-text-link', hex: '#5b90c0', description: 'Link text color' },
    { name: 'Text Link Hover', variable: '--color-text-link-hover', hex: '#4878ad', description: 'Link text color for hover states' }
  ],
  'background': [
    { name: 'Background', variable: '--color-background', hex: '#ffffff', description: 'Main background color' },
    { name: 'Background Subtle', variable: '--color-background-subtle', hex: '#f6f6f6', description: 'Subtle background color' },
    { name: 'Surface', variable: '--color-surface', hex: '#ffffff', description: 'Surface color for cards and panels' },
    { name: 'Surface Subtle', variable: '--color-surface-subtle', hex: '#f6f6f6', description: 'Subtle surface color' },
    { name: 'Surface Hover', variable: '--color-surface-hover', hex: '#f1f2f4', description: 'Surface color for hover states' },
    { name: 'Surface Pressed', variable: '--color-surface-pressed', hex: '#dfe2e7', description: 'Surface color for pressed states' }
  ],
  'border': [
    { name: 'Border', variable: '--color-border', hex: '#dfe2e7', description: 'Main border color' },
    { name: 'Border Subtle', variable: '--color-border-subtle', hex: '#f1f2f4', description: 'Subtle border color' },
    { name: 'Border Strong', variable: '--color-border-strong', hex: '#c2c8d1', description: 'Strong border color' },
    { name: 'Border Focus', variable: '--color-border-focus', hex: '#5b90c0', description: 'Focus border color' }
  ],
  'feedback': {
    'success': [
      { name: 'Success', variable: '--color-success', hex: '#247f3f', description: 'Success color for positive feedback' },
      { name: 'Success Background', variable: '--color-success-background', hex: '#ebf3eb', description: 'Success background color' },
      { name: 'Success Border', variable: '--color-success-border', hex: '#e0f1d0', description: 'Success border color' },
      { name: 'Success Hover', variable: '--color-success-hover', hex: '#247f3f', description: 'Success color for hover states' }
    ],
    'error': [
      { name: 'Error', variable: '--color-error', hex: '#e31c2c', description: 'Error color for negative feedback' },
      { name: 'Error Background', variable: '--color-error-background', hex: '#fdeff1', description: 'Error background color' },
      { name: 'Error Border', variable: '--color-error-border', hex: '#f7bbc0', description: 'Error border color' },
      { name: 'Error Hover', variable: '--color-error-hover', hex: '#e31c2c', description: 'Error color for hover states' }
    ],
    'warning': [
      { name: 'Warning', variable: '--color-warning', hex: '#f0ce3f', description: 'Warning color for caution feedback' },
      { name: 'Warning Background', variable: '--color-warning-background', hex: '#fdf7e7', description: 'Warning background color' },
      { name: 'Warning Border', variable: '--color-warning-border', hex: '#f6d687', description: 'Warning border color' },
      { name: 'Warning Hover', variable: '--color-warning-hover', hex: '#f0ce3f', description: 'Warning color for hover states' }
    ],
    'info': [
      { name: 'Info', variable: '--color-info', hex: '#5b90c0', description: 'Info color for informational feedback' },
      { name: 'Info Background', variable: '--color-info-background', hex: '#eff4f9', description: 'Info background color' },
      { name: 'Info Border', variable: '--color-info-border', hex: '#cedeec', description: 'Info border color' },
      { name: 'Info Hover', variable: '--color-info-hover', hex: '#4878ad', description: 'Info color for hover states' }
    ]
  }
};

type ViewMode = 'css' | 'hex' | 'rgb';

export const ColorsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('hex');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const pureSpectrumCoreColors = usePureSpectrumCoreColors();

  const copyToClipboard = async (color: ColorSwatch) => {
    let textToCopy = '';
    switch (viewMode) {
      case 'css':
        textToCopy = color.variable;
        break;
      case 'hex':
        textToCopy = color.hex;
        break;
      case 'rgb':
        textToCopy = `rgb(${hexToRgb(color.hex)})`;
        break;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedColor(color.variable);
      toast({
        title: "Color copied!",
        description: `${textToCopy} copied to clipboard`,
      });
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy color to clipboard",
        variant: "destructive",
      });
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
          {colors.map((color) => (
            <div
              key={color.variable}
            className="group relative"
          >
            <div
              className="w-full h-16 rounded-md mb-2 border"
              style={{ backgroundColor: color.hex }}
            />
            <div className="text-xs">
              <div className="font-medium mb-1">{color.name}</div>
              <div className="text-muted-foreground mb-1">{color.variable}</div>
              <div className="font-mono text-xs">{color.hex}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(color)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            >
                  {copiedColor === color.variable ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            </div>
          ))}
        </div>
    </div>
  );

  return (
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Color System</h1>
        <p className="text-muted-foreground mt-2">
          Our color system follows a two-tier approach: core tokens (primitive values) and semantic tokens (behavioral meanings) for maximum flexibility and consistency.
        </p>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="core">Core Color Palette</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="mt-6">
          <div className="mb-6 p-4 border rounded-lg bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800">
              Primitive color values with 11 shades each (50-950). These are the foundation that semantic tokens reference.
            </p>
          </div>
          
          {/* Neutral Colors */}
          <ColorSwatchGrid
            title="Neutral Colors"
            description="Foundation colors for essential UI elements"
            colors={pureSpectrumCoreColors['neutral']}
          />

          {/* Light Blue */}
          <ColorSwatchGrid
            title="Light Blue"
            description="Light blue shades for subtle backgrounds and hover states"
            colors={pureSpectrumCoreColors['light-blue']}
          />

          {/* Ocean Blue */}
          <ColorSwatchGrid
            title="Ocean Blue"
            description="Ocean blue shades for primary actions and main brand elements"
            colors={pureSpectrumCoreColors['ocean-blue']}
          />

          {/* Brown Earth */}
          <ColorSwatchGrid
            title="Brown Earth"
            description="Brown earth shades for warm, natural elements"
            colors={pureSpectrumCoreColors['brown-earth']}
          />

          {/* Dark Storm Blue */}
          <ColorSwatchGrid
            title="Dark Storm Blue"
            description="Dark storm blue shades for strong contrast and emphasis"
            colors={pureSpectrumCoreColors['dark-stormblue']}
          />

          {/* Sand Brown */}
          <ColorSwatchGrid
            title="Sand Brown"
            description="Sand brown shades for secondary elements and backgrounds"
            colors={pureSpectrumCoreColors['sand-brown']}
          />

          {/* Stone Blue */}
          <ColorSwatchGrid
            title="Stone Blue"
            description="Stone blue shades for secondary actions and subtle elements"
            colors={pureSpectrumCoreColors['stone-blue']}
          />

          {/* Basic Colors */}
          <ColorSwatchGrid
            title="Basic Colors"
            description="Foundation colors for essential UI elements"
            colors={pureSpectrumCoreColors['basic']}
          />
        </TabsContent>

        <TabsContent value="semantic" className="mt-6">
          <div className="mb-6 p-4 border rounded-lg bg-green-50 border-green-200">
            <p className="text-sm text-green-800">
              Semantic tokens that reference core colors and provide behavioral meaning for consistent usage across components.
            </p>
          </div>

          {/* Brand Colors */}
          <ColorSwatchGrid
            title="Brand Colors"
            description="Brand colors mapped to semantic tokens for consistent usage"
            colors={semanticTokens.brand}
          />

          {/* Text Colors */}
          <ColorSwatchGrid
            title="Text Colors"
            description="Text colors mapped to semantic tokens for consistent typography"
            colors={semanticTokens.text}
          />

          {/* Background Colors */}
          <ColorSwatchGrid
            title="Background Colors"
            description="Background and surface colors mapped to semantic tokens"
            colors={semanticTokens.background}
          />

          {/* Border Colors */}
          <ColorSwatchGrid
            title="Border Colors"
            description="Border colors mapped to semantic tokens for consistent borders"
            colors={semanticTokens.border}
          />

          {/* Success Colors */}
          <ColorSwatchGrid
            title="Success Colors"
            description="Success colors for positive feedback and confirmations"
            colors={semanticTokens.feedback.success}
          />

          {/* Error Colors */}
          <ColorSwatchGrid
            title="Error Colors"
            description="Error colors for negative feedback and alerts"
            colors={semanticTokens.feedback.error}
          />

          {/* Warning Colors */}
          <ColorSwatchGrid
            title="Warning Colors"
            description="Warning colors for caution feedback and notifications"
            colors={semanticTokens.feedback.warning}
          />

          {/* Info Colors */}
          <ColorSwatchGrid
            title="Info Colors"
            description="Info colors for informational feedback and messages"
            colors={semanticTokens.feedback.info}
          />
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-2 mt-6">
        <span className="text-sm text-muted-foreground">Display format:</span>
        <Badge variant="outline" className="cursor-pointer" onClick={() => setViewMode('css')}>
          CSS
        </Badge>
        <Badge variant="outline" className="cursor-pointer" onClick={() => setViewMode('hex')}>
          HEX
        </Badge>
        <Badge variant="outline" className="cursor-pointer" onClick={() => setViewMode('rgb')}>
          RGB
        </Badge>
          </div>
    </div>
  );
};
