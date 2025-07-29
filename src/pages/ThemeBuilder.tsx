
import React from 'react';
import { ThemeBuilder as ThemeBuilderComponent } from '@/components/theme/ThemeBuilder';

const ThemeBuilder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Theme Builder</h1>
        <p className="text-muted-foreground">
          Customize design tokens like colors, typography, and spacing. Preview changes in real-time and export your theme.
        </p>
      </div>
      <ThemeBuilderComponent />
    </div>
  );
};

export default ThemeBuilder;
