'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mockRegister } from '@/mocks/auth';

interface RegisterErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

/** S-16 — Register Page | Route: /(auth)/register */
export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const e: RegisterErrors = {};
    if (!firstName.trim()) e.firstName = 'First name is required.';
    if (!lastName.trim()) e.lastName = 'Last name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.';
    if (!phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});
    try {
      // PHASE4-SWAP: Replace mockRegister with real Supabase signUp
      await mockRegister({ firstName, lastName, email, phone, password });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
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

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#171717] mb-2">Account created!</h2>
        <p className="text-sm text-[#737373] mb-6">Welcome to Rentify, {firstName}. You can now log in.</p>
        <Link
          href="/(auth)/login"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1886FF] hover:bg-[#62D0FF] transition-all"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[#171717] mb-1">Create your account</h1>
      <p className="text-sm text-[#737373] mb-5">Start renting or listing in minutes</p>

      <form id="register-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.form && (
          <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="register-first-name" className="block text-sm font-medium text-[#171717] mb-1">
              First name
            </label>
            <input
              id="register-first-name"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors(p => ({ ...p, firstName: undefined })); }}
              placeholder="Priya"
              aria-invalid={!!errors.firstName}
              className={inputCls(!!errors.firstName)}
            />
            {errors.firstName && <p role="alert" className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="register-last-name" className="block text-sm font-medium text-[#171717] mb-1">
              Last name
            </label>
            <input
              id="register-last-name"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors(p => ({ ...p, lastName: undefined })); }}
              placeholder="Patel"
              aria-invalid={!!errors.lastName}
              className={inputCls(!!errors.lastName)}
            />
            {errors.lastName && <p role="alert" className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-[#171717] mb-1">
            Email address
          </label>
          <input
            id="register-email"
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

        {/* Phone */}
        <div>
          <label htmlFor="register-phone" className="block text-sm font-medium text-[#171717] mb-1">
            Mobile number
          </label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 py-2.5 bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg text-sm text-[#737373] whitespace-nowrap">
              🇮🇳 +91
            </span>
            <input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); if (errors.phone) setErrors(p => ({ ...p, phone: undefined })); }}
              placeholder="9876543210"
              aria-invalid={!!errors.phone}
              className={inputCls(!!errors.phone) + ' flex-1'}
            />
          </div>
          {errors.phone && <p role="alert" className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-[#171717] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
              placeholder="Min. 8 characters"
              aria-invalid={!!errors.password}
              className={inputCls(!!errors.password) + ' pr-10'}
            />
            <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1886FF] transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                {showPassword
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></>
                }
              </svg>
            </button>
          </div>
          {errors.password && <p role="alert" className="mt-1 text-xs text-red-600">{errors.password}</p>}
          {/* Password strength indicator */}
          {password && (
            <div className="mt-1.5 flex gap-1">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${password.length >= i * 2 ? (password.length >= 8 ? 'bg-green-500' : 'bg-yellow-400') : 'bg-[#E5E5E5]'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="register-confirm-password" className="block text-sm font-medium text-[#171717] mb-1">
            Confirm password
          </label>
          <input
            id="register-confirm-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: undefined })); }}
            placeholder="Re-enter password"
            aria-invalid={!!errors.confirmPassword}
            className={inputCls(!!errors.confirmPassword)}
          />
          {errors.confirmPassword && <p role="alert" className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
        </div>

        <button
          id="register-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#1886FF] hover:bg-[#62D0FF] active:bg-[#0D5BB8] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm mt-2"
        >
          {isLoading ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account…</>
          ) : 'Create account'}
        </button>

        <p className="text-xs text-[#737373] text-center">
          By signing up you agree to Rentify&apos;s{' '}
          <a href="#" className="text-[#1886FF] hover:underline">Terms</a>{' '}
          and{' '}
          <a href="#" className="text-[#1886FF] hover:underline">Privacy Policy</a>.
        </p>
      </form>

      <p className="mt-5 text-center text-sm text-[#737373]">
        Already have an account?{' '}
        <Link href="/(auth)/login" className="text-[#1886FF] hover:text-[#62D0FF] font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
