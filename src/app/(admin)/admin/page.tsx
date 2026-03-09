import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getTodayStats, getRecentCheckIns, getPendingRefundsForOverview, getRevenueSummary } from "@/lib/actions/admin";
import { redirect } from "next/navigation";
import RefundActions from "./RefundActions";

export default async function AdminOverviewPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect("/login");

  const [stats, recentCheckIns, pendingRefunds, revenue] = await Promise.all([
    getTodayStats().catch(() => ({ checkInsToday: 0, confirmedBookings: 0, activeMonthly: 0, pendingApplications: 0, maxCapacity: 14, currentOccupancy: 0 })),
    getRecentCheckIns().catch(() => []),
    getPendingRefundsForOverview().catch(() => []),
    getRevenueSummary().catch(() => ({ totalRevenue: 0, thisMonthRevenue: 0, totalCount: 0, recentBookings: [] })),
  ]);

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Admin Overview</h1>
      <p className="text-forest/50 text-sm mb-8">Today&apos;s snapshot of The Spot.</p>

      {/* ── REFUND REQUESTS ALERT ── */}
      {pendingRefunds.length > 0 && (
        <div className="mb-8 border-2 border-camel bg-camel/5 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-camel rounded-full flex items-center justify-center shrink-0">
              <span className="text-cocoa text-sm font-bold">{pendingRefunds.length}</span>
            </div>
            <div>
              <h2 className="font-serif text-xl text-forest">
                Refund Request{pendingRefunds.length !== 1 ? "s" : ""} Waiting
              </h2>
              <p className="text-forest/50 text-xs">Action required — approve or deny each request below</p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingRefunds.map((req) => {
              const profile = Array.isArray(req.profiles) ? req.profiles[0] : req.profiles;
              const formattedDate = new Date(req.booking_date + "T00:00:00").toLocaleDateString("en-GB", {
                weekday: "short", day: "numeric", month: "long",
              });
              const requestedOn = new Date(req.updated_at).toLocaleDateString("en-GB", {
                day: "numeric", month: "short",
              });

              return (
                <div key={req.id} className="bg-white border border-camel/20 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-forest font-medium">
                      {profile?.full_name || profile?.email || "Unknown"}
                    </p>
                    <p className="text-forest/50 text-xs">{profile?.email}</p>
                    <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-forest/60">
                      <span>Booking: <span className="text-forest">{formattedDate}</span></span>
                      <span>Amount: <span className="text-forest">£{req.amount_paid.toFixed(2)}</span></span>
                      <span>Requested: <span className="text-forest">{requestedOn}</span></span>
                    </div>
                    {req.refund_reason && (
                      <p className="text-xs text-forest/50 mt-1">
                        Reason: <span className="text-forest">{req.refund_reason}</span>
                      </p>
                    )}
                  </div>
                  <RefundActions bookingId={req.id} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── WHO'S IN THE BUILDING ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-forest">
            In The Building
            <span className="ml-2 text-base text-forest/40 font-sans font-normal">
              {recentCheckIns.length}/{stats.maxCapacity}
            </span>
          </h2>
          <Link
            href="/admin/check-in"
            className="bg-forest text-cream px-5 py-2 text-xs tracking-widest uppercase hover:bg-forest/80 transition-colors"
          >
            Scan Check-in
          </Link>
        </div>

        {recentCheckIns.length === 0 ? (
          <div className="bg-white border border-forest/10 p-8 text-center">
            <p className="text-forest/40 text-sm">Nobody checked in yet today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentCheckIns.map((checkIn: Record<string, unknown>) => {
              const profiles = checkIn.profiles as Record<string, string> | null;
              const name = profiles?.full_name || profiles?.email || "Unknown";
              const initials = name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={checkIn.id as string}
                  className="bg-white border border-forest/10 p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-sage text-sm font-semibold">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-forest font-medium text-sm truncate">{name}</p>
                    <p className="text-forest/40 text-xs capitalize">
                      {(checkIn.check_in_type as string)?.replace("_", " ")}
                    </p>
                  </div>
                  <p className="text-xs text-forest/40 shrink-0">
                    {new Date(checkIn.checked_in_at as string).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/revenue" className="bg-white border border-forest/10 p-5 hover:border-camel transition-colors">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">This Month</p>
          <p className="font-serif text-3xl text-forest">£{revenue.thisMonthRevenue.toFixed(0)}</p>
          <p className="text-forest/40 text-xs mt-1">£{revenue.totalRevenue.toFixed(0)} all time</p>
        </Link>

        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">Monthly</p>
          <p className="font-serif text-3xl text-forest">{stats.activeMonthly}</p>
          <p className="text-forest/40 text-xs mt-1">Active members</p>
        </div>

        <Link
          href="/admin/applications"
          className="bg-white border border-forest/10 p-5 hover:border-camel transition-colors"
        >
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">Applications</p>
          <p className="font-serif text-3xl text-forest">{stats.pendingApplications}</p>
          <p className="text-camel text-xs mt-1">Pending review</p>
        </Link>

        <Link
          href="/admin/refunds"
          className={`p-5 border transition-colors ${
            pendingRefunds.length > 0
              ? "bg-camel/10 border-camel hover:bg-camel/20"
              : "bg-white border-forest/10 hover:border-camel"
          }`}
        >
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">Refunds</p>
          <p className="font-serif text-3xl text-forest">{pendingRefunds.length}</p>
          <p className={`text-xs mt-1 ${pendingRefunds.length > 0 ? "text-camel font-medium" : "text-forest/40"}`}>
            {pendingRefunds.length > 0 ? "Action needed" : "All clear"}
          </p>
        </Link>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/calendar"
          className="border border-forest/20 text-forest px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest/5 transition-colors"
        >
          View Calendar
        </Link>
        <Link
          href="/admin/applications"
          className="border border-forest/20 text-forest px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest/5 transition-colors"
        >
          Applications
        </Link>
      </div>
    </>
  );
}
