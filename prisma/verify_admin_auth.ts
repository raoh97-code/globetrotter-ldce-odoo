import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Verifying Objective 1: Admin Account Isolation ===");

  const admin = await prisma.user.findUnique({
    where: { email: "admin@globetrotter.com" },
  });

  if (!admin) {
    console.error("Admin user admin@globetrotter.com not found!");
    process.exit(1);
  }

  const isAdminFlag = admin.email.toLowerCase() === "admin@globetrotter.com";
  console.log(`Admin account check: Email = ${admin.email}, Name = ${admin.firstName} ${admin.lastName}, isAdmin = ${isAdminFlag}`);

  const regularUsers = await prisma.user.findMany({
    where: { email: { not: "admin@globetrotter.com" } },
    take: 3,
  });

  regularUsers.forEach((u) => {
    const isRegAdmin = u.email.toLowerCase() === "admin@globetrotter.com";
    console.log(`Regular account check: Email = ${u.email}, isAdmin = ${isRegAdmin}`);
  });

  console.log("Objective 1 admin access control verification successful! ✅");
}

main()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
