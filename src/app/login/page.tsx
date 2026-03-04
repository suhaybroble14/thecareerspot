"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get("next") ?? "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already-logged-in users
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(next);
    });
  }, [next, router]);

  const callbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      : `/auth/callback?next=${encodeURIComponent(next)}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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

        if (data.session) {
          router.replace(next);
          return;
        }

        setAwaitingConfirm(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          if (signInError.message.toLowerCase().includes("email not confirmed")) {
            setAwaitingConfirm(true);
            return;
          }
          throw signInError;
        }
        router.replace(next);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
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
    setError(null);
    try {
      const supabase = createClient();
      const resetUrl = typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/auth/reset-password`
        : `/auth/callback?next=/auth/reset-password`;
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: resetUrl });
      setResetSent(true);
    } catch {
      setResetSent(true);
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
      setResendSent(true);
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setGoogleLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white border border-forest/10 px-5 py-4 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors";

  if (forgotPassword) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-cream p-8 sm:p-10 text-center">
          {resetSent ? (
            <>
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <h1 className="font-serif text-2xl text-forest mb-3">Check your email</h1>
              <p className="text-forest/60 text-sm leading-relaxed mb-6">
                We sent a password reset link to <span className="font-medium text-forest">{email}</span>.
              </p>
              <button onClick={() => { setForgotPassword(false); setResetSent(false); setError(null); }}
                className="text-forest/50 text-sm hover:text-forest transition-colors">
                Back to sign in
              </button>
            </>
          ) : (
            <>
              <h1 className="font-serif text-2xl text-forest mb-3">Reset password</h1>
              <p className="text-forest/60 text-sm leading-relaxed mb-6">
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-forest/10 px-5 py-4 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors mb-3"
              />
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
              <button onClick={handleForgotPassword} disabled={resetLoading}
                className="w-full bg-forest text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest/90 transition-colors disabled:opacity-50 mb-3">
                {resetLoading ? "Sending..." : "Send reset link"}
              </button>
              <button onClick={() => { setForgotPassword(false); setError(null); }}
                className="text-forest/50 text-sm hover:text-forest transition-colors">
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (awaitingConfirm) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-cream p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-forest mb-3">Confirm your email</h1>
          <p className="text-forest/60 text-sm leading-relaxed mb-6">
            We sent a confirmation link to <span className="font-medium text-forest">{email}</span>. Click it to activate your account and sign in.
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
            className="text-forest/50 text-sm hover:text-forest transition-colors"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-cream p-8 sm:p-10">
        {/* Mode toggle */}
        <div className="flex border border-forest/10 mb-7">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              className={`flex-1 py-2.5 text-xs tracking-widest uppercase transition-colors ${
                mode === m ? "bg-forest text-cream" : "text-forest/50 hover:text-forest"
              }`}
            >
              {m === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <h1 className="font-serif text-3xl text-forest mb-1">
          {mode === "signin" ? "Welcome back" : "Join The Spot"}
        </h1>
        <p className="text-forest/60 text-sm mb-6">
          {mode === "signin"
            ? "Sign in to your account to continue."
            : "Create your account to book a day pass or apply for membership."}
        </p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-forest/15 bg-white px-6 py-3.5 text-sm text-forest hover:bg-forest/5 transition-colors duration-200 disabled:opacity-50 mb-5"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-forest/10" />
          <span className="text-forest/30 text-xs">or</span>
          <div className="flex-1 h-px bg-forest/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">First name *</label>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Last name *</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Date of birth *</label>
                <input type="date" required value={dob} max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().split("T")[0]; })()} onChange={(e) => setDob(e.target.value)} className={inputCls} />
                <p className="text-forest/40 text-xs mt-1">You must be at least 18 years old.</p>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Email address *</label>
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
            <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Password *</label>
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
              <button type="button" onClick={() => { setForgotPassword(true); setError(null); }}
                className="text-camel text-xs hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Confirm password *</label>
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

        <div className="mt-6 pt-5 border-t border-forest/10 text-center">
          <p className="text-forest/40 text-xs">
            {mode === "signin" ? "No account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
              className="text-camel hover:underline font-medium"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-cream/50 text-sm hover:text-cream transition-colors">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-forest flex flex-col">
      <div className="p-6">
        <Link href="/" className="inline-block">
          <span className="font-serif text-2xl tracking-wide text-cream">
            THE <span className="font-bold">SP<span className="text-sage">O</span>T</span>
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <Suspense fallback={<div className="text-cream">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
