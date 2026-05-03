// ============================================================================
// Rentify — Supabase Client Setup
// Reference: TECHNICAL_REFERENCE.md Section 4, PRD 2.1-2.2
// Auth: Email + Password only (PRD 2.2) — no social login, no OTP
// ============================================================================

import { createBrowserClient } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { cookies } from 'next/headers';
import type {
  User,
  AdminRole,
  AdminRoleEntry,
} from '@/types/database';

// ============================================================================
// Environment variable validation
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ============================================================================
// 1. Browser Client — For client components
// Uses NEXT_PUBLIC_ env vars (safe for client-side)
// ============================================================================

/**
 * Creates a Supabase client for use in browser/client components.
 * Uses the anon key — all queries go through RLS policies.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ============================================================================
// 2. Server Client — For server components, API routes, server actions
// Uses cookies for session management (Next.js App Router)
// ============================================================================

/**
 * Creates a Supabase client for use in server components and API routes.
 * Reads/writes cookies for session management.
 * Must be called with the awaited cookies() result.
 *
 * @example
 * ```ts
 * import { cookies } from 'next/headers';
 * const cookieStore = await cookies();
 * const supabase = createServerSupabaseClient(cookieStore);
 * ```
 */
export function createServerSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>
) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll can be called from Server Components where cookies
          // cannot be set. This can be safely ignored when reading cookies
          // in Server Components since the middleware will handle refresh.
        }
      },
    },
  });
}

// ============================================================================
// 3. Service Role Client — For admin operations (server-side only)
// Bypasses RLS — use with caution
// PRD 7.2: "All financial state changes are server-side only"
// ============================================================================

/**
 * Creates a Supabase client with the service role key.
 * BYPASSES RLS — use only for admin operations that need full access.
 * NEVER expose this client or its key to client-side code.
 *
 * @throws Error if SUPABASE_SERVICE_ROLE_KEY is not set
 */
export function createServiceRoleClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. This client can only be used server-side.'
    );
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ============================================================================
// 4. Helper Functions — Type-safe user and role queries
// ============================================================================

/**
 * Gets the currently authenticated user from the browser client.
 * Returns null if not authenticated.
 *
 * @returns The authenticated user or null
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  return (data as User) ?? null;
}

/**
 * Gets the currently authenticated user from a server context.
 * Pass the awaited cookies() result.
 *
 * @param cookieStore - The awaited result of cookies() from next/headers
 * @returns The authenticated user or null
 */
export async function getServerCurrentUser(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<User | null> {
  const supabase = createServerSupabaseClient(cookieStore);
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  return (data as User) ?? null;
}

/**
 * Checks if a user has any admin role.
 * PRD 4.2: Admin roles checked via admin_roles table.
 *
 * @param userId - The user's UUID
 * @returns true if the user has an admin role
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  return !!data;
}

/**
 * Server-side admin check.
 *
 * @param cookieStore - The awaited result of cookies() from next/headers
 * @param userId - The user's UUID
 * @returns true if the user has an admin role
 */
export async function isServerAdmin(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  userId: string
): Promise<boolean> {
  const supabase = createServerSupabaseClient(cookieStore);
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  return !!data;
}

/**
 * Gets the admin role for a user, if any.
 * PRD 4.2: Returns the role type (super_admin, operations, finance, content, custom)
 *
 * @param userId - The user's UUID
 * @returns The admin role string or null if not an admin
 */
export async function getUserRole(userId: string): Promise<AdminRole | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  return (data as Pick<AdminRoleEntry, 'role'> | null)?.role ?? null;
}

/**
 * Server-side role check.
 *
 * @param cookieStore - The awaited result of cookies() from next/headers
 * @param userId - The user's UUID
 * @returns The admin role string or null if not an admin
 */
export async function getServerUserRole(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  userId: string
): Promise<AdminRole | null> {
  const supabase = createServerSupabaseClient(cookieStore);
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  return (data as Pick<AdminRoleEntry, 'role'> | null)?.role ?? null;
}

/**
 * Gets the full admin role entry including permissions JSON.
 * PRD 4.2: permissions_json contains granular per-module toggles
 *
 * @param userId - The user's UUID
 * @returns The full admin role entry or null
 */
export async function getAdminPermissions(
  userId: string
): Promise<AdminRoleEntry | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('user_id', userId)
    .single();

  return (data as AdminRoleEntry) ?? null;
}
