RENTIFY — Product Requirements Document **| CONFIDENTIAL**



|Field|Detail|
|---|---|
|Document Version|v1.0 — Initial PRD|
|Document Status|Draft — Awaiting Engineering Sign-off|
|Platform Name|Rentify|
|Platform Type|Peer-to-Peer (P2P) Rental Marketplace|
|Tech Stack|TypeScript · Next.js · Supabase · Node.js ·<br>Nodemailer (Google SMTP)|
|Database & Auth|Supabase (PostgreSQL + Supabase Auth)|
|Target Environment|Networkless-stable build — Web (Desktop +<br>Mobile Responsive)|
|Prepared By|Product Team|
|Date|2025|


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**
## **PART 1**

### **Product Overview**

#### **1.1 Vision**


Rentify is a peer-to-peer rental marketplace that enables any registered user to list physical products
for rent and simultaneously rent products listed by others. The platform solves the underutilization of
owned assets by connecting product owners (Listers) with people who need temporary access to those
products (Renters), all within a single unified account system backed by enforceable financial
instruments — security deposits, platform commissions, and structured payout schedules.

#### **1.2 Core Proposition**


   - Any user can list any physical product for rent and earn rental income.

   - Any user can browse, book, and rent any listed product for a defined time period.

   - The platform collects a configurable commission from the Lister on each successful transaction.

   - A 20% security deposit of the product’s listed value is charged to the Renter at booking, held in
escrow, and released or deducted based on the return condition.

   - Delivery can be managed by the platform (with configurable charges) or the Renter can selfpickup.

   - All financial flows, user management, product categories, platform fees, and delivery rates are
controlled by the Admin Panel.

#### **1.3 Platform Participants**







|Role|Description|Key Actions|
|---|---|---|
|Renter|Any registered user browsing<br>and booking products|Browse, Book, Pay, Return,<br>Raise Disputes|
|Lister|Any registered user listing their<br>own products for rent|List, Set Pricing,<br>Approve/Reject, Receive Payout|
|Delivery Agent|Platform-managed delivery<br>personnel|Accept Order, Pickup, Deliver,<br>Capture Photos|
|Sub-Admin|Operational staff with limited<br>admin rights|Manage Orders, Products,<br>Users, Disputes|
|Super Admin|Full platform control authority|All controls including fees,<br>payouts, roles, config|

#### **1.4 Design Principles**

Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


   - Single account, dual roles: One account handles both listing and renting without switching.

   - Trust by evidence: Photo capture at pickup and return is mandatory and built into the platform

    - no external uploads.

   - Fair arbitration: Disputes are admin-arbitrated using timestamped evidence from both parties.

   - Configurable financials: All fees, deposits, delivery charges, and late return penalties are
platform-configurable, not hardcoded.

   - Stable, networkless build: The system is built to run reliably offline-first with Supabase as the
persistent backend.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**
## **PART 2**

### **Technical Architecture**

#### **2.1 Stack Overview**







|Layer|Technology|Purpose|
|---|---|---|
|Frontend|Next.js 14 (App Router) +<br>TypeScript|Web UI — SSR + Client<br>Components|
|Styling|Tailwind CSS + shadcn/ui|Design system and component<br>library|
|Backend|Next.js API Routes (TypeScript)|Business logic, auth flows,<br>email, payment hooks|
|Database|Supabase (PostgreSQL)|All persistent data — users,<br>products, orders, transactions|
|Auth|Supabase Auth|Email + Password<br>authentication. No OTP, no<br>social login|
|Email|Nodemailer + Google SMTP|Transactional emails (booking<br>confirmed, payout, etc.)|
|File Storage|Supabase Storage|Product images, condition<br>photos (pickup/return)|
|State Management|Zustand or React Context|Client-side state for cart, auth<br>session|
|Deployment|Vercel or Self-hosted|Networkless-stable target —<br>zero external CDN<br>dependencies|

#### **2.2 Authentication Specification**

**Authentication Method**


Supabase Auth with Email + Password only. No OTP, no magic links, no social OAuth.


**Registration Flow**


1. User fills: First Name, Last Name, Email, Phone, Password, Confirm Password.
2. Frontend validates password match and email format client-side.
3. POST to /api/auth/register — creates user in Supabase Auth.
4. On success, a welcome email is dispatched via Nodemailer (Google SMTP).
5. User is auto-logged in and redirected to dashboard. No email verification step.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


