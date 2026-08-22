import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: tripId } = await params;

  try {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.id) {
      return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
    }

    const body = await request.json();
    const { cityId, startDate, endDate, sectionBudget } = body;

    if (!cityId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "City ID, start date, and end date are required." },
        { status: 400 }
      );
    }

    // Verify city exists
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      return NextResponse.json({ error: "Invalid city ID." }, { status: 400 });
    }

    // Get current highest orderIndex
    const lastStop = await prisma.tripStop.findFirst({
      where: { tripId },
      orderBy: { orderIndex: "desc" },
    });
    const nextOrderIndex = lastStop ? lastStop.orderIndex + 1 : 0;

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        orderIndex: nextOrderIndex,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        sectionBudget: sectionBudget ? parseFloat(sectionBudget) : null,
      },
      include: {
        city: true,
      },
    });

    return NextResponse.json({ success: true, stop }, { status: 201 });
  } catch (error) {
    console.error("Error creating trip stop:", error);
    return NextResponse.json({ error: "Failed to create trip stop" }, { status: 500 });
  }
}
