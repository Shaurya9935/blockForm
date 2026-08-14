"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "~/hooks/api/auth";
import { RegisterInputField, EyeIcon } from "~/components/register/register-input-field";
import { OAuthGroup } from "~/components/register/oauth-buttons";
import { StackedBlocksDecor } from "~/components/register/stacked-blocks-decor";

export function SignInForm({ onGoSignup }: { onGoSignup?: () => void }) {
  const router = useRouter();
  const { signInUserWithEmailAndPasswordAsync, isPending } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
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
      await signInUserWithEmailAndPasswordAsync({
        email,
        password,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setErrors({ form: err?.message || 'Invalid email or password' });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        {errors.form && (
          <div className="p-3 bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] rounded-md text-[#f87171] text-[13px] leading-snug">
            ⚠ {errors.form}
          </div>
        )}

        {/* Email */}
        <RegisterInputField
          label="Email address"
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
            placeholder="Enter your password"
            value={password}
            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: '', form: '' })); }}
            autoComplete="current-password"
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
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between mt-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative shrink-0">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="opacity-0 absolute w-0 h-0"
              />
              <div
                className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-all [image-rendering:pixelated] ${
                  rememberMe ? 'bg-[#6abf3c] border-[#6abf3c]' : 'bg-[#0d1117] border-[#2d3741]'
                }`}
              >
                {rememberMe && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#0d1117" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[13px] text-[#8b9ab0]">Remember me</span>
          </label>

          <a href="#" className="text-[13px] text-[#6abf3c] no-underline font-semibold hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Submit CTA */}
        <div className="mt-1">
          <div className="font-['Press_Start_2P'] text-[7px] text-[#4e5a6a] tracking-widest mb-2 text-center">
            WELCOME BACK
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
                Signing in...
              </>
            ) : (
              <>
                Sign In
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

        {/* Signup link */}
        <p className="m-0 text-center text-[13px] text-[#6e7a8a]">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onGoSignup || (() => router.push('/signup'))}
            className="bg-transparent border-none text-[#6abf3c] font-bold text-[13px] cursor-pointer font-['Outfit'] p-0 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
}

export function SignInRightPanel() {
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
              SIGN IN
            </span>
          </div>

          <h1 className="m-0 mb-2.5 text-[26px] font-extrabold text-[#eceae4] tracking-[-0.5px] leading-tight">
            Welcome back
          </h1>
          <p className="m-0 text-[14px] text-[#6e7a8a] leading-relaxed">
            Sign in to continue building your forms.
          </p>
        </div>

        {/* Sign in form */}
        <SignInForm onGoSignup={() => router.push('/signup')} />
      </div>

      {/* Footer note */}
      <div className="absolute bottom-5 left-0 right-0 text-center text-[11px] text-[#2d3741]">
        © 2024 BlockForm · Built block by block
      </div>
    </div>
  );
}
