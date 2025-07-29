# Typography Styles Management Guide

## Overview

Typography styles like "Display XXL" are **composite styles** that combine multiple design tokens (font size, weight, line height, letter spacing) into cohesive, reusable text styles. 

Unlike individual tokens, these styles represent semantic typography choices for your design system.

## Configuration File

Typography styles are now managed in:
```
design-tokens/typography-styles.json
```

## Structure

### Style Categories

The configuration is organized into three main categories:

1. **Display** - Large, impactful text (heroes, landing pages)
2. **Headings** - Section and subsection headings  
3. **Body** - Regular content text

### Style Properties

Each typography style defines:

```json
{
  "displayName": "Display XXL",           // Human-readable name
  "description": "Largest display text...", // Usage description
  "fontSize": "9xl",                      // References figma-tokens.json fontSize
  "fontWeight": "black",                  // References figma-tokens.json fontWeight
  "lineHeight": "tight",                  // References figma-tokens.json lineHeight
  "letterSpacing": "tight",               // Uses letterSpacingMapping
  "usage": ["Hero headlines", "..."],     // Recommended use cases
  "category": "Display"                   // Style category
}
```

## How to Edit Existing Styles

### 1. Open the Configuration File
```bash
code design-tokens/typography-styles.json
```

### 2. Modify Style Properties
For example, to change Display XXL:

```json
{
  "display-xxl": {
    "displayName": "Display XXL",
    "description": "Updated description",
    "fontSize": "8xl",          // ← Changed from 9xl to 8xl
    "fontWeight": "extrabold",  // ← Changed from black to extrabold
    "lineHeight": "tight",
    "letterSpacing": "normal",  // ← Changed from tight to normal
    "usage": ["New use case"],
    "category": "Display"
  }
}
```

### 3. Save and Check Results
Your changes will automatically appear in the documentation.

## How to Create New Styles

### 1. Add to Appropriate Category

Add a new style to the `display`, `headings`, or `body` section:

```json
{
  "typographyStyles": {
    "display": {
      // ... existing styles ...
      "display-massive": {
        "displayName": "Display Massive",
        "description": "Even larger than XXL for special occasions",
        "fontSize": "9xl",
        "fontWeight": "black", 
        "lineHeight": "none",
        "letterSpacing": "tight",
        "usage": ["Brand campaigns", "Special events"],
        "category": "Display"
      }
    }
  }
}
```

### 2. Create Entirely New Category

You can also add new categories:

```json
{
  "typographyStyles": {
    "display": { /* ... */ },
    "headings": { /* ... */ },
    "body": { /* ... */ },
    "special": {
      "caption-large": {
        "displayName": "Caption Large",
        "description": "Large captions for images",
        "fontSize": "sm",
        "fontWeight": "medium",
        "lineHeight": "snug", 
        "letterSpacing": "wide",
        "usage": ["Image captions", "Photo credits"],
        "category": "Special"
      }
    }
  }
}
```

## Available Token References

### Font Sizes
Reference these from your `figma-tokens.json`:
- `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`, `8xl`, `9xl`

### Font Weights  
Reference these from your `figma-tokens.json`:
- `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`

### Line Heights
Reference these from your `figma-tokens.json`:
- `none`, `tight`, `snug`, `normal`, `relaxed`, `loose`

### Letter Spacing
Reference these from the `letterSpacingMapping` section:
- `tight` (-0.025em)
- `normal` (0em)  
- `wide` (0.025em)

## Best Practices

### 1. Semantic Naming
Use descriptive names that indicate purpose, not appearance:
```json
// ✅ Good
"hero-title": { "displayName": "Hero Title" }

// ❌ Avoid  
"big-black-text": { "displayName": "Big Black Text" }
```

### 2. Consistent Categories
Group similar styles together:
- **Display**: Hero sections, landing pages, marketing
- **Headings**: Content structure, navigation  
- **Body**: Reading content, forms, UI text

### 3. Progressive Sizing
Create logical size progressions within categories:
```json
"display-small": { "fontSize": "5xl" },
"display-medium": { "fontSize": "6xl" },
"display-large": { "fontSize": "7xl" },
"display-xl": { "fontSize": "8xl" },
"display-xxl": { "fontSize": "9xl" }
```

### 4. Usage Documentation
Always include specific usage examples:
```json
"usage": [
  "Hero headlines on landing pages",
  "Feature announcement banners", 
  "Modal dialog titles"
]
```

## Advanced: Custom Letter Spacing

To add new letter spacing values, update the `letterSpacingMapping` section:

```json
{
  "letterSpacingMapping": {
    "tight": "-0.025em",
    "normal": "0em",
    "wide": "0.025em",
    "extra-wide": "0.05em"  // ← New option
  }
}
```

## Testing Your Changes

1. **Save the file** - Changes are automatically picked up
2. **Check the documentation** - Visit the Typography section 
3. **Validate in browser** - Test how styles look in context
4. **Update usage examples** - Ensure documentation stays current

## Integration with Design Tools

When you export tokens from Figma:
1. **Individual tokens** are updated in `figma-tokens.json`
2. **Typography styles** remain in `typography-styles.json` 
3. Styles automatically reference the latest token values

This separation allows you to:
- Update individual tokens without breaking style definitions
- Maintain design system consistency across projects
- Customize typography combinations per client

## Quick Reference Commands

```bash
# Open typography styles for editing
code design-tokens/typography-styles.json

# Validate your changes
npm run tokens:validate

# Check for any token sync issues  
npm run tokens:check-drift
``` 