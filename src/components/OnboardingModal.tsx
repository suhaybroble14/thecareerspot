"use client";

import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
};

type Props = {
  user: User;
  onComplete: (profile: Profile) => void;
};

export default function OnboardingModal({ user, onComplete }: Props) {
  const meta = user.user_metadata ?? {};

  const [firstName, setFirstName] = useState<string>(meta.given_name ?? meta.full_name?.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState<string>(meta.family_name ?? meta.full_name?.split(" ").slice(1).join(" ") ?? "");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate max DOB for 18+ requirement
  const maxDobDate = new Date();
  maxDobDate.setFullYear(maxDobDate.getFullYear() - 18);
  const maxDobStr = maxDobDate.toISOString().split("T")[0];

  // Read pending signup data from localStorage and auto-save if name is already known
  useEffect(() => {
    try {
      const raw = localStorage.getItem("_tcs_pending");
      if (!raw) return;
      const pending = JSON.parse(raw);
      const fn = pending.first_name?.trim() || "";
      const ln = pending.last_name?.trim() || "";

      // If both names came from the signup form, save automatically — no extra click needed
      if (fn && ln) {
        const supabase = createClient();
        const fullName = `${fn} ${ln}`.trim();
        supabase.from("profiles").upsert(
          { id: user.id, email: user.email, first_name: fn, last_name: ln, full_name: fullName, dob: pending.dob || null, updated_at: new Date().toISOString() },
          { onConflict: "id" }
        ).then(({ error }) => {
          if (error) {
            setFirstName(fn);
            setLastName(ln);
            if (pending.dob) setDob(pending.dob);
          } else {
            localStorage.removeItem("_tcs_pending");
            onComplete({ first_name: fn, last_name: ln, full_name: fullName, email: user.email ?? null });
          }
        });
        return;
      }

      if (fn) setFirstName(fn);
      if (ln) setLastName(ln);
      if (pending.dob) setDob(pending.dob);
    } catch {
      // ignore malformed data
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (dob) {
      const dobDate = new Date(dob);
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      if (dobDate > eighteenYearsAgo) {
        setError("You must be at least 18 years old to create an account.");
        setLoading(false);
        return;
      }
    }

    try {
      const supabase = createClient();
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: fullName,
          dob: dob || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (error) throw error;
      localStorage.removeItem("_tcs_pending");
      onComplete({ first_name: firstName.trim(), last_name: lastName.trim(), full_name: fullName, email: user.email ?? null });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white border border-forest/10 px-4 py-3.5 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-forest/90 backdrop-blur-sm" />
      <div className="relative bg-cream w-full max-w-md p-8 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="font-serif text-3xl text-forest mb-2">Complete your profile</h2>
        <p className="text-forest/50 text-sm mb-7">Tell us a bit about yourself to finish setting up your account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <input type="date" required value={dob} max={maxDobStr} onChange={(e) => setDob(e.target.value)} className={inputCls} />
            <p className="text-forest/40 text-xs mt-1">You must be at least 18 years old.</p>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-forest/60 mb-2">Email</label>
            <input type="email" disabled value={user.email ?? ""} className="w-full bg-forest/5 border border-forest/10 px-4 py-3.5 text-sm text-forest/50 cursor-not-allowed" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Saving..." : "Complete Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
