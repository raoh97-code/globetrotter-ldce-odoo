import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌍 Seeding additional cities and activities...\n");

  // ──────────────────────────────────────────────
  // NEW CITIES — 12 additional cities
  // ──────────────────────────────────────────────
  const newCitiesData = [
    // Spain
    { name: "Barcelona", country: "Spain", costIndex: 7, popularityScore: 91, imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800" },
    { name: "Madrid", country: "Spain", costIndex: 7, popularityScore: 85, imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800" },
    // Germany
    { name: "Berlin", country: "Germany", costIndex: 6, popularityScore: 84, imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800" },
    { name: "Munich", country: "Germany", costIndex: 7, popularityScore: 79, imageUrl: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800" },
    // South Korea
    { name: "Seoul", country: "South Korea", costIndex: 6, popularityScore: 89, imageUrl: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800" },
    // Vietnam
    { name: "Ho Chi Minh City", country: "Vietnam", costIndex: 2, popularityScore: 76, imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800" },
    // Morocco
    { name: "Marrakech", country: "Morocco", costIndex: 3, popularityScore: 81, imageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800" },
    // Brazil
    { name: "Rio de Janeiro", country: "Brazil", costIndex: 5, popularityScore: 90, imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800" },
    // Greece
    { name: "Santorini", country: "Greece", costIndex: 8, popularityScore: 93, imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800" },
    { name: "Athens", country: "Greece", costIndex: 6, popularityScore: 86, imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800" },
    // UAE
    { name: "Dubai", country: "UAE", costIndex: 9, popularityScore: 94, imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800" },
    // Mexico
    { name: "Mexico City", country: "Mexico", costIndex: 4, popularityScore: 82, imageUrl: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800" },
  ];

  const newCities = [];
  for (const cityData of newCitiesData) {
    const existing = await prisma.city.findFirst({ where: { name: cityData.name, country: cityData.country } });
    if (existing) {
      console.log(`  ⏭️  City already exists: ${cityData.name}, ${cityData.country}`);
      newCities.push(existing);
    } else {
      const city = await prisma.city.create({ data: cityData });
      newCities.push(city);
      console.log(`  ✅ Created city: ${city.name}, ${city.country}`);
    }
  }

  // Build a map of ALL cities (existing + new) by name
  const allCities = await prisma.city.findMany();
  const cityMap = new Map(allCities.map((c) => [c.name, c.id]));

  // ──────────────────────────────────────────────
  // ADDITIONAL ACTIVITIES for EXISTING cities
  // ──────────────────────────────────────────────
  const additionalActivities = [
    // Mumbai - add more
    { cityName: "Mumbai", name: "Bollywood Studio Tour", category: "culture", cost: 30, durationMinutes: 240, description: "Behind-the-scenes tour of Film City, Bollywood's largest studio complex." },
    { cityName: "Mumbai", name: "Dharavi Slum Walking Tour", category: "culture", cost: 15, durationMinutes: 180, description: "Eye-opening guided walk through Asia's largest slum and its thriving micro-industries." },
    // Jaipur - add more
    { cityName: "Jaipur", name: "Hot Air Balloon Ride", category: "adventure", cost: 150, durationMinutes: 60, description: "Sunrise hot air balloon flight over Jaipur's palaces and forts." },
    { cityName: "Jaipur", name: "Hawa Mahal & City Palace Tour", category: "sightseeing", cost: 15, durationMinutes: 180, description: "Visit the iconic Palace of Winds and the grand City Palace complex." },
    // Goa - add more
    { cityName: "Goa", name: "Scuba Diving at Grande Island", category: "adventure", cost: 60, durationMinutes: 300, description: "Boat trip to Grande Island with two guided scuba dives in crystal clear waters." },
    { cityName: "Goa", name: "Old Goa Heritage Walk", category: "culture", cost: 10, durationMinutes: 150, description: "Guided walking tour of Portuguese-era churches including the Basilica of Bom Jesus." },
    // Tokyo - add more
    { cityName: "Tokyo", name: "Akihabara Electronics & Anime Tour", category: "shopping", cost: 20, durationMinutes: 180, description: "Explore Tokyo's famous Electric Town with its anime stores, arcades, and tech shops." },
    { cityName: "Tokyo", name: "Sumo Wrestling Tournament Viewing", category: "culture", cost: 100, durationMinutes: 300, description: "Premium seats at a professional sumo wrestling match at Ryogoku Kokugikan." },
    { cityName: "Tokyo", name: "Mount Fuji Day Trip", category: "nature", cost: 85, durationMinutes: 720, description: "Full-day guided bus tour to Mount Fuji's 5th station with lake cruise." },
    // Kyoto - add more
    { cityName: "Kyoto", name: "Bamboo Grove & Arashiyama Walk", category: "nature", cost: 0, durationMinutes: 150, description: "Walk through the serene Arashiyama Bamboo Grove and Monkey Park." },
    { cityName: "Kyoto", name: "Geisha District Night Tour", category: "nightlife", cost: 50, durationMinutes: 120, description: "Evening walking tour of Gion district with chance to spot maiko (apprentice geisha)." },
    // Paris - add more
    { cityName: "Paris", name: "Montmartre Art Walk", category: "culture", cost: 20, durationMinutes: 150, description: "Walking tour of Montmartre's artistic heritage, including Place du Tertre and Sacré-Cœur." },
    { cityName: "Paris", name: "Palace of Versailles Day Trip", category: "sightseeing", cost: 50, durationMinutes: 480, description: "Full-day guided tour of the Palace of Versailles and its magnificent gardens." },
    // New York - add more
    { cityName: "New York", name: "High Line Walk & Chelsea Market", category: "sightseeing", cost: 0, durationMinutes: 120, description: "Stroll the elevated High Line park and explore Chelsea Market's artisan food vendors." },
    { cityName: "New York", name: "Brooklyn Bridge & DUMBO Tour", category: "sightseeing", cost: 0, durationMinutes: 150, description: "Walk across the iconic Brooklyn Bridge and explore DUMBO's waterfront." },
    { cityName: "New York", name: "Jazz Club Evening in Harlem", category: "nightlife", cost: 40, durationMinutes: 180, description: "Evening of live jazz at a legendary Harlem jazz club with dinner option." },
    // Rome - add more
    { cityName: "Rome", name: "Vatican Museums & Sistine Chapel", category: "culture", cost: 30, durationMinutes: 240, description: "Skip-the-line tour of the Vatican Museums, Raphael Rooms, and Sistine Chapel." },
    { cityName: "Rome", name: "Pizza Making Class", category: "food", cost: 55, durationMinutes: 150, description: "Learn to make authentic Roman pizza from scratch with a master pizzaiolo." },
    // Bangkok - add more
    { cityName: "Bangkok", name: "Khao San Road Night Tour", category: "nightlife", cost: 15, durationMinutes: 180, description: "Experience Bangkok's famous backpacker street at night with street food and bars." },
    { cityName: "Bangkok", name: "Temple of Dawn (Wat Arun) Visit", category: "sightseeing", cost: 5, durationMinutes: 90, description: "Visit the stunning Temple of Dawn on the Chao Phraya River banks." },
    // London - add more
    { cityName: "London", name: "Harry Potter Studio Tour", category: "culture", cost: 55, durationMinutes: 300, description: "Warner Bros. Studio Tour London featuring original sets, props, and costumes." },
    { cityName: "London", name: "Borough Market Food Tour", category: "food", cost: 40, durationMinutes: 180, description: "Guided tasting tour through London's oldest and most famous food market." },
    // Sydney - add more
    { cityName: "Sydney", name: "Opera House Backstage Tour", category: "culture", cost: 45, durationMinutes: 120, description: "Go behind the scenes at the iconic Sydney Opera House with a guide." },
    { cityName: "Sydney", name: "Blue Mountains Day Trip", category: "nature", cost: 95, durationMinutes: 600, description: "Full-day trip to the Blue Mountains with scenic railway and bushwalking." },
    // Istanbul - add more
    { cityName: "Istanbul", name: "Bosphorus Sunset Cruise", category: "sightseeing", cost: 40, durationMinutes: 150, description: "Evening cruise along the Bosphorus strait with dinner and live music." },
    { cityName: "Istanbul", name: "Turkish Hammam Experience", category: "culture", cost: 50, durationMinutes: 90, description: "Traditional Turkish bath experience at a historic hammam with full scrub and massage." },

    // ──────────────────────────────────────────────
    // ACTIVITIES for NEW CITIES
    // ──────────────────────────────────────────────
    // Barcelona
    { cityName: "Barcelona", name: "Sagrada Família Skip-the-Line Tour", category: "sightseeing", cost: 40, durationMinutes: 120, description: "Guided tour of Gaudí's unfinished masterpiece with tower access." },
    { cityName: "Barcelona", name: "Park Güell & Gothic Quarter Walk", category: "sightseeing", cost: 15, durationMinutes: 240, description: "Explore Gaudí's colorful Park Güell and the medieval Gothic Quarter." },
    { cityName: "Barcelona", name: "La Boqueria Market Food Tour", category: "food", cost: 35, durationMinutes: 150, description: "Guided tasting tour of Barcelona's legendary La Boqueria food market." },
    { cityName: "Barcelona", name: "Flamenco Show with Tapas", category: "nightlife", cost: 45, durationMinutes: 120, description: "Authentic flamenco performance with traditional Spanish tapas dinner." },
    // Madrid
    { cityName: "Madrid", name: "Prado Museum Guided Tour", category: "culture", cost: 25, durationMinutes: 180, description: "Expert-led tour of Spain's premier art museum featuring Velázquez and Goya." },
    { cityName: "Madrid", name: "Royal Palace & Retiro Park", category: "sightseeing", cost: 15, durationMinutes: 240, description: "Tour the grand Royal Palace followed by a stroll through Retiro Park." },
    { cityName: "Madrid", name: "Tapas Crawl in La Latina", category: "food", cost: 40, durationMinutes: 180, description: "Guided tapas bar crawl through Madrid's most authentic neighborhood." },
    // Berlin
    { cityName: "Berlin", name: "Berlin Wall & Cold War History Tour", category: "culture", cost: 20, durationMinutes: 180, description: "Walking tour of Berlin Wall remnants, Checkpoint Charlie, and Cold War history." },
    { cityName: "Berlin", name: "Museum Island Tour", category: "culture", cost: 25, durationMinutes: 300, description: "Visit the UNESCO-listed Museum Island with five world-class museums." },
    { cityName: "Berlin", name: "Berlin Street Art & Food Tour", category: "food", cost: 30, durationMinutes: 210, description: "Explore Berlin's vibrant street art scene with local craft beer and street food." },
    // Munich
    { cityName: "Munich", name: "Neuschwanstein Castle Day Trip", category: "sightseeing", cost: 60, durationMinutes: 600, description: "Full-day excursion to the fairy-tale Neuschwanstein Castle in the Bavarian Alps." },
    { cityName: "Munich", name: "Oktoberfest Beer Hall Experience", category: "food", cost: 25, durationMinutes: 180, description: "Traditional beer hall evening at Hofbräuhaus with pretzels and Bavarian cuisine." },
    // Seoul
    { cityName: "Seoul", name: "Gyeongbokgung Palace & Hanbok Rental", category: "culture", cost: 15, durationMinutes: 240, description: "Visit the grand Joseon palace while dressed in traditional Korean hanbok." },
    { cityName: "Seoul", name: "Korean BBQ & Soju Night Tour", category: "food", cost: 35, durationMinutes: 180, description: "Guided evening tour of Seoul's best Korean BBQ joints and soju bars." },
    { cityName: "Seoul", name: "K-Pop Dance Class", category: "culture", cost: 25, durationMinutes: 90, description: "Learn K-Pop choreography from professional dance instructors." },
    { cityName: "Seoul", name: "DMZ Border Tour", category: "sightseeing", cost: 55, durationMinutes: 480, description: "Full-day tour to the Korean Demilitarized Zone with JSA and observation post." },
    // Ho Chi Minh City
    { cityName: "Ho Chi Minh City", name: "Cu Chi Tunnels Tour", category: "culture", cost: 20, durationMinutes: 300, description: "Explore the famous Viet Cong tunnel network used during the Vietnam War." },
    { cityName: "Ho Chi Minh City", name: "Street Food Motorbike Tour", category: "food", cost: 25, durationMinutes: 240, description: "Hop on the back of a motorbike for a thrilling street food adventure." },
    { cityName: "Ho Chi Minh City", name: "Mekong Delta Day Trip", category: "nature", cost: 30, durationMinutes: 600, description: "Boat cruise through the Mekong Delta with village visits and fruit orchards." },
    // Marrakech
    { cityName: "Marrakech", name: "Medina Souk Walking Tour", category: "shopping", cost: 15, durationMinutes: 180, description: "Navigate the labyrinthine souks of Marrakech's ancient medina with a local guide." },
    { cityName: "Marrakech", name: "Moroccan Cooking Class", category: "food", cost: 35, durationMinutes: 240, description: "Learn to prepare tagine, couscous, and Moroccan pastries in a traditional riad." },
    { cityName: "Marrakech", name: "Atlas Mountains Day Hike", category: "adventure", cost: 40, durationMinutes: 480, description: "Full-day guided hike in the High Atlas Mountains with Berber village visit." },
    // Rio de Janeiro
    { cityName: "Rio de Janeiro", name: "Christ the Redeemer & Sugarloaf", category: "sightseeing", cost: 35, durationMinutes: 300, description: "Visit both iconic landmarks with cable car rides and panoramic views." },
    { cityName: "Rio de Janeiro", name: "Copacabana Beach & Ipanema Walk", category: "nature", cost: 0, durationMinutes: 180, description: "Stroll along Rio's world-famous beaches with caipirinha stops." },
    { cityName: "Rio de Janeiro", name: "Samba Dance Class", category: "culture", cost: 20, durationMinutes: 90, description: "Learn samba basics at a dance studio in the Lapa neighborhood." },
    { cityName: "Rio de Janeiro", name: "Favela Community Tour", category: "culture", cost: 25, durationMinutes: 180, description: "Responsible community-led tour of a Rio favela with cultural experiences." },
    // Santorini
    { cityName: "Santorini", name: "Caldera Sunset Sailing Cruise", category: "adventure", cost: 100, durationMinutes: 300, description: "Catamaran cruise around the volcanic caldera with swimming, BBQ, and sunset views." },
    { cityName: "Santorini", name: "Wine Tasting Tour", category: "food", cost: 55, durationMinutes: 240, description: "Visit three family-owned wineries sampling volcanic wines with local cheese pairings." },
    { cityName: "Santorini", name: "Oia Village Walking Tour", category: "sightseeing", cost: 0, durationMinutes: 120, description: "Walk through the iconic white-and-blue streets of Oia village." },
    // Athens
    { cityName: "Athens", name: "Acropolis & Parthenon Guided Tour", category: "culture", cost: 30, durationMinutes: 180, description: "Expert-guided tour of the ancient Acropolis and Parthenon with museum visit." },
    { cityName: "Athens", name: "Athens Food Walk in Plaka", category: "food", cost: 40, durationMinutes: 210, description: "Taste traditional Greek dishes on a walking tour through the Plaka neighborhood." },
    { cityName: "Athens", name: "Cape Sounion Sunset Trip", category: "sightseeing", cost: 45, durationMinutes: 300, description: "Half-day trip to the Temple of Poseidon at Cape Sounion for a legendary sunset." },
    // Dubai
    { cityName: "Dubai", name: "Burj Khalifa At The Top Observation", category: "sightseeing", cost: 45, durationMinutes: 90, description: "Visit the world's tallest building observation deck on the 124th and 125th floors." },
    { cityName: "Dubai", name: "Desert Safari with Dune Bashing", category: "adventure", cost: 70, durationMinutes: 360, description: "4x4 dune bashing, camel riding, and BBQ dinner under the stars in the Arabian Desert." },
    { cityName: "Dubai", name: "Dubai Mall & Aquarium", category: "shopping", cost: 35, durationMinutes: 240, description: "Explore the world's largest mall with underwater zoo and fountain show." },
    { cityName: "Dubai", name: "Dhow Dinner Cruise on Dubai Creek", category: "food", cost: 55, durationMinutes: 120, description: "Traditional wooden dhow cruise with buffet dinner and live entertainment." },
    // Mexico City
    { cityName: "Mexico City", name: "Teotihuacán Pyramids Day Trip", category: "culture", cost: 35, durationMinutes: 480, description: "Full-day trip to the ancient pyramids of Teotihuacán with mezcal tasting." },
    { cityName: "Mexico City", name: "Xochimilco Floating Gardens", category: "nature", cost: 20, durationMinutes: 240, description: "Colorful trajinera boat ride through the ancient Aztec canal system." },
    { cityName: "Mexico City", name: "Street Taco Tour in Centro Histórico", category: "food", cost: 25, durationMinutes: 180, description: "Guided taco crawl through the historic center sampling authentic street food." },
    { cityName: "Mexico City", name: "Frida Kahlo Museum Visit", category: "culture", cost: 15, durationMinutes: 120, description: "Tour the famous Casa Azul (Blue House) museum dedicated to Frida Kahlo." },
  ];

  let newActivityCount = 0;
  for (const act of additionalActivities) {
    const cityId = cityMap.get(act.cityName);
    if (!cityId) {
      console.warn(`  ⚠️ City not found: ${act.cityName}, skipping: ${act.name}`);
      continue;
    }
    // Check if activity already exists
    const existing = await prisma.activity.findFirst({ where: { name: act.name, cityId } });
    if (existing) {
      console.log(`  ⏭️  Activity already exists: ${act.name} (${act.cityName})`);
      continue;
    }
    await prisma.activity.create({
      data: {
        cityId,
        name: act.name,
        category: act.category,
        cost: act.cost,
        durationMinutes: act.durationMinutes,
        description: act.description,
      },
    });
    newActivityCount++;
  }

  console.log(`\n✅ Created ${newCities.filter((c) => !c.id).length} new cities`);
  console.log(`✅ Created ${newActivityCount} new activities\n`);

  // Summary
  const totalCities = await prisma.city.count();
  const totalActivities = await prisma.activity.count();
  console.log("📊 Updated Database Summary:");
  console.log(`   Total Cities:     ${totalCities}`);
  console.log(`   Total Activities: ${totalActivities}`);
  console.log("\n🎉 Additional seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
