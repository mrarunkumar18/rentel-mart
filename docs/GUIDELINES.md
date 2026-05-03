# RENTIFY — Development Guidelines

**Document Status:** OPTIONAL REFERENCE  
**Applicable To:** All Teammates & Phases

---

## 1. Code Style

### TypeScript
- **Strict mode** is mandatory (`"strict": true` in tsconfig.json)
- No `any` types — use `unknown` when type is truly unknown
- Use interfaces for objects, types for unions/intersections
- All function parameters and return types must be explicitly typed
- Use `const` by default, `let` only when reassignment is needed

### Naming Conventions
| Element | Convention | Example |
|---------|-----------|---------|
| Files (components) | PascalCase | `ProductCard.tsx` |
| Files (utils/lib) | camelCase | `calculateLateFee.ts` |
| Files (pages) | lowercase | `page.tsx` |
| Components | PascalCase | `BookingForm` |
| Functions | camelCase | `handleSubmit` |
| Constants | SCREAMING_SNAKE | `MAX_IMAGES_PER_LISTING` |
| Types/Interfaces | PascalCase | `BookingPayment` |
| CSS classes | kebab-case | `product-card-wrapper` |
| Database tables | snake_case | `booking_payments` |
| Database fields | snake_case | `created_at` |
| Env variables | SCREAMING_SNAKE | `NEXT_PUBLIC_SUPABASE_URL` |

### Folder Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui base components
│   └── layout/       # Layout components (headers, sidebars)
├── lib/              # Utility functions, clients, engines
├── types/            # TypeScript type definitions
├── mocks/            # Mock data (swappable in Phase 4)
└── hooks/            # Custom React hooks (if needed)
```

---

## 2. Component Guidelines

### File Structure
```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types
interface ProductCardProps {
  title: string;
  price: number;
  imageUrl: string;
}

// 3. Component
export function ProductCard({ title, price, imageUrl }: ProductCardProps) {
  // 4. State & hooks
  const [isHovered, setIsHovered] = useState(false);

  // 5. Handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return (
    <div className="product-card">
      {/* ... */}
    </div>
  );
}
```

### Rules
- One component per file
- Export named components (not default)
- Use semantic HTML (`<button>`, `<label>`, `<nav>`, not `<div>`)
- All interactive elements must be keyboard-accessible
- Images must have `alt` text

---

## 3. Tailwind CSS Guidelines

### Color Usage
```
Primary CTA:     bg-primary text-white         (#1886FF)
Hover state:     hover:bg-secondary             (#62D0FF)
Active/pressed:  active:bg-primary-dark         (#0D5BB8)
Card background: bg-accent                      (#E4F9FF)
Page background: bg-white
```

### Responsive Breakpoints
```
sm:  640px   (mobile landscape)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
2xl: 1536px  (extra large)
```

### Best Practices
- Mobile-first: write base styles for mobile, add `md:` and `lg:` for larger
- Use Tailwind's spacing scale consistently (don't use arbitrary values like `p-[13px]`)
- Group related classes: layout → spacing → typography → colors → effects

---

## 4. Mock Data Conventions

### Structure
```typescript
// mocks/bookings.ts
import { Booking } from '@/types/database';

export const mockBookings: Booking[] = [
  {
    id: 'BK001',
    product_id: 'PROD001',
    renter_id: 'USR001',
    lister_id: 'USR002',
    start_date: '2025-05-10',
    end_date: '2025-05-15',
    status: 'active',
    created_at: '2025-05-08T10:00:00Z',
  },
  // ... more entries
];
```

### Rules (from RULES.md Rule 11)
- All mock data must match the real database schema exactly
- Mark every mock call with: `// PHASE4-SWAP: Replace with real API`
- Mock data must include edge cases (empty lists, error states, etc.)
- Minimum 5 entries per mock data file for realistic testing

---

## 5. Git Commit Messages

### Format (from RULES.md Rule 3)
```
[STEP-N] - [Task Description]

Completed:
- [What was built/implemented]
- [What was tested]
- [Progress notes]

Testing:
- [Manual tests passed]
- [Edge cases checked]
- [Known issues (if any)]
```

### Rules
- ONE commit per step
- ONLY commit after testing is complete
- Use `[STEP-N-BLOCKED]` prefix if step cannot be completed

---

## 6. Accessibility Checklist (WCAG AA)

Before committing any UI code, verify:

- [ ] All buttons have descriptive text (not "Click here")
- [ ] All form inputs have associated `<label>` elements
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Focus rings visible on tab navigation (2px `#62D0FF` outline)
- [ ] All images have `alt` text
- [ ] Keyboard navigation works for all interactive elements
- [ ] Error messages are associated with form fields
- [ ] Loading states announced to screen readers

---

## 7. Performance Guidelines

- Lazy load images below the fold
- Use Next.js `<Image>` component for automatic optimization
- Minimize client-side JavaScript — prefer Server Components where possible
- Database queries must use proper indexes
- Image uploads: max 5MB per file, show progress indicator

---

**Document Version:** 1.0  
**Status:** OPTIONAL REFERENCE  
**For:** Rentify P2P Rental Marketplace
