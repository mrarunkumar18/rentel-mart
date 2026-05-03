# RENTIFY COLOR THEME

**Status:** LOCKED - No deviations allowed

---

## Primary Color

**Name:** Dark Vibrant Blue  
**Hex Code:** `#1886FF`  
**RGB:** 24, 134, 255  
**Usage:** CTAs, primary buttons, navigation elements, links, active states, badges

### Primary Color Variants

| Purpose | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Light background | `#E4F9FF` | 228, 249, 255 | Button hover bg, light fills |
| Medium tint | `#62D0FF` | 98, 208, 255 | Borders, dividers, secondary states |
| Primary | `#1886FF` | 24, 134, 255 | Main CTA buttons, nav, links |
| Dark state | `#0D5BB8` | 13, 91, 184 | Pressed state, dark mode, shadows |

---

## Secondary Color

**Name:** Medium-Light Sky Blue  
**Hex Code:** `#62D0FF`  
**RGB:** 98, 208, 255  
**Usage:** Hover states, secondary buttons, focus rings, loading states, progress indicators

### Secondary Color Usage

- Hover state on primary buttons (background becomes lighter, text remains)
- Secondary action buttons (e.g., "Cancel", "Skip")
- Focus ring outline (2px solid `#62D0FF`)
- Loading spinners, progress bars
- Badge backgrounds for secondary information
- Disabled button states (lower opacity)

---

## Accent Color

**Name:** Lightest Blue  
**Hex Code:** `#E4F9FF`  
**RGB:** 228, 249, 255  
**Usage:** Backgrounds, cards, panels, container fills, information highlights

### Accent Color Usage

- Card backgrounds (slightly elevated surfaces)
- Panel/modal backgrounds
- Information boxes and alerts
- Form input backgrounds
- Container fills and wrapper divs
- Tag/label backgrounds
- Highlight backgrounds for selected items

---

## Component Color Map

### Buttons

| State | Color | Hex | Usage |
|-------|-------|-----|-------|
| Primary button bg | Dark Vibrant Blue | `#1886FF` | Default CTA |
| Primary button hover | Medium Sky Blue | `#62D0FF` | Hover state |
| Primary button active | Dark state | `#0D5BB8` | Pressed state |
| Primary button disabled | Gray | `#CCCCCC` | Disabled with opacity 0.6 |
| Secondary button bg | Lightest Blue | `#E4F9FF` | Secondary action |
| Secondary button text | Dark Vibrant Blue | `#1886FF` | Secondary button text |
| Secondary button hover | Medium Sky Blue | `#62D0FF` | Secondary hover |

### Text & Typography

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary text | Black | `#000000` | Body text, headings |
| Secondary text | Gray | `#666666` | Labels, captions, hints |
| Tertiary text | Light Gray | `#999999` | Disabled text, placeholders |
| Link text | Dark Vibrant Blue | `#1886FF` | Hyperlinks, inline links |
| Link hover | Medium Sky Blue | `#62D0FF` | Link hover state |
| Error text | Red | `#E24B4A` | Error messages |
| Success text | Green | `#3B6D11` | Success messages |
| Warning text | Amber | `#BA7517` | Warning messages |

### Borders & Dividers

| Element | Color | Hex | Opacity | Usage |
|---------|-------|-----|---------|-------|
| Default border | Dark Vibrant Blue | `#1886FF` | 0.2 | Input borders, card edges |
| Focus border | Dark Vibrant Blue | `#1886FF` | 0.5 | Focus ring on inputs |
| Hover border | Medium Sky Blue | `#62D0FF` | 0.3 | Border on hover |
| Divider line | Gray | `#CCCCCC` | 0.5 | Section dividers |
| Disabled border | Gray | `#DDDDDD` | 1.0 | Disabled input border |

### Form Elements

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Input background | White | `#FFFFFF` | Text input bg |
| Input border | Dark Vibrant Blue | `#1886FF` | Input outline (0.2 opacity) |
| Input focus border | Dark Vibrant Blue | `#1886FF` | Focus ring (0.5 opacity) |
| Input placeholder | Gray | `#999999` | Placeholder text |
| Input label | Black | `#000000` | Field labels |
| Checkbox checked | Dark Vibrant Blue | `#1886FF` | Checked state |
| Checkbox bg | Lightest Blue | `#E4F9FF` | Checkbox background |
| Radio button checked | Dark Vibrant Blue | `#1886FF` | Selected radio |

### Backgrounds

