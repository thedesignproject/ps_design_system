// Type definitions for component source code handling

export interface ComponentSourceData {
  fullSource: string;
  imports: string[];
  mainComponent: string;
  exports: string[];
  propTypes: string[];
  componentName: string;
}

export interface ComponentExample {
  title: string;
  description: string;
  component: React.ReactElement;
  code: string;
  sourceFile?: string;
}

export interface ComponentDocumentation {
  title: string;
  description: string;
  examples: ComponentExample[];
  sourceCode?: ComponentSourceData;
  props?: ComponentProp[];
}

export interface ComponentProp {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

export interface ComponentCategory {
  title: string;
  description: string;
  items: ComponentItem[];
}

export interface ComponentItem {
  name: string;
  description: string;
  path?: string;
  hasSource?: boolean;
} 