**Login Flow**


6. User enters Email + Password.
7. Supabase Auth validates credentials.
8. On success, session token is issued and stored in HTTP-only cookie.
9. User is redirected to dashboard.


**Password Reset Flow**


10. User clicks Forgot Password and enters registered email.
11. Backend generates a secure time-limited reset token (stored in Supabase).
12. Nodemailer sends reset link via Google SMTP.
13. User clicks link → enters new password → token is invalidated.

#### **2.3 Nodemailer + Google SMTP Configuration**


All transactional emails are routed through a single verified Google Workspace SMTP account. The
configuration is stored in environment variables and never exposed client-side.

|Email Trigger|Recipient|Template|
|---|---|---|
|Registration|New User|Welcome to Rentify — account<br>confirmation|
|Booking Confirmed|Renter + Lister|Booking ID, product, dates,<br>deposit amount|
|Rental Approved by Lister|Renter|Approval confirmation with<br>pickup/delivery details|
|Payment Receipt|Renter|Itemised: rent, deposit, delivery,<br>platform fee|
|Payout Initiated|Lister|Amount, deductions, net payout,<br>timeline|
|Return Confirmed|Renter + Lister|Return date, condition status,<br>deposit outcome|
|Damage Claim Raised|Renter + Lister|Dispute ID, evidence summary|
|Dispute Resolved|Renter + Lister|Admin verdict, deduction/refund<br>amount|
|Password Reset|User|Reset link (expires in 30<br>minutes)|
|Late Return Alert|Renter|Late fee amount, accrual rate|


#### **2.4 Database Schema — Core Tables**


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


All tables live in Supabase PostgreSQL. Row-Level Security (RLS) is enabled on all tables.













|Table|Key Fields|Notes|
|---|---|---|
|users|id, email, full_name, phone,<br>created_at, role|Single table for all user types|
|products|id, lister_id, title, category,<br>description, original_value,<br>status|Listed items|
|product_pricing|product_id, per_day, per_week,<br>per_month, per_year,<br>late_fee_rate, late_fee_unit|Flexible pricing per product|
|product_images|product_id, url, is_primary|Supabase Storage URLs|
|bookings|id, product_id, renter_id,<br>lister_id, start_date, end_date,<br>status|Core rental record|
|booking_payments|booking_id, rent_total,<br>deposit_amount, delivery_fee,<br>platform_fee, payment_plan|Financial record per booking|
|installments|booking_id, due_date, amount,<br>status, paid_at|For monthly/weekly payment<br>plans|
|condition_photos|booking_id, type (pickup/return),<br>url, captured_at, captured_by|Mandatory evidence photos|
|disputes|booking_id, raised_by, status,<br>admin_id, verdict,<br>deduction_amount|Damage claims|
|payouts|lister_id, booking_id, gross,<br>deductions, net, status,<br>released_at|Lister earnings|
|delivery_orders|booking_id, agent_id, type<br>(deliver/collect), status, address|Platform delivery management|
|platform_config|key, value, updated_by,<br>updated_at|Admin-controlled settings|
|admin_roles|user_id, role, permissions_json|Super admin + sub-admin<br>RBAC|


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**
## **PART 3**

### **End-User Application — Screens & Flows**

#### **3.1 Authentication Screens**


**3.1.1 Registration Screen**


   - Fields: First Name, Last Name, Email, Phone Number, Password, Confirm Password.

   - Inline client-side validation on all fields.

   - Submit triggers POST /api/auth/register.

   - On success: auto-login, redirect to dashboard, welcome email dispatched.

   - Link to Login page for existing users.


**3.1.2 Login Screen**


   - Fields: Email, Password.

   - Remember Me toggle (persists session).

   - Forgot Password link → Password Reset flow.

   - Submit triggers Supabase Auth signInWithPassword.

   - Error states: invalid credentials, account not found.


**3.1.3 Password Reset Screen**


   - Step 1: Enter email → receive reset link via Nodemailer.

   - Step 2: Click link → enter new password + confirm.

   - Token expires in 30 minutes.

#### **3.2 Dashboard**


