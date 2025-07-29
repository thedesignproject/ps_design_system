# 🎨 Font Architecture

## 🏗️ **Font Separation Strategy**

This design system separates **Design System Fonts** (customizable per client) from **Documentation Fonts** (fixed).

## 📋 **Two Font Systems**

### **🎯 Design System Fonts (Customizable)**
- **Location**: `src/index.css` 
- **Purpose**: Used in actual components and templates
- **Customizable**: ✅ Change these per client/project

### **📚 Documentation Fonts (Fixed)**  
- **Location**: `src/docs.css`
- **Purpose**: Used only in documentation website
- **Customizable**: ❌ Never change these

---

## 🎨 **Design System Fonts**

### **Current Setup**
```css
/* Default Design System Fonts */
--ds-font-sans: 'Inter', system-ui, sans-serif;         /* Body text */
--ds-font-heading: 'Poppins', sans-serif;               /* Headings */  
--ds-font-mono: 'Fira Code', ui-monospace, monospace;   /* Code */
--ds-font-display: 'Playfair Display', serif;           /* Special display */
```

### **Usage in Components**
```tsx
// Design System Components
<h1 className="font-ds-heading text-4xl font-ds-bold">
  Client Heading
</h1>

<p className="font-ds-sans text-base font-ds-regular">
  Client body text
</p>

<code className="font-ds-mono text-sm">
  const code = 'example';
</code>
```

### **Available Classes**
```css
/* Font Families */
.font-ds-sans      /* Body text font */
.font-ds-heading   /* Heading font */
.font-ds-mono      /* Monospace font */
.font-ds-display   /* Display font */

/* Font Weights */
.font-ds-thin      /* 100 */
.font-ds-light     /* 300 */
.font-ds-regular   /* 400 */
.font-ds-medium    /* 500 */
.font-ds-semibold  /* 600 */
.font-ds-bold      /* 700 */
.font-ds-black     /* 900 */

/* Letter Spacing */
.tracking-ds-tight   /* -0.025em */
.tracking-ds-normal  /* 0em */
.tracking-ds-wide    /* 0.025em */

/* Line Heights */
.leading-ds-tight    /* 1.2 */
.leading-ds-normal   /* 1.5 */
.leading-ds-loose    /* 1.8 */
```

---

## 📚 **Documentation Fonts (Fixed)**

### **Fixed Setup**
```css
/* Documentation uses these fonts - NEVER CHANGE */
- Body: 'Geist', system-ui, sans-serif
- Headings: 'Halyard Display', sans-serif  
- Code: 'Geist Mono', monospace
```

### **Usage**
These are automatically applied to documentation and should **never be used in design system components**.

---

## 🔄 **Customizing for Clients**

### **Step 1: Update Font Loading**
**File: `index.html`**
```html
<!-- Replace design system fonts for new client -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@400;600;700&display=swap">
```

### **Step 2: Update Font Variables**
**File: `src/index.css`**
```css
:root {
  /* Customize these for each client */
  --ds-font-sans: 'Roboto', system-ui, sans-serif;
  --ds-font-heading: 'Montserrat', sans-serif;
  --ds-font-mono: 'JetBrains Mono', monospace;
  /* Keep documentation fonts unchanged */
}
```

### **Step 3: Components Update Automatically**
All components using `font-ds-*` classes will automatically use the new fonts!

---

## ✅ **Benefits**

1. **Client Flexibility**: Easy to change design system fonts per project
2. **Documentation Consistency**: Docs always look the same
3. **Clear Separation**: No confusion between design system and docs
4. **Automatic Updates**: Change variables → all components update
5. **Maintainable**: Clear architecture for teams

---

## 🚨 **Important Rules**

### **✅ DO**
- Use `font-ds-*` classes in design system components
- Customize design system fonts per client
- Keep documentation fonts fixed

### **❌ DON'T**  
- Change documentation fonts
- Use documentation fonts in design system components
- Mix the two font systems

---

## 🔧 **Quick Client Setup**

```bash
# 1. Update fonts in index.html
# 2. Update CSS variables in src/index.css  
# 3. Test components automatically update
npm run dev
```

**That's it!** 🎉 Your design system now supports client-specific fonts while keeping documentation consistent. 