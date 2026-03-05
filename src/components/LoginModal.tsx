"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  onClose: () => void;
  redirectTo?: string;
};

export default function LoginModal({ onClose, redirectTo = "/" }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
      : `/auth/callback?next=${encodeURIComponent(redirectTo)}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (mode === "signup") {
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        if (dob) {
          const eighteenYearsAgo = new Date();
          eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
          if (new Date(dob) > eighteenYearsAgo) {
            setError("You must be at least 18 years old to create an account.");
            return;
          }
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        // Save extra fields so OnboardingModal can persist them after confirmation
        localStorage.setItem(
          "_tcs_pending",
          JSON.stringify({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            dob,
          })
        );

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: callbackUrl,
            data: {
              full_name: fullName,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            },
          },
        });

        if (signUpError) throw signUpError;

        // If Supabase has email confirmation disabled, session is available immediately
        if (data.session) {
          onClose();
          window.location.href = redirectTo;
          return;
        }

        // Otherwise user must click the confirmation link
        setAwaitingConfirm(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          // Email exists but not yet confirmed — show resend screen
          if (signInError.message.toLowerCase().includes("email not confirmed")) {
            setAwaitingConfirm(true);
            return;
          }
          throw signInError;
        }
        onClose();
        window.location.href = redirectTo;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      // Rate limit hit — show a friendly message
      if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("too many")) {
        setError("Too many emails sent. Please wait a few minutes then try again, or check your spam folder.");
      } else if (msg.toLowerCase().includes("user already registered")) {
        setError("An account with this email already exists. Use Sign In instead.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Please enter your email address first."); return; }
    setResetLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const resetUrl = typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/auth/reset-password`
        : `/auth/callback?next=/auth/reset-password`;
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: resetUrl });
      setResetSent(true);
    } catch {
      setResetSent(true); // show sent state regardless
    } finally {
      setResetLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSent(false);
    try {
      const supabase = createClient();
      await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: callbackUrl } });
      setResendSent(true);
    } catch {
      // ignore — just show sent state anyway
      setResendSent(true);
    } finally {
      setResendLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white border border-forest/10 px-5 py-3.5 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors";

  const maxDobDate = new Date();
  maxDobDate.setFullYear(maxDobDate.getFullYear() - 18);
  const maxDobStr = maxDobDate.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-forest/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-cream w-full max-w-md p-8 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-forest/40 hover:text-forest transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {forgotPassword ? (
          <div className="text-center py-4">
            {resetSent ? (
              <>
                <div className="w-14 h-14 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl text-forest mb-2">Check your email</h2>
                <p className="text-forest/60 text-sm leading-relaxed mb-5">
                  We sent a password reset link to <span className="font-medium text-forest">{email}</span>.
                </p>
                <button onClick={() => { setForgotPassword(false); setResetSent(false); setError(""); }}
                  className="text-forest/50 text-xs hover:text-forest transition-colors tracking-widest uppercase">
                  Back to sign in
                </button>
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl text-forest mb-2">Reset password</h2>
                <p className="text-forest/60 text-sm leading-relaxed mb-5">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white border border-forest/10 px-5 py-3.5 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors mb-3"
                />
                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                <button onClick={handleForgotPassword} disabled={resetLoading}
                  className="w-full bg-forest text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest/90 transition-colors disabled:opacity-50 mb-3">
                  {resetLoading ? "Sending..." : "Send reset link"}
                </button>
                <button onClick={() => { setForgotPassword(false); setError(""); }}
                  className="text-forest/50 text-xs hover:text-forest transition-colors tracking-widest uppercase">
                  Back to sign in
                </button>
              </>
            )}
          </div>
        ) : awaitingConfirm ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-forest mb-2">Confirm your email</h2>
            <p className="text-forest/60 text-sm leading-relaxed mb-5">
              We sent a confirmation link to <span className="font-medium text-forest">{email}</span>. Click it to activate your account.
            </p>
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="w-full bg-forest text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest/90 transition-colors disabled:opacity-50 mb-3"
            >
              {resendLoading ? "Sending..." : resendSent ? "Email sent again!" : "Resend confirmation email"}
            </button>
            <button
              onClick={() => { setAwaitingConfirm(false); setEmail(""); setPassword(""); setConfirmPassword(""); setResendSent(false); }}
              className="text-forest/50 text-xs hover:text-forest transition-colors tracking-widest uppercase"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            {/* Mode toggle */}
            <div className="flex border border-forest/10 mb-7">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  className={`flex-1 py-2.5 text-xs tracking-widest uppercase transition-colors ${
                    mode === m ? "bg-forest text-cream" : "text-forest/50 hover:text-forest"
                  }`}
                >
                  {m === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <h2 className="font-serif text-3xl text-forest mb-1">
              {mode === "signin" ? "Welcome back" : "Join The Spot"}
            </h2>
            <p className="text-forest/50 text-sm mb-6">
              {mode === "signin"
                ? "Sign in to your account to continue."
                : "Create your account to book a day pass or apply for membership."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-forest/60 mb-1.5">First name *</label>
                      <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-forest/60 mb-1.5">Last name *</label>
                      <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-forest/60 mb-1.5">Date of birth *</label>
                    <input type="date" required value={dob} max={maxDobStr} onChange={(e) => setDob(e.target.value)} className={inputCls} />
                    <p className="text-forest/40 text-xs mt-1">You must be at least 18 years old.</p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs tracking-widest uppercase text-forest/60 mb-1.5">Email address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-forest/60 mb-1.5">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min. 6 characters" : "Your password"}
                  className={inputCls}
                />
              </div>

              {mode === "signin" && (
                <div className="text-right -mt-2">
                  <button type="button" onClick={() => { setForgotPassword(true); setError(""); }}
                    className="text-camel text-xs hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/60 mb-1.5">Confirm password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={inputCls}
                  />
                </div>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? mode === "signup" ? "Creating account..." : "Signing in..."
                  : mode === "signup" ? "Create account" : "Sign in"}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-forest/10 text-center">
              <p className="text-forest/40 text-xs">
                {mode === "signin" ? "No account? " : "Already have an account? "}
                <button
                  onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
                  className="text-camel hover:underline font-medium"
                >
                  {mode === "signin" ? "Create one" : "Sign in"}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
