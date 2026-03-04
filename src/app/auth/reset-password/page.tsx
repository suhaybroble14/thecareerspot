"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setDone(true);
      setTimeout(() => router.replace("/"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white border border-forest/10 px-5 py-4 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors";

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
        <div className="w-full max-w-md">
          <div className="bg-cream p-8 sm:p-10">
            {done ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h1 className="font-serif text-2xl text-forest mb-3">Password updated</h1>
                <p className="text-forest/60 text-sm">Your password has been changed. Redirecting you home...</p>
              </div>
            ) : (
              <>
                <h1 className="font-serif text-3xl text-forest mb-1">New password</h1>
                <p className="text-forest/60 text-sm mb-6">Choose a new password for your account.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">New password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className={inputCls}
                    />
                  </div>
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
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Set new password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
