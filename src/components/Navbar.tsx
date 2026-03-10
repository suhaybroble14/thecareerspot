"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import LoginModal from "@/components/LoginModal";
import OnboardingModal from "@/components/OnboardingModal";

type Profile = {
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/events", label: "Events" },
  { href: "/hire", label: "Hire" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState("/");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body overflow when mobile open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auth state — eagerly load session on mount, then subscribe to changes
  useEffect(() => {
    const supabase = createClient();

    async function handleUser(currentUser: User | null) {
      setUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("first_name, last_name, full_name, email")
          .eq("id", currentUser.id)
          .single();

        setProfile(data ?? null);

        const hasName =
          data?.full_name ||
          data?.first_name ||
          currentUser.user_metadata?.full_name ||
          currentUser.user_metadata?.name;
        if (!hasName) {
          setShowOnboarding(true);
        }
      } else {
        setProfile(null);
        setShowOnboarding(false);
      }
    }

    // 1. Eagerly read the session from cookies so the header updates instantly
    //    after an OAuth/magic-link redirect without waiting for the WS event.
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        handleUser(session?.user ?? null);
      })
      .catch(() => {
        // Session check failed — Sign In button already visible, nothing to do
      });

    // 2. Keep listening for sign-in / sign-out / token-refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Listen for modal open event from other components
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setLoginRedirect(detail?.redirectTo ?? "/dashboard");
      setShowLogin(true);
    };
    window.addEventListener("openLoginModal", handler);
    return () => window.removeEventListener("openLoginModal", handler);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowDropdown(false);
    setMobileOpen(false);
    window.location.href = "/";
  };

  const displayName =
    profile?.full_name ||
    (profile?.first_name
      ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
      : null) ||
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Account";

  const firstName =
    profile?.first_name ||
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    displayName.split(" ")[0];

  // Auth button for desktop
  const AuthDesktop = () => {
    if (!user) {
      return (
        <button
          onClick={() => { setLoginRedirect("/"); setShowLogin(true); }}
          className="bg-camel text-forest text-sm tracking-widest uppercase px-6 py-2.5 hover:bg-camel/90 transition-colors duration-300"
        >
          Sign In
        </button>
      );
    }
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <span className="w-8 h-8 rounded-full bg-camel flex items-center justify-center text-forest text-xs font-bold tracking-wide shrink-0">
            {displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
          </span>
          <span className="text-cream text-sm tracking-wide hidden lg:block">Welcome, {firstName}</span>
          <svg className={`w-3 h-3 text-cream/60 transition-transform ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-cream shadow-xl border border-forest/10 z-50"
            >
              <div className="px-4 py-3 border-b border-forest/10">
                <p className="text-xs text-forest/40 uppercase tracking-widest">Signed in as</p>
                <p className="text-sm text-forest font-medium truncate mt-0.5">{user.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setShowDropdown(false)}
                className="block px-4 py-3 text-sm text-forest hover:bg-forest/5 transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setShowDropdown(false)}
                className="block px-4 py-3 text-sm text-forest hover:bg-forest/5 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 text-sm text-cocoa hover:bg-forest/5 transition-colors border-t border-forest/10"
              >
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-forest/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="group flex items-center">
            <Image
              src="/logo-circle.jpeg"
              alt="The Spot — Work Create Connect"
              width={48}
              height={48}
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/80 hover:text-cream text-sm tracking-widest uppercase transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-camel after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
            <AuthDesktop />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 z-50"
            aria-label="Toggle menu"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-6 h-[2px] bg-cream" />
            <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-6 h-[2px] bg-cream" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-6 h-[2px] bg-cream" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-forest flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={link.href} onClick={() => setMobileOpen(false)} className="text-cream font-serif text-3xl tracking-wide hover:text-camel transition-colors">
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: navLinks.length * 0.1 }} className="flex flex-col items-center gap-3">
              {user ? (
                <>
                  <p className="text-cream/60 text-sm tracking-wide">Welcome, {firstName}</p>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="bg-camel text-forest px-8 py-3 text-sm tracking-widest uppercase hover:bg-camel/90 transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="text-cream/50 text-sm hover:text-cream transition-colors">
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setLoginRedirect("/dashboard"); setShowLogin(true); }}
                  className="bg-camel text-forest px-8 py-3 text-sm tracking-widest uppercase hover:bg-camel/90 transition-colors"
                >
                  Sign In
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} redirectTo={loginRedirect} />}
      {showOnboarding && user && (
        <OnboardingModal
          user={user}
          onComplete={(p) => { setProfile(p); setShowOnboarding(false); }}
        />
      )}
    </>
  );
}
