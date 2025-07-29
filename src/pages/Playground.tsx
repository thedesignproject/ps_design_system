
import React from 'react';
import { ComponentPlayground } from '@/components/playground/ComponentPlayground';

const Playground = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Component Playground</h1>
        <p className="text-muted-foreground">
          Experiment with UI components interactively. Change props, see live previews, and copy code snippets.
        </p>
      </div>
      <ComponentPlayground />
    </div>
  );
};

export default Playground;
