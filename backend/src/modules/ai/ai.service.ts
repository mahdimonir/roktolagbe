import crypto from 'crypto';
import cache from '../../lib/cache';
import { getGeminiClient } from '../../lib/gemini';
import { prisma } from '../../lib/prisma';

// Memory-based rate limit tracker
let last429Time: number = 0;
const COOLDOWN_MS = 60000; // 1 minute cooldown after 429

// Helper to get real-time demand statistics
async function getBloodDemandContext(): Promise<string> {
  try {
    const stats = await prisma.bloodRequest.groupBy({
      by: ['bloodGroup'],
      where: { status: 'OPEN' },
      _count: { id: true }
    });

    if (stats.length === 0) {
      return "Current operational status: No active urgent requests on the grid.";
    }

    const demandStr = stats.map(s => `${s.bloodGroup}: ${s._count.id} requests`).join(', ');
    return `CURRENT ACTIVE DEMAND: ${demandStr}. These are live request counts from the database.`;
  } catch (error) {
    return "Status: Live demand data temporarily unavailable.";
  }
}

// Grounded system prompt with all platform knowledge
const BASE_SYSTEM_PROMPT = `You are the RoktoLagbe Help Assistant — a professional, "Mission Control" style assistant for Bangladesh's blood donor network.

## Mission Persona
- Tone: Professional, high-agency, and encouraging.
- Refer to donors as "Vital Assets" and their contributions as "Life-saving Protocols."

## About RoktoLagbe
A real-time blood donation & emergency network for Bangladesh. Connects patients with donors instantly.

## Blood Compatibility Matrix (CRITICAL)
- O- → Universal donor (can donate to everyone)
- AB+ → Universal receiver (can receive from everyone)
- O+ → Can donate to O+, A+, B+, AB+ | Receives from O-, O+
- A- → Can donate to A-, A+, AB-, AB+ | Receives from O-, A-
- A+ → Can donate to A+, AB+ | Receives from O-, O+, A-, A+
- B- → Can donate to B-, B+, AB-, AB+ | Receives from O-, B-
- B+ → Can donate to B+, AB+ | Receives from O-, O+, B-, B+
- AB- → Can donate to AB-, AB+ | Receives from O-, A-, B-, AB-

## Rules
1. Be concise (max 180 words).
2. ONLY answer about blood donation and RoktoLagbe.
3. For medical emergencies, visit a hospital IMMEDIATELY.`;

/**
 * Get AI response to a help question.
 * Strategy: Cache -> Map Filter -> Gemini 1.5 -> Static Fallback
 */
