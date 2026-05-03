# Teammate 2 — Testing Checklist

**Type:** Manual Testing | **Test after each step, before committing.**

---

## Step 1 — Auth Screens
- [ ] Register: All fields render (First Name, Last Name, Email, Phone, Password, Confirm Password)
- [ ] Register: Inline validation works (email format, password match, required fields)
- [ ] Register: Submit shows success state (mock)
- [ ] Register: Link to Login page works
- [ ] Login: Email + Password fields render
- [ ] Login: Remember Me toggle works
- [ ] Login: Forgot Password link works
- [ ] Login: Error states display (invalid credentials mock)
- [ ] Forgot Password: Email entry + submit works
- [ ] Navigation bar renders with Rentify branding
- [ ] Mobile responsive on all 3 screens
- [ ] Color theme matches: Primary buttons `#1886FF`, hover `#62D0FF`

## Step 2 — Dashboard
- [ ] Stats cards show mock data (active rentals, listings, earnings)
- [ ] Period selector (7/30/90 days) toggles data
- [ ] Quick actions: Browse, List Product, My Orders, My Wallet
- [ ] Notifications panel shows updates
- [ ] Sidebar/nav highlight current page
- [ ] Mobile responsive

## Step 3 — Browse + Product Detail
- [ ] Search bar filters products
- [ ] Category filter works
- [ ] Price range filter works
- [ ] Sort options (Price, Newest, Most Rented) work
- [ ] Product grid cards show: thumbnail, title, price, availability badge
- [ ] Product Detail: Image gallery with navigation
- [ ] Product Detail: Pricing table (per day/week/month/year)
- [ ] Product Detail: Date picker selects start/end
- [ ] Product Detail: Auto-calculates total on date selection
- [ ] Product Detail: Delivery option selector
- [ ] Product Detail: Proceed to Booking CTA

## Step 4 — Booking Flow
- [ ] Step 1: Order overview displays correctly
- [ ] Step 1: Cost breakdown (rent, deposit, delivery)
- [ ] Step 1: Payment plan selection based on duration rules
- [ ] Step 2: Address form (if platform delivery)
- [ ] Step 2: Self-pickup shows lister address
- [ ] Step 3: Final summary with all line items
- [ ] Step 3: Place Order button works
- [ ] Cart: Products listed with quantities
- [ ] Multi-step navigation (back/forward) works

## Step 5 — Order Management
- [ ] Order list renders with status badges
- [ ] Filter tabs work (All, Pending, Active, Completed, etc.)
- [ ] Order detail shows full booking info
- [ ] Payment summary visible
- [ ] Installment schedule visible (if applicable)
- [ ] Return initiation button present

## Step 6 — Lister Screens
- [ ] My Listings: Grid of listing cards with stats
- [ ] Create Listing: Multi-step form works (title, description, category, value, images, pricing, availability)
- [ ] Create Listing: Image upload UI (3 min, 10 max)
- [ ] Create Listing: Pricing toggle for per day/week/month/year
- [ ] Create Listing: Late fee configuration
- [ ] Order Requests: Incoming bookings with Accept/Reject actions

## Step 7 — Operations + Dispute
- [ ] Pickup Order: Photo capture UI renders
- [ ] Pickup Order: Minimum 3 photos enforced
- [ ] Pickup Order: Confirm Pickup button
- [ ] Return Order: Same flow as pickup
- [ ] Dispute: Claim form with notes
- [ ] Dispute: Status tracker visible
- [ ] All screens: Loading states present
- [ ] All screens: Empty states present
- [ ] All screens: Keyboard navigation works
- [ ] All screens: Focus rings visible (2px `#62D0FF`)
