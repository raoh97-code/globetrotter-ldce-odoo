import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "admin@globetrotter.com";

async function main() {
  console.log("=== Seeding Dedicated Admin Account ===");

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("AdminPass123!", salt);

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      firstName: "System",
      lastName: "Admin",
      passwordHash,
    },
    create: {
      email: ADMIN_EMAIL,
      firstName: "System",
      lastName: "Admin",
      passwordHash,
      city: "Global HQ",
      country: "System",
    },
  });

  console.log(`Dedicated Admin account ready! Email: ${adminUser.email}, Name: ${adminUser.firstName} ${adminUser.lastName}`);
}

main()
  .catch((e) => {
    console.error("Error seeding admin account:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
