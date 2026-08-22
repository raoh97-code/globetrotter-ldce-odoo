import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const tripId = resolvedParams.id;

  try {
    const originalTrip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        isPublic: true,
      },
      include: {
        stops: {
          include: {
            tripActivities: true,
          },
        },
      },
    });

    if (!originalTrip) {
      return NextResponse.json({ error: "Public trip not found." }, { status: 404 });
    }

    // Create cloned trip
    const clonedTrip = await prisma.trip.create({
      data: {
        userId: sessionUser.id,
        name: `${originalTrip.name} (Cloned)`,
        description: originalTrip.description ? `Cloned from ${originalTrip.name}. ${originalTrip.description}` : `Cloned from ${originalTrip.name}.`,
        startDate: originalTrip.startDate,
        endDate: originalTrip.endDate,
        coverPhotoUrl: originalTrip.coverPhotoUrl,
        isPublic: false,
      },
    });

    // Duplicate stops and activities
    for (const stop of originalTrip.stops) {
      const newStop = await prisma.tripStop.create({
        data: {
          tripId: clonedTrip.id,
          cityId: stop.cityId,
          orderIndex: stop.orderIndex,
          startDate: stop.startDate,
          endDate: stop.endDate,
          sectionBudget: stop.sectionBudget,
        },
      });

      for (const act of stop.tripActivities) {
        await prisma.tripActivity.create({
          data: {
            tripStopId: newStop.id,
            activityId: act.activityId,
            dayNumber: act.dayNumber,
            timeSlot: act.timeSlot,
            costOverride: act.costOverride,
          },
        });
      }
    }

    return NextResponse.json({ clonedTripId: clonedTrip.id });
  } catch (error: any) {
    console.error("POST /api/trips/[id]/clone error:", error);
    return NextResponse.json({ error: "Failed to clone trip." }, { status: 500 });
  }
}
