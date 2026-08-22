# 🌍 GlobeTrotter — Smart Multi-Stop Travel & Itinerary Planning Platform

> **GlobeTrotter** is a modern, full-stack travel planning platform built to simplify multi-city itinerary building, section-wise budget tracking, community trip discovery, interactive mapping, and AI-driven travel intelligence powered by Google Gemini 3.6 Flash.

---

## 📌 Problem Statement

Planning complex trips involving multiple cities and destinations often presents major challenges for modern travelers:

1. **Fragmented Planning**: Managing multi-stop itineraries across spreadsheet apps, notes, and maps leads to confusion and disorganization.
2. **Unclear Budget Allocation**: Travelers struggle to break down total travel budgets into granular section budgets for individual city stops and specific daily activities.
3. **Lack of Regional Destination Discovery**: Most travel apps focus exclusively on generic international spots, overlooking rich domestic travel regions, cultural spots, and local state itineraries (such as Gujarat, Maharashtra, Rajasthan, and Punjab).
4. **Static & Outdated Information**: Lack of real-time AI itinerary recommendations and interactive visual map navigation.
5. **No Easy Itinerary Sharing**: Inability to share public trip plans or clone itineraries created by experienced travelers.

---

## 💡 The GlobeTrotter Solution

**GlobeTrotter** resolves these challenges by offering a unified, end-to-end web app:

- **Multi-Stop Section Builder**: Organize trips into sequential city stops with start/end dates, section budgets, and time-slotted daily activities.
- **AI Travel Intelligence**: Integrated with **Google Gemini 3.6 Flash** to generate custom place recommendations, day-wise itineraries, and budget breakdowns formatted in **Indian Rupees (₹ / INR)**.
- **Interactive Destination Maps**: Explore global and domestic locations using embedded interactive map navigation.
- **India & International Destination Catalog**: Dedicated selection between **Inside India** (10+ States including Gujarat, Maharashtra, Rajasthan, Punjab, Goa, Kerala, Himachal Pradesh, etc.) and **Outside India** international spots.
- **Community Trip Gallery & Cloning**: Share public itineraries with shareable links and clone popular community trips with a single click.
- **Admin Control Panel**: Guarded admin dashboard for managing cities, adding new spots, creating activities, and auditing platform metrics.

---

## ⭐ Key Features & Plus Points

### 1. 🗓️ Multi-Stop Itinerary & Section Budget Planning
- Add multiple city stops to any trip with custom date ranges.
- Set section budgets per city stop and assign time-slotted activities (*Morning, Afternoon, Evening, Night*).
- Interactive visual budget analytics powered by **Recharts** (*Pie Charts & Category Over-budget Alerts*).

### 2. 🤖 Google Gemini 3.6 Flash AI Integration (`/ai-suggestions`)
- Enter any destination name to receive instant AI travel intelligence.
- Returns top places to visit, entry/activity costs, day-wise itineraries, and money-saving tips strictly formatted in **Indian Rupees (₹ / INR)**.
- Directly integrated with Google Gemini REST API endpoints (`gemini-3.6-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`).

### 3. 🗺️ Interactive Destination Maps (`/map`)
- Seamless interactive map view supporting search for any city or landmark worldwide.
- Preset quick-select buttons for top domestic & global destinations (*Mumbai, Ahmedabad, Jaipur, Amritsar, Surat, Udaipur, Goa, Tokyo, Paris, New York*).

### 4. 🇮🇳 Comprehensive Indian States & Regional Destinations
- Dedicated destination selector for **Inside India** vs **Outside India**.
- **10+ Indian States**: Gujarat, Maharashtra, Rajasthan, Punjab, Goa, Kerala, Himachal Pradesh, Uttarakhand, Uttar Pradesh, Delhi.
- **High-Density Spots & Activities**: Rich catalog covering heritage tours, food walks, desert safaris, beach activities, and craft shopping.

### 5. 🏙️ Dedicated City Detail Pages & User Photo Sharing (`/cities/[id]`)
- Every destination has its own page displaying cost indexes, category filters (*Sightseeing, Food, Culture, Adventure, Nature, Shopping, Nightlife*), and activity prices.
- Registered users and admins can upload photos to city galleries with custom captions.

### 6. 🌐 Public Community Trips & One-Click Cloning (`/community` & `/explore`)
- Public/Private toggle on trip cards and itinerary builder.
- Unregistered guest users can browse landing page destinations and community public trips.
- Registered users can **clone any public trip** into their personal account to customize section budgets and activities.

