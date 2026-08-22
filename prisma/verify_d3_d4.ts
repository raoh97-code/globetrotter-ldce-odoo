import prisma from "../src/lib/prisma";

async function verifyDirective3And4() {
  console.log("=========================================");
  console.log("DIRECTIVE 3 & 4: ACTIVITY SEARCH & ITINERARY BUDGET VERIFICATION");
  console.log("=========================================\n");

  const email = "directive34.tester@example.com";
  await prisma.user.deleteMany({ where: { email } });

  // 1. Create User
  const user = await prisma.user.create({
    data: {
      firstName: "Directive34",
      lastName: "Tester",
      email,
      passwordHash: "hash123",
    },
  });

  // 2. Create Trip & Stop in Tokyo
  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      name: "Tokyo Adventure 2026",
      startDate: new Date("2026-10-01"),
      endDate: new Date("2026-10-07"),
    },
  });

  const tokyoCity = await prisma.city.findFirst({ where: { name: "Tokyo" } });
  if (!tokyoCity) throw new Error("Tokyo city missing from seed!");

  const stop = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      cityId: tokyoCity.id,
      orderIndex: 0,
      startDate: new Date("2026-10-01"),
      endDate: new Date("2026-10-07"),
      sectionBudget: 2500.0,
    },
  });

  // 3. Search activities in Tokyo
  const tokyoActivities = await prisma.activity.findMany({
    where: { cityId: tokyoCity.id },
  });

  console.log(`1. TOKYO ACTIVITIES FOUND: ${tokyoActivities.length}`);
  tokyoActivities.forEach((act) => {
    console.log(`   - [${act.category}] ${act.name} ($${act.cost})`);
  });

  if (tokyoActivities.length < 2) throw new Error("Seed lacks 2 Tokyo activities!");

  // 4. Attach 2 activities on different days (Day 1 & Day 2) to tripStop
  const tripAct1 = await prisma.tripActivity.create({
    data: {
      tripStopId: stop.id,
      activityId: tokyoActivities[0].id,
      dayNumber: 1,
      timeSlot: "Morning",
    },
  });

  const tripAct2 = await prisma.tripActivity.create({
    data: {
      tripStopId: stop.id,
      activityId: tokyoActivities[1].id,
      dayNumber: 2,
      timeSlot: "Evening",
      costOverride: 120.0,
    },
  });

  console.log(`\n2. CREATED TRIP ACTIVITIES IN DB:`);
  console.log(`   - Activity 1 ID: ${tripAct1.id} | Stop ID: ${tripAct1.tripStopId} | Day: ${tripAct1.dayNumber} | Slot: ${tripAct1.timeSlot}`);
  console.log(`   - Activity 2 ID: ${tripAct2.id} | Stop ID: ${tripAct2.tripStopId} | Day: ${tripAct2.dayNumber} | Slot: ${tripAct2.timeSlot} | Cost Override: $${tripAct2.costOverride}`);

  // 5. Query back from PostgreSQL DB to verify total trip cost & category sums
  const reloadedTrip = await prisma.trip.findUnique({
    where: { id: trip.id },
    include: {
      stops: {
        include: {
          tripActivities: {
            include: { activity: true },
          },
        },
      },
    },
  });

  let calculatedTotal = 0;
  const categoryTotals: Record<string, number> = {};

  reloadedTrip?.stops.forEach((s) => {
    s.tripActivities.forEach((ta) => {
      const cost = ta.costOverride !== null ? Number(ta.costOverride) : Number(ta.activity.cost);
      calculatedTotal += cost;
      categoryTotals[ta.activity.category] = (categoryTotals[ta.activity.category] || 0) + cost;
    });
  });

  console.log(`\n3. CALCULATED BUDGET ANALYSIS FROM DB:`);
  console.log(`   - Total Trip Cost: $${calculatedTotal.toFixed(2)}`);
  console.log(`   - Category Breakdown:`, categoryTotals);

  const isValid =
    reloadedTrip?.stops[0].tripActivities.length === 2 &&
    reloadedTrip?.stops[0].tripActivities[0].dayNumber === 1 &&
    reloadedTrip?.stops[0].tripActivities[1].dayNumber === 2;

  if (isValid) {
    console.log("\n✅ SUCCESS: trip_activities created with correct trip_stop_id & day_numbers in PostgreSQL DB!");
  } else {
    console.error("\n❌ FAIL: DB validation failed!");
  }

  console.log("=========================================");
}

verifyDirective3And4().finally(() => prisma.$disconnect());
