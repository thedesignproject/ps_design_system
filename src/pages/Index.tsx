import React from 'react';
import { Cube, Palette, PlayCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/documentation/CodeBlock';

const Index = () => {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-12 pl-0">
        <h1 className="text-4xl font-bold mb-4">Bridge the gap between design & code</h1>
        <p className="text-muted-foreground">
          Stop reinventing the wheel. Our design system gives you production-ready React components, design tokens, and a playground to experiment—all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <Cube size={32} className="text-blue-500 mb-4" />
          <h3 className="font-semibold mb-2">Components</h3>
          <p className="text-sm text-muted-foreground">
            Explore our library of reusable components with live examples and code snippets.
          </p>
        </div>
        
        <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <Palette size={32} className="text-green-500 mb-4" />
          <h3 className="font-semibold mb-2">Design Tokens</h3>
          <p className="text-sm text-muted-foreground">
            Discover our design foundations including colors, typography, and spacing.
          </p>
        </div>
        
        <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <PlayCircle size={32} className="text-purple-500 mb-4" />
          <h3 className="font-semibold mb-2">Playground</h3>
          <p className="text-sm text-muted-foreground">
            Experiment with components and generate code for your projects.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        <h2 className="text-xl font-bold">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-lg font-regular">Installation</h3>
            <CodeBlock code="npx @tdp/cli init" minHeight="80px" />
            <Button asChild className="w-full">
              <a href="/installation">View Installation Guide</a>
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-regular">Usage</h3>
            <CodeBlock code="import { ComponentName } from '@/components/ui/component-name'" language="tsx" minHeight="80px" />
            <Button asChild className="w-full">
              <a href="/components">Browse Components</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
