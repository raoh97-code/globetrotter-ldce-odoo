import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.email?.toLowerCase() !== "admin@globetrotter.com") {
    return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
  }

  try {
    const [
      totalUsers,
      totalTrips,
      publicTrips,
      totalStops,
      totalActivities,
      topCities,
      recentUsers,
      recentTrips,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.trip.count({ where: { isPublic: true } }),
      prisma.tripStop.count(),
      prisma.tripActivity.count(),
      prisma.city.findMany({
        include: {
          _count: { select: { stops: true, activities: true } },
        },
        orderBy: { stops: { _count: "desc" } },
        take: 5,
      }),
      prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          city: true,
          country: true,
          createdAt: true,
          _count: { select: { trips: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.trip.findMany({
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
          _count: { select: { stops: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTrips,
        publicTrips,
        totalStops,
        totalActivities,
      },
      topCities,
      recentUsers,
      recentTrips,
    });
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats." }, { status: 500 });
  }
}
