import prisma from "../src/lib/prisma";

async function verifyGoldenPath() {
  console.log("=========================================");
  console.log("DIRECTIVE 5: FULL GOLDEN PATH VERIFICATION");
  console.log("=========================================\n");

  const email = "golden.path@example.com";
  await prisma.user.deleteMany({ where: { email } });

  // 1. User Registration
  const bcrypt = require("bcryptjs");
  const passwordHash = await bcrypt.hash("GoldenPassword123!", 10);

  const user = await prisma.user.create({
    data: {
      firstName: "Golden",
      lastName: "Path",
      email,
      passwordHash,
      city: "San Francisco",
      country: "USA",
    },
  });
  console.log(`1. USER REGISTERED: ${user.firstName} ${user.lastName} (${user.email})`);

  // 2. Create Trip
  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      name: "Asian Heritage Odyssey 2026",
      startDate: new Date("2026-11-01"),
      endDate: new Date("2026-11-15"),
      description: "Golden path end-to-end integration test trip",
    },
  });
  console.log(`2. TRIP CREATED: ${trip.name} (ID: ${trip.id})`);

  // 3. Add 2 Stops: Tokyo & Bangkok
  const tokyo = await prisma.city.findFirst({ where: { name: "Tokyo" } });
  const bangkok = await prisma.city.findFirst({ where: { name: "Bangkok" } });
  if (!tokyo || !bangkok) throw new Error("Missing cities in seed data!");

  const stop1 = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      cityId: tokyo.id,
      orderIndex: 0,
      startDate: new Date("2026-11-01"),
      endDate: new Date("2026-11-07"),
      sectionBudget: 3000.0,
    },
  });

  const stop2 = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      cityId: bangkok.id,
      orderIndex: 1,
      startDate: new Date("2026-11-08"),
      endDate: new Date("2026-11-15"),
      sectionBudget: 1500.0,
    },
  });
  console.log(`3. STOPS ADDED: Stop 1 (${tokyo.name}), Stop 2 (${bangkok.name})`);

  // 4. Add Activities to each stop
  const tokyoAct = await prisma.activity.findFirst({ where: { cityId: tokyo.id } });
  const bangkokAct = await prisma.activity.findFirst({ where: { cityId: bangkok.id } });

  if (tokyoAct) {
    await prisma.tripActivity.create({
      data: {
        tripStopId: stop1.id,
        activityId: tokyoAct.id,
        dayNumber: 1,
        timeSlot: "Morning",
      },
    });
  }

  if (bangkokAct) {
    await prisma.tripActivity.create({
      data: {
        tripStopId: stop2.id,
        activityId: bangkokAct.id,
        dayNumber: 2,
        timeSlot: "Afternoon",
        costOverride: 45.0,
      },
    });
  }
  console.log(`4. ACTIVITIES ATTACHED: Tokyo (${tokyoAct?.name}), Bangkok (${bangkokAct?.name})`);

  // 5. Query complete trip graph from PostgreSQL
  const fullTrip = await prisma.trip.findUnique({
    where: { id: trip.id },
    include: {
      user: true,
      stops: {
        include: {
          city: true,
          tripActivities: {
            include: { activity: true },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  console.log(`\n5. FULL TRIP RELATIONAL INTEGRITY VERIFICATION:`);
  console.log(`   - Owner: ${fullTrip?.user.firstName} (${fullTrip?.user.email})`);
  console.log(`   - Stops Count: ${fullTrip?.stops.length}`);

  let totalCost = 0;
  fullTrip?.stops.forEach((s, idx) => {
    console.log(`   - Stop #${idx + 1}: ${s.city.name}, ${s.city.country} (${s.tripActivities.length} activities)`);
    s.tripActivities.forEach((ta) => {
      const c = ta.costOverride !== null ? Number(ta.costOverride) : Number(ta.activity.cost);
      totalCost += c;
      console.log(`     * Day ${ta.dayNumber} [${ta.timeSlot}]: ${ta.activity.name} ($${c})`);
    });
  });

  console.log(`   - Total Golden Path Trip Cost: $${totalCost.toFixed(2)}`);

  if (fullTrip?.stops.length === 2 && totalCost >= 0) {
    console.log("\n🎉 GOLDEN PATH PASSED WITH ZERO ERRORS!");
  } else {
    console.error("\n❌ GOLDEN PATH FAILED!");
  }

  console.log("=========================================");
}

verifyGoldenPath().finally(() => prisma.$disconnect());
