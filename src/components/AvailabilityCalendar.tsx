"use client";

import { useState, useEffect, useCallback } from "react";

type DayAvailability = {
  date: string;
  total: number;
  activeMonthly: number;
  bookedDayPasses: number;
  available: number;
};

type AvailabilityCalendarProps = {
  selectedDate: string | null;
  onSelectDate: (date: string, availability: DayAvailability) => void;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AvailabilityCalendar({
  selectedDate,
  onSelectDate,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [availability, setAvailability] = useState<Map<string, DayAvailability>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError("");

    const start = new Date(currentMonth);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    try {
      const res = await fetch(
        `/api/bookings/availability?start=${startStr}&end=${endStr}`
      );

      if (!res.ok) {
        setError("Unable to load availability. Please try again later.");
        setLoading(false);
        return;
      }

      const data: DayAvailability[] = await res.json();

      if (!Array.isArray(data)) {
        setError("Unable to load availability. Please try again later.");
        setLoading(false);
        return;
      }

      const map = new Map<string, DayAvailability>();
      data.forEach((d) => map.set(d.date, d));
      setAvailability(map);
    } catch (err) {
      console.error("Failed to fetch availability:", err);
      setError("Unable to load availability. Please try again later.");
    }

    setLoading(false);
  }, [currentMonth]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth = lastDay.getDate();
  const cells: (number | null)[] = [];

  // Padding for first week
  for (let i = 0; i < startDow; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const canGoPrev = currentMonth > today;

  const goToPrev = () => {
    if (!canGoPrev) return;
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNext = () => {
    // Allow up to 2 months ahead
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    if (currentMonth < maxMonth) {
      setCurrentMonth(new Date(year, month + 1, 1));
    }
  };

  const getDateStr = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getAvailabilityColor = (avail: DayAvailability | undefined) => {
    if (!avail) return "bg-cream";
    if (avail.available <= 0) return "bg-red-100 text-red-400";
    if (avail.available <= 3) return "bg-amber-100";
    return "bg-green-100";
  };

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrev}
          disabled={!canGoPrev}
          className="p-2 hover:bg-forest/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-serif text-xl text-forest">
          {MONTHS[month]} {year}
        </h3>
        <button
          onClick={goToNext}
          className="p-2 hover:bg-forest/5 transition-colors"
        >
          <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs tracking-wider uppercase text-forest/40 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const dateStr = getDateStr(day);
          const date = new Date(year, month, day);
          const isPast = date < today;
          const isToday = date.getTime() === today.getTime();
          const isSelected = selectedDate === dateStr;
          const avail = availability.get(dateStr);
          const isSoldOut = avail ? avail.available <= 0 : false;
          const isDisabled = isPast || isSoldOut;

          return (
            <button
              key={dateStr}
              disabled={isDisabled || loading}
              onClick={() => {
                if (avail) onSelectDate(dateStr, avail);
              }}
              className={`
                aspect-square flex flex-col items-center justify-center text-sm transition-all duration-200 relative
                ${isSelected
                  ? "bg-forest text-cream ring-2 ring-forest ring-offset-2"
                  : isDisabled
                    ? "bg-cream/50 text-forest/20 cursor-not-allowed"
                    : `${getAvailabilityColor(avail)} text-forest hover:ring-2 hover:ring-camel hover:ring-offset-1 cursor-pointer`
                }
                ${isToday && !isSelected ? "ring-1 ring-camel" : ""}
              `}
            >
              <span className={`font-medium ${isSelected ? "text-cream" : ""}`}>
                {day}
              </span>
              {!isPast && avail && !loading && (
                <span
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? "text-cream/70" : "text-forest/40"
                  }`}
                >
                  {avail.available > 0 ? `${avail.available} left` : "Full"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-4">
          <p className="text-forest/40 text-sm">Loading availability...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 rounded-sm border border-green-200" />
          <span className="text-xs text-forest/50">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-100 rounded-sm border border-amber-200" />
          <span className="text-xs text-forest/50">Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 rounded-sm border border-red-200" />
          <span className="text-xs text-forest/50">Full</span>
        </div>
      </div>
    </div>
  );
}