The dashboard is the landing page after login. It surfaces contextual data based on what the user is
actively doing.

   - Active Rentals (as Renter): cards showing product, days remaining, next payment due.

   - My Listings (as Lister): quick stats — active, pending, total earned.

   - Notifications panel: booking updates, payment alerts, dispute status.

   - Quick actions: Browse Products, List a Product, My Orders, My Wallet.

   - A dropdown period selector filters dashboard data (7 days, 30 days, 90 days, custom).

#### **3.3 Product Browsing & Discovery**


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


**3.3.1 Browse / Search Screen**


   - Search bar with text search + category filter.

   - Filters: Category, Price Range (per day/week/month), Location, Availability Dates.

   - Product grid cards: thumbnail, title, price from (lowest unit rate), availability badge.

   - Sort: Price Low-High, Newest Listed, Most Rented.


**3.3.2 Product Detail Screen**


   - Full image gallery (swipeable).

   - Product name, description, category, condition.

   - Pricing table: per day / per week / per month / per year rates (if set by lister).

   - Late return fee schedule: per hour / 6 hours / per day (as configured by lister).

   - Security deposit indicator: auto-calculated as 20% of listed product value.

   - Availability calendar (blocked dates shown).

   - Date range picker: user selects start and end date.

   - On date selection: system auto-calculates total rent, deposit, delivery fee, platform breakdown.

   - Delivery Options: Platform Delivery (charged) or Self-Pickup.

   - Rental Summary card with Proceed to Booking CTA.

#### **3.4 Booking Flow**


**3.4.1 Booking Step 1 — Order Overview**


   - Displays: Product name, selected dates, duration, delivery method.

   - Cost breakdown: Rent total, Security Deposit (20%), Delivery Charge (if applicable).

   - Payment plan selection (rules applied automatically):

     - Duration ≤ 7 days: Full payment upfront only.

     - Duration 8 days to 30 days: Upfront OR weekly installments.

     - Duration > 30 days: Upfront OR monthly installments.

   - Security deposit is always paid upfront regardless of payment plan.


**3.4.2 Booking Step 2 — Delivery Address**


   - If Platform Delivery: enter delivery address (save to profile option).

   - If Same as billing: auto-fill toggle.

   - If Self-Pickup: show lister pickup address.


**3.4.3 Booking Step 3 — Confirm Order & Pay**


   - Final summary: all line items, payment plan, total due now vs. later.

   - Save payment details option.

   - Place Order button — confirms booking, triggers lister notification.

   - Order confirmation email dispatched to Renter and Lister.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**

#### **3.5 Order Management (Renter View)**


   - Order list with status badges: Pending Lister Approval, Confirmed, Active, Completed,
Cancelled, Disputed.

   - Order detail: booking ID, product, dates, payment summary, delivery tracking.

   - Installment schedule visible with upcoming due dates.

   - Return initiation: Renter marks intent to return → triggers delivery agent or self-return flow.

#### **3.6 Lister — Product Listing Flow**


**3.6.1 Create Listing**


14. Product title, description, category (admin-defined list).
15. Original product value (used to calculate 20% security deposit).
16. Upload product images (3 minimum, 10 maximum) — camera capture supported directly in
platform.
17. Pricing setup:

a. Toggle per day / per week / per month / per year pricing — lister enables what applies.
b. Enter rate for each enabled period.
c. Late return fee: set amount and unit (per hour / per 6 hours / per day).
18. Delivery settings: allow platform delivery, allow self-pickup, or both.
19. Availability: set blackout dates when product is unavailable.
20. Submit for review (or auto-publish based on admin setting).


**3.6.2 Lister — Order Management**


   - Incoming booking requests with Renter details, dates, payment plan.

   - Accept or Reject booking (with optional rejection reason).

   - View active rentals with return status.

   - Raise damage claim within 24 hours of return with photo evidence.

   - Earnings dashboard: gross, platform fee deducted, net payout, payout status.

#### **3.7 Condition Photography Flow**


This is a core trust and security feature. All photo capture happens within the platform UI using the
device camera. No external file uploads are accepted.


**At Pickup (Delivery Agent or Lister)**


21. Open order in app.
22. Tap Capture Pickup Photos.
23. Platform opens in-app camera (requests camera permission if not granted).


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


24. Minimum 3 photos required (front, back, close-up of any existing damage).
25. Photos auto-tagged with: timestamp, GPS coordinates, booking ID, captured_by user.
26. Uploaded directly to Supabase Storage.
27. Renter must acknowledge and confirm receipt by tapping Confirm Pickup.


