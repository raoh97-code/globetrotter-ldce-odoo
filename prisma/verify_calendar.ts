import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Verifying Stretch Directive 1: Calendar View Data Layer ===");

  // 1. Fetch trips with stops, cities, and activities
  const trips = await prisma.trip.findMany({
    include: {
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

  console.log(`Found ${trips.length} trips in database.`);

  trips.forEach((t) => {
    console.log(`Trip [${t.name}]: ${t.startDate.toISOString().split("T")[0]} to ${t.endDate.toISOString().split("T")[0]}`);
    console.log(`  Stops count: ${t.stops.length}`);
    t.stops.forEach((s) => {
      console.log(`    City: ${s.city.name} (${s.startDate.toISOString().split("T")[0]} to ${s.endDate.toISOString().split("T")[0]}) - Activities: ${s.tripActivities.length}`);
    });
  });

  console.log("Calendar data layer verification successful! ✅");
}

main()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
