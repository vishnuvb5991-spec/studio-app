import { GoogleGenAI } from '@google/genai';

const STUDIO_KNOWLEDGE_PROMPT = `
You are the AI Concierge and Studio Assistant for "Balan Studios" (Preetha Studio App).
Your purpose is to warmly welcome clients, guide visitors, explain photography packages, assist with booking inquiries, and answer photo restoration questions.

Studio Profile:
- Name: Balan Studios (Preetha Studio)
- Owner: Balan
- Location: Kerala, India
- Phone: +91 0000000000
- Email: admin@studio.com
- Website: https://preetha-studio-app.surge.sh
- Working Hours: 09:00 AM - 08:30 PM (Monday through Sunday)

Packages & Pricing:
1. Royal Wedding Cinematic Package - ₹85,000:
   - Comprehensive wedding coverage: Traditional photography + candid photography
   - 4K Ultra HD cinematic wedding film & highlights
   - Drone aerial cinematography
   - Luxury velvet embossed 40-page photo album
   - 1-minute Instagram/WhatsApp cinematic teaser trailer
2. Classic Wedding & Reception - ₹55,000:
   - Full traditional ceremony and reception photography
   - Full HD multicam video coverage
   - Premium embossed photo book
3. Pre-Wedding / Post-Wedding Shoot - ₹25,000:
   - Outdoor destination couple shoot
   - Up to 3 costume changes
   - Candid photography with color-graded digital gallery
   - 1-minute cinematic reel
4. Portrait & Model Portfolio - ₹8,000:
   - In-studio professional session
   - 3 distinct lighting setups
   - 15 high-end retouched digital portraits
   - Private digital web gallery
5. Heritage Photo Restoration - ₹1,500 per photo:
   - High-resolution digital flatbed scanning
   - Deep scratch, tear, and water stain removal
   - Faded color restoration and black & white colorization
   - Facial feature and detail reconstruction
   - 1 complimentary premium framed physical print

Studio Policies & FAQ:
- Advance Booking: 20% advance deposit confirms your event date.
- Delivery Timelines: Raw preview gallery shared within 3-5 days. Final edited album and 4K film delivered in 2-3 weeks.
- Travel: Available for destination weddings across Kerala, South India, and Goa.
- Restoration Submissions: Customers can bring old physical photos directly to the studio or upload high-resolution phone scans.

Guidelines for Interaction:
- Be polite, warm, and artistically inspiring.
- Answer in the same language the customer uses (English, Malayalam, Hindi, etc.).
- When recommending packages, briefly explain why that package fits their celebration.
- If a client wants to book or request a date, kindly ask for their: Name, Event Date, Location/Venue, and Phone Number so the studio team can confirm availability.
- Keep responses concise, clear, and easy to read on mobile.
`;

let aiInstance = null;

function getAIClient() {
    if (!aiInstance) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6Khrn1J6g70tHq8SyH4Ob7Twnee6StqXsY5zyypbLhUZA";
        if (!apiKey) {
            throw new Error("Gemini API key is not configured.");
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
}

/**
 * Sends customer message with history to Gemini with fallback
 */
export async function sendChatMessage(userMessage, conversationHistory = []) {
    const ai = getAIClient();

    // Map conversation turns into Gemini parts
    const contents = [];
    if (Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory.slice(-8)) {
            if (msg.role === 'user' || msg.sender === 'user') {
                contents.push({ role: 'user', parts: [{ text: msg.text || msg.content }] });
            } else if (msg.role === 'model' || msg.role === 'assistant' || msg.sender === 'assistant') {
                contents.push({ role: 'model', parts: [{ text: msg.text || msg.content }] });
            }
        }
    }

    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    // Primary model: gemini-3.5-flash-lite, fallback: gemini-3.8-flash
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents,
            config: {
                systemInstruction: STUDIO_KNOWLEDGE_PROMPT,
                temperature: 0.7,
            }
        });
        return response.text ? response.text.trim() : "Welcome to Balan Studios! How can I assist you today?";
    } catch (err) {
        console.warn("[Studio AI] Primary model error, falling back to gemini-3.8-flash:", err);
        const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
                systemInstruction: STUDIO_KNOWLEDGE_PROMPT,
                temperature: 0.7,
            }
        });
        return fallbackResponse.text ? fallbackResponse.text.trim() : "Welcome to Balan Studios! How can I assist you today?";
    }
}
