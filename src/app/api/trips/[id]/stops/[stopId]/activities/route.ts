import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: tripId, stopId } = await params;

  try {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.id) {
      return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
    }

    const body = await request.json();
    const { activityId, dayNumber, timeSlot, costOverride } = body;

    if (!activityId || !dayNumber || !timeSlot) {
      return NextResponse.json(
        { error: "Activity ID, day number, and time slot are required." },
        { status: 400 }
      );
    }

    const tripActivity = await prisma.tripActivity.create({
      data: {
        tripStopId: stopId,
        activityId,
        dayNumber: parseInt(dayNumber),
        timeSlot: timeSlot.trim(),
        costOverride: costOverride ? parseFloat(costOverride) : null,
      },
      include: {
        activity: true,
      },
    });

    return NextResponse.json({ success: true, tripActivity }, { status: 201 });
  } catch (error) {
    console.error("Error adding activity to stop:", error);
    return NextResponse.json({ error: "Failed to add activity" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: tripId } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const tripActivityId = searchParams.get("tripActivityId");

    if (!tripActivityId) {
      return NextResponse.json({ error: "Missing tripActivityId parameter" }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.id) {
      return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
    }

    await prisma.tripActivity.delete({ where: { id: tripActivityId } });

    return NextResponse.json({ success: true, message: "Activity removed from stop" });
  } catch (error) {
    console.error("Error deleting trip activity:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
