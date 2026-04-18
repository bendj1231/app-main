# WingMentor Design System

## Overview
The WingMentor Design System provides a comprehensive set of guidelines, components, and tokens to ensure consistency across the application.

## Color Palette

### Primary Colors
- **Primary Blue**: `#1a365d` (Dark Navy)
- **Primary Blue Light**: `#2c5282`
- **Primary Blue Dark**: `#0f1c3a`

### Secondary Colors
- **Accent Blue**: `#3182ce`
- **Accent Cyan**: `#0bc5ea`
- **Accent Teal**: `#38b2ac`

### Accent Colors
- **Success Green**: `#48bb78`
- **Warning Yellow**: `#ecc94b`
- **Error Red**: `#f56565`
- **Info Purple**: `#9f7aea`

### Neutral Colors
- **Gray 50**: `#f7fafc`
- **Gray 100**: `#edf2f7`
- **Gray 200**: `#e2e8f0`
- **Gray 300**: `#cbd5e0`
- **Gray 400**: `#a0aec0`
- **Gray 500**: `#718096`
- **Gray 600**: `#4a5568`
- **Gray 700**: `#2d3748`
- **Gray 800**: `#1a202c`
- **Gray 900**: `#171923`

### Semantic Colors
- **Background Primary**: `#ffffff`
- **Background Secondary**: `#f7fafc`
- **Text Primary**: `#1a202c`
- **Text Secondary**: `#4a5568`
- **Text Tertiary**: `#718096`
- **Border Default**: `#e2e8f0`
- **Border Focus**: `#3182ce`

## Typography Scale

### Font Families
- **Primary**: Inter, system-ui, -apple-system, sans-serif
- **Secondary**: Georgia, serif (for headings)
- **Monospace**: 'Fira Code', 'Courier New', monospace

### Font Sizes
- **XS**: 0.75rem (12px)
- **SM**: 0.875rem (14px)
- **Base**: 1rem (16px)
- **LG**: 1.125rem (18px)
- **XL**: 1.25rem (20px)
- **2XL**: 1.5rem (24px)
- **3XL**: 1.875rem (30px)
- **4XL**: 2.25rem (36px)
- **5XL**: 3rem (48px)

### Font Weights
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

### Line Heights
- **Tight**: 1.25
- **Snug**: 1.375
- **Normal**: 1.5
- **Relaxed**: 1.625
- **Loose**: 2

### Letter Spacing
- **Tighter**: -0.05em
- **Tight**: -0.025em
- **Normal**: 0em
- **Wide**: 0.025em
- **Wider**: 0.05em
- **Widest**: 0.1em

## Spacing Scale

Base unit: 4px

- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

## Border Radius Scale

- **None**: 0
- **SM**: 0.125rem (2px)
- **Base**: 0.25rem (4px)
- **MD**: 0.375rem (6px)
- **LG**: 0.5rem (8px)
- **XL**: 0.75rem (12px)
- **2XL**: 1rem (16px)
- **3XL**: 1.5rem (24px)
- **Full**: 9999px

## Shadow Scale

- **XS**: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- **SM**: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
- **Base**: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
- **MD**: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- **LG**: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- **XL**: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
- **2XL**: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
- **Inner**: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)

## Animation Durations

- **Fast**: 150ms
- **Base**: 200ms
- **Normal**: 300ms
- **Slow**: 500ms
- **Slower**: 700ms
- **Slowest**: 1000ms

## Transition Easings

- **Linear**: linear
- **Ease In**: ease-in
- **Ease Out**: ease-out
- **Ease In Out**: ease-in-out
- **Bounce**: cubic-bezier(0.68, -0.55, 0.265, 1.55)

## Component Variants

### Button Sizes
- **XS**: height 24px, padding 0 8px, font-size 12px
- **SM**: height 32px, padding 0 12px, font-size 14px
- **MD**: height 40px, padding 0 16px, font-size 16px
- **LG**: height 48px, padding 0 20px, font-size 18px
- **XL**: height 56px, padding 0 24px, font-size 20px

### Input Sizes
- **SM**: height 32px, padding 8px, font-size 14px
- **MD**: height 40px, padding 12px, font-size 16px
- **LG**: height 48px, padding 16px, font-size 18px

### Card Variants
- **Default**: white background, base shadow
- **Elevated**: white background, lg shadow
- **Outlined**: white background, border
- **Filled**: gray-100 background

## Responsive Breakpoints

- **SM**: 640px
- **MD**: 768px
- **LG**: 1024px
- **XL**: 1280px
- **2XL**: 1536px

## Z-Index Scale

- **Dropdown**: 1000
- **Sticky**: 1020
- **Fixed**: 1030
- **Modal Backdrop**: 1040
- **Modal**: 1050
- **Popover**: 1060
- **Tooltip**: 1070

## Accessibility Guidelines

### Color Contrast
- **AA Standard**: 4.5:1 for normal text, 3:1 for large text
- **AAA Standard**: 7:1 for normal text, 4.5:1 for large text

### Touch Targets
- **Minimum**: 44x44px
- **Recommended**: 48x48px

### Focus States
- **Visible**: 2px outline with offset
- **Color**: Primary blue or high contrast

### Keyboard Navigation
- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and dropdowns
- **Arrow Keys**: Navigate within components

## Dark Mode

### Color Adjustments
- **Background Primary**: #1a202c
- **Background Secondary**: #2d3748
- **Text Primary**: #f7fafc
- **Text Secondary**: #cbd5e0
- **Border Default**: #4a5568

## Usage Guidelines

### Component Composition
- Use semantic HTML elements
- Follow mobile-first approach
- Ensure responsive behavior
- Maintain accessibility

### Spacing
- Use spacing scale consistently
- Maintain visual rhythm
- Consider content hierarchy
- Account for touch targets on mobile

### Typography
- Use appropriate font sizes for hierarchy
- Maintain consistent line heights
- Use letter spacing sparingly
- Ensure readability at all sizes

## Component Guidelines

### Buttons
- Primary action: use primary color
- Secondary action: use secondary color
- Destructive action: use error color
- Disabled state: reduce opacity and disable pointer events

### Forms
- Group related fields
- Use clear labels
- Provide helpful error messages
- Show validation states

### Cards
- Use consistent padding
- Apply appropriate shadows
- Maintain content hierarchy
- Ensure responsive behavior

### Navigation
- Use clear labels
- Indicate active state
- Provide visual feedback
- Support keyboard navigation

## Best Practices

1. **Consistency**: Use design tokens and components consistently
2. **Accessibility**: Ensure WCAG 2.1 AA compliance
3. **Performance**: Optimize for fast loading and smooth interactions
4. **Responsiveness**: Test across all device sizes
5. **User Experience**: Prioritize user needs and goals

## Maintenance

- Regular updates to keep components current
- Document changes and deprecations
- Gather user feedback
- Iterate based on usage patterns

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Guidelines](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
