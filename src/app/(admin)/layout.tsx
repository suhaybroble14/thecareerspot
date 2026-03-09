"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getNotificationCounts } from "@/lib/actions/admin";

type Notifications = Awaited<ReturnType<typeof getNotificationCounts>>;

const adminLinks = [
  {
    href: "/admin",
    label: "Overview",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: "/admin/check-in",
    label: "Check In",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
      </svg>
    ),
  },
  {
    href: "/admin/applications",
    label: "Applications",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    href: "/admin/calendar",
    label: "Calendar",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    href: "/admin/refunds",
    label: "Refunds",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    href: "/admin/revenue",
    label: "Revenue",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/hire",
    label: "Hire Enquiries",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notifications>({
    pendingRefunds: 0,
    todaysPurchases: [],
  });
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotificationCounts();
      setNotifications(data);
    } catch {
      // fail silently
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {adminLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition-colors ${
            isActive(link.href)
              ? "bg-cream/15 text-cream"
              : "text-cream/50 hover:bg-cream/5 hover:text-cream/80"
          }`}
        >
          {link.icon}
          {link.label}
          {link.href === "/admin/refunds" && notifications.pendingRefunds > 0 && (
            <span className="ml-auto w-5 h-5 bg-camel text-cocoa text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
              {notifications.pendingRefunds > 9 ? "9+" : notifications.pendingRefunds}
            </span>
          )}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-forest/[0.03]">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cocoa h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-serif text-xl tracking-wide text-cream">
            THE{" "}
            <span className="font-bold">
              SP<span className="text-camel">O</span>T
            </span>
          </Link>
          <span className="text-xs tracking-widest uppercase text-cream/40 hidden sm:inline">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden sm:inline text-cream/60 text-sm hover:text-cream transition-colors"
          >
            Member view
          </Link>
          <Link
            href="/"
            className="hidden sm:inline text-cream/60 text-sm hover:text-cream transition-colors"
          >
            Site
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-cream/60 text-sm hover:text-cream transition-colors"
            >
              Sign out
            </button>
          </form>

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative text-cream/60 hover:text-cream transition-colors p-1"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {notifications.pendingRefunds > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-camel text-cocoa text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications.pendingRefunds > 9 ? "9+" : notifications.pendingRefunds}
                </span>
              )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white shadow-xl border border-forest/10 z-50"
                >
                  <div className="px-4 py-3 border-b border-forest/10 flex items-center justify-between">
                    <p className="text-xs tracking-widest uppercase text-forest/50 font-medium">Notifications</p>
                    <button
                      onClick={fetchNotifications}
                      className="text-xs text-forest/30 hover:text-forest transition-colors"
                    >
                      Refresh
                    </button>
                  </div>

                  {/* Pending refunds */}
                  {notifications.pendingRefunds > 0 && (
                    <Link href="/admin/refunds" onClick={() => setNotifOpen(false)}>
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-forest/5 transition-colors border-b border-forest/5">
                        <div className="w-8 h-8 bg-camel/20 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-camel text-xs font-bold">{notifications.pendingRefunds}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-forest font-medium">
                            Refund request{notifications.pendingRefunds !== 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-forest/50">
                            {notifications.pendingRefunds} pending your review
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-forest/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </Link>
                  )}

                  {/* Today's purchases */}
                  {notifications.todaysPurchases.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-forest/[0.03] border-b border-forest/5">
                        <p className="text-[10px] tracking-widest uppercase text-forest/40">
                          Today&apos;s day passes
                        </p>
                      </div>
                      {notifications.todaysPurchases.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between px-4 py-3 border-b border-forest/5"
                        >
                          <div>
                            <p className="text-sm text-forest">
                              {p.profiles?.full_name || p.profiles?.email || "Unknown"}
                            </p>
                            <p className="text-xs text-forest/50">
                              £{p.amount_paid.toFixed(2)} ·{" "}
                              {new Date(p.created_at).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <span className="text-[10px] tracking-widest uppercase px-2 py-1 bg-sage/10 text-sage shrink-0">
                            Paid
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {notifications.pendingRefunds === 0 && notifications.todaysPurchases.length === 0 && (
                    <div className="px-4 py-8 text-center">
                      <p className="text-forest/40 text-sm">All caught up.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-cream p-1"
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {mobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-60 fixed top-16 bottom-0 bg-cocoa/95 py-6 px-3">
          <nav className="flex flex-col gap-1">
            <NavLinks />
          </nav>
        </aside>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-16 left-0 right-0 z-40 bg-cocoa border-b border-cream/10 md:hidden"
            >
              <nav className="flex flex-col p-3">
                <NavLinks onLinkClick={() => setMobileNavOpen(false)} />
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 md:ml-60 min-h-[calc(100vh-4rem)]">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