### 7. 🛡️ Role-Based Admin Management (`/admin`)
- Strict route protection and isolated admin credentials (`admin@globetrotter.com`).
- Admin navigation option visible **only** to the administrator.
- Admin forms for adding new cities, registering activities, and auditing database metrics.

### 8. 💰 Universal Indian Rupees (₹ / INR) Currency Standard
- All financial metrics, activity costs, section budgets, and AI suggestions are standardized in **Indian Rupees (₹ / INR)**.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | Vanilla CSS, TailwindCSS & Glassmorphism UI |
| **Database & ORM** | PostgreSQL & [Prisma ORM](https://www.prisma.io/) |
| **AI Integration** | [Google Gemini 3.6 Flash API](https://ai.google.dev/) |
| **Mapping** | Google Maps & Embedded Map Navigation |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Authentication** | Custom Session Auth & Middleware Guard (`proxy.ts`) |

---

## 📁 Project Structure

```text
globetrotter-ldce-odoo-demo-replica/
├── prisma/
│   ├── schema.prisma              # Prisma PostgreSQL Schema (User, Trip, City, Activity, CityPhoto, etc.)
│   ├── seed_india_expanded.ts     # Seed script for Indian States, Cities & Activities
│   └── verify_directives_2_0_to_2_7.ts # Automated feature verification script
├── src/
│   ├── app/
│   │   ├── admin/                 # Isolated Admin Panel & Management Modals
│   │   ├── ai-suggestions/        # Gemini 3.6 Flash AI Travel & Budget Page
│   │   ├── cities/[id]/           # Dedicated City Detail Pages & Photo Upload
│   │   ├── community/             # Public Trips Gallery
│   │   ├── explore/               # Public Destination Catalog & Trip Search
│   │   ├── map/                   # Interactive Map Navigation Page
│   │   ├── trips/                 # User Trips Dashboard, Builder & Itinerary Analytics
│   │   ├── api/                   # REST API Endpoints (Trips, Admin, Cities, AI, Auth)
│   │   ├── page.tsx               # Redesigned Guest Landing Page
│   │   └── globals.css            # Custom Design System, Glassmorphism & Gradients
│   ├── components/
│   │   ├── Header.tsx             # Navbar with Role-Based Admin Link & Page Navigation
│   │   └── TripCard.tsx           # Reusable Trip Card Component
│   ├── lib/
│   │   ├── auth.ts                # Authentication & Session Helper
│   │   ├── currency.ts            # Indian Rupees (₹ / INR) Currency Utility
│   │   └── prisma.ts              # Prisma Client Instance
│   └── proxy.ts                   # Route Protection Middleware
├── .env                           # Environment Variables
├── .env.example                   # Environment Template
└── package.json
```

---

## 🚀 Step-by-Step Installation & Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **PostgreSQL** (running locally on port `5432` or via cloud connection)

---

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/raoh97-code/globetrotter-ldce-odoo-demo-replica.git
cd globetrotter-ldce-odoo-demo-replica
npm install
```

---

### 3. Configure Environment Variables (`.env`)
Create or edit your `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/globetrotter"
NEXTAUTH_SECRET="gT_s3cr3t_k3y_f0r_n3xtAuth_2024_hckthon"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini API Key (Used for /ai-suggestions)
GEMINI_API_KEY="your_google_gemini_api_key_here"
```

---

### 4. Database Setup & Seeding
Push the Prisma schema to your PostgreSQL database and run the expanded India seeding script:

```bash
# Push Prisma Schema to Database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed Indian States, Cities & Activities
npx tsx prisma/seed_india_expanded.ts
```

---

### 5. Run Development Server
Start the Next.js development server:

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 👥 Default Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@globetrotter.com` | `AdminPass123!` | Admin Panel, Navbar Admin Option, Add City/Activity APIs |
| **Registered User** | `demo@globetrotter.com` | `UserPass123!` | Create Trips, Section Builder, Photo Uploads, Clone Trips |

---

## 🧪 Verification & Typechecking

Run TypeScript typechecking and automated verification:

```bash
# Run TypeScript Typecheck
npx tsc --noEmit

# Run Automated Feature Verification
npx tsx prisma/verify_directives_2_0_to_2_7.ts
```

---

## 📜 License

This project is open-source and available under the **MIT License**.