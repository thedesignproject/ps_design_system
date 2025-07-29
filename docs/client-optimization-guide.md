# 🎨 Client Optimization Guide

## 🎯 **Overview**

This guide shows you **exactly where** to customize styles and tokens for each client project.

## 📋 **Client Customization Checklist**

### **🎨 1. Design Tokens** 
- **File**: `design-tokens/figma-tokens.json`
- **What**: Colors, spacing, border radius, typography sizes
- **When**: Primary brand customization

### **🔤 2. Fonts**
- **File**: `src/index.css` (variables) + `index.html` (loading)
- **What**: Font families, weights, letter spacing
- **When**: Brand typography requirements

### **🎨 3. Component Styles**
- **Files**: `src/components/ui/*.tsx`
- **What**: Component-specific styling and variants
- **When**: Custom component behavior needed

### **⚙️ 4. Theme Configuration**
- **File**: `tailwind.config.ts`
- **What**: Extended utilities, custom classes, breakpoints
- **When**: Advanced customization needed

### **📦 5. Templates**
- **File**: `templates/` directory
- **What**: Ready-to-use component exports
- **When**: Client deliverables

---

## 🎨 **1. Design Tokens (Primary Customization)**

### **Location**: `design-tokens/figma-tokens.json`

**This is your main customization file!** 

```json
{
  "global": {
    "colors": {
      // 🎯 CUSTOMIZE THESE FOR CLIENT BRAND
      "blue-500": {
        "value": "#3b82f6",  // ← Change to client brand color
        "type": "color"
      },
      "gray-900": {
        "value": "#111827",  // ← Client text color
        "type": "color"
      }
    },
    "spacing": {
      "spacing": {
        "4": {
          "value": "16px",    // ← Adjust spacing scale
          "type": "spacing"
        }
      }
    }
  }
}
```

### **How to Customize:**
```bash
# Method 1: Via Figma (Recommended)
# 1. Update colors/spacing in Figma
# 2. Export via Figma Tokens plugin
# 3. Replace figma-tokens.json

# Method 2: Direct Edit
# 1. Edit design-tokens/figma-tokens.json
# 2. Documentation updates automatically
```

---

## 🔤 **2. Fonts (Brand Typography)**

### **Location**: `src/index.css` + `index.html`

#### **Step 1: Load Client Fonts** (`index.html`)
```html
<!-- Replace with client fonts -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@400;600;700&display=swap">
```

#### **Step 2: Update Font Variables** (`src/index.css`)
```css
:root {
  /* 🎯 CUSTOMIZE THESE FOR CLIENT */
  --ds-font-sans: 'Roboto', system-ui, sans-serif;
  --ds-font-heading: 'Montserrat', sans-serif;
  --ds-font-mono: 'JetBrains Mono', monospace;
  --ds-font-display: 'Playfair Display', serif;
  
  /* Adjust weights if needed */
  --ds-font-weight-regular: 400;
  --ds-font-weight-bold: 700;
}
```

#### **Usage in Components:**
```tsx
<h1 className="font-ds-heading font-ds-bold">Client Heading</h1>
<p className="font-ds-sans font-ds-regular">Client body text</p>
```

---

## 🎨 **3. Component Styles (Advanced)**

### **Location**: `src/components/ui/*.tsx`

#### **Example: Customizing Button Component**
```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700", // ← Client brand
        secondary: "bg-gray-100 text-gray-900",
        // Add client-specific variants
        client: "bg-purple-600 text-white hover:bg-purple-700", // ← New!
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        // Add client sizes
        xl: "h-14 rounded-lg px-12 text-lg", // ← New!
      },
    }
  }
)
```

---

## ⚙️ **4. Theme Configuration (Advanced)**

### **Location**: `tailwind.config.ts`

#### **Custom Colors**
```typescript
extend: {
  colors: {
    // Client brand colors
    brand: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    // Client accent colors
    accent: {
      DEFAULT: '#f59e0b',
      light: '#fcd34d',
      dark: '#d97706',
    }
  }
}
```

#### **Custom Spacing**
```typescript
extend: {
  spacing: {
    '18': '4.5rem',    // Custom spacing
    '88': '22rem',     // Client-specific sizes
  },
  borderRadius: {
    'client': '12px',  // Client border radius
  }
}
```

---

## 📦 **5. Templates (Client Deliverables)**

### **Location**: `templates/` directory

This contains the **exact files** clients get:

```
templates/
├── components/ui/    # Core components for client
├── lib/             # Utilities
├── globals.css      # Compiled styles
└── tailwind.config.ts # Client Tailwind config
```

#### **Before Client Delivery:**
```bash
# Update templates with client customizations
npm run build-templates  # (if this command exists)
# Or manually copy customized files to templates/
```

---

## 🚀 **Client Optimization Workflow**

### **🎯 Standard Client Setup (15 minutes)**

#### **1. Quick Brand Colors**
```bash
# Update 3 main colors in figma-tokens.json
- Primary: blue-600 → client brand
- Gray: gray-900 → client neutral  
- Success: green-600 → client success
```

#### **2. Font Swap**
```bash
# Update 2 fonts in index.html + src/index.css
- Sans: Inter → client body font
- Heading: Poppins → client heading font
```

#### **3. Test & Export**
```bash
npm run dev           # Test changes
npm run build         # Build for client
# Copy templates/ to client project
```

### **🔧 Advanced Client Setup (1-2 hours)**

#### **1. Full Token Customization**
- Complete color palette update
- Spacing scale adjustment  
- Typography scale refinement

#### **2. Component Variants**
- Add client-specific button styles
- Custom card layouts
- Brand-specific form styling

#### **3. Advanced Theme**
- Custom Tailwind utilities
- Client-specific breakpoints
- Animation customizations

---

## 📁 **File Priority for Client Customization**

### **🔥 High Priority (Always Customize)**
1. `design-tokens/figma-tokens.json` - Brand colors & tokens
2. `src/index.css` - Font variables
3. `index.html` - Font loading

### **⚡ Medium Priority (Often Customize)** 
4. `tailwind.config.ts` - Extended theme
5. `src/components/ui/button.tsx` - Button variants
6. `src/components/ui/card.tsx` - Card styling

### **💡 Low Priority (Rarely Customize)**
7. Individual component files
8. Documentation styles
9. Build configuration

---

## ✅ **Client Optimization Best Practices**

### **✅ DO**
- Start with design tokens (colors, fonts)
- Test changes in documentation first
- Use CSS variables for easy switching
- Keep client configs organized
- Document client-specific changes

### **❌ DON'T**
- Change documentation fonts
- Modify build/config files unnecessarily  
- Hard-code client values in components
- Skip testing after customizations
- Mix client customizations with base system

---

## 🔧 **Quick Commands**

```bash
# Check current token setup
npm run tokens:check-drift

# Validate customizations
npm run tokens:validate

# Test client changes
npm run dev

# Build for client delivery
npm run build
```

**Ready to optimize for your next client!** 🎉 