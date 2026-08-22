import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const country = searchParams.get("country") || "";
  const region = searchParams.get("region") || ""; // "india" | "international"
  const state = searchParams.get("state") || "";

  try {
    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { state: { contains: query, mode: "insensitive" } },
        { country: { contains: query, mode: "insensitive" } },
      ];
    }

    if (country) {
      whereClause.country = { equals: country, mode: "insensitive" };
    }

    if (region === "india") {
      whereClause.country = "India";
    } else if (region === "international") {
      whereClause.country = { not: "India" };
    }

    if (state) {
      whereClause.state = { equals: state, mode: "insensitive" };
    }

    const cities = await prisma.city.findMany({
      where: whereClause,
      include: {
        _count: { select: { activities: true, stops: true } },
      },
      orderBy: [{ popularityScore: "desc" }, { name: "asc" }],
    });

    // Also get unique states in India for state selector UI
    const indiaStatesRaw = await prisma.city.findMany({
      where: { country: "India", state: { not: null } },
      select: { state: true },
      distinct: ["state"],
    });

    const states = indiaStatesRaw
      .map((item) => item.state)
      .filter((s): s is string => Boolean(s))
      .sort();

    return NextResponse.json({ cities, states });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}
