# Logo Component

A reusable SOAR logo component that ensures consistent branding across the application.

## Features

- **Multiple Size Variants**: Small, Medium, Large, XL
- **Theme Options**: Gradient, Solid, White (for dark backgrounds)
- **Flexible Subtitle**: Show/hide with customizable text
- **Decoration Line**: Optional decorative line below the logo
- **Responsive Design**: Mobile-first approach with responsive typography
- **Font Consistency**: Uses the Pacifico font consistently
- **Accessibility**: Proper semantic HTML structure

## Usage

### Basic Usage

```tsx
import { Logo } from "@/components/atoms/Logo/Logo";

// Simple logo
<Logo />

// Logo with all options
<Logo 
  size="large" 
  showSubtitle={true}
  subtitle="Sistema de Avaliação e Feedback"
  showDecorationLine={true}
  theme="gradient"
/>
```

### Size Variants

```tsx
<Logo size="small" />   // Small size
<Logo size="medium" />  // Medium size
<Logo size="large" />   // Large size (default)
<Logo size="xl" />      // Extra large size
```

### Theme Options

```tsx
<Logo theme="gradient" />  // Gradient text effect (default)
<Logo theme="solid" />     // Solid dark text
<Logo theme="white" />     // White text for dark backgrounds
```

### Subtitle Options

```tsx
<Logo showSubtitle={false} />                        // No subtitle
<Logo showSubtitle={true} />                         // Default subtitle
<Logo showSubtitle={true} subtitle="Custom Text" />  // Custom subtitle
```

### Decoration Line

```tsx
<Logo showDecorationLine={true} />   // Show decorative line
<Logo showDecorationLine={false} />  // Hide decorative line
```

## Props

| Prop                 | Type                                     | Default                             | Description                         |
| -------------------- | ---------------------------------------- | ----------------------------------- | ----------------------------------- |
| `size`               | `"small" \| "medium" \| "large" \| "xl"` | `"large"`                           | Size variant of the logo            |
| `className`          | `string`                                 | `""`                                | Additional CSS classes              |
| `style`              | `CSSProperties`                          | `undefined`                         | Custom inline styles                |
| `showSubtitle`       | `boolean`                                | `true`                              | Whether to show the subtitle        |
| `subtitle`           | `string`                                 | `"Sistema de Avaliação e Feedback"` | Custom subtitle text                |
| `showDecorationLine` | `boolean`                                | `true`                              | Whether to show the decorative line |
| `theme`              | `"gradient" \| "solid" \| "white"`       | `"gradient"`                        | Color theme of the logo             |

## Examples

### Main Page Logo
```tsx
<Logo 
  size="large" 
  showSubtitle={true}
  subtitle="Sistema de Avaliação e Feedback"
  showDecorationLine={true}
  theme="gradient"
/>
```

### CSAT Page Logo
```tsx
<Logo 
  size="large" 
  showSubtitle={true}
  subtitle="Avaliação e Feedback"
  showDecorationLine={false}
  theme="gradient"
/>
```

### Header Logo (Small)
```tsx
<Logo 
  size="small" 
  showSubtitle={false}
  showDecorationLine={false}
  theme="solid"
/>
```

### Dark Background Logo
```tsx
<Logo 
  size="medium" 
  showSubtitle={true}
  theme="white"
/>
```

## Design Decisions

1. **Font Consistency**: Uses the Pacifico font with proper fallbacks
2. **Responsive Design**: Mobile-first approach with responsive typography
3. **Accessibility**: Proper semantic HTML structure with h1 tags
4. **Flexibility**: Multiple props for different use cases
5. **Performance**: Efficient CSS classes and minimal re-renders
6. **Theming**: Support for different color schemes and backgrounds

## File Structure

```
src/components/atoms/Logo/
├── Logo.tsx    # Main component
├── index.ts    # Export file
└── README.md   # This documentation
```

## Dependencies

- React
- TypeScript
- Tailwind CSS
- Pacifico font (configured in layout.tsx)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers
