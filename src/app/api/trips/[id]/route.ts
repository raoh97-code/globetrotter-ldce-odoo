import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            city: true,
            tripActivities: {
              include: { activity: true },
              orderBy: [{ dayNumber: "asc" }, { timeSlot: "asc" }],
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        budgetItems: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.userId !== user.id && !trip.isPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Error fetching trip details:", error);
    return NextResponse.json({ error: "Failed to fetch trip details" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, description, startDate, endDate, coverPhotoUrl, isPublic } = body;

    const existingTrip = await prisma.trip.findUnique({ where: { id } });
    if (!existingTrip || existingTrip.userId !== user.id) {
      return NextResponse.json({ error: "Trip not found or forbidden" }, { status: 404 });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description ? description.trim() : null }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(coverPhotoUrl !== undefined && { coverPhotoUrl: coverPhotoUrl ? coverPhotoUrl.trim() : null }),
        ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
      },
    });

    return NextResponse.json({ success: true, trip: updatedTrip });
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existingTrip = await prisma.trip.findUnique({ where: { id } });
    if (!existingTrip || existingTrip.userId !== user.id) {
      return NextResponse.json({ error: "Trip not found or forbidden" }, { status: 404 });
    }

    await prisma.trip.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}
