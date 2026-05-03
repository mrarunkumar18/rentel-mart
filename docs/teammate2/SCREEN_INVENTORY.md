# Teammate 2 — Screen Inventory

**19 End-User Screens from PRD Part 6 (S-01 to S-19)**

---

| Screen ID | Screen Name | Module | Route | Key Components |
|-----------|-------------|--------|-------|----------------|
| S-01 | Dashboard | Home | `/(renter)/dashboard` | Stats cards, period selector, quick actions, notifications |
| S-02 | Browse Products | Discovery | `/(renter)/browse` | Search, filters, product grid, sort |
| S-03 | Product Detail | Discovery | `/(renter)/product/[id]` | Gallery, pricing table, date picker, booking CTA |
| S-04 | My Orders (Renter) | Orders | `/(renter)/orders` | Order list, status badges, filter tabs |
| S-05 | Order Detail | Orders | `/(renter)/orders/[id]` | Order info, product, payment, delivery, actions |
| S-06 | Pickup Order | Operations | `/(renter)/orders/[id]/pickup` | Pickup confirmation, photo capture, agent details |
| S-07 | Return Order | Operations | `/(renter)/orders/[id]/return` | Return confirmation, photo capture, late fee notice |
| S-08 | My Listings (Lister) | Listings | `/(lister)/listings` | Listing cards, status, earnings, add new CTA |
| S-09 | Create / Edit Listing | Listings | `/(lister)/listings/new` | Multi-step: details, pricing, photos, availability |
| S-10 | Lister Order Requests | Listings | `/(lister)/requests` | Incoming bookings, approve/reject |
| S-11 | Review Order - Step 1 | Checkout | `/(renter)/checkout` | Order summary, delivery group |
| S-12 | Review Order - Step 2 | Checkout | `/(renter)/checkout` | Delivery/billing address |
| S-13 | Review Order - Step 3 | Checkout | `/(renter)/checkout` | Final summary, payment plan, Pay Now |
| S-14 | Cart | Checkout | `/(renter)/cart` | Product cards, qty, pricing, proceed CTA |
| S-15 | Product Category Browse | Discovery | `/(renter)/browse/categories` | Category icons grid, sub-categories |
| S-16 | Register | Auth | `/(auth)/register` | Name, email, phone, password fields |
| S-17 | Login | Auth | `/(auth)/login` | Email, password, remember me, forgot password |
| S-18 | Forgot Password | Auth | `/(auth)/forgot-password` | Email entry, reset link dispatch |
| S-19 | Dispute / Damage Claim | Disputes | `/(renter)/orders/[id]/dispute` | Evidence view, claim form, status tracker |

---

## Component Breakdown

### Shared Components (used across multiple screens)
- `Navbar` — Top navigation with logo, search, profile
- `Sidebar` — Left sidebar with navigation links
- `StatusBadge` — Color-coded status indicators
- `ProductCard` — Product grid card (thumbnail, title, price, badge)
- `PriceDisplay` — Formatted currency display
- `DateRangePicker` — Start/end date selection
- `ImageGallery` — Swipeable image gallery
- `LoadingSpinner` — Loading state indicator
- `EmptyState` — Empty list placeholder
- `ErrorBoundary` — Error fallback UI

### Screen-Specific Components
- `DashboardStats` — KPI cards for dashboard
- `ProductFilter` — Filter panel for browse screen
- `BookingSummary` — Cost breakdown card
- `PaymentPlanSelector` — Upfront/weekly/monthly toggle
- `AddressForm` — Delivery address input
- `PhotoCapture` — Camera UI for condition photos
- `ListingForm` — Multi-step listing creation
- `OrderTimeline` — Order status progression
