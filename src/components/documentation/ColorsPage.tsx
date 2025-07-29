
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Eye, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CodeBlock } from './CodeBlock';
import { ComponentExample } from './ComponentExample';

interface ColorSwatch {
  name: string;
  variable: string;
  hex: string;
  rgb: string;
  hsl: string;
}

const primaryColors: ColorSwatch[] = [
  { name: 'Primary 50', variable: '--primary-50', hex: '#EFF6FF', rgb: '239, 246, 255', hsl: '214, 100%, 97%' },
  { name: 'Primary 100', variable: '--primary-100', hex: '#DBEAFE', rgb: '219, 234, 254', hsl: '214, 95%, 93%' },
  { name: 'Primary 200', variable: '--primary-200', hex: '#BFDBFE', rgb: '191, 219, 254', hsl: '213, 97%, 87%' },
  { name: 'Primary 300', variable: '--primary-300', hex: '#93C5FD', rgb: '147, 197, 253', hsl: '212, 96%, 78%' },
  { name: 'Primary 400', variable: '--primary-400', hex: '#60A5FA', rgb: '96, 165, 250', hsl: '213, 93%, 68%' },
  { name: 'Primary 500', variable: '--primary-500', hex: '#3B82F6', rgb: '59, 130, 246', hsl: '217, 91%, 60%' },
  { name: 'Primary 600', variable: '--primary-600', hex: '#2563EB', rgb: '37, 99, 235', hsl: '221, 83%, 53%' },
  { name: 'Primary 700', variable: '--primary-700', hex: '#1D4ED8', rgb: '29, 78, 216', hsl: '224, 76%, 48%' },
  { name: 'Primary 800', variable: '--primary-800', hex: '#1E40AF', rgb: '30, 64, 175', hsl: '226, 71%, 40%' },
  { name: 'Primary 900', variable: '--primary-900', hex: '#1E3A8A', rgb: '30, 58, 138', hsl: '225, 64%, 33%' },
];

const neutralColors: ColorSwatch[] = [
  { name: 'Gray 50', variable: '--gray-50', hex: '#F9FAFB', rgb: '249, 250, 251', hsl: '210, 20%, 98%' },
  { name: 'Gray 100', variable: '--gray-100', hex: '#F3F4F6', rgb: '243, 244, 246', hsl: '220, 14%, 96%' },
  { name: 'Gray 200', variable: '--gray-200', hex: '#E5E7EB', rgb: '229, 231, 235', hsl: '220, 13%, 91%' },
  { name: 'Gray 300', variable: '--gray-300', hex: '#D1D5DB', rgb: '209, 213, 219', hsl: '212, 10%, 84%' },
  { name: 'Gray 400', variable: '--gray-400', hex: '#9CA3AF', rgb: '156, 163, 175', hsl: '218, 11%, 65%' },
  { name: 'Gray 500', variable: '--gray-500', hex: '#6B7280', rgb: '107, 114, 128', hsl: '220, 9%, 46%' },
  { name: 'Gray 600', variable: '--gray-600', hex: '#4B5563', rgb: '75, 85, 99', hsl: '215, 14%, 34%' },
  { name: 'Gray 700', variable: '--gray-700', hex: '#374151', rgb: '55, 65, 81', hsl: '217, 19%, 27%' },
  { name: 'Gray 800', variable: '--gray-800', hex: '#1F2937', rgb: '31, 41, 55', hsl: '215, 28%, 17%' },
  { name: 'Gray 900', variable: '--gray-900', hex: '#111827', rgb: '17, 24, 39', hsl: '221, 39%, 11%' },
];

