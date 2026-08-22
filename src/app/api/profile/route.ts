import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch full user details along with trips and stops
    const userWithTrips = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        photoUrl: true,
        createdAt: true,
        trips: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            stops: {
              select: {
                cityId: true,
              },
            },
          },
        },
      },
    });

    if (!userWithTrips) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalTrips = userWithTrips.trips.length;

    // Unique cities visited
    const cityIdSet = new Set<string>();
    let totalTravelDays = 0;

    userWithTrips.trips.forEach((t) => {
      t.stops.forEach((s) => cityIdSet.add(s.cityId));

      const start = new Date(t.startDate).getTime();
      const end = new Date(t.endDate).getTime();
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      totalTravelDays += days;
    });

    const { trips, ...profile } = userWithTrips;

    return NextResponse.json({
      user: profile,
      stats: {
        totalTrips,
        citiesVisited: cityIdSet.size,
        totalTravelDays,
      },
    });
  } catch (error: any) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, phone, city, country, photoUrl } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        city: city || null,
        country: country || null,
        photoUrl: photoUrl || null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        photoUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
