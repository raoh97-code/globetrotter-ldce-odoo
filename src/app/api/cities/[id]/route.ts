import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { category: "asc" },
        },
        photos: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: {
          select: { stops: true, activities: true, photos: true },
        },
      },
    });

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    return NextResponse.json({ city });
  } catch (error: any) {
    console.error("GET /api/cities/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch city details." }, { status: 500 });
  }
}
