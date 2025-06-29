import OpenAI from 'openai';
import { Profile, Match } from '@/types';
import { RawResumeData } from './pdfParser';

export class OpenAIAgent {
  private client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  async parseResumeToProfile(resumeData: RawResumeData): Promise<Profile> {
    const prompt = `
You are the MeetGenius Resume Parser for AI DEMO NIGHT on July 9, 2025.

Parse this resume text into a structured profile. Extract:
- Name (full name)
- Current title/role
- Current company
- Location (city/state/country)
- Skills (technical and soft skills)
- Certifications
- Key experience highlights
- Professional interests
- Inferred networking goal

Resume Text:
${resumeData.text}

Based on the title, skills, and experience, infer their networking goal:
- Founders/Entrepreneurs → "Find clients or startup partners"
- Students/Recent Grads → "Learn new tech and find mentorship"
- Recruiters/HR → "Hiring and talent acquisition"
- Engineers/Developers → "Technical collaboration and AI deep dives"
- Sales/Marketing → "Generate leads and partnerships"
- Consultants → "Find clients and expand network"

Return ONLY a JSON object in this exact format:
{
  "id": "generated-unique-id",
  "name": "Full Name",
  "title": "Current Title",
  "company": "Current Company",
  "location": "City, State",
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": ["cert1", "cert2"],
  "experience": ["experience1", "experience2"],
  "interests": ["interest1", "interest2"],
  "goal": "inferred networking goal"
}`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      const profile = JSON.parse(content) as Profile;
      profile.id = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return profile;
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw error;
    }
  }

  async generateMatches(profiles: Profile[]): Promise<Match[]> {
    const prompt = `
You are the MeetGenius Matching Agent for AI DEMO NIGHT on July 9, 2025.

Create optimal matches for these ${profiles.length} attendees. Each person should get exactly ONE high-quality match.

Profiles:
${JSON.stringify(profiles, null, 2)}

Matching Criteria:
1. Domain/industry overlap (same field = good)
2. Complementary roles (founder ↔ engineer, student ↔ mentor)
3. Shared skills or tools
4. Compatible networking goals
5. Location similarity (bonus points)
6. Shared certifications/education
7. Common interests or volunteer work

For each attendee, find their BEST match and generate:
- Match score (0.0 to 1.0)
- 3-5 things they share
- 3 conversation starters/icebreakers
- Confidence level (Low/Medium/High)
- Simulated presence status

IMPORTANT: 
- Each person appears exactly once as "attendee"
- No duplicate pairings (if A matches B, don't also have B match A)
- Ensure high-quality matches with scores > 0.7

Return ONLY a JSON array of match objects in this format:
[
  {
    "attendee": "Person A Name",
    "match": "Person B Name", 
    "matchScore": 0.85,
    "whatYouShare": ["skill1", "interest1", "goal similarity"],
    "icebreakers": ["question1", "question2", "question3"],
    "matchConfidence": "High",
    "presenceStatus": {
      "attendee": "Present",
      "match": "Just Arrived"
    }
  }
]`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 3000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      const rawMatches = JSON.parse(content);
      
      // Enrich matches with full profile data
      const enrichedMatches: Match[] = rawMatches.map((match: any) => {
        const attendeeProfile = profiles.find(p => p.name === match.attendee);
        const matchProfile = profiles.find(p => p.name === match.match);
        
        if (!attendeeProfile || !matchProfile) {
          throw new Error(`Profile not found for match: ${match.attendee} <-> ${match.match}`);
        }

        return {
          ...match,
          attendeeProfile,
          matchProfile
        };
      });

      return enrichedMatches;
    } catch (error) {
      console.error('Error generating matches:', error);
      throw error;
    }
  }
}