**At Return (Delivery Agent or Renter)**


28. Same flow as pickup.
29. Return photos uploaded and stored as type: return.
30. Lister has 24 hours from confirmed return to raise a damage claim.
31. After 24 hours with no claim, security deposit auto-release is queued.

#### **3.8 Delivery & Pickup System**


**Platform Delivery**


   - Delivery charge set by Admin for outbound (delivery to renter) and inbound (return collection).

   - Delivery agent is assigned by Admin or sub-admin.

   - Agent sees: pickup address, delivery address, product details, contact number.

   - Agent completes pickup photo capture in-app before marking Delivered.

   - Return collection: agent collects product, captures return photos, marks Collected.


**Self-Pickup**


   - Renter visits lister’s pickup address at agreed time.

   - Lister captures pickup photos in-app.

   - Renter confirms receipt in app.

   - On return: Renter brings product back, Lister captures return photos.

#### **3.9 Payout & Deposit Release Logic**


Payouts to Listers follow a hold period to allow for dispute windows:

|Rental Duration|Payout Hold After Return|
|---|---|
|1 – 3 days|Payment released after 2 days post-return|
|4 – 7 days|Payment released after 5 days post-return|
|8 – 14 days|Payment released after 7 days post-return|
|15 – 30 days|Payment released after 10 days post-return|
|More than 30 days|Payment released after 14 days post-return|



   - Security deposit is held throughout the rental.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


   - If no damage claim is raised within 24 hours of confirmed return: deposit is queued for refund to
Renter.

   - If a damage claim is raised: deposit is frozen pending admin arbitration.

   - Admin reviews pickup vs. return photos and decides on deduction amount.

   - Admin releases deduction to Lister and remainder (if any) to Renter.

#### **3.10 Dispute Flow**


32. Lister raises a damage claim from the order screen within 24 hours of confirmed return.
33. Lister uploads additional evidence notes (photos already on record from return).
34. System notifies Renter of claim raised.
35. Renter can submit a response (text + references to existing photos).
36. Admin reviews both sides and pickup vs. return photo comparison.
37. Admin sets deduction amount (0 to 100% of deposit).
38. Admin marks dispute Resolved.
39. System releases: deduction amount to Lister, remainder to Renter.
40. Both parties receive resolution email.

#### **3.11 Late Return Penalty System**


   - Return deadline is the end date of the booking at the agreed time.

   - If the product is not returned by the deadline, the system starts accruing late fees.

   - Late fee rate and unit are defined by the Lister when creating the listing.

   - Late fee units: per hour / per 6 hours / per day.

   - System calculates accrued late fees and adds to the Renter’s outstanding balance.

   - Renter receives a late return alert email when they breach the deadline.

   - Late fees are deducted from the security deposit first; if deposit is insufficient, additional
payment is required.

   - Admin can waive late fees in exceptional circumstances from the admin panel.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**
## **PART 4**

### **Admin Panel — Full Specification**

#### **4.1 Admin Panel Overview**


The Admin Panel is a separate, secured web application (or protected route) accessible only to users
with admin roles. It is the single source of truth for all platform configuration, financial controls, content
moderation, and operational management.


The Admin Panel is not visible to or accessible by regular users under any condition. It is protected by
role-based authentication at the Supabase RLS level and the Next.js middleware layer.

#### **4.2 Admin Role System**

|Role|Access Level|Permissions|
|---|---|---|
|Super Admin|Full|All modules. Can<br>create/edit/delete sub-admins.<br>Can change all platform config.|
|Operations Sub-Admin|Limited|Orders, Deliveries, Returns,<br>Disputes (no financial config<br>access).|
|Finance Sub-Admin|Limited|Payouts, Refunds, Deposits,<br>Transaction reports (no user<br>deletion).|
|Content Sub-Admin|Limited|Product listing review, category<br>management, flagged content.|
|Custom Role|Configurable|Super Admin defines granular<br>permissions per module.|



Permissions are stored as a JSON object in admin_roles table. Super Admin can toggle individual
permissions per sub-admin from the admin panel UI.

#### **4.3 Admin Panel Modules**


**4.3.1 Dashboard**


   - Real-time stats: total users, active listings, active rentals, pending disputes, pending payouts.

   - Revenue chart: daily/weekly/monthly gross GMV and platform fee collected.

   - Order status funnel: Pending → Confirmed → Active → Completed → Disputed.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


   - Recent activity feed: new bookings, new users, claims raised.


