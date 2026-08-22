import prisma from "../src/lib/prisma";

async function verifyDirective2() {
  console.log("=========================================");
  console.log("DIRECTIVE 2: TRIP & STOP CRUD VERIFICATION");
  console.log("=========================================\n");

  const email = "directive2.tester@example.com";
  await prisma.user.deleteMany({ where: { email } });

  // 1. Create User
  const user = await prisma.user.create({
    data: {
      firstName: "Directive2",
      lastName: "Tester",
      email,
      passwordHash: "hash123",
    },
  });

  // 2. Create Trip
  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      name: "Euro Expedition 2026",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-09-15"),
      description: "Testing multi-city section CRUD",
    },
  });

  console.log(`1. TRIP CREATION:`);
  console.log(`   - Trip ID:   ${trip.id}`);
  console.log(`   - Trip Name: ${trip.name}`);

  // Fetch 3 cities
  const cities = await prisma.city.findMany({ take: 3 });
  if (cities.length < 3) {
    throw new Error("Seed database lacks sufficient cities!");
  }

  // 3. Add 3 Sections (TripStops)
  const stop1 = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      cityId: cities[0].id,
      orderIndex: 0,
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-09-05"),
      sectionBudget: 1200.0,
    },
  });

  const stop2 = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      cityId: cities[1].id,
      orderIndex: 1,
      startDate: new Date("2026-09-05"),
      endDate: new Date("2026-09-10"),
      sectionBudget: 1500.0,
    },
  });

  const stop3 = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      cityId: cities[2].id,
      orderIndex: 2,
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-15"),
      sectionBudget: 1800.0,
    },
  });

  console.log(`\n2. INITIAL SECTIONS (3 STOPS):`);
  console.log(`   - Stop 0: ${cities[0].name} (ID: ${stop1.id})`);
  console.log(`   - Stop 1: ${cities[1].name} (ID: ${stop2.id})`);
  console.log(`   - Stop 2: ${cities[2].name} (ID: ${stop3.id})`);

  // 4. Reorder sections (Move Stop 2 to Index 0)
  await prisma.$transaction([
    prisma.tripStop.update({ where: { id: stop3.id }, data: { orderIndex: 0 } }),
    prisma.tripStop.update({ where: { id: stop1.id }, data: { orderIndex: 1 } }),
    prisma.tripStop.update({ where: { id: stop2.id }, data: { orderIndex: 2 } }),
  ]);

  // 5. Reload from DB and verify persisted order Index
  const reloadedTrip = await prisma.trip.findUnique({
    where: { id: trip.id },
    include: {
      stops: {
        include: { city: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  console.log(`\n3. PERSISTED REORDERED SECTIONS (RELOADED FROM DB):`);
  reloadedTrip?.stops.forEach((s, idx) => {
    console.log(`   - Index ${idx} [DB orderIndex=${s.orderIndex}]: ${s.city.name} (Stop ID: ${s.id})`);
  });

  const isReorderedInDB =
    reloadedTrip?.stops[0].id === stop3.id &&
    reloadedTrip?.stops[1].id === stop1.id &&
    reloadedTrip?.stops[2].id === stop2.id;

  const isFKLinked = reloadedTrip?.stops.every((s) => s.tripId === trip.id);

  if (isReorderedInDB && isFKLinked) {
    console.log("\n✅ SUCCESS: Reordered section index persisted in PostgreSQL DB and FK trip_id correctly links back!");
  } else {
    console.error("\n❌ FAIL: Reordered sections were not correctly persisted!");
  }

  console.log("=========================================");
}

verifyDirective2().finally(() => prisma.$disconnect());
