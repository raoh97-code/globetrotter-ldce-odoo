import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const sessionUser = await getSessionUser();
    const body = await req.json();
    const { destination, numDays, travelStyle, clientApiKey } = body;

    if (!destination || !destination.trim()) {
      return NextResponse.json({ error: "Please provide a destination name." }, { status: 400 });
    }

    // Check env vars or client-provided API key
    const rawApiKey = (
      clientApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      ""
    ).trim();

    // Clean quotes if user put quotes in .env
    const apiKey = rawApiKey.replace(/^["']|["']$/g, "");

    if (!apiKey || apiKey === "your-gemini-api-key-here" || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not set in .env file.",
          detail: "Please add GEMINI_API_KEY=\"AIzaSy...\" in your .env file to enable live Gemini AI suggestions.",
        },
        { status: 400 }
      );
    }

    const prompt = `You are an expert travel planner. The user wants to visit "${destination.trim()}" for ${numDays || 3} days with a ${travelStyle || "moderate"} budget style.
Please provide travel recommendations formatted strictly in valid JSON with the following exact structure:
{
  "destination": "${destination.trim()}",
  "estimatedBudgetINR": "₹15,000 - ₹25,000 INR",
  "summary": "Short 2-sentence destination summary.",
  "topAttractions": [
    { "name": "Attraction Name", "category": "Sightseeing/Food/Culture", "costINR": "₹500 INR", "description": "Brief highlight" }
  ],
  "dayWiseItinerary": [
    { "day": 1, "title": "Day Title", "highlights": "Key activities for the day" }
  ],
  "budgetTips": ["Tip 1", "Tip 2"]
}
Ensure ALL costs and budgets are strictly formatted in Indian Rupees (₹ / INR). Return ONLY raw JSON without markdown code blocks.`;

    // Try live Gemini endpoints prioritizing gemini-3.6-flash
    const geminiEndpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    ];

    let lastError = "";

    for (const endpoint of geminiEndpoints) {
      try {
        const geminiRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        const gData = await geminiRes.json();

        if (geminiRes.ok) {
          const responseText = gData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({
              success: true,
              suggestions: parsed,
              source: "gemini-api",
            });
          }
        } else {
          lastError = gData.error?.message || `HTTP ${geminiRes.status}: ${geminiRes.statusText}`;
          console.error(`Gemini API Endpoint Error (${endpoint}):`, lastError);

          // If API key is invalid or quota blocked, return the actual error directly
          if (gData.error?.code === 400 || gData.error?.code === 403 || gData.error?.status === "INVALID_ARGUMENT") {
            return NextResponse.json(
              { error: `Google Gemini API Error: ${lastError}` },
              { status: 400 }
            );
          }
        }
      } catch (err: any) {
        lastError = err.message || "Network error calling Gemini API.";
      }
    }

    return NextResponse.json(
      { error: `Google Gemini API Error: ${lastError || "Failed to parse AI response."}` },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("POST /api/ai-suggestions error:", error);
    return NextResponse.json({ error: "Failed to generate AI suggestions." }, { status: 500 });
  }
}
