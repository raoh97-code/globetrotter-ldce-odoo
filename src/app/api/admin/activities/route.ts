import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.email?.toLowerCase() !== "admin@globetrotter.com") {
    return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { cityId, name, category, cost, durationMinutes, description } = body;

    if (!cityId || !name || !category) {
      return NextResponse.json({ error: "City ID, activity name, and category are required." }, { status: 400 });
    }

    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      return NextResponse.json({ error: "City not found." }, { status: 404 });
    }

    const activity = await prisma.activity.create({
      data: {
        cityId,
        name: name.trim(),
        category: category.trim(),
        cost: cost ? Number(cost) : 0,
        durationMinutes: durationMinutes ? Number(durationMinutes) : 60,
        description: description ? description.trim() : null,
      },
    });

    return NextResponse.json({ success: true, activity }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/activities error:", error);
    return NextResponse.json({ error: "Failed to create activity." }, { status: 500 });
  }
}
