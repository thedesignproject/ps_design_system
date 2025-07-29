import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/documentation/CodeBlock';

const componentCategories = [
  {
    title: 'Actions',
    description: 'Interactive elements that trigger actions',
    items: [
      { name: 'Button', description: 'Clickable button component with multiple variants' },
      { name: 'Button Group', description: 'Group of related buttons' },
      { name: 'Compact Button', description: 'Space-efficient button variant' },
      { name: 'Fancy Button', description: 'Styled button with enhanced visual effects' },
      { name: 'Link Button', description: 'Button styled as a link' },
      { name: 'Social Button', description: 'Buttons for social media integration' }
    ]
  },
  {
    title: 'Form Components',
    description: 'Input elements for collecting user data',
    items: [
      { name: 'Input', description: 'Text input field with validation support' },
      { name: 'Textarea', description: 'Multi-line text input' },
      { name: 'Select', description: 'Dropdown selection component' },
      { name: 'Checkbox', description: 'Boolean input with checkmark' },
      { name: 'Radio Group', description: 'Single selection from multiple options' },
      { name: 'Switch', description: 'Toggle switch for boolean values' },
      { name: 'Slider', description: 'Range input with draggable handle' },
      { name: 'Label', description: 'Form field labels' },
      { name: 'Form', description: 'Form wrapper with validation' },
      { name: 'Search', description: 'Search input with clear functionality' },
      { name: 'Date Picker', description: 'Date selection with calendar popup' }
    ]
  },
  {
    title: 'Display Components',
    description: 'Components for displaying content and data',
    items: [
      { name: 'Card', description: 'Container for grouping related content' },
      { name: 'Badge', description: 'Small status or label indicator' },
      { name: 'Avatar', description: 'User profile image with fallback' },
      { name: 'Table', description: 'Structured data display' },
      { name: 'Chart', description: 'Data visualization components' },
      { name: 'Progress', description: 'Progress indicator bar' },
      { name: 'Skeleton', description: 'Loading placeholder animation' },
      { name: 'Separator', description: 'Visual divider between content' },
      { name: 'Breadcrumb', description: 'Navigation path indicator' },
      { name: 'Calendar', description: 'Date selection calendar' },
      { name: 'Carousel', description: 'Image or content slideshow' }
    ]
  },
  {
    title: 'Feedback Components',
    description: 'Components that provide user feedback',
    items: [
      { name: 'Alert', description: 'Important messages and notifications' },
      { name: 'Toast', description: 'Temporary notification messages' },
      { name: 'Sonner', description: 'Enhanced toast notifications' },
      { name: 'Tooltip', description: 'Contextual help on hover' },
      { name: 'Hover Card', description: 'Rich content preview on hover' },
      { name: 'Loading', description: 'Loading spinner and states' }
    ]
  },
  {
    title: 'Overlay Components',
    description: 'Modal and popup components',
    items: [
      { name: 'Modal', description: 'Full-screen overlay dialog' },
      { name: 'Dialog', description: 'Accessible modal dialog' },
      { name: 'Alert Dialog', description: 'Confirmation and alert dialogs' },
      { name: 'Drawer', description: 'Side panel overlay' },
      { name: 'Sheet', description: 'Sliding panel from screen edge' },
      { name: 'Popover', description: 'Floating content container' }
    ]
  },
  {
    title: 'Navigation Components',
    description: 'Components for site navigation',
    items: [
      { name: 'Tabs', description: 'Tabbed interface for content switching' },
      { name: 'Dropdown', description: 'Dropdown menu with options' },
      { name: 'Menubar', description: 'Horizontal menu bar' },
      { name: 'Navigation Menu', description: 'Multi-level navigation menu' },
      { name: 'Pagination', description: 'Page navigation controls' },
      { name: 'Command', description: 'Command palette interface' },
      { name: 'Context Menu', description: 'Right-click context menu' }
    ]
  },
  {
    title: 'Layout Components',
    description: 'Components for organizing content layout',
    items: [
      { name: 'Accordion', description: 'Collapsible content sections' },
      { name: 'Collapsible', description: 'Show/hide content trigger' },
      { name: 'Scroll Area', description: 'Custom scrollable container' },
      { name: 'Toggle', description: 'Binary state toggle button' },
      { name: 'Toggle Group', description: 'Group of toggle buttons' }
    ]
  }
];

export default function Usage() {
  const navigate = useNavigate();

  const handleComponentClick = (componentName: string) => {
    navigate(`/components/${componentName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8 pb-6">
        <h1 className="text-4xl font-bold">All Components</h1>
        <h2 className="text-2xl font-regular">Usage</h2>
       <div className="space-y-4"> <CodeBlock code="import { ComponentName } from '@/components/ui/component-name'" language="tsx" />
        <p className="text-base text-muted-foreground">
          To use any component, import it from the <code className="font-mono">@/components/ui/</code> directory. <br></br> Replace <code className="font-mono">ComponentName</code> with the name of the component you want to use (e.g., <code className="font-mono">Button</code>, <code className="font-mono">Card</code>, <code className="font-mono">Input</code>, etc).
        </p>
        </div>
      </div>

      <div className="space-y-12">
        {componentCategories.map((category) => (
          <section key={category.title} className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-lg font-regular">{category.title}</h4>

            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((component) => (
                <Card 
                  key={component.name}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleComponentClick(component.name)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {component.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{component.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
} 