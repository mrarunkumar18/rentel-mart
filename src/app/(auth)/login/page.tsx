'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mockLogin } from '@/mocks/auth';

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

/** S-17 — Login Page | Route: /(auth)/login */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const e: LoginErrors = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});
    try {
      // PHASE4-SWAP: Replace mockLogin with real Supabase auth
      await mockLogin(email, password);
      window.location.href = '/(renter)/dashboard';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  }

  const inputCls = (hasErr: boolean) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
      hasErr
        ? 'border-red-400 focus:ring-red-200 bg-red-50'
        : 'border-[#E5E5E5] focus:ring-[#62D0FF] focus:border-[#1886FF]'
    }`;

  return (
    <>
      <h1 className="text-2xl font-bold text-[#171717] mb-1">Welcome back</h1>
      <p className="text-sm text-[#737373] mb-5">Sign in to your Rentify account</p>

      {/* Demo hint */}
      <div className="mb-5 p-3 rounded-lg bg-[#E4F9FF] border border-[#62D0FF]/40 text-xs">
        <span className="font-medium text-[#1886FF]">Demo: </span>
        <span className="text-[#737373]">renter@demo.com · any 6+ char password</span>
      </div>

      <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.form && (
          <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-[#171717] mb-1">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={inputCls(!!errors.email)}
          />
          {errors.email && <p role="alert" className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-[#171717] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className={inputCls(!!errors.password) + ' pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1886FF] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                {showPassword
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></>
                }
              </svg>
            </button>
          </div>
          {errors.password && <p role="alert" className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Remember me + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="login-remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[#E5E5E5] accent-[#1886FF]"
            />
            <span className="text-sm text-[#737373]">Remember me</span>
          </label>
          <Link href="/(auth)/forgot-password" className="text-sm text-[#1886FF] hover:text-[#62D0FF] font-medium transition-colors">
            Forgot password?
          </Link>
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#1886FF] hover:bg-[#62D0FF] active:bg-[#0D5BB8] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {isLoading ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</>
          ) : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#737373]">
        Don&apos;t have an account?{' '}
        <Link href="/(auth)/register" className="text-[#1886FF] hover:text-[#62D0FF] font-medium transition-colors">
          Create one free
        </Link>
      </p>
    </>
  );
}
