import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verify() {
  console.log("=========================================");
  console.log("DIRECTIVE 0: DEFINITION OF DONE VERIFICATION");
  console.log("=========================================\n");

  // 1. Table Row Counts
  const userCount = await prisma.user.count();
  const tripCount = await prisma.trip.count();
  const cityCount = await prisma.city.count();
  const tripStopCount = await prisma.tripStop.count();
  const activityCount = await prisma.activity.count();
  const tripActivityCount = await prisma.tripActivity.count();
  const budgetItemCount = await prisma.budgetItem.count();

  console.log("1. DATABASE ROW COUNTS:");
  console.log(`   - Users:           ${userCount}`);
  console.log(`   - Trips:           ${tripCount}`);
  console.log(`   - Cities:          ${cityCount}`);
  console.log(`   - TripStops:       ${tripStopCount}`);
  console.log(`   - Activities:      ${activityCount}`);
  console.log(`   - TripActivities:  ${tripActivityCount}`);
  console.log(`   - BudgetItems:     ${budgetItemCount}`);
  console.log("\n-----------------------------------------\n");

  // 2. FK Constraint Enforcement Proof
  console.log("2. FOREIGN KEY CONSTRAINT VIOLATION TEST:");
  console.log("   Attempting to insert a trip_stop with non-existent city_id 'invalid-city-id-9999'...");

  // First create a dummy user and trip to attach trip_stop to
  try {
    const testUser = await prisma.user.create({
      data: {
        firstName: "Test",
        lastName: "User",
        email: "fk-test@example.com",
        passwordHash: "dummyhash",
      },
    });

    const testTrip = await prisma.trip.create({
      data: {
        userId: testUser.id,
        name: "Test Trip",
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    // Try inserting trip_stop with invalid city_id
    await prisma.tripStop.create({
      data: {
        tripId: testTrip.id,
        cityId: "invalid-city-id-9999",
        orderIndex: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    console.error("❌ FAIL: FK constraint was not enforced!");
  } catch (err: any) {
    console.log("✅ SUCCESS: Foreign key constraint error successfully caught by DB!");
    console.log("   Error code:", err.code);
    console.log("   Error message snippet:", err.message.split("\n").slice(0, 4).join(" "));
  } finally {
    // Cleanup test user (cascades to test trip)
    await prisma.user.deleteMany({ where: { email: "fk-test@example.com" } });
  }

  console.log("\n=========================================");
}

verify().finally(() => prisma.$disconnect());
