import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getMyBookings } from "@/lib/actions/bookings";
import { redirect } from "next/navigation";
import BookingCard from "./BookingCard";

export default async function BookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const bookings = await getMyBookings();

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && b.booking_date >= new Date().toISOString().split("T")[0]
  );
  const past = bookings.filter(
    (b) => b.status !== "confirmed" || b.booking_date < new Date().toISOString().split("T")[0]
  );

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">My Bookings</h1>
      <p className="text-forest/50 text-sm mb-10">
        View your day pass bookings and QR codes.
      </p>

      {bookings.length === 0 ? (
        <div className="bg-white border border-forest/10 p-12 text-center">
          <p className="text-forest/40 mb-6">You don&apos;t have any bookings yet.</p>
          <Link
            href="/day-pass"
            className="bg-forest text-cream px-8 py-3 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors inline-block"
          >
            Book a Day Pass
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-4">
                Upcoming
              </h2>
              <div className="space-y-4">
                {upcoming.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showQR />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-4">
                Past & Cancelled
              </h2>
              <div className="space-y-4">
                {past.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