export const getHelpResponse = async (
  question: string
): Promise<{ answer: string; source: 'gemini' | 'static'; cached: boolean }> => {
  if (!question || question.trim().length < 3) {
    return {
      answer: 'Please ask a more specific question about blood donation or the RoktoLagbe platform.',
      source: 'static',
      cached: false,
    };
  }

  const normalizedQ = question.trim().toLowerCase();
  const cacheKey = `ai:help:${crypto.createHash('sha256').update(normalizedQ).digest('hex').slice(0, 16)}`;

  // 1. Check cache first
  const cached = cache.get<{ answer: string; source: 'gemini' | 'static' }>(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  // 2. Map Filter (Instant FAQ check to save quota)
  const mapResult = getIntentMatch(normalizedQ);
  if (mapResult) {
    const response = { answer: mapResult, source: 'static' as const };
    cache.set(cacheKey, response, 3600);
    return { ...response, cached: false };
  }

  // 3. Cooldown Check (Throttle calls after 429)
  const now = Date.now();
  if (now - last429Time < COOLDOWN_MS) {
    const demandContext = await getBloodDemandContext();
    const staticAnswer = getStaticAnswer(normalizedQ, demandContext);
    return { answer: `[System Cooling Down] ${staticAnswer}`, source: 'static', cached: false };
  }

  // 4. Attempt Gemini 1.5 Flash
  const demandContext = await getBloodDemandContext();
  const finalSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${demandContext}\n\nUser Question: `;
  
  const geminiAnswer = await tryGemini(question, finalSystemPrompt);
  if (geminiAnswer) {
    const result = { answer: geminiAnswer, source: 'gemini' as const };
    cache.set(cacheKey, result, 3600);
    return { ...result, cached: false };
  }

  // 5. Final Static Fallback
  const finalStatic = getStaticAnswer(normalizedQ, demandContext);
  return { answer: finalStatic, source: 'static', cached: false };
};

async function tryGemini(question: string, systemPrompt: string): Promise<string | null> {
  try {
    const client = getGeminiClient();
    if (!client) return null;

    // We use gemini-1.5-flash as it has more reliable availability for free tier calls
    const model = client.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent(question);
    const response = await result.response;
    return response.text() || null;
  } catch (error: any) {
    const errorMsg = error.message || error.toString();
    console.error(`[AI Help] Gemini 1.5 Failure: ${errorMsg}`);
    
    if (errorMsg.includes('429')) {
      last429Time = Date.now();
      console.warn('💡 AI Entering Cooldown Mode for 60s');
    }
    return null;
  }
}

// Intent Matcher for common queries (Saves AI Quota)
function getIntentMatch(query: string): string | null {
  // --- PRIORITY 0: DEMAND & URGENCY DETECTION ---
  // If the user is asking about NEED or DEMAND, do NOT use static compatibility.
  // Return null to let the main flow handle it with real-time DB stats + Gemini.
  if (query.includes('need') || query.includes('demand') || query.includes('urgent') || query.includes('require') || query.includes('shortage')) {
    return null; 
  }

  // --- PRIORITY 1: CRITICAL MISSION TOPICS ---
  
  // 1. Thalassemia (High Priority for correctly identifying "support" as Thalassemia support)
  if (query.includes('thalassemia') || query.includes('thelasemia') || query.includes('thalasemia') || query.includes('telsimia') || query.includes('thal ') || query.includes('genetic blood')) {
    return "Thalassemia patients require regular life-saving transfusions (usually every 2-4 weeks). RoktoLagbe has a dedicated priority tag for 'Thalassemia Major' requests. You can sign up as a regular donor to be matched with a specific patient for consistent long-term support.";
  }

  // 2. SOS & Emergency Requests
  if (query.includes('emergency') || query.includes('sos') || query.includes('post') || query.includes('need blood') || query.includes('urgent')) {
    return "To post an emergency blood request: 1. Go to the 'Emergency SOS' section. 2. Provide the patient's blood group, hospital location, and contact number. 3. Our system will immediately notify all matching donors in that district. Requests are verified by our clinical coordinators.";
  }

  // 3. Detailed Blood Compatibility
  if (query.includes(' o+') || query.startsWith('o+')) {
    return "O+ Compatibility: Can donate to O+, A+, B+, AB+. Can receive from O+, O-. O+ is the most common blood type and vital for our emergency network.";
  }
  if (query.includes(' o-') || query.startsWith('o-')) {
    return "O- Compatibility: Universal Donor. Can donate to EVERYONE. Can receive ONLY from O-. O- donors are our most critical assets for trauma and emergency situations.";
  }
  if (query.includes(' a+') || query.startsWith('a+')) {
    return "A+ Compatibility: Can donate to A+, AB+. Can receive from A+, A-, O+, O-.";
  }
  if (query.includes(' a-') || query.startsWith('a-')) {
    return "A- Compatibility: Can donate to A+, A-, AB+, AB-. Can receive from A-, O-.";
  }
  if (query.includes(' b+') || query.startsWith('b+')) {
    return "B+ Compatibility: Can donate to B+, AB+. Can receive from B+, B-, O+, O-.";
  }
  if (query.includes(' b-') || query.startsWith('b-')) {
    return "B- Compatibility: Can donate to B+, B-, AB+, AB-. Can receive from B-, O-.";
  }
  if (query.includes(' ab+') || query.startsWith('ab+')) {
    return "AB+ Compatibility: Universal Receiver. Can receive from EVERYONE. Can donate ONLY to AB+.";
  }
  if (query.includes(' ab-') || query.startsWith('ab-')) {
    return "AB- Compatibility: Can donate to AB+, AB-. Can receive from AB-, A-, B-, O-.";
  }

  // --- PRIORITY 2: MEDICAL & ELIGIBILITY ---

  // 4. Medication & Procedures
  if (query.includes('medicine') || query.includes('antibiotic') || query.includes('aspirin') || query.includes('dental') || query.includes('surgery')) {
    return "Medication Guidelines: 1. Antibiotics: Wait 7 days after the last dose and being symptom-free. 2. Aspirin: Wait 48 hours if donating platelets. 3. Dental work: Wait 24 hours for cleaning, 7 days for extraction. 4. Major Surgery: Wait 6-12 months.";
  }

  // 5. Specific Health Conditions
  if (query.includes('diabetes') || query.includes('pressure') || query.includes('anemia') || query.includes('thyroid')) {
    return "Health Conditions: 1. Diabetes: Eligible if controlled by diet or oral meds. 2. High BP: Eligible if stable and under 160/100. 3. Anemia: Not eligible until hemoglobin levels are normal (Min 12.5 g/dL).";
  }

  // 6. Recovery from Diseases
  if (query.includes('malaria') || query.includes('dengue') || query.includes('typhoid') || query.includes('jaundice')) {
    return "Recovery Wait Times: 1. Dengue: Wait 6 months after full recovery. 2. Malaria: Wait 3 years after recovery. 3. Typhoid: Wait 12 months. 4. Jaundice: Permanently ineligible if it was Hepatitis B or C.";
  }

  // 7. Medical & Eligibility (General)
  if (query.includes('eligible') || query.includes('requirement') || query.includes('can i donate') || query.includes('weight') || query.includes('age')) {
    return "Eligibility Protocols: 1. Age 18-65. 2. Weight over 50kg. 3. Good general health. 4. Minimum 4 months since last donation. 5. No recent tattoos/piercings (last 6 months).";
  }

  // --- PRIORITY 3: PLATFORM & ACCOUNTS ---

  // 8. Registration & Joining
  if (query.includes('join') || query.includes('register') || query.includes('become a') || query.includes('sign up') || query.includes('account')) {
    return "To join the RoktoLagbe mission, proceed to the Register page. You can sign up as a Donor (to provide blood) or a Volunteer Coordinator (to manage requests). Once registered, you are immediately eligible to respond to emergency protocols.";
  }

  // 9. Hospital & Organization Partnerships
  if (query.includes('hospital join') || query.includes('organization') || query.includes('partner') || query.includes('portal')) {
    return "Hospitals and organizations can join the RoktoLagbe network through our dedicated partnership portal. Our regional managers manually verify all clinical credentials before activating your account to ensure protocol integrity.";
  }

  // 10. Rewards & Ranks
  if (query.includes('point') || query.includes('reward') || query.includes('rank') || query.includes('silver') || query.includes('gold')) {
    return "You earn 100 points for every verified donation. Ranks include Silver, Gold, Platinum, and Titanium. Higher ranks unlock exclusive priority access.";
  }

  // 11. Verification & History
  if (query.includes('verify') || query.includes('badge') || query.includes('check') || query.includes('history') || query.includes('record')) {
    return "Donors build trust through successful contributions. Your 'Donation History' is automatically recorded on your dashboard. Once you complete 3 verified donations, you receive the 'Verified Asset' badge.";
  }

  // --- PRIORITY 4: GENERIC & HELP (Lowest priority to avoid shadowing) ---

  // 12. Support & Contact
  if (query.includes('contact') || query.includes('support') || query.includes('team') || query.includes('email') || query.includes('help')) {
    return "For operational support, contact Mission Control at team@roktolagbe.org. Our team typically responds to all inquiries within 12-24 hours.";
  }

  // 13. Lifestyle Habits
  if (query.includes('smoke') || query.includes('alcohol') || query.includes('tattoo') || query.includes('piercing')) {
    return "Lifestyle: Avoid smoking for 2 hours and alcohol for 24 hours before donation. Tattoos/piercings require a 6-month wait period.";
  }

  return null;
}

function getStaticAnswer(query: string, demandContext: string): string {
  if (query.includes('need') || query.includes('demand') || query.includes('urgency') || query.includes('blood')) {
    return `${demandContext} Please check the 'Urgent Requests' page for live locations requiring immediate support.`;
  }
  return 'I am currently in power-save mode due to high network demand. I can still help with registration info, blood compatibility, and platform basics. For unique medical queries, please contact us at team@roktolagbe.org.';
}
