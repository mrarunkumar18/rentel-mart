// PHASE4-SWAP: Replace this entire file with real Supabase auth calls

export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'renter' | 'lister' | 'admin';
  avatarUrl?: string;
  createdAt: string;
}

/** Simulated users for mock auth */
export const mockUsers: MockUser[] = [
  {
    id: 'USR001',
    email: 'renter@demo.com',
    firstName: 'Priya',
    lastName: 'Patel',
    phone: '9876543210',
    role: 'renter',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'USR002',
    email: 'lister@demo.com',
    firstName: 'Rahul',
    lastName: 'Sharma',
    phone: '9123456789',
    role: 'lister',
    createdAt: '2025-01-10T08:30:00Z',
  },
  {
    id: 'USR003',
    email: 'admin@demo.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '9000000000',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'USR004',
    email: 'arun@demo.com',
    firstName: 'Arun',
    lastName: 'Kumar',
    phone: '9988776655',
    role: 'renter',
    createdAt: '2025-02-01T12:00:00Z',
  },
  {
    id: 'USR005',
    email: 'devraj@demo.com',
    firstName: 'Devraj',
    lastName: 'Singh',
    phone: '9871234567',
    role: 'lister',
    createdAt: '2025-02-10T09:00:00Z',
  },
];

/** Mock authentication state */
export interface MockAuthState {
  isAuthenticated: boolean;
  currentUser: MockUser | null;
  error: string | null;
}

export const defaultAuthState: MockAuthState = {
  isAuthenticated: false,
  currentUser: null,
  error: null,
};

/** Simulate login — returns user or throws error */
export async function mockLogin(
  email: string,
  password: string
): Promise<MockUser> {
  // PHASE4-SWAP: Replace with real Supabase signInWithPassword
  await new Promise((resolve) => setTimeout(resolve, 600)); // simulate network delay

  const user = mockUsers.find((u) => u.email === email);

  if (!user) {
    throw new Error('No account found with this email address.');
  }

  // In mock mode, any password works for demo users
  if (!password || password.length < 6) {
    throw new Error('Invalid password.');
  }

  return user;
}

/** Simulate registration — returns new user */
export async function mockRegister(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<MockUser> {
  // PHASE4-SWAP: Replace with real Supabase signUp
  await new Promise((resolve) => setTimeout(resolve, 800));

  const existing = mockUsers.find((u) => u.email === data.email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: MockUser = {
    id: `USR${String(mockUsers.length + 1).padStart(3, '0')}`,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: 'renter',
    createdAt: new Date().toISOString(),
  };

  return newUser;
}

/** Simulate forgot password — always succeeds for valid email */
export async function mockForgotPassword(email: string): Promise<void> {
  // PHASE4-SWAP: Replace with real Supabase resetPasswordForEmail
  await new Promise((resolve) => setTimeout(resolve, 600));

  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    // Still resolve — don't reveal if email exists (security best practice)
    return;
  }
}
