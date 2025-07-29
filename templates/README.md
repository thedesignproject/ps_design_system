# Design System Template

This directory contains the **reusable design system template** that can be copied and used in other projects.

## What's Included

### Core Files
- `globals.css` - Base design tokens and theme variables
- `tailwind.config.ts` - Tailwind configuration with design system tokens
- `components/ui/` - Reusable UI component library

### Design Tokens
- Color system (light/dark themes)
- Typography scale
- Spacing scale
- Border radius tokens
- Animation tokens

## Usage

1. **Copy the template** to your new project
2. **Install dependencies** from the root `package.json`
3. **Customize the tokens** in `globals.css` and `tailwind.config.ts`
4. **Add your brand fonts** to the font family configuration
5. **Use the components** from `components/ui/`

## Customization

### Colors
Edit the CSS custom properties in `globals.css`:
```css
:root {
  --primary: your-color-here;
  --secondary: your-color-here;
  /* ... */
}
```

### Typography
Update the `fontFamily` in `tailwind.config.ts`:
```ts
fontFamily: {
  sans: ["Your Font", "system-ui", "sans-serif"],
  heading: ["Your Heading Font", "sans-serif"],
}
```

### Border Radius
Adjust the `--radius` variable in `globals.css`:
```css
--radius: 0.5rem; /* Change to your preferred radius */
```

## What's NOT Included

This template is kept minimal and generic. It does NOT include:
- Documentation-specific styles
- Project-specific customizations
- Complex layout components

## Default Fonts
The template uses **Geist** as the default font family with system fonts as fallback:
- **Sans-serif**: Geist → system-ui → sans-serif
- **Monospace**: Geist Mono → ui-monospace → SFMono-Regular → monospace
- **Heading**: Geist → system-ui → sans-serif

## Integration with Design Tools

The design tokens in this template are compatible with:
- Figma Tokens plugin
- Style Dictionary
- Design token pipelines

Use the `scripts/extract-design-tokens.js` from the root project to sync tokens with design tools. 