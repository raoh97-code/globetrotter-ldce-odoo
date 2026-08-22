import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      include: {
        stops: {
          include: { city: true },
          orderBy: { orderIndex: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, startDate, endDate, coverPhotoUrl } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Trip name, start date, and end date are required." },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
        name: name.trim(),
        description: description ? description.trim() : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverPhotoUrl: coverPhotoUrl ? coverPhotoUrl.trim() : null,
      },
    });

    return NextResponse.json({ success: true, trip }, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
