"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "~/hooks/api/auth";
import { PasswordStrengthBar } from "./password-strength-bar";
import { RegisterInputField, EyeIcon } from "./register-input-field";
import { OAuthGroup } from "./oauth-buttons";
import { StackedBlocksDecor } from "./stacked-blocks-decor";

export function RegisterForm({ onGoLogin }: { onGoLogin: () => void }) {
  const router = useRouter();
  const { createUserWithEmailAndPasswordAsync, isPending } = useSignUp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!agreed) e.agreed = 'You must accept the terms to continue';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      await createUserWithEmailAndPasswordAsync({
        fullName: name,
        email,
        password,
      });
      setSubmitted(true);
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to create user account' });
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-12 text-center">
        <div className="w-16 h-16 rounded-xl bg-[rgba(106,191,60,0.12)] border border-[rgba(106,191,60,0.35)] flex items-center justify-center text-2xl">
          ✓
        </div>
        <div>
          <div className="text-[20px] font-extrabold text-[#eceae4] mb-2">
            Account created!
          </div>
          <div className="text-[14px] text-[#6e7a8a] leading-relaxed">
            Welcome to BlockForm, {name.split(' ')[0]}.
            <br />
            Redirecting you to sign in...
          </div>
        </div>
        <button
          onClick={() => router.push('/signin')}
          className="bg-[#6abf3c] text-[#0d1117] border-none rounded-lg px-7 py-3 text-[14px] font-bold font-['Outfit'] cursor-pointer hover:bg-[#7dd44a] transition-colors"
        >
          Go to Sign In →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        {errors.form && (
          <div className="p-3 bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] rounded-md text-[#f87171] text-[13px] leading-snug">
            ⚠ {errors.form}
          </div>
        )}

        {/* Name */}
        <RegisterInputField
          label="Full name"
          placeholder="Alex Johnson"
          value={name}
          onChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: '', form: '' })); }}
          autoComplete="name"
          error={errors.name}
        />

        {/* Email */}
        <RegisterInputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: '', form: '' })); }}
          autoComplete="email"
          error={errors.email}
        />

        {/* Password */}
        <div>
          <RegisterInputField
            label="Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={password}
            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: '', form: '' })); }}
            autoComplete="new-password"
            error={errors.password}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="bg-transparent border-none cursor-pointer p-0 flex items-center"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                <EyeIcon visible={showPw} />
              </button>
            }
          />
          <PasswordStrengthBar password={password} />
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <div className="relative shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, agreed: '', form: '' })); }}
                className="opacity-0 absolute w-0 h-0"
              />
              <div
                className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-all [image-rendering:pixelated] ${
                  agreed
                    ? 'bg-[#6abf3c] border-[#6abf3c]'
                    : errors.agreed
                    ? 'bg-[#0d1117] border-[#dc2626]'
                    : 'bg-[#0d1117] border-[#2d3741]'
                }`}
              >
                {agreed && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#0d1117" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[13px] text-[#8b9ab0] leading-snug">
              I agree to the{' '}
              <a href="#" className="text-[#6abf3c] no-underline hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#6abf3c] no-underline hover:underline">Privacy Policy</a>
            </span>
          </label>
          {errors.agreed && (
            <div className="text-[12px] text-[#dc2626] mt-1.5 ml-7">
              ⚠ {errors.agreed}
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div>
          <div className="font-['Press_Start_2P'] text-[7px] text-[#4e5a6a] tracking-widest mb-2 text-center">
            READY TO BUILD?
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3.5 px-6 border-none rounded-lg text-[15px] font-bold font-['Outfit'] text-[#0d1117] flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(106,191,60,0.25)] ${
              isPending
                ? 'bg-[#4a8a28] cursor-not-allowed'
                : 'bg-[#6abf3c] cursor-pointer hover:bg-[#7dd44a] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(106,191,60,0.38)]'
            }`}
          >
            {isPending ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="animate-spin"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Building your account...
              </>
            ) : (
              <>
                Create Account
                <span className="text-[18px]">→</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#21262d]" />
          <span className="text-[11px] text-[#4e5a6a] font-semibold tracking-wider whitespace-nowrap">
            OR CONTINUE WITH
          </span>
          <div className="flex-1 h-px bg-[#21262d]" />
        </div>

        {/* OAuth */}
        <OAuthGroup />

        {/* Login link */}
        <p className="m-0 text-center text-[13px] text-[#6e7a8a]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onGoLogin}
            className="bg-transparent border-none text-[#6abf3c] font-bold text-[13px] cursor-pointer font-['Outfit'] p-0 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </form>
  );
}

export function RegisterRightPanel() {
  const router = useRouter();

  return (
    <div className="register-right flex-1 flex flex-col justify-center p-6 md:p-12 bg-[#0d1117] border-l border-[#21262d] overflow-y-auto relative">
      {/* Mobile logo */}
      <div className="register-logo-mobile hidden items-center gap-2.5 mb-8">
        <div className="flex gap-0.5">
          <div className="w-2.5 h-2.5 bg-[#6abf3c] rounded-xs" />
          <div className="w-2.5 h-2.5 bg-[#4e9c2e] rounded-xs mt-1" />
        </div>
        <span className="font-['Press_Start_2P'] text-[12px] text-[#eceae4]">
          Block<span className="text-[#6abf3c]">Form</span>
        </span>
      </div>

      {/* Decorative blocks — top right corner */}
      <div className="absolute top-5 right-5">
        <StackedBlocksDecor />
      </div>

      {/* Card */}
      <div className="max-w-[420px] w-full mx-auto">
        {/* Card header */}
        <div className="mb-8">
          {/* Pixel tag */}
          <div className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 bg-[rgba(106,191,60,0.08)] border border-[rgba(106,191,60,0.18)] rounded-md">
            <svg width="8" height="8" viewBox="0 0 8 8" className="[image-rendering:pixelated]">
              <rect x="0" y="0" width="4" height="4" fill="#6abf3c" />
              <rect x="4" y="4" width="4" height="4" fill="#4e9c2e" />
              <rect x="4" y="0" width="4" height="4" fill="#3d7020" />
              <rect x="0" y="4" width="4" height="4" fill="#5aad32" />
            </svg>
            <span className="font-['Press_Start_2P'] text-[7px] text-[#6abf3c] tracking-wider">
              NEW ACCOUNT
            </span>
          </div>

          <h1 className="m-0 mb-2.5 text-[26px] font-extrabold text-[#eceae4] tracking-[-0.5px] leading-tight">
            Create your account
          </h1>
          <p className="m-0 text-[14px] text-[#6e7a8a] leading-relaxed">
            Start building your first form in minutes.
          </p>
        </div>

        {/* Registration form */}
        <RegisterForm onGoLogin={() => router.push('/signin')} />
      </div>

      {/* Footer note */}
      <div className="absolute bottom-5 left-0 right-0 text-center text-[11px] text-[#2d3741]">
        © 2024 BlockForm · Built block by block
      </div>
    </div>
  );
}
