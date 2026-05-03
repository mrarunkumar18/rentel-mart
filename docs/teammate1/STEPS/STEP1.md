# STEP 1 — Supabase Project Setup + Core Tables

**Day:** 1  
**Estimated Time:** 4-6 hours  
**Dependencies:** None

---

## Objectives

1. Create and configure a Supabase project
2. Create the 4 core tables: `users`, `products`, `product_pricing`, `product_images`
3. Set up primary keys, field types, and basic constraints
4. Establish foreign key relationships

## Instructions

### 1.1 — Supabase Project Setup
- Go to [supabase.com](https://supabase.com) and create a new project
- Name it `rentify` (or `rentify-dev` for development)
- Choose a strong database password — save it securely
- Select the closest region to your deployment target
- Wait for the project to initialize
- Copy the **Project URL** and **Anon Key** — these go in `.env.local`

### 1.2 — Create `users` Table
Reference: PRD Part 2.4 — `users` table

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.3 — Create `products` Table
Reference: PRD Part 2.4 — `products` table

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lister_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  original_value DECIMAL(10,2) NOT NULL,
  condition TEXT DEFAULT 'good',
  delivery_option TEXT DEFAULT 'both' CHECK (delivery_option IN ('platform', 'self_pickup', 'both')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.4 — Create `product_pricing` Table
Reference: PRD Part 2.4 — `product_pricing` table

```sql
CREATE TABLE product_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  per_day DECIMAL(10,2),
  per_week DECIMAL(10,2),
  per_month DECIMAL(10,2),
  per_year DECIMAL(10,2),
  late_fee_rate DECIMAL(10,2) DEFAULT 0,
  late_fee_unit TEXT DEFAULT 'per_day' CHECK (late_fee_unit IN ('per_hour', 'per_6_hours', 'per_day')),
  UNIQUE(product_id)
);
```

### 1.5 — Create `product_images` Table
Reference: PRD Part 2.4 — `product_images` table

```sql
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Testing

After running all SQL:
1. Open Supabase Table Editor — verify all 4 tables exist
2. Check field types match the SQL above
3. Try inserting a test user, then a test product linked to that user
4. Try inserting a product with a non-existent `lister_id` — should fail (FK constraint)
5. Try inserting a product with `status = 'invalid'` — should fail (CHECK constraint)

## After Completion

1. Update `/docs/teammate1/PROGRESS.md` → Step 1
2. Commit: `[STEP-1] - Supabase project setup + core tables (users, products, pricing, images)`
