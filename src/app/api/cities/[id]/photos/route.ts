import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized. Please login to add photos." }, { status: 401 });
  }

  const { id: cityId } = await params;

  try {
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      return NextResponse.json({ error: "City not found." }, { status: 404 });
    }

    const body = await req.json();
    const { imageUrl, caption } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
    }

    const photo = await prisma.cityPhoto.create({
      data: {
        cityId,
        userId: sessionUser.id,
        imageUrl: imageUrl.trim(),
        caption: caption ? caption.trim() : null,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ success: true, photo }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/cities/[id]/photos error:", error);
    return NextResponse.json({ error: "Failed to add photo." }, { status: 500 });
  }
}
