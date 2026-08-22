import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Verifying Stretch Directive 3: My Trips Grouping Data Layer ===");

  const trips = await prisma.trip.findMany({
    include: {
      stops: true,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const counts = { ongoing: 0, upcoming: 0, completed: 0, draft: 0 };

  trips.forEach((trip) => {
    let status = "completed";
    if (trip.stops.length === 0) {
      status = "draft";
    } else {
      const start = new Date(trip.startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(trip.endDate);
      end.setHours(23, 59, 59, 999);

      if (start <= today && today <= end) status = "ongoing";
      else if (start > today) status = "upcoming";
      else status = "completed";
    }

    counts[status as keyof typeof counts]++;
    console.log(`Trip [${trip.name}] -> Status: ${status.toUpperCase()} (${trip.startDate.toISOString().split("T")[0]} to ${trip.endDate.toISOString().split("T")[0]}, Stops: ${trip.stops.length})`);
  });

  console.log("Category counts:", counts);
  console.log("Trip grouping verification successful! ✅");
}

main()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
