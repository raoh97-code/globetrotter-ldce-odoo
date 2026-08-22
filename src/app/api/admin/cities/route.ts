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
    const { name, country, costIndex, popularityScore, imageUrl } = body;

    if (!name || !country) {
      return NextResponse.json({ error: "City name and country are required." }, { status: 400 });
    }

    const existing = await prisma.city.findFirst({
      where: { name: name.trim(), country: country.trim() },
    });

    if (existing) {
      return NextResponse.json({ error: `City "${name}" in ${country} already exists.` }, { status: 409 });
    }

    const city = await prisma.city.create({
      data: {
        name: name.trim(),
        country: country.trim(),
        costIndex: costIndex ? Number(costIndex) : 5,
        popularityScore: popularityScore ? Number(popularityScore) : 50,
        imageUrl: imageUrl ? imageUrl.trim() : null,
      },
    });

    return NextResponse.json({ success: true, city }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/cities error:", error);
    return NextResponse.json({ error: "Failed to create city." }, { status: 500 });
  }
}
