# @tdp/cli

The official CLI tool for **TDP Design System** - making it easy to add beautiful, accessible components to your React projects.

## 🚀 Quick Start

### Option 1: Use directly with npx (Recommended)
```bash
npx @tdp/cli init
```

### Option 2: Install globally
```bash
npm install -g @tdp/cli
tdp init
```

### Option 3: Local Development (for contributors)
```bash
# Clone and build
git clone <repo-url>
cd cli
npm install
npm run build

# Install locally for testing
./install.sh

# Now you can use tdp commands globally
tdp init
```

## 📦 Commands

### `tdp init`
Initialize TDP Design System in your project

```bash
tdp init                    # Interactive setup
tdp init --yes             # Skip prompts, use defaults
```

**What it does:**
- ✅ Setup Tailwind CSS configuration with TDP design tokens
- ✅ Add Geist font family configuration
- ✅ Install utility functions (`cn`, etc.)
- ✅ Create component directories (`src/components/ui`, `src/lib`)
- ✅ Add required dependencies to package.json
- ✅ Setup CSS with design tokens and typography

### `tdp add <component>`
Add specific components to your project

```bash
tdp add button             # Add button component
tdp add card               # Add card component  
tdp add input              # Add input component
tdp add badge              # Add badge component
```

**Options:**
- `--overwrite` - Overwrite existing files

**What it does:**
- ✅ Copies component files to `src/components/ui/`
- ✅ Ensures `src/lib/utils.ts` exists
- ✅ Adds component-specific dependencies
- ✅ Shows import instructions

### `tdp setup`
Run additional configuration

```bash
tdp setup                  # Additional setup tasks
tdp setup --force         # Force overwrite existing config
```

## 🎨 What You Get

### Design Tokens
- **Colors**: Semantic color system with light/dark mode support
- **Typography**: Geist font family with Halyard Display for headings
- **Spacing**: Consistent spacing scale based on Tailwind
- **Border Radius**: Unified border radius system

### Components
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Card**: Flexible card component with header/content/footer
- **Input**: Form input with validation states
- **Badge**: Status and category badges
- **And more coming soon...**

### Developer Experience
- **TypeScript**: Full TypeScript support out of the box
- **Accessibility**: WCAG compliant components
- **Dark Mode**: Built-in dark mode support
- **Responsive**: Mobile-first responsive design

## 🛠️ Framework Support

| Framework | Status |
|-----------|--------|
| React + Vite | ✅ Fully Supported |
| Next.js | ✅ Fully Supported |
| React + Webpack | ✅ Supported |
| Vue | 🚧 Coming Soon |

## 🎯 Example Usage

After running `tdp init`, you can immediately start using components:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to TDP</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

## 🔧 Development & Testing

### Building the CLI
```bash
npm install
npm run build    # Compiles TypeScript and copies templates
```

### Testing Locally
```bash
npm run test     # Basic CLI help test
./install.sh     # Install globally for testing
```

### Manual Testing
```bash
# Create test project
mkdir test-project && cd test-project
echo '{"name": "test"}' > package.json

# Test CLI
tdp init --yes
tdp add button
tdp add card
```

## 📋 Requirements

### System Requirements
- Node.js 16 or higher
- npm, yarn, or pnpm

### Project Requirements
- React 18 or higher
- Tailwind CSS
- TypeScript (recommended)

## 🔗 Links

- [Documentation](https://your-docs-site.com)
- [Components Gallery](https://your-storybook.com)
- [GitHub](https://github.com/thedesignproject/ds-template)

## 📄 License

MIT © The Design Project

---

## 🚀 Publishing to npm

When ready to publish:

```bash
npm run build
npm publish --access public
```

Then users can install with:
```bash
npx @tdp/cli init
``` 