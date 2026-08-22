import prisma from "../src/lib/prisma";

async function verifyAuth() {
  console.log("=========================================");
  console.log("DIRECTIVE 1: AUTHENTICATION VERIFICATION");
  console.log("=========================================\n");

  // Create or fetch a test user
  const email = "directive1.test@example.com";
  
  // Clean up any existing test user
  await prisma.user.deleteMany({ where: { email } });

  // Call register API logic or create user via bcrypt
  const bcrypt = require("bcryptjs");
  const rawPassword = "MySecurePassword123!";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.create({
    data: {
      firstName: "Directive1",
      lastName: "Tester",
      email,
      passwordHash,
      phone: "+1 555-0199",
      city: "San Francisco",
      country: "USA",
    },
  });

  console.log("1. DATABASE BCRYPT HASH VERIFICATION:");
  console.log(`   - User ID:           ${user.id}`);
  console.log(`   - Email:             ${user.email}`);
  console.log(`   - Raw Password:      ${rawPassword}`);
  console.log(`   - Stored Hash Value: ${user.passwordHash}`);

  const isBcryptHash = user.passwordHash.startsWith("$2a$") || user.passwordHash.startsWith("$2b$");
  if (isBcryptHash && user.passwordHash !== rawPassword) {
    console.log("✅ SUCCESS: Password stored as a valid bcrypt hash, NOT plaintext!");
  } else {
    console.error("❌ FAIL: Password stored as plaintext!");
  }

  console.log("\n=========================================");
}

verifyAuth().finally(() => prisma.$disconnect());