const successColors: ColorSwatch[] = [
  { name: 'Success 50', variable: '--success-50', hex: '#F0FDF4', rgb: '240, 253, 244', hsl: '138, 76%, 97%' },
  { name: 'Success 100', variable: '--success-100', hex: '#DCFCE7', rgb: '220, 252, 231', hsl: '141, 84%, 93%' },
  { name: 'Success 200', variable: '--success-200', hex: '#BBF7D0', rgb: '187, 247, 208', hsl: '141, 79%, 85%' },
  { name: 'Success 300', variable: '--success-300', hex: '#86EFAC', rgb: '134, 239, 172', hsl: '142, 77%, 73%' },
  { name: 'Success 400', variable: '--success-400', hex: '#4ADE80', rgb: '74, 222, 128', hsl: '142, 69%, 58%' },
  { name: 'Success 500', variable: '--success-500', hex: '#22C55E', rgb: '34, 197, 94', hsl: '142, 71%, 45%' },
  { name: 'Success 600', variable: '--success-600', hex: '#16A34A', rgb: '22, 163, 74', hsl: '142, 76%, 36%' },
  { name: 'Success 700', variable: '--success-700', hex: '#15803D', rgb: '21, 128, 61', hsl: '142, 72%, 29%' },
  { name: 'Success 800', variable: '--success-800', hex: '#166534', rgb: '22, 101, 52', hsl: '143, 64%, 24%' },
  { name: 'Success 900', variable: '--success-900', hex: '#14532D', rgb: '20, 83, 45', hsl: '144, 61%, 20%' },
];

const warningColors: ColorSwatch[] = [
  { name: 'Warning 50', variable: '--warning-50', hex: '#FFFBEB', rgb: '255, 251, 235', hsl: '48, 100%, 96%' },
  { name: 'Warning 100', variable: '--warning-100', hex: '#FEF3C7', rgb: '254, 243, 199', hsl: '48, 97%, 89%' },
  { name: 'Warning 200', variable: '--warning-200', hex: '#FDE68A', rgb: '253, 230, 138', hsl: '48, 97%, 77%' },
  { name: 'Warning 300', variable: '--warning-300', hex: '#FCD34D', rgb: '252, 211, 77', hsl: '46, 97%, 65%' },
  { name: 'Warning 400', variable: '--warning-400', hex: '#FBBF24', rgb: '251, 191, 36', hsl: '43, 96%, 56%' },
  { name: 'Warning 500', variable: '--warning-500', hex: '#F59E0B', rgb: '245, 158, 11', hsl: '38, 92%, 50%' },
  { name: 'Warning 600', variable: '--warning-600', hex: '#D97706', rgb: '217, 119, 6', hsl: '32, 95%, 44%' },
  { name: 'Warning 700', variable: '--warning-700', hex: '#B45309', rgb: '180, 83, 9', hsl: '26, 90%, 37%' },
  { name: 'Warning 800', variable: '--warning-800', hex: '#92400E', rgb: '146, 64, 14', hsl: '23, 83%, 31%' },
  { name: 'Warning 900', variable: '--warning-900', hex: '#78350F', rgb: '120, 53, 15', hsl: '22, 78%, 26%' },
];

const errorColors: ColorSwatch[] = [
  { name: 'Error 50', variable: '--error-50', hex: '#FEF2F2', rgb: '254, 242, 242', hsl: '0, 86%, 97%' },
  { name: 'Error 100', variable: '--error-100', hex: '#FEE2E2', rgb: '254, 226, 226', hsl: '0, 93%, 94%' },
  { name: 'Error 200', variable: '--error-200', hex: '#FECACA', rgb: '254, 202, 202', hsl: '0, 96%, 89%' },
  { name: 'Error 300', variable: '--error-300', hex: '#FCA5A5', rgb: '252, 165, 165', hsl: '0, 93%, 82%' },
  { name: 'Error 400', variable: '--error-400', hex: '#F87171', rgb: '248, 113, 113', hsl: '0, 91%, 71%' },
  { name: 'Error 500', variable: '--error-500', hex: '#EF4444', rgb: '239, 68, 68', hsl: '0, 84%, 60%' },
  { name: 'Error 600', variable: '--error-600', hex: '#DC2626', rgb: '220, 38, 38', hsl: '0, 73%, 51%' },
  { name: 'Error 700', variable: '--error-700', hex: '#B91C1C', rgb: '185, 28, 28', hsl: '0, 74%, 42%' },
  { name: 'Error 800', variable: '--error-800', hex: '#991B1B', rgb: '153, 27, 27', hsl: '0, 70%, 35%' },
  { name: 'Error 900', variable: '--error-900', hex: '#7F1D1D', rgb: '127, 29, 29', hsl: '0, 63%, 31%' },
];