**4.3.2 User Management**


   - View all users with search, filter by status, join date, role.

   - User detail: profile info, all bookings as renter, all listings as lister, payment history.

   - Actions: Suspend Account, Unsuspend, Delete Account, Verify Identity (manual flag).

   - View and download user activity logs.


**4.3.3 Product Listing Management**


   - View all listings: Active, Pending Review, Suspended, Archived.

   - Admin can Approve, Reject (with reason), Suspend, or Delete any listing.

   - Override any pricing field on a listing in exceptional cases.

   - Bulk actions: approve multiple listings, suspend category.

   - Category management: create, rename, archive product categories.


**4.3.4 Order Management**


   - View all orders with full details: booking ID, renter, lister, product, dates, status.

   - Filter by: status, date range, delivery type, dispute flag.

   - Admin can force-cancel an order with reason.

   - Admin can reassign delivery agents.

   - View pickup and return photos for any order directly from this screen.

   - Trigger manual payout release for any order.


**4.3.5 Dispute Management**


   - Queue of all open disputes sorted by days pending.

   - Dispute detail view: side-by-side pickup vs. return photo comparison.

   - Renter response and Lister claim text visible together.

   - Admin inputs: deduction amount (0 – 100% of deposit), resolution notes.

   - Resolve Dispute button triggers: payout split, email notifications to both parties.

   - Closed disputes archived with full audit trail.


**4.3.6 Payout Management**


   - View all pending payouts with hold period countdown.

   - Payouts auto-queue for release after hold period elapses with no active dispute.

   - Admin can manually release any payout before hold period ends.

   - Admin can block a payout pending investigation.

   - Payout history with filters: lister, date range, status, amount.

   - Export payout report as CSV.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


**4.3.7 Delivery Management**


   - View all platform delivery orders: assigned, in-transit, completed.

   - Create and manage delivery agent accounts.

   - Assign delivery orders to agents manually or set auto-assignment rules.

   - View agent performance: orders completed, average delivery time, complaints.


**4.3.8 Financial Reports**


   - GMV (Gross Merchandise Value) by period.

   - Platform fee collected by period (broken into transaction % and subscription fees).

   - Security deposits held vs. released vs. forfeited.

   - Late fee revenue.

   - Delivery fee revenue.

   - Refunds issued.

   - Export all reports as CSV or PDF.


**4.3.9 Platform Configuration (Super Admin Only)**


This is the most critical module. All financial and operational parameters of the platform are set here.
No values are hardcoded in the application.







|Config Key|Description|Type|
|---|---|---|
|security_deposit_pct|Percentage of product original<br>value charged as security<br>deposit (default: 20%)|Number (%)|
|platform_fee_type|Fee model:<br>transaction_percentage,<br>flat_fee, or subscription|Enum|
|platform_fee_pct|Percentage of rental value<br>charged as platform fee per<br>transaction|Number (%)|
|platform_flat_fee|Flat fee per listing (if flat fee<br>model selected)|Number (INR)|
|subscription_monthly_fee|Monthly fee charged to Listers<br>for the subscription model|Number (INR)|
|fee_model_active|Which fee model(s) are active<br>simultaneously|Multi-select|
|delivery_fee_outbound|Platform delivery charge for<br>delivering product to Renter|Number (INR)|
|delivery_fee_inbound|Platform delivery charge for<br>collecting product from Renter<br>at return|Number (INR)|
|payout_hold_short|Hold days for rentals 1–3 days|Number (days)|


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**












|payout_hold_medium|Hold days for rentals 4–7 days|Number (days)|
|---|---|---|
|payout_hold_long|Hold days for rentals 8+ days|Number (days)|
|damage_claim_window_hours|Hours a Lister has to raise a<br>damage claim after return|Number (hours)|
|deposit_auto_release_days|Days after which an unclaimed<br>deposit auto-refunds to Renter|Number (days)|
|min_rental_duration_days|Minimum rental duration in days|Number (days)|
|max_rental_duration_days|Maximum rental duration in<br>days|Number (days)|
|listing_auto_approve|If true, listings go live without<br>admin review|Boolean|
|smtp_from_email|Sender email for Nodemailer<br>(Google SMTP)|Email string|
|platform_name|Display name for all emails and<br>UI|String|



