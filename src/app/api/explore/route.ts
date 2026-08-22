import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [publicTrips, cities] = await Promise.all([
      prisma.trip.findMany({
        where: { isPublic: true },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              photoUrl: true,
            },
          },
          stops: {
            orderBy: { orderIndex: "asc" },
            include: {
              city: true,
              tripActivities: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.city.findMany({
        include: {
          _count: {
            select: { stops: true, activities: true },
          },
        },
        orderBy: { popularityScore: "desc" },
        take: 12,
      }),
    ]);

    return NextResponse.json({
      publicTrips,
      cities,
    });
  } catch (error: any) {
    console.error("GET /api/explore error:", error);
    return NextResponse.json({ error: "Failed to fetch exploration data." }, { status: 500 });
  }
}
