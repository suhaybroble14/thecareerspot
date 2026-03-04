import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getTodayStats, getRecentCheckIns } from "@/lib/actions/admin";
import { redirect } from "next/navigation";

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stats = await getTodayStats();
  const recentCheckIns = await getRecentCheckIns();

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Admin Overview</h1>
      <p className="text-forest/50 text-sm mb-8">
        Today&apos;s snapshot of The Spot.
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">
            Capacity
          </p>
          <p className="font-serif text-3xl text-forest">
            {stats.currentOccupancy}
            <span className="text-lg text-forest/40">/{stats.maxCapacity}</span>
          </p>
          <p className="text-forest/40 text-xs mt-1">Checked in today</p>
        </div>

        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">
            Day Passes
          </p>
          <p className="font-serif text-3xl text-forest">
            {stats.confirmedBookings}
          </p>
          <p className="text-forest/40 text-xs mt-1">Booked today</p>
        </div>

        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">
            Monthly
          </p>
          <p className="font-serif text-3xl text-forest">
            {stats.activeMonthly}
          </p>
          <p className="text-forest/40 text-xs mt-1">Active members</p>
        </div>

        <Link
          href="/admin/applications"
          className="bg-white border border-forest/10 p-5 hover:border-camel transition-colors"
        >
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">
            Applications
          </p>
          <p className="font-serif text-3xl text-forest">
            {stats.pendingApplications}
          </p>
          <p className="text-camel text-xs mt-1">Pending review</p>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href="/admin/check-in"
          className="bg-forest text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors"
        >
          Scan Check-in
        </Link>
        <Link
          href="/admin/applications"
          className="border border-forest/20 text-forest px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest/5 transition-colors"
        >
          Review Applications
        </Link>
        <Link
          href="/admin/calendar"
          className="border border-forest/20 text-forest px-6 py-3 text-sm tracking-widest uppercase hover:bg-forest/5 transition-colors"
        >
          View Calendar
        </Link>
      </div>

      {/* Recent check-ins */}
      <div>
        <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-4">
          Today&apos;s Check-ins
        </h2>
        {recentCheckIns.length === 0 ? (
          <div className="bg-white border border-forest/10 p-8 text-center">
            <p className="text-forest/40 text-sm">No check-ins today yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-forest/10 divide-y divide-forest/5">
            {recentCheckIns.map((checkIn: Record<string, unknown>) => {
              const profiles = checkIn.profiles as Record<string, string> | null;
              return (
                <div
                  key={checkIn.id as string}
                  className="px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-forest font-medium">
                      {profiles?.full_name || profiles?.email || "Unknown"}
                    </p>
                    <p className="text-xs text-forest/40 capitalize">
                      {(checkIn.check_in_type as string)?.replace("_", " ")}
                    </p>
                  </div>
                  <p className="text-xs text-forest/40">
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
    </>
  );
}
