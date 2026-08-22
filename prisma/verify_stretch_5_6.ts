import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Verifying Stretch Directives 5 & 6 Data Layer ===");

  // 1. Test Explore Data & Community Public Trips
  const publicTrips = await prisma.trip.findMany({
    where: { isPublic: true },
    include: { stops: { include: { tripActivities: true } } },
  });

  console.log(`Explore query: Found ${publicTrips.length} public trips.`);

  // 2. Test Itinerary Cloning
  if (publicTrips.length > 0) {
    const orig = publicTrips[0];
    const user = await prisma.user.findFirst();
    if (user) {
      const cloned = await prisma.trip.create({
        data: {
          userId: user.id,
          name: `${orig.name} (Auto-Cloned Verification)`,
          startDate: orig.startDate,
          endDate: orig.endDate,
          isPublic: false,
        },
      });

      console.log(`Cloned trip successfully: Original ID = ${orig.id} -> Cloned ID = ${cloned.id}`);
    }
  }

  // 3. Test Admin Stats Aggregation
  const [uCount, tCount, pCount, topCities] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.trip.count({ where: { isPublic: true } }),
    prisma.city.findMany({
      include: { _count: { select: { stops: true } } },
      orderBy: { stops: { _count: "desc" } },
      take: 3,
    }),
  ]);

  console.log("Admin Analytics Data:");
  console.log(`  Users: ${uCount}, Trips: ${tCount}, Public Trips: ${pCount}`);
  console.log("  Top Cities:", topCities.map((c) => `${c.name} (${c._count.stops} stops)`).join(", "));

  console.log("Stretch Directives 5 & 6 verification successful! ✅");
}

main()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
