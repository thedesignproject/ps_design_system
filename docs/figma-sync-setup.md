# Figma Sync Setup Guide

## 🚀 Complete Guide to Keep Code and Figma in Perfect Sync

### 📋 Prerequisites

1. **Figma Account** with access to your design system file
2. **Figma Tokens Plugin** installed in your Figma workspace
3. **GitHub Repository** with Actions enabled (for automation)

### 🔑 Initial Setup

#### Step 1: Get Figma Credentials

1. **Personal Access Token:**
   - Go to Figma → Account Settings → Personal Access Tokens
   - Click "Create new token"
   - Name it "Design System Sync"
   - Copy the token (save it securely!)

2. **File Key:**
   - Open your Figma design system file
   - Copy the key from URL: `https://www.figma.com/design/[FILE_KEY]/...`

#### Step 2: Environment Configuration

Create a `.env` file in your project root:

```env
# Figma Integration
FIGMA_TOKEN=your_figma_personal_access_token_here
FIGMA_FILE_KEY=your_figma_file_key_here

# Optional: Slack notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Optional: Auto-commit (for CI/CD)
AUTO_COMMIT=false
```

#### Step 3: Install Git Hooks (Recommended)

```bash
npm run sync-figma:hooks
```

This installs a pre-commit hook that automatically extracts tokens when you commit code changes.

### 🔄 Daily Workflow

#### Code → Figma Sync

1. **Make changes** to CSS variables or components in your code
2. **Extract tokens**: `npm run extract-tokens`
3. **Import to Figma**: Upload `design-tokens/figma-tokens.json` to Figma Tokens plugin
4. **Update components** in Figma to match code changes

#### Figma → Code Sync

1. **Export from Figma**: Use Figma Tokens plugin to export tokens
2. **Compare tokens**: Check for conflicts with current tokens
3. **Update CSS**: Modify `src/index.css` if needed
4. **Verify**: Run `npm run extract-tokens` to confirm

### 🤖 Automation Features

#### GitHub Actions

The included workflow automatically:
- ✅ Extracts tokens on CSS/component changes
- ✅ Validates token structure and themes
- ✅ Comments on PRs with sync status
- ✅ Commits updated tokens to repository
- ✅ Notifies team via Slack (optional)

#### Available Commands

```bash
# Validate current sync status
npm run sync-figma:validate

# Full sync analysis
npm run sync-figma

# Extract design tokens
npm run extract-tokens

# Install git hooks
npm run sync-figma:hooks
```

### 🎨 Theme Management

#### Current Themes Detected
- **Light Theme** (`:root` selector)
- **Dark Theme** (`.dark` selector)

#### Adding Custom Themes

1. **Create CSS class** in `src/index.css`:
```css
.theme-blue {
  --background: 214 100% 97%;
  --foreground: 214 84% 12%;
  /* ... other variables */
}
```

2. **Re-extract tokens**: `npm run extract-tokens`
3. **Import to Figma**: New theme will appear in token sets

### 📊 Component Tracking

The sync system tracks:
- **51 UI Components** detected
- **Component variants** and props
- **Documentation coverage** (currently 0%)
- **Accessibility considerations**

### 🔧 Figma Dev Mode Integration

Use `design-tokens/figma-dev-mode-mapping.json` to:
- Link Figma components to code files
- Map component props and variants
- Connect to documentation and playground

### 🚨 Troubleshooting

#### Common Issues

**"Missing tokens" error:**
- Run `npm run extract-tokens` first
- Check that `src/index.css` contains CSS variables

**"Token validation failed":**
- Verify CSS variable format (HSL values)
- Check theme selectors (`:root`, `.dark`)

**Figma API errors:**
- Verify `FIGMA_TOKEN` has correct permissions
- Check `FIGMA_FILE_KEY` from URL
- Ensure file is accessible to token owner

**Theme not detected:**
- Use `.theme-name` or `.dark` class selectors
- Include proper CSS variables in theme block
- Re-run token extraction after changes

#### Getting Help

1. **Validate sync**: `npm run sync-figma:validate`
2. **Check manifest**: Review `design-tokens/sync-manifest.json`
3. **Review logs**: GitHub Actions logs show detailed sync status

### 📈 Best Practices

#### Code Organization
- Keep all design tokens in `src/index.css`
- Use semantic token names (`--primary`, not `--blue-500`)
- Maintain consistent HSL format for colors

#### Figma Organization
- Organize tokens in clear token sets (global, light, dark)
- Use Figma Tokens plugin theme switching
- Keep component variants aligned with code

#### Team Workflow
- Use PR comments for sync status updates
- Review token changes before merging
- Coordinate Figma updates with code deployments

### 🎯 Next Steps

1. **Complete setup** using this guide
2. **Import initial tokens** to Figma
3. **Create first components** in Figma matching your code
4. **Set up team workflow** with regular sync checks
5. **Expand documentation** coverage for components

---

**🎨 Your design system is now ready for seamless code-Figma synchronization!** 