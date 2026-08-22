import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
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
    const { stops } = body as { stops: { id: string; orderIndex: number }[] };

    if (!Array.isArray(stops)) {
      return NextResponse.json({ error: "Invalid stops format." }, { status: 400 });
    }

    // Execute transaction to update orderIndex for all stops
    await prisma.$transaction(
      stops.map((item) =>
        prisma.tripStop.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        })
      )
    );

    return NextResponse.json({ success: true, message: "Sections reordered successfully" });
  } catch (error) {
    console.error("Error reordering stops:", error);
    return NextResponse.json({ error: "Failed to reorder sections" }, { status: 500 });
  }
}
