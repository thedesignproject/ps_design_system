// Utility for fetching and processing component source code
import { ComponentSourceData } from './types';

// Map component names to their file paths
const COMPONENT_FILE_MAP: Record<string, string> = {
  'Button': '/src/components/ui/button.tsx',
  'Badge': '/src/components/ui/badge.tsx',
  'Card': '/src/components/ui/card.tsx',
  'Input': '/src/components/ui/input.tsx',
  'Textarea': '/src/components/ui/textarea.tsx',
  'Checkbox': '/src/components/ui/checkbox.tsx',
  'Alert': '/src/components/ui/alert.tsx',
  'Label': '/src/components/ui/label.tsx',
  'Select': '/src/components/ui/select.tsx',
  'Dialog': '/src/components/ui/dialog.tsx',
  'Popover': '/src/components/ui/popover.tsx',
  'Tooltip': '/src/components/ui/tooltip.tsx',
  'Tabs': '/src/components/ui/tabs.tsx',
  'Accordion': '/src/components/ui/accordion.tsx',
  'Avatar': '/src/components/ui/avatar.tsx',
  'Progress': '/src/components/ui/progress.tsx',
  'Slider': '/src/components/ui/slider.tsx',
  'Switch': '/src/components/ui/switch.tsx',
  'Table': '/src/components/ui/table.tsx',
  'Form': '/src/components/ui/form.tsx',
  'Command': '/src/components/ui/command.tsx',
  'Calendar': '/src/components/ui/calendar.tsx',
  'Date Picker': '/src/components/ui/date-picker.tsx',
  'Dropdown Menu': '/src/components/ui/dropdown-menu.tsx',
  'Navigation Menu': '/src/components/ui/navigation-menu.tsx',
  'Menubar': '/src/components/ui/menubar.tsx',
  'Context Menu': '/src/components/ui/context-menu.tsx',
  'Sheet': '/src/components/ui/sheet.tsx',
  'Alert Dialog': '/src/components/ui/alert-dialog.tsx',
  'Hover Card': '/src/components/ui/hover-card.tsx',
  'Toast': '/src/components/ui/toast.tsx',
  'Sonner': '/src/components/ui/sonner.tsx',
  'Pagination': '/src/components/ui/pagination.tsx',
  'Separator': '/src/components/ui/separator.tsx',
  'Skeleton': '/src/components/ui/skeleton.tsx',
  'Toggle': '/src/components/ui/toggle.tsx',
  'Toggle Group': '/src/components/ui/toggle-group.tsx',
  'Collapsible': '/src/components/ui/collapsible.tsx',
  'Scroll Area': '/src/components/ui/scroll-area.tsx',
  'Aspect Ratio': '/src/components/ui/aspect-ratio.tsx',
  'Breadcrumb': '/src/components/ui/breadcrumb.tsx',
  'Carousel': '/src/components/ui/carousel.tsx',
  'Chart': '/src/components/ui/chart.tsx',
  'Drawer': '/src/components/ui/drawer.tsx',
  'Input OTP': '/src/components/ui/input-otp.tsx',
  'Loading': '/src/components/ui/loading.tsx',
  'Radio Group': '/src/components/ui/radio-group.tsx',
  'Resizable': '/src/components/ui/resizable.tsx',
  'Search': '/src/components/ui/search.tsx',
  'Sidebar': '/src/components/ui/sidebar.tsx',
  'Toaster': '/src/components/ui/toaster.tsx',
};

/**
 * Fetches the source code for a component
 */
export async function fetchComponentSource(componentName: string): Promise<string | null> {
  const filePath = COMPONENT_FILE_MAP[componentName];
  
  if (!filePath) {
    console.warn(`No file mapping found for component: ${componentName}`);
    return null;
  }

  try {
    // In a real application, you might fetch this from an API endpoint
    // For now, we'll try to fetch it as a static resource
    const response = await fetch(filePath);
    
    if (!response.ok) {
      console.warn(`Failed to fetch component source for ${componentName}: ${response.status}`);
      return null;
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error fetching component source for ${componentName}:`, error);
    return null;
  }
}

/**
 * Processes component source code to extract key information
 */
export function processComponentSource(source: string, componentName: string): ComponentSourceData {
  // Extract imports
  const importRegex = /^import\s+.*$/gm;
  const imports = source.match(importRegex) || [];
  
  // Extract the main component definition
  const componentRegex = new RegExp(
    `(export\\s+)?(const|function)\\s+${componentName}\\s*[=:]?[^{]*{[\\s\\S]*?^}(?=\\s*(?:export|const|function|$))`,
    'gm'
  );
  const componentMatch = source.match(componentRegex);
  const mainComponent = componentMatch ? componentMatch[0] : '';
  
  // Extract exports
  const exportRegex = /^export\s+.*$/gm;
  const exports = source.match(exportRegex) || [];
  
  // Extract prop types/interfaces
  const interfaceRegex = /(?:interface|type)\s+\w*Props?\s*=?\s*{[^}]*}/g;
  const propTypes = source.match(interfaceRegex) || [];
  
  // Clean up the source for display
  const cleanedSource = source
    .replace(/^\s*\/\*[\s\S]*?\*\/\s*$/gm, '') // Remove block comments
    .replace(/^\s*\/\/.*$/gm, '') // Remove line comments
    .trim();
  
  return {
    fullSource: cleanedSource,
    imports,
    mainComponent,
    exports,
    propTypes,
    componentName
  };
}

/**
 * Gets the file path for a component
 */
export function getComponentFilePath(componentName: string): string | null {
  return COMPONENT_FILE_MAP[componentName] || null;
}

/**
 * Gets all available component names
 */
export function getAvailableComponents(): string[] {
  return Object.keys(COMPONENT_FILE_MAP);
}

/**
 * Checks if a component has source code available
 */
export function hasComponentSource(componentName: string): boolean {
  return componentName in COMPONENT_FILE_MAP;
} 