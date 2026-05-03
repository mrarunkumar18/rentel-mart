# Phase 4 — Technical Reference

## Integration patterns, API routes, auth middleware, deployment.

### API Route Pattern
```typescript
// src/app/api/bookings/route.ts
import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.from('bookings').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
```

### Auth Middleware
```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check auth for protected routes
  // Redirect to login if not authenticated
  // Check admin_roles for admin routes
}

export const config = {
  matcher: ['/(renter)/:path*', '/(lister)/:path*', '/(admin)/:path*'],
};
```

### Mock-to-Real Swap Pattern
```typescript
// Before (mock):
// PHASE4-SWAP: Replace with real API
const bookings = mockBookings;

// After (real):
const { data: bookings } = await supabase.from('bookings').select('*').eq('renter_id', user.id);
```
