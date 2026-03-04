"use client";

import { useState, useEffect, useCallback } from "react";
import { getBookingsForDate } from "@/lib/actions/admin";

type DayAvailability = {
  date: string;
  total: number;
  available: number;
  bookedDayPasses: number;
  activeMonthly: number;
};

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayBookings, setDayBookings] = useState<Record<string, unknown>[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchAvailability = useCallback(async () => {
    const startDate = new Date(year, month, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

    try {
      const res = await fetch(
        `/api/bookings/availability?start=${startDate}&end=${endDate}`
      );
      const data = await res.json();
      const map: Record<string, DayAvailability> = {};
      if (data.availability) {
        for (const day of data.availability) {
          map[day.date] = day;
        }
      }
      setAvailability(map);
    } catch {
      console.error("Failed to fetch availability");
    }
  }, [year, month]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSelectDate = async (date: string) => {
    setSelectedDate(date);
    setLoadingBookings(true);
    const bookings = await getBookingsForDate(date);
    setDayBookings(bookings);
    setLoadingBookings(false);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  // Adjust for Monday start (0 = Mon, 6 = Sun)
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthLabel = currentDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Calendar</h1>
      <p className="text-forest/50 text-sm mb-8">
        View bookings and capacity by day.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="md:col-span-2">
          <div className="bg-white border border-forest/10 p-6">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="text-forest/40 hover:text-forest transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h2 className="font-serif text-xl text-forest">{monthLabel}</h2>
              <button
                onClick={nextMonth}
                className="text-forest/40 hover:text-forest transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div
                  key={d}
                  className="text-center text-xs text-forest/40 tracking-widest uppercase py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const avail = availability[dateStr];
                const available = avail?.available ?? 14;
                const isToday = dateStr === today;
                const isSelected = dateStr === selectedDate;

                let bgColor = "bg-sage/10"; // available
                if (avail) {
                  if (available === 0) bgColor = "bg-red-50";
                  else if (available <= 3) bgColor = "bg-camel/15";
                }

                return (
                  <button
                    key={dateStr}
                    onClick={() => handleSelectDate(dateStr)}
                    className={`aspect-square flex flex-col items-center justify-center text-sm rounded transition-colors ${bgColor} ${
                      isSelected
                        ? "ring-2 ring-forest"
                        : "hover:ring-1 hover:ring-forest/30"
                    } ${isToday ? "font-bold" : ""}`}
                  >
                    <span className="text-forest">{day}</span>
                    {avail && (
                      <span className="text-[10px] text-forest/40">
                        {available} left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-xs text-forest/50">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-sage/10 border border-forest/10" />
                Available
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-camel/15 border border-forest/10" />
                Limited
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-50 border border-forest/10" />
                Full
              </div>
            </div>
          </div>
        </div>

        {/* Day detail sidebar */}
        <div>
          {selectedDate ? (
            <div className="bg-white border border-forest/10 p-6">
              <h3 className="font-serif text-lg text-forest mb-1">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h3>
              {availability[selectedDate] && (
                <p className="text-xs text-forest/40 mb-4">
                  {availability[selectedDate].available} of{" "}
                  {availability[selectedDate].total} spots available
                </p>
              )}

              <h4 className="text-xs tracking-widest uppercase text-forest/50 mb-3">
                Day Pass Bookings
              </h4>
              {loadingBookings ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-5 h-5 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
                </div>
              ) : dayBookings.length === 0 ? (
                <p className="text-forest/30 text-sm">No bookings for this day.</p>
              ) : (
                <div className="space-y-3">
                  {dayBookings.map((booking) => {
                    const profiles = booking.profiles as Record<string, string> | null;
                    return (
                      <div
                        key={booking.id as string}
                        className="flex items-center justify-between py-2 border-b border-forest/5 last:border-0"
                      >
                        <div>
                          <p className="text-sm text-forest">
                            {profiles?.full_name || profiles?.email || "Unknown"}
                          </p>
                          <p className="text-xs text-forest/40 capitalize">
                            {(booking.status as string)?.replace("_", " ")}
                          </p>
                        </div>
                        {booking.qr_used ? (
                          <span className="text-xs text-sage">Checked in</span>
                        ) : (
                          <span className="text-xs text-forest/30">Pending</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-forest/10 p-6 text-center">
              <p className="text-forest/30 text-sm">
                Select a day to see bookings.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
