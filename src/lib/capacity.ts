import { createClient } from "./supabase/server";

const DEFAULT_CAPACITY = 8;

export type DayAvailability = {
  date: string;
  total: number;
  activeMonthly: number;
  bookedDayPasses: number;
  available: number;
};

export async function getAvailability(date: string): Promise<DayAvailability> {
  const supabase = await createClient();

  // 1. Check for capacity override on this date
  const { data: override } = await supabase
    .from("capacity_overrides")
    .select("max_capacity")
    .eq("override_date", date)
    .single();

  const total = override?.max_capacity ?? DEFAULT_CAPACITY;

  // 2. Count active monthly memberships
  const now = new Date().toISOString();
  const { count: activeMonthly } = await supabase
    .from("memberships")
    .select("*", { count: "exact", head: true })
    .eq("membership_type", "30_day")
    .eq("is_active", true)
    .gte("expires_at", now);

  // 3. Count confirmed day pass bookings for this date
  const { count: bookedDayPasses } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("booking_date", date)
    .in("status", ["confirmed", "checked_in"]);

  const monthlyCount = activeMonthly ?? 0;
  const dayPassCount = bookedDayPasses ?? 0;
  const available = Math.max(0, total - monthlyCount - dayPassCount);

  return {
    date,
    total,
    activeMonthly: monthlyCount,
    bookedDayPasses: dayPassCount,
    available,
  };
}

export async function getAvailabilityRange(
  startDate: string,
  endDate: string
): Promise<DayAvailability[]> {
  const supabase = await createClient();

  // Get capacity overrides for the range
  const { data: overrides } = await supabase
    .from("capacity_overrides")
    .select("override_date, max_capacity")
    .gte("override_date", startDate)
    .lte("override_date", endDate);

  const overrideMap = new Map<string, number>();
  overrides?.forEach((o) => {
    overrideMap.set(o.override_date, o.max_capacity);
  });

  // Count active monthly memberships (same for all days)
  const now = new Date().toISOString();
  const { count: activeMonthly } = await supabase
    .from("memberships")
    .select("*", { count: "exact", head: true })
    .eq("membership_type", "30_day")
    .eq("is_active", true)
    .gte("expires_at", now);

  const monthlyCount = activeMonthly ?? 0;

  // Get all confirmed bookings in the date range
  const { data: bookings } = await supabase
    .from("bookings")
    .select("booking_date")
    .gte("booking_date", startDate)
    .lte("booking_date", endDate)
    .in("status", ["confirmed", "checked_in"]);

  // Count bookings per date
  const bookingCounts = new Map<string, number>();
  bookings?.forEach((b) => {
    const count = bookingCounts.get(b.booking_date) ?? 0;
    bookingCounts.set(b.booking_date, count + 1);
  });

  // Build availability for each date in range
  const results: DayAvailability[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    const total = overrideMap.get(dateStr) ?? DEFAULT_CAPACITY;
    const dayPassCount = bookingCounts.get(dateStr) ?? 0;
    const available = Math.max(0, total - monthlyCount - dayPassCount);

    results.push({
      date: dateStr,
      total,
      activeMonthly: monthlyCount,
      bookedDayPasses: dayPassCount,
      available,
    });

    current.setDate(current.getDate() + 1);
  }

  return results;
}
