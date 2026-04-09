/**
 * AI Query Helper
 * Simulated parsing of natural language for Blood Discovery.
 * This can be connected to Gemini/OpenAI free tiers.
 */

export interface ParsedQuery {
  bloodGroup?: string;
  district?: string;
  urgency?: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  queryType?: 'DONOR' | 'REQUEST';
}

const BLOOD_GROUPS: Record<string, string> = {
  'A+': 'A_POS', 'A-': 'A_NEG',
  'B+': 'B_POS', 'B-': 'B_NEG',
  'O+': 'O_POS', 'O-': 'O_NEG',
  'AB+': 'AB_POS', 'AB-': 'AB_NEG',
};

/**
 * Lightweight parsing logic (Regex-based mock of AI intent)
 * In production, this would call an LLM with the prompt: 
 * "Parse this blood request search: [query]. Return JSON {group, district, urgency}"
 */
export const parseBloodQuery = async (query: string): Promise<ParsedQuery> => {
  const normalized = query.toUpperCase();
  const result: ParsedQuery = {};

  // 1. Detect Blood Group
  for (const [key, val] of Object.entries(BLOOD_GROUPS)) {
    if (normalized.includes(key)) {
      result.bloodGroup = val;
      break;
    }
  }

  // 2. Detect Urgency
  if (normalized.includes('EMERGENCY') || normalized.includes('NOW') || normalized.includes('SOS')) {
    result.urgency = 'EMERGENCY';
  } else if (normalized.includes('URGENT')) {
    result.urgency = 'URGENT';
  } else {
    result.urgency = 'NORMAL';
  }

  // 3. Detect Intent
  if (normalized.includes('DONOR') || normalized.includes('LIST')) {
    result.queryType = 'DONOR';
  } else if (normalized.includes('NEED') || normalized.includes('REQUEST')) {
    result.queryType = 'REQUEST';
  }

  // 4. District Suggestion (Placeholder for Geocoding integration)
  // This will be refined using ORS geocoding as per the plan
  const commonDistricts = ['DHAKA', 'SYLHET', 'CHITTAGONG', 'RAJSHAHI', 'KHULNA', 'BARISHAL', 'RANGPUR'];
  for (const dist of commonDistricts) {
    if (normalized.includes(dist)) {
      result.district = dist.charAt(0) + dist.slice(1).toLowerCase();
      break;
    }
  }

  return result;
};

/**
 * AI FAQ Suggester
 * Returns potential answers or related questions based on keywords
 */
export const getAISuggestions = (input: string) => {
  if (input.length < 3) return [];
  
  const suggestions = [
    { title: "Donate A+ Blood", link: "/donors?group=A_POS" },
    { title: "Urgent O- Needs", link: "/urgent-requests?group=O_NEG" },
    { title: "How to Donate?", link: "/help" },
    { title: "Check Eligibility", link: "/help" }
  ];

  return suggestions.filter(s => s.title.toLowerCase().includes(input.toLowerCase()));
};
