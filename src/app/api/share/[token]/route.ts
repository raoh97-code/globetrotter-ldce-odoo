import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const resolvedParams = await params;
  const token = resolvedParams.token;

  if (!token) {
    return NextResponse.json({ error: "Share token required" }, { status: 400 });
  }

  try {
    const trip = await prisma.trip.findFirst({
      where: {
        shareToken: token,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
        stops: {
          orderBy: { orderIndex: "asc" },
          include: {
            city: true,
            tripActivities: {
              include: {
                activity: true,
              },
            },
          },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Public itinerary not found or private." }, { status: 404 });
    }

    return NextResponse.json({ trip });
  } catch (error: any) {
    console.error("GET /api/share/[token] error:", error);
    return NextResponse.json({ error: "Failed to load public trip." }, { status: 500 });
  }
}
