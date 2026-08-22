import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("cityId") || "";
  const category = searchParams.get("category") || "";
  const query = searchParams.get("query") || "";
  const maxCost = searchParams.get("maxCost") ? parseFloat(searchParams.get("maxCost")!) : null;

  try {
    const activities = await prisma.activity.findMany({
      where: {
        AND: [
          cityId ? { cityId } : {},
          category ? { category: { equals: category, mode: "insensitive" } } : {},
          query ? { name: { contains: query, mode: "insensitive" } } : {},
          maxCost !== null ? { cost: { lte: maxCost } } : {},
        ],
      },
      include: {
        city: true,
      },
      orderBy: [{ cost: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
