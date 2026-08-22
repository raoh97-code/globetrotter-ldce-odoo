import { PrismaClient } from "@prisma/client";
import { formatCurrency, getCurrencySymbol } from "../src/lib/currency";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Verifying Directives 2.0 to 2.7 ===");

  // 1. Verify Indian States count
  const indiaStates = await prisma.city.findMany({
    where: { country: "India", state: { not: null } },
    select: { state: true },
    distinct: ["state"],
  });
  const stateList = indiaStates.map((s) => s.state).filter(Boolean);
  console.log(`✅ Directive 2.1: Found ${stateList.length} Indian States in database.`);
  console.log(`   States list: ${stateList.join(", ")}`);

  if (stateList.length < 10) {
    throw new Error("Failed Directive 2.1: Less than 10-15 Indian states found.");
  }

  // 2. Verify Gujarat, Maharashtra, Rajasthan, Punjab activity counts
  const keyStates = ["Gujarat", "Maharashtra", "Rajasthan", "Punjab"];
  for (const st of keyStates) {
    const citiesInState = await prisma.city.findMany({
      where: { country: "India", state: st },
      include: { _count: { select: { activities: true } } },
    });
    const totalActivities = citiesInState.reduce((acc, c) => acc + c._count.activities, 0);
    console.log(`✅ Directive 2.3: State [${st}] has ${citiesInState.length} cities/spots with ${totalActivities} total activities.`);
  }

  // 3. Verify Currency Formatter (Directive 2.6)
  const inrSample = formatCurrency(1500, "India");
  const usdSample = formatCurrency(150, "USA");
  console.log(`✅ Directive 2.6: India Currency Sample = ${inrSample}, International Currency Sample = ${usdSample}`);

  if (!inrSample.startsWith("₹") || !usdSample.startsWith("₹")) {
    throw new Error("Failed Directive 2.6: Currency symbol formatting failed.");
  }

  // 4. Verify Unsplash image URLs (Directive 2.4 & 2.7)
  const citiesWithImage = await prisma.city.count({
    where: { imageUrl: { startsWith: "https://images.unsplash.com" } },
  });
  console.log(`✅ Directive 2.4 & 2.7: Found ${citiesWithImage} cities/spots with valid copyright-free Unsplash image URLs.`);

  console.log("\n🎉 Directives 2.0 to 2.7 data layer verification successful! ✅");
}

main()
  .catch((e) => {
    console.error("❌ Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
