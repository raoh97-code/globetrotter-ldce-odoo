import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Verifying Stretch Directive 2: Profile Page Data Layer ===");

  // Find first user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found in database.");
    process.exit(1);
  }

  console.log(`Initial user: ${user.firstName} ${user.lastName} (${user.email})`);

  // Update user fields
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      phone: "+1 555-0999",
      city: "Barcelona",
      country: "Spain",
    },
  });

  console.log(`Updated user: ${updated.firstName} ${updated.lastName}, Phone: ${updated.phone}, City: ${updated.city}, Country: ${updated.country}`);
  console.log("Profile data layer verification successful! ✅");
}

main()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
