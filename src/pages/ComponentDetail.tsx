import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ComponentShowcase } from '@/components/documentation/ComponentShowcase';

export default function ComponentDetail() {
  const { componentName } = useParams<{ componentName: string }>();
  const navigate = useNavigate();

  // Convert URL parameter back to display name
  const displayName = componentName
    ? componentName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : '';

  // Component descriptions mapping
  const componentDescriptions: Record<string, string> = {
    'Button': 'Buttons trigger actions and events. Use them for form submissions, dialogs, and user interactions.',
    'Button Group': 'Component documentation coming soon. This will include grouped button patterns, toggle groups, and action sets.',
    'Compact Button': 'Space-efficient button variant for dense interfaces.',
    'Fancy Button': 'Enhanced button with visual effects and animations.',
    'Link Button': 'Button styled as a link for navigation actions.',
    'Social Button': 'Buttons for social media integration and sharing.',
    'Input': 'Input fields collect user data with validation and accessibility features.',
    'Textarea': 'Multi-line text input for longer content with auto-resize and validation.',
    'Select': 'Dropdown selection component with search and grouping capabilities.',
    'Checkbox': 'Boolean input with checkmark for multiple selections.',
    'Radio Group': 'Single selection from multiple options.',
    'Switch': 'Toggle switch for boolean values and settings.',
    'Slider': 'Range input with draggable handle for numeric values.',
    'Label': 'Form field labels with proper accessibility attributes.',
    'Form': 'Form wrapper with validation and submission handling.',
    'Search': 'Search input with clear functionality and suggestions.',
    'Date Picker': 'Date selection with calendar popup and flexible formatting options.',
    'Card': 'Container for grouping related content and actions.',
    'Badge': 'Small status or label indicator for highlighting information.',
    'Avatar': 'User profile image with fallback and status indicators.',
    'Table': 'Structured data display with sorting and pagination.',
    'Chart': 'Data visualization components for analytics.',
    'Progress': 'Progress indicator bar for task completion.',
    'Skeleton': 'Loading placeholder animation for content.',
    'Separator': 'Visual divider between content sections.',
    'Breadcrumb': 'Navigation path indicator for hierarchical content.',
    'Calendar': 'Full calendar component for date selection.',
    'Carousel': 'Image or content slideshow with navigation.',
    'Alert': 'Important messages and notifications for users.',
    'Toast': 'Temporary notification messages with auto-dismiss.',
    'Sonner': 'Enhanced toast notifications with better UX.',
    'Tooltip': 'Contextual help on hover with positioning.',
    'Hover Card': 'Rich content preview on hover interactions.',
    'Loading': 'Loading spinner and states for async operations.',
    'Modal': 'Full-screen overlay dialog for important actions.',
    'Dialog': 'Accessible modal dialog with focus management.',
    'Alert Dialog': 'Confirmation and alert dialogs for critical actions.',
    'Drawer': 'Side panel overlay for navigation or forms.',
    'Sheet': 'Sliding panel from screen edge with content.',
    'Popover': 'Floating content container with positioning.',
    'Tabs': 'Tabbed interface for content switching and organization.',
    'Dropdown': 'Dropdown menu with options and actions.',
    'Menubar': 'Horizontal menu bar for application navigation.',
    'Navigation Menu': 'Multi-level navigation menu with submenus.',
    'Pagination': 'Page navigation controls for large datasets.',
    'Command': 'Command palette interface for quick actions.',
    'Context Menu': 'Right-click context menu with options.',
    'Accordion': 'Collapsible content sections for FAQ and content.',
    'Collapsible': 'Show/hide content trigger for space efficiency.',
    'Scroll Area': 'Custom scrollable container with styling.',
    'Toggle': 'Binary state toggle button for settings.',
    'Toggle Group': 'Group of toggle buttons for multiple selections.'
  };

  const getComponentDescription = (componentName: string): string => {
    return componentDescriptions[componentName] || `Component documentation and examples for ${componentName}.`;
  };

  const handleBackClick = () => {
    navigate('/components');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          View All Components
        </Button>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{displayName}</h1>
        <p className="text-lg font-light text-muted-foreground">
          {getComponentDescription(displayName)}
        </p>
      </div>

      <ComponentShowcase activeComponent={displayName} />
    </div>
  );
} 