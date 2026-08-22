import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🇮🇳 Seeding Expanded India States, Cities, and Activities...\n");

  // Define cities data with States
  const indiaCitiesData = [
    // ─── GUJARAT ───
    {
      name: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      costIndex: 3,
      popularityScore: 85,
      imageUrl: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
      activities: [
        { name: "Sabarmati Ashram Tour", category: "culture", cost: 0, durationMinutes: 120, description: "Visit Mahatma Gandhi's historic abode along the banks of Sabarmati River." },
        { name: "Heritage Walk in Old City", category: "sightseeing", cost: 200, durationMinutes: 180, description: "Explore ancient Pols, wooden architecture, and secret passages of Walled City." },
        { name: "Law Garden Night Market Shopping", category: "shopping", cost: 500, durationMinutes: 150, description: "Shop for authentic Chaniya Cholis, traditional handicrafts, and Gujarati street food." },
        { name: "Kankaria Lake Front & Toy Train", category: "nature", cost: 100, durationMinutes: 180, description: "Enjoy balloon rides, toy train journeys, and lakefront entertainment." },
        { name: "Akshardham Temple Day Excursion", category: "culture", cost: 150, durationMinutes: 240, description: "Stunning pink sandstone temple complex with water show in Gandhinagar." },
        { name: "Science City Robotic Gallery Visit", category: "adventure", cost: 250, durationMinutes: 210, description: "Explore India's largest robotics gallery, aquatic gallery, and 3D IMAX theater." },
      ],
    },
    {
      name: "Surat",
      state: "Gujarat",
      country: "India",
      costIndex: 3,
      popularityScore: 78,
      imageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800",
      activities: [
        { name: "Dumas Beach Sunset Walk", category: "nature", cost: 0, durationMinutes: 120, description: "Walk along the iconic black sand beach famous for street food stalls." },
        { name: "Dutch Garden & Cemetery Tour", category: "culture", cost: 50, durationMinutes: 90, description: "Explore European historical tombs and serene manicured gardens." },
        { name: "Textile & Diamond Market Shopping", category: "shopping", cost: 1000, durationMinutes: 240, description: "Guided tour through Surat's world-renowned silk and diamond trading hubs." },
        { name: "Gopi Talav Recreation Park", category: "sightseeing", cost: 100, durationMinutes: 150, description: "Historical urban lake turned into a vibrant recreational hub." },
      ],
    },
    {
      name: "Vadodara",
      state: "Gujarat",
      country: "India",
      costIndex: 3,
      popularityScore: 80,
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      activities: [
        { name: "Laxmi Vilas Palace Tour", category: "culture", cost: 250, durationMinutes: 180, description: "Four times the size of Buckingham Palace, showcasing royal Maratha grandeur." },
        { name: "Sayaji Baug & Toy Train", category: "nature", cost: 50, durationMinutes: 150, description: "Vast city garden featuring a planetarium, zoo, and mini train." },
        { name: "Champaner-Pavagadh UNESCO Excursion", category: "sightseeing", cost: 500, durationMinutes: 420, description: "Day trip to ancient hill fortress, stepwells, and ropeway temple." },
        { name: "Baroda Museum & Picture Gallery", category: "culture", cost: 100, durationMinutes: 120, description: "Rich collection of European oil paintings and royal Indian artifacts." },
      ],
    },
    {
      name: "Rann of Kutch",
      state: "Gujarat",
      country: "India",
      costIndex: 5,
      popularityScore: 92,
      imageUrl: "https://images.unsplash.com/photo-1627894099068-d06941584061?w=800",
      activities: [
        { name: "White Desert Full Moon Night Safari", category: "adventure", cost: 800, durationMinutes: 240, description: "Witness the surreal glowing white salt desert under the moonlight." },
        { name: "Kala Dungar Sunset View", category: "nature", cost: 200, durationMinutes: 180, description: "Panoramic view of the Great Rann from the highest point in Kutch." },
        { name: "Prag Mahal & Aina Mahal Tour", category: "culture", cost: 150, durationMinutes: 150, description: "Italian Gothic palace and hall of mirrors in historic Bhuj." },
        { name: "Khavda Handicraft & Embroidery Village", category: "shopping", cost: 400, durationMinutes: 180, description: "Purchase famous Kutchi embroidery and Rogan art directly from artisans." },
      ],
    },
    {
      name: "Dwarka & Somnath",
      state: "Gujarat",
      country: "India",
      costIndex: 3,
      popularityScore: 88,
      imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
      activities: [
        { name: "Dwarkadhish Temple Morning Darshan", category: "culture", cost: 0, durationMinutes: 120, description: "Worship at Lord Krishna's ancient kingdom temple on Gomti river banks." },
        { name: "Bet Dwarka Island Boat Trip", category: "adventure", cost: 300, durationMinutes: 240, description: "Ferry boat trip across the Gulf of Kutch to the sacred island." },
        { name: "Somnath Seafront Temple Sound & Light Show", category: "culture", cost: 100, durationMinutes: 150, description: "First among the 12 sacred Jyotirlingas, overlooking the Arabian Sea." },
      ],
    },

    // ─── MAHARASHTRA ───
    {
      name: "Mumbai",
      state: "Maharashtra",
      country: "India",
      costIndex: 4,
      popularityScore: 95,
      imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
      activities: [
        { name: "Gateway of India & Ferry to Elephanta", category: "sightseeing", cost: 300, durationMinutes: 240, description: "Iconic colonial arch and boat cruise to ancient rock-cut cave temples." },
        { name: "Marine Drive Queen's Necklace Sunset Walk", category: "nature", cost: 0, durationMinutes: 120, description: "Stroll along C-shaped boulevard as city lights turn on." },
        { name: "Chowpatty Street Food Feast", category: "food", cost: 400, durationMinutes: 180, description: "Savor Pav Bhaji, Pani Puri, Bhel Puri, and Kulfi at Girgaon Chowpatty." },
        { name: "Colaba Causeway Bargain Shopping", category: "shopping", cost: 600, durationMinutes: 180, description: "Bustling street market for jewelry, clothes, antiques, and Cafe Mondegar." },
        { name: "Dharavi Community Walking Tour", category: "culture", cost: 600, durationMinutes: 180, description: "Guided walk understanding leather, recycling, and pottery micro-industries." },
        { name: "Bollywood Film City Studio Tour", category: "culture", cost: 1500, durationMinutes: 240, description: "Behind-the-scenes access to active sets, dance shows, and dubbing studios." },
      ],
    },
    {
      name: "Pune",
      state: "Maharashtra",
      country: "India",
      costIndex: 3,
      popularityScore: 84,
      imageUrl: "https://images.unsplash.com/photo-1618386230353-3631c1ca65be?w=800",
      activities: [
        { name: "Shaniwar Wada Historical Exploration", category: "culture", cost: 100, durationMinutes: 120, description: "18th-century Peshwa fortified palace famous for Bajirao Peshwa history." },
        { name: "Aga Khan Palace & Gandhi Memorial", category: "culture", cost: 50, durationMinutes: 120, description: "Italian arch palace where Mahatma Gandhi was interned during Freedom struggle." },
        { name: "Sinhagad Fort Trek & Pithla Bhakri", category: "adventure", cost: 200, durationMinutes: 240, description: "Hike up the hilltop fortress and relish traditional rural Maharashtrian meal." },
        { name: "Dagadusheth Ganpati Darshan & FC Road Walk", category: "sightseeing", cost: 0, durationMinutes: 180, description: "Visit famous gold-adorned Ganesha temple and street shop at Fergusson College road." },
      ],
    },
    {
      name: "Nashik",
      state: "Maharashtra",
      country: "India",
      costIndex: 3,
      popularityScore: 80,
      imageUrl: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800",
      activities: [
        { name: "Sula Vineyards Wine Tasting & Vineyard Tour", category: "food", cost: 1000, durationMinutes: 240, description: "Tour India's premier winery, stomping grapes and tasting reserve wines." },
        { name: "Trimbakeshwar Temple Holy Darshan", category: "culture", cost: 0, durationMinutes: 180, description: "Sacred Jyotirlinga temple at the source of Godavari river." },
        { name: "Panchavati & Ram Kund Heritage Walk", category: "sightseeing", cost: 0, durationMinutes: 150, description: "Revered Ramayana sites along the holy Godavari river ghats." },
      ],
    },
    {
      name: "Chhatrapati Sambhajinagar (Aurangabad)",
      state: "Maharashtra",
      country: "India",
      costIndex: 3,
      popularityScore: 86,
      imageUrl: "https://images.unsplash.com/photo-1627894099068-d06941584061?w=800",
      activities: [
        { name: "Ajanta Caves Full Day Excursion", category: "culture", cost: 600, durationMinutes: 480, description: "UNESCO rock-cut Buddhist cave monuments with ancient fresco paintings." },
        { name: "Ellora Caves & Kailasa Temple Tour", category: "culture", cost: 500, durationMinutes: 300, description: "World's largest monolithic rock-cut structure carved out of single rock." },
        { name: "Bibi Ka Maqbara (Taj of Deccan)", category: "sightseeing", cost: 100, durationMinutes: 120, description: "Mughal architecture built by Azam Shah in memory of his mother." },
        { name: "Daulatabad Fort Hill Hike", category: "adventure", cost: 150, durationMinutes: 210, description: "Conquer the medieval impregnable fort with dark maze passages (Bhool Bhulaiyaa)." },
      ],
    },
    {
      name: "Mahabaleshwar",
      state: "Maharashtra",
      country: "India",
      costIndex: 3,
      popularityScore: 82,
      imageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800",
      activities: [
        { name: "Arthur's Seat & Echo Point Viewpoint", category: "nature", cost: 0, durationMinutes: 150, description: "Breathtaking cliff views of Savitri river valley from Western Ghats." },
        { name: "Mapro Garden Strawberry Tasting", category: "food", cost: 300, durationMinutes: 120, description: "Enjoy fresh strawberry cream, wood-fired pizzas, and berry preserves." },
        { name: "Venna Lake Boating & Horse Riding", category: "adventure", cost: 400, durationMinutes: 180, description: "Row boating on scenic hill station lake surrounded by pine trees." },
      ],
    },

    // ─── RAJASTHAN ───
    {
      name: "Jaipur",
      state: "Rajasthan",
      country: "India",
      costIndex: 3,
      popularityScore: 94,
      imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      activities: [
        { name: "Amber Fort Elephant / Jeep Safari", category: "sightseeing", cost: 500, durationMinutes: 240, description: "Majestic hilltop fort with Sheesh Mahal mirror palace overlooking Maota Lake." },
        { name: "Hawa Mahal & Palace of Winds Walk", category: "culture", cost: 200, durationMinutes: 120, description: "Iconic 953-window pink sandstone facade built for royal ladies." },
        { name: "City Palace & Jantar Mantar Observatory", category: "culture", cost: 400, durationMinutes: 180, description: "Royal museum residence and UNESCO medieval astronomical instruments." },
        { name: "Nahargarh Fort Sunset Viewpoint", category: "nature", cost: 150, durationMinutes: 150, description: "Panoramic golden sunset over the entire Pink City from fortress walls." },
        { name: "Johari Bazaar Handicraft & Textile Shopping", category: "shopping", cost: 800, durationMinutes: 180, description: "Shop Jaipur's famous Block Print textiles, Kundan jewelry, and Blue Pottery." },
        { name: "Chokhi Dhani Ethnic Rajasthani Village Feast", category: "food", cost: 1000, durationMinutes: 240, description: "Unlimited Dal Baati Churma with folk dance, puppet shows, and rides." },
      ],
    },
    {
      name: "Udaipur",
      state: "Rajasthan",
      country: "India",
      costIndex: 4,
      popularityScore: 93,
      imageUrl: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800",
      activities: [
        { name: "City Palace Udaipur Grand Tour", category: "culture", cost: 400, durationMinutes: 240, description: "Rajasthan's largest palace complex overlooking Lake Pichola." },
        { name: "Lake Pichola Sunset Boat Cruise", category: "nature", cost: 700, durationMinutes: 120, description: "Glide past Jag Mandir and Taj Lake Palace in the City of Lakes." },
        { name: "Bagore Ki Haveli Rajasthani Folk Dance Show", category: "culture", cost: 200, durationMinutes: 90, description: "Dharohar dance performance including fire dance and puppet theater." },
        { name: "Saheliyon Ki Bari Royal Garden Stroll", category: "nature", cost: 100, durationMinutes: 90, description: "Marble fountains, lotus pools, and lush lawns built for royal maidens." },
      ],
    },
    {
      name: "Jodhpur",
      state: "Rajasthan",
      country: "India",
      costIndex: 3,
      popularityScore: 89,
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
      activities: [
        { name: "Mehrangarh Fort Tour & Flying Fox Zip-line", category: "adventure", cost: 800, durationMinutes: 240, description: "Imposing fortress rising 400 feet above the famous Blue City." },
        { name: "Blue City Guided Alleyway Walk", category: "sightseeing", cost: 300, durationMinutes: 150, description: "Explore vibrant blue-painted houses in the old indigo heritage quarter." },
        { name: "Jaswant Thada Royal Cenotaphs", category: "culture", cost: 100, durationMinutes: 90, description: "Milky white marble memorial carved delicately with lake views." },
        { name: "Mirchi Vada & Mawa Kachori Tasting", category: "food", cost: 150, durationMinutes: 90, description: "Taste Jodhpur's legendary spicy street delicacies at Clock Tower." },
      ],
    },
    {
      name: "Jaisalmer",
      state: "Rajasthan",
      country: "India",
      costIndex: 4,
      popularityScore: 91,
      imageUrl: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=800",
      activities: [
        { name: "Sam Sand Dunes Camel & Quad Bike Safari", category: "adventure", cost: 1200, durationMinutes: 300, description: "Sunset camel ride, dune bashing, and Rajasthani cultural camp night." },
        { name: "Jaisalmer Golden Living Fort Tour", category: "culture", cost: 200, durationMinutes: 180, description: "Explore the world's only living fort where 1/4th of city population resides." },
        { name: "Patwon Ki Haveli Carved Mansion Visit", category: "sightseeing", cost: 150, durationMinutes: 120, description: "Five-story cluster of intricate yellow sandstone mansions." },
      ],
    },
    {
      name: "Pushkar",
      state: "Rajasthan",
      country: "India",
      costIndex: 2,
      popularityScore: 82,
      imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      activities: [
        { name: "Brahma Temple & Holy Ghats Sunset Aarti", category: "culture", cost: 0, durationMinutes: 120, description: "Worship at one of the world's few temples dedicated to Lord Brahma." },
        { name: "Pushkar Camel Fair Grounds & Desert Walk", category: "sightseeing", cost: 300, durationMinutes: 180, description: "Walk through desert dunes and artisan leather craft markets." },
      ],
    },

    // ─── PUNJAB ───
    {
      name: "Amritsar",
      state: "Punjab",
      country: "India",
      costIndex: 3,
      popularityScore: 95,
      imageUrl: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800",
      activities: [
        { name: "Golden Temple (Harmandir Sahib) Night Viewing", category: "culture", cost: 0, durationMinutes: 180, description: "Revered spiritual shrine glistening in gold over Amrit Sarovar lake." },
        { name: "Guru Ka Langar Community Kitchen Volunteering", category: "culture", cost: 0, durationMinutes: 120, description: "Participate in serving free meals to 100,000 pilgrims daily." },
        { name: "Wagah Border Beating Retreat Ceremony", category: "sightseeing", cost: 0, durationMinutes: 240, description: "High-octane patriotic military flag-lowering parade at India-Pakistan border." },
        { name: "Amritsari Kulcha & Lassi Culinary Trail", category: "food", cost: 300, durationMinutes: 150, description: "Savor crispy butter-loaded Amritsari Kulcha with tall glasses of creamy Lassi." },
        { name: "Jallianwala Bagh Memorial Visit", category: "culture", cost: 0, durationMinutes: 90, description: "Pay homage at the solemn national freedom memorial site." },
        { name: "Gobindgarh Fort 7D & Light Show", category: "adventure", cost: 250, durationMinutes: 180, description: "Interactive heritage fort featuring Maharaja Ranjit Singh's coin mint and 7D show." },
      ],
    },
    {
      name: "Chandigarh",
      state: "Punjab",
      country: "India",
      costIndex: 3,
      popularityScore: 86,
      imageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800",
      activities: [
        { name: "Nek Chand's Rock Garden Walk", category: "culture", cost: 100, durationMinutes: 180, description: "World-famous sculpture garden built entirely from industrial waste & discarded rocks." },
        { name: "Sukhna Lake Sunset Boating", category: "nature", cost: 200, durationMinutes: 120, description: "Picturesque man-made reservoir at the foothills of Shivalik range." },
        { name: "Zakir Hussain Rose Garden Stroll", category: "nature", cost: 50, durationMinutes: 120, description: "Asia's largest rose garden featuring 1,600 different rose varieties." },
        { name: "Sector 17 Shopping & Culinary Plaza", category: "shopping", cost: 500, durationMinutes: 180, description: "Open-air pedestrian shopping precinct with brands, cafes, and fountains." },
      ],
    },
    {
      name: "Patiala",
      state: "Punjab",
      country: "India",
      costIndex: 2,
      popularityScore: 78,
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      activities: [
        { name: "Qila Mubarak Complex Tour", category: "culture", cost: 100, durationMinutes: 150, description: "18th-century fort palace complex representing Sikh palace architecture." },
        { name: "Sheesh Mahal & Medal Gallery", category: "culture", cost: 50, durationMinutes: 120, description: "Palace of mirrors with world's largest collection of royal medals." },
        { name: "Phulkari Embroidery & Jutti Shopping", category: "shopping", cost: 600, durationMinutes: 180, description: "Shop authentic Patiala suits, Phulkari shawls, and handcrafted leather juttis." },
      ],
    },
    {
      name: "Ludhiana",
      state: "Punjab",
      country: "India",
      costIndex: 3,
      popularityScore: 75,
      imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
      activities: [
        { name: "Rural Heritage Museum PAU", category: "culture", cost: 50, durationMinutes: 120, description: "Depicts ancient Punjabi village lifestyle, farming equipment, and crafts." },
        { name: "Clock Tower Street Food Trail", category: "food", cost: 250, durationMinutes: 150, description: "Sample famous Punjabi tandoori chicken, chaat, and sweet jalebis." },
      ],
    },

    // ─── GOA ───
    {
      name: "Panaji & North Goa",
      state: "Goa",
      country: "India",
      costIndex: 3,
      popularityScore: 92,
      imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
      activities: [
        { name: "Fontainhas Heritage Latin Quarter Walk", category: "culture", cost: 0, durationMinutes: 120, description: "Stroll through colorful Portuguese-era bungalows and quaint cafes." },
        { name: "Mandovi River Casino & Dinner Cruise", category: "nightlife", cost: 1500, durationMinutes: 240, description: "Sunset cruise on Mandovi with Goan folk music, dance, and buffet." },
        { name: "Dudhsagar Waterfalls Jeep Safari", category: "adventure", cost: 1200, durationMinutes: 480, description: "Thrill ride through Bhagwan Mahavir Wildlife Sanctuary to four-tiered waterfall." },
      ],
    },

    // ─── KERALA ───
    {
      name: "Kochi",
      state: "Kerala",
      country: "India",
      costIndex: 3,
      popularityScore: 88,
      imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
      activities: [
        { name: "Fort Kochi Chinese Fishing Nets View", category: "sightseeing", cost: 0, durationMinutes: 90, description: "Iconic cantilevered fishing nets operating along the Arabian Sea shore." },
        { name: "Kathakali Dance & Kalaripayattu Martial Arts", category: "culture", cost: 400, durationMinutes: 150, description: "Watch intricate facial makeup and traditional Kerala performing arts." },
      ],
    },
    {
      name: "Munnar",
      state: "Kerala",
      country: "India",
      costIndex: 3,
      popularityScore: 90,
      imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
      activities: [
        { name: "Tea Plantation Walk & Factory Tasting", category: "nature", cost: 200, durationMinutes: 180, description: "Walk through lush green rolling tea estates and sample fresh spices." },
        { name: "Eravikulam National Park Nilgiri Tahr Safari", category: "nature", cost: 300, durationMinutes: 240, description: "Home to the endangered mountain goat species and Anamudi peak." },
      ],
    },

    // ─── HIMACHAL PRADESH ───
    {
      name: "Manali",
      state: "Himachal Pradesh",
      country: "India",
      costIndex: 3,
      popularityScore: 93,
      imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
      activities: [
        { name: "Solang Valley Paragliding & Zorbing", category: "adventure", cost: 2000, durationMinutes: 240, description: "Thrill sports hub surrounded by snow-capped Himalayan peaks." },
        { name: "Hadimba Temple & Cedar Forest Stroll", category: "culture", cost: 0, durationMinutes: 90, description: "Pagoda-style wooden temple built in 1553 inside Dhungri pine forest." },
      ],
    },

    // ─── UTTARAKHAND ───
    {
      name: "Rishikesh",
      state: "Uttarakhand",
      country: "India",
      costIndex: 2,
      popularityScore: 91,
      imageUrl: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800",
      activities: [
        { name: "White Water River Rafting on Ganga", category: "adventure", cost: 800, durationMinutes: 180, description: "Conquer grade 3 & 4 rapids on holy Ganges river." },
        { name: "Triveni Ghat Evening Ganga Aarti", category: "culture", cost: 0, durationMinutes: 120, description: "Spiritual evening prayer with floating oil lamps and Vedic chants." },
      ],
    },

    // ─── UTTAR PRADESH ───
    {
      name: "Varanasi",
      state: "Uttar Pradesh",
      country: "India",
      costIndex: 2,
      popularityScore: 96,
      imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
      activities: [
        { name: "Dashashwamedh Ghat Evening Ganga Aarti", category: "culture", cost: 0, durationMinutes: 150, description: "Mesmerizing brass lamp ceremony performed by young priests." },
        { name: "Sunrise Boat Ride along Holy Ghats", category: "sightseeing", cost: 400, durationMinutes: 120, description: "Watch morning rituals and bathing pilgrims across 84 historic ghats." },
      ],
    },
    {
      name: "Agra",
      state: "Uttar Pradesh",
      country: "India",
      costIndex: 3,
      popularityScore: 98,
      imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
      activities: [
        { name: "Taj Mahal Sunrise Guided Tour", category: "sightseeing", cost: 1100, durationMinutes: 240, description: "Wonder of the World marble mausoleum built by Mughal Emperor Shah Jahan." },
        { name: "Agra Fort Heritage Walk", category: "culture", cost: 600, durationMinutes: 180, description: "Red sandstone fortress residence of Mughal emperors." },
      ],
    },

    // ─── DELHI ───
    {
      name: "New Delhi",
      state: "Delhi",
      country: "India",
      costIndex: 3,
      popularityScore: 96,
      imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      activities: [
        { name: "Qutub Minar & Mehrauli Archaeological Park", category: "culture", cost: 500, durationMinutes: 180, description: "World's tallest brick minaret standing at 72.5 meters." },
        { name: "Chandni Chowk Rickshaw & Street Food Tour", category: "food", cost: 500, durationMinutes: 180, description: "Sample Paranthe Wali Gali paranthas, Jalebi, and spice market chaos." },
      ],
    },
  ];

  console.log(`Processing ${indiaCitiesData.length} Indian cities across multiple states...`);

  for (const cData of indiaCitiesData) {
    // Upsert City
    const existing = await prisma.city.findFirst({
      where: { name: cData.name, country: "India" },
    });

    let cityId: string;
    if (existing) {
      const updated = await prisma.city.update({
        where: { id: existing.id },
        data: {
          state: cData.state,
          costIndex: cData.costIndex,
          popularityScore: cData.popularityScore,
          imageUrl: cData.imageUrl,
        },
      });
      cityId = updated.id;
      console.log(`  Updated city: ${cData.name} (${cData.state})`);
    } else {
      const created = await prisma.city.create({
        data: {
          name: cData.name,
          state: cData.state,
          country: "India",
          costIndex: cData.costIndex,
          popularityScore: cData.popularityScore,
          imageUrl: cData.imageUrl,
        },
      });
      cityId = created.id;
      console.log(`  Created city: ${cData.name} (${cData.state})`);
    }

    // Add activities
    for (const act of cData.activities) {
      const existingAct = await prisma.activity.findFirst({
        where: { name: act.name, cityId },
      });
      if (!existingAct) {
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
      }
    }
  }

  // Also update any remaining international cities state field if null
  console.log("\n✅ India seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