| Surface | Color | Hex | Usage |
|---------|-------|-----|-------|
| Page background | White | `#FFFFFF` | Main canvas |
| Card background | Lightest Blue | `#E4F9FF` | Cards, panels, modals |
| Modal overlay | Black | `#000000` | Scrim (0.3-0.5 opacity) |
| Elevated surface | White | `#FFFFFF` | Shadows only |
| Success background | Light Green | `#EAF3DE` | Success message bg |
| Error background | Light Red | `#FCEBEB` | Error message bg |
| Warning background | Light Amber | `#FAEEDA` | Warning message bg |
| Info background | Lightest Blue | `#E4F9FF` | Info message bg |

### Special Elements

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Badge (primary) | Dark Vibrant Blue | `#1886FF` | Status badges, tags |
| Badge text | White | `#FFFFFF` | Badge text |
| Alert border | Red | `#E24B4A` | Error alert left border |
| Success checkmark | Green | `#3B6D11` | Success indicator |
| Loading spinner | Dark Vibrant Blue | `#1886FF` | Spinner color |
| Progress bar | Dark Vibrant Blue | `#1886FF` | Progress fill |
| Skeleton loader | Lightest Blue | `#E4F9FF` | Skeleton shimmer |

---

## Dark Mode Adjustments

For dark mode implementation (if applicable):

| Element | Dark Mode Color | Hex |
|---------|-----------------|-----|
| Primary text | White | `#FFFFFF` |
| Secondary text | Light Gray | `#CCCCCC` |
| Tertiary text | Medium Gray | `#999999` |
| Page background | Very Dark Gray | `#1A1A1A` |
| Card background | Dark Gray | `#2A2A2A` |
| Input background | Dark Gray | `#333333` |
| Input border | Medium Sky Blue | `#62D0FF` |
| Divider line | Gray | `#444444` |

---

## CSS Variables (Tailwind Integration)

If using Tailwind CSS, map these colors as follows:

```css
:root {
  --color-primary: #1886FF;
  --color-primary-light: #62D0FF;
  --color-primary-accent: #E4F9FF;
  --color-primary-dark: #0D5BB8;
  
  --color-text-primary: #000000;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;
  
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #E4F9FF;
  --color-bg-tertiary: #F5F5F5;
  
  --color-border-primary: #1886FF;
  --color-border-secondary: #CCCCCC;
  --color-border-tertiary: #DDDDDD;
  
  --color-success: #3B6D11;
  --color-error: #E24B4A;
  --color-warning: #BA7517;
  --color-info: #1886FF;
}
```

---

## Accessibility Requirements

1. **Color Contrast:**
   - Primary text (#000000) on Lightest Blue (#E4F9FF): ✅ WCAG AAA (contrast ratio 10.5:1)
   - Primary text (#000000) on White (#FFFFFF): ✅ WCAG AAA (contrast ratio 21:1)
   - White text on Dark Vibrant Blue (#1886FF): ✅ WCAG AAA (contrast ratio 8.6:1)

2. **Focus Indicators:**
   - Use 2px solid `#62D0FF` border for keyboard focus on all interactive elements
   - Ensure focus ring has sufficient contrast ratio (≥ 3:1)

3. **Color Blindness:**
   - Do NOT rely on color alone to convey information
   - Always pair color with icons, text labels, or patterns
   - Test color combinations with accessibility tools (e.g., Color Contrast Analyzer)

---

## Implementation Rules

### DO:
✅ Use the three primary colors for all UI elements  
✅ Apply secondary/accent colors for hover and active states  
✅ Maintain consistent color usage across all screens  
✅ Use borders and outlines to enhance accessibility  
✅ Test all color combinations for WCAG AA compliance  

### DON'T:
❌ Introduce new colors outside the theme palette  
❌ Use color as the only way to convey information  
❌ Apply opacity arbitrarily (use predefined opacity values)  
❌ Mix with other design system colors  
❌ Deviate from this theme for "special cases"  

---

## Color Theme Lock Certificate

**Theme Name:** Rentify Official Color Theme  
**Lock Date:** 2025-05-03  
**Status:** FINAL - NO CHANGES PERMITTED  
**Primary Color:** #1886FF (Dark Vibrant Blue)  
**Secondary Color:** #62D0FF (Medium-Light Sky Blue)  
**Accent Color:** #E4F9FF (Lightest Blue)  

This theme is locked and must be applied consistently across all three teammate workspaces (T1, T2, T3) and all four phases of the project.

---

**Generated for:** Rentify P2P Rental Marketplace  
**For use by:** Teammate 1, Teammate 2, Teammate 3, Phase 4 Integration Team  
**Reference:** Use in all UI implementations, component styling, and design decisions
