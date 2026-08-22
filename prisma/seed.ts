import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌍 Seeding GlobeTrotter database...\n");

  // ──────────────────────────────────────────────
  // CITIES — 18 cities across 6+ countries
  // ──────────────────────────────────────────────
  const cities = await Promise.all([
    // India
    prisma.city.create({
      data: {
        name: "Mumbai",
        country: "India",
        costIndex: 4,
        popularityScore: 75,
        imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
      },
    }),
    prisma.city.create({
      data: {
        name: "Jaipur",
        country: "India",
        costIndex: 3,
        popularityScore: 70,
        imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      },
    }),
    prisma.city.create({
      data: {
        name: "Goa",
        country: "India",
        costIndex: 3,
        popularityScore: 80,
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
      },
    }),
    // Japan
    prisma.city.create({
      data: {
        name: "Tokyo",
        country: "Japan",
        costIndex: 8,
        popularityScore: 95,
        imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      },
    }),
    prisma.city.create({
      data: {
        name: "Kyoto",
        country: "Japan",
        costIndex: 7,
        popularityScore: 82,
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      },
    }),
    prisma.city.create({
      data: {
        name: "Osaka",
        country: "Japan",
        costIndex: 7,
        popularityScore: 78,
        imageUrl: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800",
      },
    }),
    // France
    prisma.city.create({
      data: {
        name: "Paris",
        country: "France",
        costIndex: 9,
        popularityScore: 98,
        imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      },
    }),
    prisma.city.create({
      data: {
        name: "Nice",
        country: "France",
        costIndex: 8,
        popularityScore: 72,
        imageUrl: "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800",
      },
    }),
    // USA
    prisma.city.create({
      data: {
        name: "New York",
        country: "USA",
        costIndex: 9,
        popularityScore: 97,
        imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
      },
    }),
    prisma.city.create({
      data: {
        name: "San Francisco",
        country: "USA",
        costIndex: 9,
        popularityScore: 85,
        imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
      },
    }),
    prisma.city.create({
      data: {
        name: "Los Angeles",
        country: "USA",
        costIndex: 8,
        popularityScore: 90,
        imageUrl: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800",
      },
    }),
    // Italy
    prisma.city.create({
      data: {
        name: "Rome",
        country: "Italy",
        costIndex: 7,
        popularityScore: 92,
        imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
      },
    }),
    prisma.city.create({
      data: {
        name: "Venice",
        country: "Italy",
        costIndex: 8,
        popularityScore: 88,
        imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800",
      },
    }),
    // Thailand
    prisma.city.create({
      data: {
        name: "Bangkok",
        country: "Thailand",
        costIndex: 3,
        popularityScore: 88,
        imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800",
      },
    }),
    prisma.city.create({
      data: {
        name: "Chiang Mai",
        country: "Thailand",
        costIndex: 2,
        popularityScore: 74,
        imageUrl: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800",
      },
    }),
    // UK
    prisma.city.create({
      data: {
        name: "London",
        country: "UK",
        costIndex: 9,
        popularityScore: 96,
        imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
      },
    }),
    // Australia
    prisma.city.create({
      data: {
        name: "Sydney",
        country: "Australia",
        costIndex: 8,
        popularityScore: 85,
        imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
      },
    }),
    // Turkey
    prisma.city.create({
      data: {
        name: "Istanbul",
        country: "Turkey",
        costIndex: 4,
        popularityScore: 83,
        imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
      },
    }),
  ]);

  console.log(`✅ Created ${cities.length} cities\n`);

  // Map city names to their IDs for activity seeding
  const cityMap = new Map(cities.map((c) => [c.name, c.id]));

  // ──────────────────────────────────────────────
  // ACTIVITIES — 28 activities across multiple cities
  // ──────────────────────────────────────────────
  const activitiesData = [
    // Mumbai (India)
    { cityName: "Mumbai", name: "Gateway of India Tour", category: "sightseeing", cost: 15, durationMinutes: 120, description: "Visit the iconic Gateway of India and take a ferry to Elephanta Caves." },
    { cityName: "Mumbai", name: "Street Food Walk in Chowpatty", category: "food", cost: 25, durationMinutes: 180, description: "Guided street food tour through Mumbai's famous Chowpatty Beach area." },
    // Jaipur (India)
    { cityName: "Jaipur", name: "Amber Fort Exploration", category: "culture", cost: 20, durationMinutes: 240, description: "Explore the magnificent Amber Fort with its intricate architecture." },
    { cityName: "Jaipur", name: "Bazaar Shopping Tour", category: "shopping", cost: 10, durationMinutes: 180, description: "Navigate Jaipur's colorful bazaars for textiles, jewelry, and crafts." },
    // Tokyo (Japan)
    { cityName: "Tokyo", name: "Shibuya & Harajuku Walk", category: "sightseeing", cost: 0, durationMinutes: 180, description: "Walk through Shibuya Crossing and explore the quirky Harajuku district." },
    { cityName: "Tokyo", name: "Tsukiji Outer Market Food Tour", category: "food", cost: 60, durationMinutes: 150, description: "Sample fresh sushi, tamagoyaki, and street food at Tsukiji Outer Market." },
    { cityName: "Tokyo", name: "Robot Restaurant Show", category: "nightlife", cost: 80, durationMinutes: 90, description: "Experience the wild, neon-lit Robot Restaurant show in Shinjuku." },
    // Kyoto (Japan)
    { cityName: "Kyoto", name: "Fushimi Inari Shrine Hike", category: "nature", cost: 0, durationMinutes: 180, description: "Hike through thousands of vermillion torii gates at Fushimi Inari." },
    { cityName: "Kyoto", name: "Tea Ceremony Experience", category: "culture", cost: 45, durationMinutes: 90, description: "Participate in a traditional Japanese tea ceremony with a tea master." },
    // Paris (France)
    { cityName: "Paris", name: "Eiffel Tower Summit Visit", category: "sightseeing", cost: 35, durationMinutes: 120, description: "Skip-the-line access to the summit of the Eiffel Tower." },
    { cityName: "Paris", name: "Louvre Museum Guided Tour", category: "culture", cost: 55, durationMinutes: 180, description: "Expert-guided tour of the Louvre's masterpieces including the Mona Lisa." },
    { cityName: "Paris", name: "Seine River Dinner Cruise", category: "food", cost: 95, durationMinutes: 150, description: "Elegant dinner cruise along the Seine with views of illuminated Paris." },
    // New York (USA)
    { cityName: "New York", name: "Central Park Bike Tour", category: "nature", cost: 45, durationMinutes: 120, description: "Guided bicycle tour through Central Park's scenic pathways." },
    { cityName: "New York", name: "Broadway Show", category: "nightlife", cost: 150, durationMinutes: 180, description: "Premium seats for a top Broadway musical performance." },
    { cityName: "New York", name: "Statue of Liberty & Ellis Island", category: "sightseeing", cost: 25, durationMinutes: 240, description: "Ferry to Liberty Island and guided tour of the Statue and Ellis Island." },
    // Rome (Italy)
    { cityName: "Rome", name: "Colosseum & Roman Forum Tour", category: "culture", cost: 50, durationMinutes: 180, description: "Skip-the-line guided tour of the Colosseum, Palatine Hill, and Forum." },
    { cityName: "Rome", name: "Trastevere Food Walk", category: "food", cost: 65, durationMinutes: 180, description: "Taste authentic Roman cuisine on a walking tour through Trastevere." },
    // Bangkok (Thailand)
    { cityName: "Bangkok", name: "Grand Palace & Wat Phra Kaew", category: "sightseeing", cost: 15, durationMinutes: 180, description: "Tour the stunning Grand Palace complex and Temple of the Emerald Buddha." },
    { cityName: "Bangkok", name: "Floating Market Day Trip", category: "shopping", cost: 30, durationMinutes: 300, description: "Visit the famous Damnoen Saduak Floating Market outside Bangkok." },
    { cityName: "Bangkok", name: "Thai Cooking Class", category: "food", cost: 35, durationMinutes: 240, description: "Learn to cook authentic Thai dishes with a local chef." },
    // London (UK)
    { cityName: "London", name: "Tower of London & Crown Jewels", category: "culture", cost: 35, durationMinutes: 180, description: "Explore the historic Tower of London and see the Crown Jewels." },
    { cityName: "London", name: "West End Theatre Show", category: "nightlife", cost: 85, durationMinutes: 180, description: "Top-tier seats for a West End musical or play." },
    // Sydney (Australia)
    { cityName: "Sydney", name: "Sydney Harbour Bridge Climb", category: "adventure", cost: 175, durationMinutes: 210, description: "Climb to the summit of the Sydney Harbour Bridge for panoramic views." },
    { cityName: "Sydney", name: "Bondi to Coogee Coastal Walk", category: "nature", cost: 0, durationMinutes: 120, description: "Scenic coastal walk from Bondi Beach to Coogee Beach." },
    // Istanbul (Turkey)
    { cityName: "Istanbul", name: "Hagia Sophia & Blue Mosque Tour", category: "culture", cost: 25, durationMinutes: 180, description: "Guided tour of Istanbul's most iconic religious monuments." },
    { cityName: "Istanbul", name: "Grand Bazaar Shopping", category: "shopping", cost: 10, durationMinutes: 180, description: "Navigate the world's oldest and largest covered market." },
    // Goa (India)
    { cityName: "Goa", name: "Dudhsagar Falls Trek", category: "adventure", cost: 35, durationMinutes: 480, description: "Full-day trek to the magnificent Dudhsagar waterfall." },
    // San Francisco (USA)
    { cityName: "San Francisco", name: "Golden Gate Bridge Bike Ride", category: "adventure", cost: 40, durationMinutes: 180, description: "Rent a bike and ride across the Golden Gate Bridge to Sausalito." },
  ];

  const activities = [];
  for (const act of activitiesData) {
    const cityId = cityMap.get(act.cityName);
    if (!cityId) {
      console.warn(`⚠️  City not found: ${act.cityName}, skipping activity: ${act.name}`);
      continue;
    }
    const activity = await prisma.activity.create({
      data: {
        cityId,
        name: act.name,
        category: act.category,
        cost: act.cost,
        durationMinutes: act.durationMinutes,
        description: act.description,
      },
    });
    activities.push(activity);
  }

  console.log(`✅ Created ${activities.length} activities\n`);

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  const cityCount = await prisma.city.count();
  const activityCount = await prisma.activity.count();

  console.log("📊 Seed Summary:");
  console.log(`   Cities:     ${cityCount}`);
  console.log(`   Activities: ${activityCount}`);
  console.log("\n🎉 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
