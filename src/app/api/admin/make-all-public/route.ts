import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.email?.toLowerCase() !== "admin@globetrotter.com") {
    return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
  }

  try {
    const trips = await prisma.trip.findMany();

    for (const trip of trips) {
      const token = trip.shareToken || crypto.randomBytes(8).toString("hex");
      await prisma.trip.update({
        where: { id: trip.id },
        data: {
          isPublic: true,
          shareToken: token,
        },
      });
    }

    return NextResponse.json({ success: true, count: trips.length });
  } catch (error: any) {
    console.error("POST /api/admin/make-all-public error:", error);
    return NextResponse.json({ error: "Failed to update trips." }, { status: 500 });
  }
}
