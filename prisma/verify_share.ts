import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Verifying Stretch Directive 4: Public Share Links Data Layer ===");

  const trip = await prisma.trip.findFirst();
  if (!trip) {
    console.error("No trips found in database.");
    process.exit(1);
  }

  const token = crypto.randomBytes(8).toString("hex");

  // Toggle public and set shareToken
  const sharedTrip = await prisma.trip.update({
    where: { id: trip.id },
    data: {
      isPublic: true,
      shareToken: token,
    },
  });

  console.log(`Generated public share for Trip [${sharedTrip.name}]: Token = ${sharedTrip.shareToken}, isPublic = ${sharedTrip.isPublic}`);

  // Fetch as unauthenticated viewer via token
  const publicTrip = await prisma.trip.findFirst({
    where: {
      shareToken: token,
      isPublic: true,
    },
    include: {
      user: true,
      stops: {
        include: { city: true },
      },
    },
  });

  if (!publicTrip) {
    console.error("Failed to fetch public trip by token!");
    process.exit(1);
  }

  console.log(`Fetched public trip [${publicTrip.name}] created by ${publicTrip.user.firstName} ${publicTrip.user.lastName} with ${publicTrip.stops.length} stops.`);
  console.log("Public Share Links verification successful! ✅");
}

main()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