**4.3.10 Role & Permission Management (Super Admin Only)**


   - View all admin users.

   - Create new sub-admin: assign email, temporary password, role.

   - Edit permissions per module: toggle read / write / delete per section.

   - Deactivate or delete sub-admin accounts.

   - Audit log: every admin action is logged with admin ID, timestamp, action, affected record.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**
## **PART 5**

### **Platform Fee Architecture**

#### **5.1 Fee Collection Rules**


Platform fees are collected exclusively from the Lister. Renters are never charged a platform fee. This
is a non-negotiable product principle.

#### **5.2 Supported Fee Models**


**Model A: Transaction Percentage**


   - Admin sets a percentage (e.g., 10%) of the total rental value.

   - Fee is deducted from the Lister’s payout at settlement time.

   - Example: Rental value = ₹ 5,000. Platform fee at 10% = ₹ 500. Lister receives ₹ 4,500.


**Model B: Flat Fee Per Listing**


   - Admin sets a fixed amount charged per active listing per month (or per listing creation).

   - Lister is billed this amount regardless of whether the product is rented.

   - This can coexist with Model A or Model C.


**Model C: Subscription**


   - Lister pays a monthly subscription fee to maintain listing rights.

   - Admin sets the subscription amount.

   - Subscription can be tiered (e.g., up to 5 listings, up to 20 listings) — configurable by admin.

   - Subscription does not reduce or eliminate transaction % if both are active.


**Multi-model Activation**


   - Super Admin can activate any combination of the three models simultaneously.

   - The platform calculates total Lister obligation as the sum of all active fee types.

   - All deductions are shown transparently in the Lister’s payout breakdown.

#### **5.3 Fee Display to Lister**


   - When creating a listing, the Lister sees a fee disclosure: “Platform fee of X% will be deducted
from each rental payout.”

   - In the payout dashboard, Lister sees: Gross Rental − Platform Fee = Net Payout.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**
## **PART 6**

### **Screen Inventory (From Wireframe Reference)**


The following screens were identified from the uploaded wireframe drawing and are confirmed in scope
for the end-user application:






|Screen ID|Screen Name|Module|Key Components|
|---|---|---|---|
|S-01|Dashboard|Home|Stats cards, period<br>selector, quick actions,<br>notifications|
|S-02|Browse Products|Discovery|Search, filters, product<br>grid, sort|
|S-03|Product Detail|Discovery|Gallery, pricing table,<br>date picker, booking<br>CTA|
|S-04|My Orders (Renter)|Orders|Order list, status<br>badges, filter tabs|
|S-05|Order Detail — R00001|Orders|Order info, product,<br>payment, delivery,<br>actions|
|S-06|Pickup Order|Operations|Pickup confirmation,<br>photo capture, agent<br>details|
|S-07|Return Order|Operations|Return confirmation,<br>photo capture, late fee<br>notice|
|S-08|My Listings (Lister)|Listings|Listing cards, status,<br>earnings, add new CTA|
|S-09|Create / Edit Listing|Listings|Multi-step form: details,<br>pricing, photos,<br>availability|
|S-10|Lister Order Requests|Listings|Incoming bookings,<br>approve/reject actions|
|S-11|Review Order — Step<br>1 (Delivery)|Checkout|Order summary,<br>product, qty, delivery<br>group|
|S-12|Review Order — Step<br>2 (Address)|Checkout|Delivery / invoice<br>address, same-as-<br>billing toggle|
|S-13|Review Order — Step<br>3 (Confirm & Pay)|Checkout|Final summary,<br>payment plan, Pay<br>Now button|



Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**


















