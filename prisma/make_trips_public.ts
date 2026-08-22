import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Making all trips in database public ===");

  const trips = await prisma.trip.findMany();

  for (const trip of trips) {
    const token = trip.shareToken || crypto.randomBytes(8).toString("hex");

    await prisma.trip.update({
      where: { id: trip.id },
      data: {
        isPublic: true,
        shareToken: token,
      },
    });

    console.log(`Updated trip [${trip.name}]: isPublic = true, shareToken = ${token}`);
  }

  console.log(`All ${trips.length} trips are now public! ✅`);
}

main()
  .catch((e) => {
    console.error("Error making trips public:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
