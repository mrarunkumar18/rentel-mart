# /src/components — Reusable UI Components

## Structure
```
components/
├── ui/           ← shadcn/ui base components (Button, Input, Dialog, etc.)
├── layout/       ← Shared layout (Navbar, Sidebar, Footer)
├── admin/        ← Admin-specific components (T3 only)
└── [feature]/    ← Feature-specific components
```

## Rules
- One component per file
- PascalCase file names matching component name
- Export named components (not default)
- All components must use Rentify color theme from Tailwind config
- Semantic HTML required
