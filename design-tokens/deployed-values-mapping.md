# Design Token Mapping: Code ↔ Figma

## ✅ **Verified Sync Status**

Your design tokens now accurately reflect the deployed design system values.

### 🔄 **Border Radius Values**

| Token Name | Deployed Value | Figma Token | Status |
|------------|----------------|-------------|--------|
| `rounded-none` | `0px` | `borderRadius.none` → `0px` | ✅ **Synced** |
| `rounded-sm` | `calc(var(--radius) - 4px)` | `borderRadius.sm` → `4px`* | ✅ **Synced** |
| `rounded` | `calc(var(--radius) - 2px)` | `borderRadius.md` → `6px`* | ✅ **Synced** |
| `rounded-md` | `calc(var(--radius) - 2px)` | `borderRadius.md` → `6px`* | ✅ **Synced** |
| `rounded-lg` | `var(--radius)` → `0.5rem` → `8px` | `borderRadius.lg` → `8px` | ✅ **Synced** |
| `rounded-full` | `9999px` | `borderRadius.full` → `9999px` | ✅ **Synced** |

*_Calculated values based on `--radius: 0.5rem`_

### 📏 **Spacing Values**

| Token Name | Deployed Value | Figma Token | Status |
|------------|----------------|-------------|--------|
| `xs` | `4px` | `spacing.1` → `4px` | ✅ **Synced** |
| `sm` | `8px` | `spacing.2` → `8px` | ✅ **Synced** |
| `md` | `16px` | `spacing.4` → `16px` | ✅ **Synced** |
| `lg` | `24px` | `spacing.6` → `24px` | ✅ **Synced** |
| `xl` | `32px` | `spacing.8` → `32px` | ✅ **Synced** |
| `2xl` | `48px` | `spacing.12` → `48px` | ✅ **Synced** |
| `3xl` | `64px` | `spacing.16` → `64px` | ✅ **Synced** |

### 🎨 **Color Theme Mapping**

#### Light Theme (`:root`)
| CSS Variable | Deployed HSL | Figma Hex | Status |
|--------------|--------------|-----------|--------|
| `--background` | `0 0% 100%` | `#ffffff` | ✅ **Synced** |
| `--foreground` | `222.2 84% 4.9%` | `#020817` | ✅ **Synced** |
| `--primary` | `222.2 47.4% 11.2%` | `#0f172a` | ✅ **Synced** |
| `--secondary` | `210 40% 96.1%` | `#f1f5f9` | ✅ **Synced** |
| `--border` | `214.3 31.8% 91.4%` | `#e2e8f0` | ✅ **Synced** |
| `--destructive` | `0 84.2% 60.2%` | `#ef4444` | ✅ **Synced** |

#### Dark Theme (`.dark`)
| CSS Variable | Deployed HSL | Figma Hex | Status |
|--------------|--------------|-----------|--------|
| `--background` | `222.2 84% 4.9%` | `#020817` | ✅ **Synced** |
| `--foreground` | `210 40% 98%` | `#f8fafc` | ✅ **Synced** |
| `--primary` | `210 40% 98%` | `#f8fafc` | ✅ **Synced** |
| `--secondary` | `217.2 32.6% 17.5%` | `#1e293b` | ✅ **Synced** |
| `--border` | `217.2 32.6% 17.5%` | `#1e293b` | ✅ **Synced** |
| `--destructive` | `0 62.8% 30.6%` | `#7f1d1d` | ✅ **Synced** |

### 📝 **Typography Mapping**

| Property | Deployed Value | Figma Token | Status |
|----------|----------------|-------------|--------|
| **Body Font** | `Geist, system-ui, sans-serif` | `fontFamilies.sans` | ✅ **Synced** |
| **Heading Font** | `Halyard Display, sans-serif` | `fontFamilies.heading` | ✅ **Synced** |
| **Code Font** | `Geist Mono, ui-monospace` | `fontFamilies.mono` | ✅ **Synced** |
| **Font Sizes** | Tailwind scale (12px-128px) | `fontSizes.*` | ✅ **Synced** |
| **Font Weights** | 400, 500, 600, 700, 800, 900 | `fontWeights.*` | ✅ **Synced** |

### 🔧 **Complete Spacing Scale**

Your Figma tokens now include the full Tailwind spacing scale:

```
0px, 1px, 2px, 4px, 6px, 8px, 10px, 12px, 14px, 16px, 20px, 24px, 28px, 32px, 
36px, 40px, 44px, 48px, 56px, 64px, 80px, 96px, 112px, 128px, 144px, 160px, 
176px, 192px, 208px, 224px, 240px, 256px, 288px, 320px, 384px
```

## 🎯 **Figma Import Status**

**Ready for import:** `design-tokens/figma-tokens.json`

### What's included:
- ✅ **2 Complete Themes** (Light & Dark)
- ✅ **35 Spacing Tokens** (Full Tailwind scale)
- ✅ **5 Border Radius Tokens** (Based on your CSS variables)
- ✅ **45+ Color Tokens** (Accurate HSL→Hex conversion)
- ✅ **Typography System** (3 font families, 13 sizes, 6 weights)

### How to import:
1. Open Figma Tokens plugin
2. Import `design-tokens/figma-tokens.json`
3. Select token sets: `global` + `light` (or `dark`)
4. Apply tokens to create Figma styles

## 🚀 **Validation Commands**

```bash
# Validate sync status
npm run sync-figma:validate

# Re-extract tokens after changes
npm run extract-tokens

# Check for drift between code and Figma
npm run sync-figma
```

---

**🎨 Your design tokens are now perfectly synchronized with your deployed code!** 