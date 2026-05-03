'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mockForgotPassword } from '@/mocks/auth';

/** S-18 — Forgot Password Page | Route: /(auth)/forgot-password */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    if (!email.trim()) { setEmailError('Email is required.'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Enter a valid email address.'); return false; }
    setEmailError('');
    return true;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      // PHASE4-SWAP: Replace mockForgotPassword with real Supabase resetPasswordForEmail
      await mockForgotPassword(email);
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#E4F9FF]">
          <svg className="w-8 h-8 text-[#1886FF]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#171717] mb-2">Check your inbox</h2>
        <p className="text-sm text-[#737373] mb-1">
          If an account exists for <span className="font-medium text-[#171717]">{email}</span>,
        </p>
        <p className="text-sm text-[#737373] mb-6">
          we&apos;ve sent a password reset link.
        </p>
        <Link
          href="/(auth)/login"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1886FF] hover:bg-[#62D0FF] transition-all"
        >
          Back to Login
        </Link>
        <p className="mt-4 text-xs text-[#737373]">
          Didn&apos;t receive it?{' '}
          <button
            type="button"
            onClick={() => { setSubmitted(false); }}
            className="text-[#1886FF] hover:underline"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href="/(auth)/login"
          className="inline-flex items-center gap-1 text-sm text-[#737373] hover:text-[#1886FF] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to login
        </Link>
        <h1 className="text-2xl font-bold text-[#171717] mb-1">Forgot your password?</h1>
        <p className="text-sm text-[#737373]">
          No worries — enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form id="forgot-password-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-[#171717] mb-1">
            Email address
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
            placeholder="you@example.com"
            aria-invalid={!!emailError}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
              emailError
                ? 'border-red-400 focus:ring-red-200 bg-red-50'
                : 'border-[#E5E5E5] focus:ring-[#62D0FF] focus:border-[#1886FF]'
            }`}
          />
          {emailError && (
            <p role="alert" className="mt-1 text-xs text-red-600">{emailError}</p>
          )}
        </div>

        <button
          id="forgot-password-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#1886FF] hover:bg-[#62D0FF] active:bg-[#0D5BB8] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {isLoading ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending link…</>
          ) : 'Send reset link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#737373]">
        Remembered it?{' '}
        <Link href="/(auth)/login" className="text-[#1886FF] hover:text-[#62D0FF] font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
