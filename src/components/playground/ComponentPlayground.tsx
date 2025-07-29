import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { CodeBlock } from '../documentation/CodeBlock';

interface PlaygroundState {
  component: string;
  variant: string;
  size: string;
  disabled: boolean;
  fullWidth: boolean;
}

export const ComponentPlayground: React.FC = () => {
  const [state, setState] = useState<PlaygroundState>({
    component: 'Button',
    variant: 'default',
    size: 'default',
    disabled: false,
    fullWidth: false,
  });

  const updateState = (key: keyof PlaygroundState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const generateCode = () => {
    const props = [];
    if (state.variant !== 'default') props.push(`variant="${state.variant}"`);
    if (state.size !== 'default') props.push(`size="${state.size}"`);
    if (state.disabled) props.push('disabled');
    if (state.fullWidth) props.push('className="w-full"');
    
    const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
    return `<${state.component}${propsString}>Click me</${state.component}>`;
  };

  const renderComponent = () => {
    switch (state.component) {
      case 'Button':
        return (
          <Button
            variant={state.variant as any}
            size={state.size as any}
            disabled={state.disabled}
            className={state.fullWidth ? 'w-full' : ''}
          >
            Click me
          </Button>
        );
      default:
        return <Button>Click me</Button>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Component Playground</h2>
        <p className="text-muted-foreground">
          Experiment with component properties and see the code generated in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Component</Label>
              <Select value={state.component} onValueChange={(value) => updateState('component', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Button">Button</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Variant</Label>
              <Select value={state.variant} onValueChange={(value) => updateState('variant', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <Select value={state.size} onValueChange={(value) => updateState('size', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Disabled</Label>
              <Switch
                checked={state.disabled}
                onCheckedChange={(checked) => updateState('disabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Full Width</Label>
              <Switch
                checked={state.fullWidth}
                onCheckedChange={(checked) => updateState('fullWidth', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center min-h-[200px] p-4 border rounded-lg bg-background">
                {renderComponent()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={generateCode()} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
