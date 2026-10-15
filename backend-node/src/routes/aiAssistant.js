const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const STUDIO_SYSTEM_INSTRUCTION = `
You are the AI Concierge and Studio Assistant for "Balan Studios" (Preetha Studio App).
Your purpose is to welcome clients, guide visitors, explain photography packages, assist with booking inquiries, and answer photo restoration questions.

Studio Profile:
- Name: Balan Studios (also known as Preetha Studio)
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

// Helper: initialize Google GenAI client
function getAIClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured in backend environment');
    }
    return new GoogleGenAI({ apiKey });
}

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message text is required.' });
        }

        const ai = getAIClient();

        // Convert incoming conversation turns into Gemini contents format
        const contents = [];

        if (Array.isArray(history) && history.length > 0) {
            for (const item of history.slice(-8)) { // keep last 8 messages for context
                if (item.sender === 'user' || item.role === 'user') {
                    contents.push({ role: 'user', parts: [{ text: item.text || item.content }] });
                } else if (item.sender === 'assistant' || item.role === 'model') {
                    contents.push({ role: 'model', parts: [{ text: item.text || item.content }] });
                }
            }
        }

        // Add current user prompt
        contents.push({ role: 'user', parts: [{ text: message }] });

        // Generate response using verified fast model with fallback
        let response;
        try {
            response = await ai.models.generateContent({
                model: 'gemini-3.5-flash-lite',
                contents: contents,
                config: {
                    systemInstruction: STUDIO_SYSTEM_INSTRUCTION,
                    temperature: 0.7,
                }
            });
        } catch (primaryErr) {
            console.warn('[AI Assistant] Primary model failed, trying fallback:', primaryErr.message);
            response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: contents,
                config: {
                    systemInstruction: STUDIO_SYSTEM_INSTRUCTION,
                    temperature: 0.7,
                }
            });
        }

        const reply = response.text ? response.text.trim() : 'I am here to help you with Balan Studios! How can I assist you?';

        res.json({
            success: true,
            reply: reply,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[AI Assistant Error]:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process AI chat inquiry'
        });
    }
});

module.exports = router;