|S-14|Customer Basket / Cart|Checkout|Product cards, qty,<br>pricing, proceed CTA|
|---|---|---|---|
|S-15|Product Category<br>Browse|Discovery|Category icons grid,<br>sub-category<br>navigation|
|S-16|Register|Auth|Name, email, phone,<br>password fields|
|S-17|Login|Auth|Email, password,<br>remember me, forgot<br>password|
|S-18|Forgot Password|Auth|Email entry, reset link<br>dispatch|
|S-19|Dispute / Damage<br>Claim|Disputes|Evidence view, claim<br>form, status tracker|
|S-20|Admin Dashboard|Admin|KPI cards, revenue<br>chart, activity feed|
|S-21|Admin — User<br>Management|Admin|User table, search,<br>suspend/delete actions|
|S-22|Admin — Order<br>Management|Admin|Order table, filters,<br>detail drawer|
|S-23|Admin — Dispute<br>Management|Admin|Dispute queue, photo<br>comparison, verdict<br>input|
|S-24|Admin — Payout<br>Management|Admin|Payout queue, hold<br>timers, release actions|
|S-25|Admin — Platform<br>Config|Admin|Settings form, all<br>configurable params|
|S-26|Admin — Role<br>Management|Admin|Sub-admin list,<br>permission toggles|
|S-27|Admin — Delivery<br>Management|Admin|Delivery orders, agent<br>assignment|



Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**
## **PART 7**

### **Non-Functional Requirements**

#### **7.1 Performance**


   - Page load time under 2 seconds on a standard 4G connection.

   - Supabase queries must include proper indexes on booking status, user ID, and product ID
fields.

   - Image uploads to Supabase Storage must show progress indicator; max file size 5MB per
photo.

#### **7.2 Security**


   - All API routes protected by Supabase session validation middleware.

   - Row-Level Security (RLS) enforced on all Supabase tables — users can only access their own
data.

   - Admin routes additionally protected by admin_roles check in Next.js middleware.

   - SMTP credentials stored in server-side environment variables only, never exposed to client.

   - All financial state changes (payout release, deductions) are server-side only — no client-side
financial mutations.

   - Condition photos are stored in private Supabase Storage buckets; accessed via signed URLs
only.

#### **7.3 Stability (Networkless Build)**


   - The application is designed to run fully from a self-contained build with no external CDN
dependencies.

   - All fonts, icons, and UI libraries are bundled locally.

   - Supabase connection is the only required network call; application gracefully handles Supabase
offline state with meaningful error messages.

   - No third-party analytics, tracking scripts, or external APIs beyond Supabase and Google SMTP.

#### **7.4 Scalability**


   - Database schema supports unlimited users, products, bookings.

   - Supabase free tier supports development; Supabase Pro tier recommended for production.

   - Platform configuration is table-driven, not code-driven — fee changes require zero code
deployments.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**

#### **7.5 Accessibility**


   - All interactive elements are keyboard-navigable.

   - Camera permission flow is handled gracefully with fallback instructions if permission is denied.

   - All forms include proper ARIA labels.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**
## **PART 8**

### **Out of Scope — v1.0**


The following features are explicitly excluded from the initial release and are noted for future
consideration:


   - In-app messaging between Lister and Renter.

   - OTP / SMS verification.

   - Social login (Google, Facebook, Apple).

   - Native iOS or Android mobile app (v1 is web-only, mobile-responsive).

   - Integrated payment gateway (Razorpay, Stripe) — payment processing is noted as a Phase 2
addition.

   - Automated ID / KYC verification.

   - Ratings and reviews system.

   - Insurance integration.

   - Multi-language support.

   - Lister analytics dashboard beyond basic earnings view.


Rentify Platform © 2025 Page


RENTIFY — Product Requirements Document **| CONFIDENTIAL**
## **PART 9**

### **Open Questions — To Be Decided**






|#|Question|Impact|
|---|---|---|
|OQ-1|Which payment gateway will be<br>integrated for actual money<br>movement? (Razorpay, Stripe,<br>manual?)|High — affects entire payment<br>flow implementation|
|OQ-2|Should subscription-model<br>billing be automated (recurring<br>charge) or manual (invoice<br>sent)?|Medium — affects subscription<br>module design|
|OQ-3|Will delivery agents be internal<br>staff or third-party (e.g., Dunzo,<br>Porter API)?|High — affects delivery<br>management module|
|OQ-4|Is there a maximum number of<br>active listings per Lister in v1?|Low — platform config can cap<br>this|
|OQ-5|Should the platform support<br>multiple cities with city-specific<br>delivery fees?|Medium — affects delivery<br>config schema|
|OQ-6|Who resolves disputes if both<br>admin sub-admin is unavailable<br>— escalation chain?|Medium — affects SLA<br>definition|
|OQ-7|What happens to an active<br>rental if the Lister’s account is<br>suspended mid-rental?|High — needs a clear policy and<br>system behavior|



Rentify Platform © 2025 Page


