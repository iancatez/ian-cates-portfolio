# ShadCN UI Quick Reference Guide

This guide helps ensure we stick to ShadCN components throughout the project.

## Available ShadCN Components

### Currently Installed
- ✅ Button (`@/components/ui/button`)
- ✅ Card (`@/components/ui/card`)

### Common Components to Install When Needed

```bash
# Forms
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add label
npx shadcn@latest add form

# Navigation
npx shadcn@latest add navigation-menu
npx shadcn@latest add dropdown-menu
npx shadcn@latest add menubar

# Overlays
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add popover
npx shadcn@latest add tooltip

# Feedback
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add progress
npx shadcn@latest add skeleton

# Data Display
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add separator

# Layout
npx shadcn@latest add accordion
npx shadcn@latest add tabs
npx shadcn@latest add scroll-area
```

## Installation Process

1. **Check if component exists**: Visit https://ui.shadcn.com/docs/components
2. **Install component**: `npx shadcn@latest add [component-name]`
3. **Import and use**: Import from `@/components/ui/[component-name]`
4. **Customize if needed**: Edit the installed component file directly

## Component Usage Examples

### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

## Customization

ShadCN components are copied into your project, so you can:
- ✅ Edit component files directly in `components/ui/`
- ✅ Modify variants, styles, and behavior
- ✅ Add new variants or props
- ✅ Combine multiple ShadCN components

## Before Building Custom UI

**Always ask**: "Does ShadCN have this?"

1. Check: https://ui.shadcn.com/docs/components
2. Search: Component name in ShadCN docs
3. Install: If it exists, install it
4. Customize: Modify the installed component
5. Compose: Build complex UIs using ShadCN primitives

## Resources

- [ShadCN Documentation](https://ui.shadcn.com/docs)
- [Component Gallery](https://ui.shadcn.com/docs/components)
- [Installation Guide](https://ui.shadcn.com/docs/installation)

