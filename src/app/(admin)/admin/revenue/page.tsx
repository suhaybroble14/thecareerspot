import { getRevenueSummary } from "@/lib/actions/admin";

export default async function RevenuePage() {
  const { totalRevenue, thisMonthRevenue, totalCount, recentBookings } =
    await getRevenueSummary();

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Revenue</h1>
      <p className="text-forest/50 text-sm mb-8">
        Earnings from day passes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">Total Revenue</p>
          <p className="font-serif text-3xl text-forest">£{totalRevenue.toFixed(2)}</p>
          <p className="text-forest/40 text-xs mt-1">All time</p>
        </div>
        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">This Month</p>
          <p className="font-serif text-3xl text-forest">£{thisMonthRevenue.toFixed(2)}</p>
          <p className="text-forest/40 text-xs mt-1">Day passes only</p>
        </div>
        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">Day Passes Sold</p>
          <p className="font-serif text-3xl text-forest">{totalCount}</p>
          <p className="text-forest/40 text-xs mt-1">All time</p>
        </div>
      </div>

      <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-4">Recent Payments</h2>

      {recentBookings.length === 0 ? (
        <div className="bg-white border border-forest/10 p-12 text-center">
          <p className="text-forest/40 text-sm">No payments yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-forest/10 divide-y divide-forest/5">
          {recentBookings.map((booking: Record<string, unknown>) => {
            const profile = booking.profiles as { full_name?: string; email?: string } | null;
            return (
              <div key={booking.id as string} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest font-medium">
                    {profile?.full_name || profile?.email || "Unknown"}
                  </p>
                  <p className="text-xs text-forest/40">
                    Day Pass —{" "}
                    {new Date((booking.booking_date as string) + "T00:00:00").toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-forest">
                    £{(booking.amount_paid as number).toFixed(2)}
                  </p>
                  <span
                    className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
                      booking.status === "cancellation_requested"
                        ? "bg-cocoa/20 text-cocoa"
                        : "bg-sage/20 text-sage"
                    }`}
                  >
                    {booking.status === "cancellation_requested" ? "Refund pending" : booking.status as string}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
