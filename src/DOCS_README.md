# Documentation Website

This directory contains the **documentation website** for the design system. This is a custom implementation that showcases the design system components and should NOT be included in the reusable template.

## Structure

### Custom Styles
- `docs.css` - Documentation-specific styling (layout, showcases, code blocks)
- `index.css` - Main CSS file that imports base tokens + docs styles
- `App.css` - Application-specific styles

### Documentation Features
- Component showcases with live previews
- Source code display for each component
- Design token documentation
- Theme switcher (light/dark)
- Responsive navigation and layout

### Custom Implementation Details

#### Typography
The documentation uses **Halyard Display** for text-lg and larger, and **Geist Mono** for code. These are applied via `docs.css`:

```css
.text-lg, .text-xl, .text-2xl, /* ... */ .text-9xl {
  font-family: 'Halyard Display', sans-serif;
}
```

#### Layout Classes
Documentation-specific layout utilities:
- `.docs-container` - Main content wrapper
- `.docs-sidebar` - Fixed sidebar navigation
- `.docs-content` - Main content area
- `.component-showcase` - Component preview containers
- `.docs-code-block` - Code syntax highlighting

#### Component Structure
```
src/
├── components/
│   ├── documentation/     # Docs-specific components
│   ├── layout/            # Layout components for docs
│   ├── playground/        # Interactive component playground
│   ├── theme/             # Theme builder tools
│   └── ui/                # Design system components (copied from template)
├── pages/                 # Documentation pages
├── contexts/              # React contexts for docs
└── lib/                   # Utilities for docs functionality
```

## Key Differences from Template

| Documentation Website | Template |
|----------------------|----------|
| Uses Halyard Display + Geist Mono | Uses system fonts |
| Complex layout components | Minimal base components |
| Documentation-specific utilities | Generic utility classes |
| Showcase and preview styles | Clean, reusable styles |
| Source code display logic | No meta-functionality |

## Development

### Adding New Components
1. Add the component to `templates/components/ui/` (for the template)
2. Copy to `src/components/ui/` (for documentation)
3. Create documentation page in `src/pages/`
4. Add to navigation and component sources

### Styling Guidelines
- **Template styles** → `templates/globals.css`
- **Documentation styles** → `src/docs.css`
- **Never mix** template and documentation styles

### Font Loading
Make sure to load the custom fonts (Halyard Display, Geist, Geist Mono) in your HTML head or via font loading service for the documentation site. 