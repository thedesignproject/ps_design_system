import React from 'react';
import { ComponentExample } from './ComponentExample';
import { ComponentSourceViewer } from './ComponentSourceViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ColorsPage } from './ColorsPage';
import { hasComponentSource } from '@/lib/component-source';
import { hasInlineComponentSource } from '@/lib/component-sources';

interface ComponentShowcaseProps {
  activeComponent: string;
}

// Define proper types for different component structures
interface ColorsComponent {
  title: string;
  description: string;
  component: React.ReactElement;
}

interface RegularComponent {
  title: string;
  description: string;
  examples: Array<{
    title: string;
    description: string;
    component: React.ReactElement;
    code: string;
  }>;
}

interface EmptyComponent {
  title: string;
  description: string;
  examples: never[];
  isEmpty: true;
}

type ComponentData = ColorsComponent | RegularComponent | EmptyComponent;

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ activeComponent }) => {
  const componentData: Record<string, ComponentData> = {
    // Colors page
    Colors: {
      title: 'Colors',
      description: 'Our comprehensive color system for design consistency.',
      component: <ColorsPage />
    },
    Button: {
      title: 'Button',
      description: 'Displays a button or a component that looks like a button.',
      examples: [
        {
          title: 'Default',
          description: 'The default button appearance.',
          component: <Button>Click me</Button>,
          code: `import { Button } from "@/components/ui/button"

<Button>Click me</Button>`
        },
        {
          title: 'Variants',
          description: 'Different button styles for various use cases.',
          component: (
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          ),
          code: `import { Button } from "@/components/ui/button"

<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`
        },
        {
          title: 'Sizes',
          description: 'Different button sizes.',
          component: (
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            </div>
          ),
          code: `import { Button } from "@/components/ui/button"

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
</Button>`
        }
      ]
    },

    Badge: {
      title: 'Badge',
      description: 'Displays a badge or a component that looks like a badge.',
      examples: [
        {
          title: 'Default',
          description: 'The default badge appearance.',
          component: <Badge>Badge</Badge>,
          code: `<Badge>Badge</Badge>`
        },
        {
          title: 'Variants',
          description: 'Different badge styles.',
          component: (
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          ),
          code: `<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`
        }
      ]
    },

    Card: {
      title: 'Card',
      description: 'Displays a card with header, content, and footer.',
      examples: [
        {
          title: 'Simple Card',
          description: 'A basic card layout.',
          component: (
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here.</p>
              </CardContent>
            </Card>
          ),
          code: `<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>`
        }
      ]
    },

    Input: {
      title: 'Input',
      description: 'Displays an input field for user text entry.',
      examples: [
        {
          title: 'Default Input',
          description: 'A basic input field.',
          component: (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
          ),
          code: `<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>`
        }
      ]
    },

    Textarea: {
      title: 'Textarea',
      description: 'A textarea component for multi-line text input.',
      examples: [
        {
          title: 'Default Textarea',
          description: 'A basic textarea field.',
          component: <Textarea placeholder="Type your message here." />,
          code: `<Textarea placeholder="Type your message here." />`
        }
      ]
    },

    Checkbox: {
      title: 'Checkbox',
      description: 'A checkbox component for boolean input.',
      examples: [
        {
          title: 'Default Checkbox',
          description: 'A basic checkbox with label.',
          component: (
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          ),
          code: `<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`
        }
      ]
    },

    Alert: {
      title: 'Alert',
      description: 'Displays an alert message to the user.',
      examples: [
        {
          title: 'Default Alert',
          description: 'A basic alert message.',
          component: (
    <Alert>
      <AlertDescription>
                This is an alert message.
      </AlertDescription>
    </Alert>
          ),
          code: `<Alert>
                <AlertDescription>
    This is an alert message.
                </AlertDescription>
</Alert>`
        }
      ]
    },

    // Empty state placeholders
    Select: {
      title: 'Select',
      description: 'A select dropdown component. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Dialog: {
      title: 'Dialog',
      description: 'A modal dialog component. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Popover: {
      title: 'Popover',
      description: 'A popover component for displaying content on top of other content. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Tooltip: {
      title: 'Tooltip',
      description: 'A tooltip component for providing additional information. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Tabs: {
      title: 'Tabs',
      description: 'A tab component for organizing content. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Accordion: {
      title: 'Accordion',
      description: 'An accordion component for collapsible content sections. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Avatar: {
      title: 'Avatar',
      description: 'An avatar component for displaying user profile images. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Progress: {
      title: 'Progress',
      description: 'A progress bar component for showing completion status. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Slider: {
      title: 'Slider',
      description: 'A slider component for selecting values from a range. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Switch: {
      title: 'Switch',
      description: 'A switch component for boolean input. Implementation coming soon.',
      examples: [],
      isEmpty: true
    },

    Table: {
      title: 'Table',
      description: 'A table component for displaying tabular data. Implementation coming soon.',
      examples: [],
      isEmpty: true
    }
  };

  const currentComponent = componentData[activeComponent];

  if (!currentComponent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Component not found</p>
      </div>
    );
  }

  // Special handling for Colors page
  if (activeComponent === 'Colors' && 'component' in currentComponent) {
    return currentComponent.component;
  }

  // Handle empty state components
  if ('isEmpty' in currentComponent && currentComponent.isEmpty) {
    return (
      <div className="space-y-6">
  <div>
          <h1 className="text-3xl font-bold mb-2">{currentComponent.title}</h1>
          <p className="text-muted-foreground text-lg">{currentComponent.description}</p>
  </div>
        
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Examples Coming Soon</h3>
              <p className="text-muted-foreground">
                Examples for this component are planned for a future release. However, you can view the source code below.
              </p>
            </div>
          </div>
        </Card>
        
        {/* Source Code Viewer for empty state components */}
        {(hasComponentSource(activeComponent) || hasInlineComponentSource(activeComponent)) && (
          <ComponentSourceViewer componentName={activeComponent} />
        )}
      </div>
    );
  }

  // Regular component display
  if ('examples' in currentComponent) {
    return (
      <div className="space-y-8">
        {/* Component Examples */}
      <div className="space-y-8">
          {currentComponent.examples.map((example, index) => (
        <ComponentExample
              key={index}
              title={example.title}
              description={example.description}
              code={example.code}
            >
              {example.component}
        </ComponentExample>
          ))}
        </div>
        
        {/* Source Code Viewer */}
        {(hasComponentSource(activeComponent) || hasInlineComponentSource(activeComponent)) && (
          <ComponentSourceViewer componentName={activeComponent} />
        )}
    </div>
  );
  }

  // Fallback
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Component configuration error</p>
    </div>
  );
};
