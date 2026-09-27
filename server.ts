import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client according to instructions
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. AI Enhance Bullet Point
app.post('/api/ai/enhance-bullet', async (req, res) => {
  try {
    const { bullet, role, context } = req.body;
    if (!bullet || typeof bullet !== 'string') {
      return res.status(400).json({ error: 'Bullet text is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment variables.',
      });
    }

    const prompt = `You are a world-class executive resume writer and ATS specialist.
Transform the following rough resume bullet point into 3 distinct, high-impact achievement statements.
Job Title/Role: ${role || 'Professional'}
Additional Context: ${context || 'None'}
Original Bullet: "${bullet}"

Rules:
1. Start with strong, varied action verbs (e.g., Spearheaded, Orchestrated, Engineered, Accelerated).
2. Emphasize quantifiable metrics, business value, or scale (using reasonable placeholder numbers like [X]%, [$Y]M, [Z] users where applicable if the original lacks data).
3. Follow the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
4. Keep each option between 15-28 words.
5. Provide 3 styles:
   - "metrics": Focus heavily on quantifiable data and speed/revenue/efficiency.
   - "leadership": Focus on ownership, strategy, and cross-functional impact.
   - "concise": Punchy, modern, direct, ATS-optimized.

Return STRICT JSON only in the following schema:
{
  "options": [
    { "style": "Impact & Metrics", "text": "..." },
    { "style": "Leadership & Strategy", "text": "..." },
    { "style": "Concise & Direct", "text": "..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error enhancing bullet:', error);
    return res.status(500).json({
      error: error.message || 'Failed to enhance bullet point',
    });
  }
});

// 2. AI Generate Professional Summary
app.post('/api/ai/generate-summary', async (req, res) => {
  try {
    const { fullName, jobTitle, experienceYears, skills, highlights } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment variables.',
      });
    }

    const prompt = `You are an elite career coach and executive headhunter.
Write 3 compelling professional summary options for this candidate's resume/CV:
- Candidate: ${fullName || 'Candidate'}
- Target Title: ${jobTitle || 'Experienced Specialist'}
- Years of Experience: ${experienceYears || '3+'} years
- Core Skills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Relevant industry skills'}
- Notable Highlights: ${highlights || 'Proven track record of excellence and collaboration'}

Provide 3 distinct tones:
1. Executive & Authoritative (focused on leadership, strategic vision, and bottom-line impact)
2. Results-Driven & Metric-Focused (focused on technical depth, execution speed, and measurable outcomes)
3. Modern & Adaptable (contemporary tone, mission-driven, highlighting rapid learning and innovation)

Each summary must be 3-4 sentences (approx 45-65 words), clear, grammatically flawless, and free of cliches like "go-getter".

Return STRICT JSON:
{
  "summaries": [
    { "tone": "Executive & Strategic", "text": "..." },
    { "tone": "Results-Driven", "text": "..." },
    { "tone": "Modern & Adaptive", "text": "..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate summary',
    });
  }
});

// 3. AI Recommend Skills
app.post('/api/ai/suggest-skills', async (req, res) => {
  try {
    const { jobTitle, existingSkills } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment variables.',
      });
    }

    const prompt = `Suggest high-value ATS resume skills for:
Target Role: "${jobTitle || 'Software Engineer'}"
Existing Skills: ${Array.isArray(existingSkills) ? existingSkills.join(', ') : ''}

Provide skills categorized into:
- "technical": 6-8 core technical / hard domain skills
- "tools": 4-6 industry standard tools / platforms / software
- "soft": 4-5 high-value collaborative / leadership soft skills

Exclude skills already in existing skills. Return STRICT JSON:
{
  "technical": ["Skill 1", "Skill 2", ...],
  "tools": ["Tool 1", "Tool 2", ...],
  "soft": ["Soft skill 1", "Soft skill 2", ...]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error suggesting skills:', error);
    return res.status(500).json({
      error: error.message || 'Failed to suggest skills',
    });
  }
});

// 4. AI ATS Resume Review & Scoring
app.post('/api/ai/review-resume', async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment variables.',
      });
    }

    const prompt = `You are a senior hiring manager and Applicant Tracking System (ATS) algorithm auditor.
Review the following resume data:
${JSON.stringify(resumeData, null, 2)}

Provide an honest, constructive ATS compatibility audit and score (0 to 100):
Evaluate on:
1. Impact & Quantifiable achievements (use of metrics, KPIs)
2. Action Verbs & Language strength (lack of passive voice)
3. Completeness & Structure (clear contact info, summary, experience dates, education, skills)
4. ATS Readability & Keyword presence

Return STRICT JSON format:
{
  "score": 85,
  "verdict": "Strong candidate profile with solid technical depth. Minor polish needed on quantified metrics.",
  "breakdown": {
    "impactScore": 80,
    "clarityScore": 90,
    "completenessScore": 95,
    "atsCompatibilityScore": 88
  },
  "strengths": [
    "Clear chronological career progression",
    "Strong technical tool stack aligned with target role"
  ],
  "improvements": [
    "Add more specific metric percentages (e.g. reduction in latency or cost savings)",
    "Shorten lengthy bullets to under 30 words for quick recruiter skimming"
  ],
  "missingKeywords": [
    "CI/CD", "System Architecture", "Cross-functional Collaboration"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error reviewing resume:', error);
    return res.status(500).json({
      error: error.message || 'Failed to review resume',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
