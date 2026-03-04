import { NextRequest, NextResponse } from "next/server";
import { getAvailability, getAvailabilityRange } from "@/lib/capacity";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    // Single date query
    if (date) {
      const availability = await getAvailability(date);
      return NextResponse.json(availability);
    }

    // Date range query
    if (start && end) {
      const availability = await getAvailabilityRange(start, end);
      return NextResponse.json(availability);
    }

    return NextResponse.json(
      { error: "Provide either ?date=YYYY-MM-DD or ?start=...&end=..." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