type ViewMode = 'css' | 'hex' | 'rgb';

export const ColorsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('css');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

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
        textToCopy = `rgb(${color.rgb})`;
        break;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedColor(color.variable);
      toast({
        title: "Copied to clipboard",
        description: `${textToCopy} has been copied to your clipboard.`,
      });
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const ColorSwatchGrid: React.FC<{ colors: ColorSwatch[]; title: string }> = ({ colors, title }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {colors.map((color) => (
            <div
              key={color.variable}
              className="group cursor-pointer"
              onClick={() => copyToClipboard(color)}
            >
              <div
                className="w-full h-16 rounded-lg border-2 border-gray-200 dark:border-gray-700 mb-2 transition-all duration-200 hover:scale-105 hover:shadow-lg relative overflow-hidden"
                style={{ backgroundColor: color.hex }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  {copiedColor === color.variable ? (
                    <Check size={16} className="text-white drop-shadow-lg" />
                  ) : (
                    <Copy size={16} className="text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </div>
              </div>
              <div className="text-xs space-y-1">
                <p className="font-medium text-foreground truncate">{color.name}</p>
                <p className="text-muted-foreground font-mono truncate">
                  {viewMode === 'css' && color.variable}
                  {viewMode === 'hex' && color.hex}
                  {viewMode === 'rgb' && `rgb(${color.rgb})`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const usageExampleCode = `// Using CSS Variables
.my-component {
  background-color: var(--primary-500);
  color: var(--gray-50);
}

// Using Tailwind CSS
<div className="bg-primary-500 text-gray-50">
  Hello World
</div>

// Custom CSS with our colors
.success-button {
  background: var(--success-500);
  border: 1px solid var(--success-600);
  color: white;
}`;

  const ComponentExamples = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button className="bg-blue-500 hover:bg-blue-600">Primary Button</Button>
      <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
        Success Button
      </Button>
      <Button variant="destructive">Error Button</Button>
      <Badge className="bg-blue-100 text-blue-800">Info Badge</Badge>
      <Badge className="bg-green-100 text-green-800">Success Badge</Badge>
      <Badge className="bg-red-100 text-red-800">Error Badge</Badge>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Colors</h1>
          <p className="text-lg font-light text-muted-foreground max-w-3xl">
          Our color system provides a comprehensive palette designed for accessibility, 
          consistency, and scalability across all digital products.
        </p>
        </div>
      </div>

      {/* View Mode Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Color Display Options</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === 'css' ? 'default' : 'outline'}
                onClick={() => setViewMode('css')}
              >
                CSS Variables
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'hex' ? 'default' : 'outline'}
                onClick={() => setViewMode('hex')}
              >
                Hex Codes
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'rgb' ? 'default' : 'outline'}
                onClick={() => setViewMode('rgb')}
              >
                RGB Values
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click any color swatch to copy its value to your clipboard. 
            Use the toggles above to switch between different color formats.
          </p>
        </CardContent>
      </Card>

      {/* Color Palettes */}
      <div className="space-y-6">
        <ColorSwatchGrid colors={primaryColors} title="Primary Colors" />
        <ColorSwatchGrid colors={neutralColors} title="Neutral Colors" />
        <ColorSwatchGrid colors={successColors} title="Success Colors" />
        <ColorSwatchGrid colors={warningColors} title="Warning Colors" />
        <ColorSwatchGrid colors={errorColors} title="Error Colors" />
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={20} />
            Usage Examples
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Code Implementation</h3>
            <CodeBlock code={usageExampleCode} language="css" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Live Component Examples</h3>
            <ComponentExamples />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">WCAG Compliance</h3>
              <p className="text-sm text-muted-foreground mb-3">
                All color combinations in our palette meet WCAG 2.1 AA standards for contrast ratio.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Normal text: 4.5:1 minimum contrast ratio</li>
                <li>• Large text: 3:1 minimum contrast ratio</li>
                <li>• UI components: 3:1 minimum contrast ratio</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Best Practices</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use semantic colors for consistent meaning</li>
                <li>• Test colors in both light and dark themes</li>
                <li>• Avoid using color alone to convey information</li>
                <li>• Consider colorblind users when choosing combinations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
