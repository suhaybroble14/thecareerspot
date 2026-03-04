import Link from "next/link";
import { getCurrentUser, getUserProfile } from "@/lib/supabase/auth";
import { getUpcomingBooking } from "@/lib/actions/bookings";
import { getMyMembership, getMyApplicationStatus } from "@/lib/actions/memberships";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [profile, upcomingBooking, membership, application] = await Promise.all([
    getUserProfile(user.id).catch(() => null),
    getUpcomingBooking(),
    getMyMembership(),
    getMyApplicationStatus(),
  ]);

  const displayName = profile?.full_name || user.email?.split("@")[0] || "there";

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">
        Welcome back, {displayName}
      </h1>
      <p className="text-forest/50 text-sm mb-10">
        Here&apos;s what&apos;s happening with your account.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {/* Next booking */}
        <div className="bg-white border border-forest/10 p-6">
          <h3 className="text-xs tracking-widest uppercase text-forest/50 mb-3">
            Next Booking
          </h3>
          {upcomingBooking ? (
            <>
              <p className="font-serif text-2xl text-forest mb-1">
                {new Date(upcomingBooking.booking_date + "T00:00:00").toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <p className="text-forest/50 text-sm mb-4">Day Pass</p>
              <Link
                href="/dashboard/bookings"
                className="text-camel text-sm hover:underline"
              >
                View details
              </Link>
            </>
          ) : (
            <>
              <p className="text-forest/40 text-sm mb-4">
                No upcoming bookings
              </p>
              <Link
                href="/day-pass"
                className="text-camel text-sm hover:underline"
              >
                Book a day pass
              </Link>
            </>
          )}
        </div>

        {/* Membership status */}
        <div className="bg-white border border-forest/10 p-6">
          <h3 className="text-xs tracking-widest uppercase text-forest/50 mb-3">
            Membership
          </h3>
          {membership ? (
            <>
              <p className="font-serif text-2xl text-forest mb-1">Active</p>
              <p className="text-forest/50 text-sm mb-4">
                Expires{" "}
                {new Date(membership.expires_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <Link
                href="/dashboard/membership"
                className="text-camel text-sm hover:underline"
              >
                View membership
              </Link>
            </>
          ) : application ? (
            <>
              <p className="font-serif text-2xl text-forest mb-1 capitalize">
                {application.status.replace("_", " ")}
              </p>
              <p className="text-forest/50 text-sm mb-4">
                Application from{" "}
                {new Date(application.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <Link
                href="/dashboard/membership"
                className="text-camel text-sm hover:underline"
              >
                View details
              </Link>
            </>
          ) : (
            <>
              <p className="text-forest/40 text-sm mb-4">
                No active membership
              </p>
              <Link
                href="/membership/apply"
                className="text-camel text-sm hover:underline"
              >
                Apply for membership
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="font-serif text-xl text-forest mb-4">Quick actions</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/day-pass"
          className="bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors text-center"
        >
          Book Day Pass
        </Link>
        <Link
          href="/dashboard/bookings"
          className="border border-forest/20 text-forest px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest/5 transition-colors text-center"
        >
          My Bookings
        </Link>
        <Link
          href="/dashboard/profile"
          className="border border-forest/20 text-forest px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest/5 transition-colors text-center"
        >
          Edit Profile
        </Link>
      </div>
    </>
  );
}
