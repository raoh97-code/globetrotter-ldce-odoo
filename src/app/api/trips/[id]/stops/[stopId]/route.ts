import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
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
    const { cityId, startDate, endDate, sectionBudget } = body;

    const updatedStop = await prisma.tripStop.update({
      where: { id: stopId },
      data: {
        ...(cityId && { cityId }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(sectionBudget !== undefined && {
          sectionBudget: sectionBudget ? parseFloat(sectionBudget) : null,
        }),
      },
      include: { city: true },
    });

    return NextResponse.json({ success: true, stop: updatedStop });
  } catch (error) {
    console.error("Error updating stop:", error);
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
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

  const { id: tripId, stopId } = await params;

  try {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.id) {
      return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
    }

    await prisma.tripStop.delete({ where: { id: stopId } });
    return NextResponse.json({ success: true, message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting stop:", error);
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}
