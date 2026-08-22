import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

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
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: sessionUser.id },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
    }

    const body = await req.json();
    const isPublic = Boolean(body.isPublic);

    let shareToken = trip.shareToken;
    if (isPublic && !shareToken) {
      shareToken = crypto.randomBytes(8).toString("hex");
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        isPublic,
        shareToken,
      },
    });

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const shareUrl = `${protocol}://${host}/share/${updatedTrip.shareToken}`;

    return NextResponse.json({
      isPublic: updatedTrip.isPublic,
      shareToken: updatedTrip.shareToken,
      shareUrl,
    });
  } catch (error: any) {
    console.error("POST /api/trips/[id]/share error:", error);
    return NextResponse.json({ error: "Failed to update share status." }, { status: 500 });
  }
}
