import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

// ── Input Schema ──────────────────────────────────────────────────────────────

export const CampaignInputSchema = z.object({
  businessName:      z.string().min(1, "Business name is required").max(200),
  productService:    z.string().min(1, "Product or service is required").max(300),
  targetAudience:    z.string().min(1, "Target audience is required").max(300),
  campaignObjective: z.enum(["awareness", "traffic", "conversions", "retargeting", "leads"]),
  tone:              z.enum(["professional", "casual", "urgent", "inspirational", "humorous"]).default("casual"),
  offer:             z.string().max(200).optional(),
  cta:               z.string().min(1, "CTA is required").max(100),
  websiteUrl:        z.string().url().optional().or(z.literal("")),
  platform:          z.enum(["facebook", "instagram", "google", "tiktok", "youtube", "linkedin"]),
  keywords:          z.string().max(300).optional(),
  variationIndex:    z.number().int().min(0).max(2).optional(), // for single regeneration
});

export type CampaignInput = z.infer<typeof CampaignInputSchema>;

// ── Output Types ──────────────────────────────────────────────────────────────

export interface AdVariation {
  id: string;
  headline: string;
  body: string;
  cta: string;
  hook?: string;           // TikTok / short-form hook line
  relevanceScore: number;  // 0–100
  relevanceBreakdown: {
    keywordMatch: number;
    businessMention: number;
    audienceMatch: number;
    objectiveAlignment: number;
    ctaRelevance: number;
  };
  type: "High Performer" | "Strong" | "Good" | "Fallback";
  platform: string;
  isFromFallback: boolean;
  debugLog?: string;       // dev-mode log
}

export interface GenerateAdsResult {
  variations: AdVariation[];
  totalGenerated: number;
  rejectedCount: number;
  usedFallback: boolean;
  platform: string;
  campaignSummary: string;
}

// ── Platform Style Guide ──────────────────────────────────────────────────────

const PLATFORM_STYLE: Record<string, string> = {
  facebook:  "Write in a conversational, warm, and conversion-focused tone. Use social proof if possible. Max headline 40 chars, body 125 chars.",
  instagram: "Write visually evocative, lifestyle-oriented copy. Use emojis sparingly. Max headline 30 chars, body 125 chars.",
  google:    "Write keyword-driven, direct-intent copy. Be concise and benefit-focused. Max headline 30 chars, body 90 chars. No emojis.",
  tiktok:    "Write a punchy hook (first 3 words must grab attention), trend-style copy, casual Gen-Z friendly language. Max headline 20 chars, body 100 chars.",
  youtube:   "Write engaging, story-driven copy with a clear value proposition. Max headline 40 chars, body 150 chars.",
  linkedin:  "Write in a professional, authoritative tone. Focus on business value and ROI. No slang. Max headline 40 chars, body 150 chars.",
};

const OBJECTIVE_STYLE: Record<string, string> = {
  awareness:    "Focus on brand recognition and memorability. Avoid hard selling.",
  traffic:      "Focus on curiosity and click-through. Use action verbs.",
  conversions:  "Focus on urgency, value, and clear next step. Include the offer prominently.",
  retargeting:  "Acknowledge the audience already knows the brand. Focus on overcoming objections.",
  leads:        "Focus on the benefit of signing up / getting the free resource. Reduce friction.",
};

// ── Relevance Scoring ─────────────────────────────────────────────────────────

function scoreRelevance(
  ad: { headline: string; body: string; cta: string },
  input: CampaignInput
): AdVariation["relevanceBreakdown"] & { total: number } {
  const text = `${ad.headline} ${ad.body} ${ad.cta}`.toLowerCase();

  // 1. Keyword match (0–20)
  const keywords = (input.keywords || "").toLowerCase().split(/[,\s]+/).filter(Boolean);
  const businessWords = input.businessName.toLowerCase().split(/\s+/);
  const productWords = input.productService.toLowerCase().split(/\s+/);
  const allKeywords = [...keywords, ...businessWords, ...productWords];
  const matchedKeywords = allKeywords.filter((kw) => kw.length > 2 && text.includes(kw));
  const keywordMatch = Math.min(20, Math.round((matchedKeywords.length / Math.max(allKeywords.length, 1)) * 20));

  // 2. Business mention (0–20)
  const bizWords = input.businessName.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const bizMentioned = bizWords.some((w) => text.includes(w));
  const productMentioned = productWords.some((w) => w.length > 2 && text.includes(w));
  const businessMention = bizMentioned ? 20 : productMentioned ? 12 : 0;

  // 3. Audience match (0–20)
  const audienceWords = input.targetAudience.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const audienceMatched = audienceWords.filter((w) => text.includes(w));
  const audienceMatch = Math.min(20, Math.round((audienceMatched.length / Math.max(audienceWords.length, 1)) * 20));

  // 4. Objective alignment (0–20)
  const objectiveKeywords: Record<string, string[]> = {
    awareness:   ["discover", "introducing", "meet", "learn about", "brand", "new"],
    traffic:     ["click", "visit", "explore", "see", "check out", "find out"],
    conversions: ["buy", "shop", "get", "order", "save", "deal", "offer", "limited", "now"],
    retargeting: ["back", "still", "remember", "missed", "waiting", "return"],
    leads:       ["free", "sign up", "join", "register", "download", "get access"],
  };
  const objKws = objectiveKeywords[input.campaignObjective] || [];
  const objMatched = objKws.filter((kw) => text.includes(kw));
  const objectiveAlignment = Math.min(20, objMatched.length * 7);

  // 5. CTA relevance (0–20)
  const inputCta = input.cta.toLowerCase();
  const adCta = ad.cta.toLowerCase();
  const ctaWords = inputCta.split(/\s+/).filter((w) => w.length > 2);
  const ctaMatched = ctaWords.filter((w) => adCta.includes(w));
  const ctaRelevance = ctaMatched.length > 0 ? 20 : adCta.length > 2 ? 10 : 0;

  const total = keywordMatch + businessMention + audienceMatch + objectiveAlignment + ctaRelevance;

  return { keywordMatch, businessMention, audienceMatch, objectiveAlignment, ctaRelevance, total };
}

function getVariationType(score: number): AdVariation["type"] {
  if (score >= 80) return "High Performer";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Good";
  return "Fallback";
}

// ── Smart Fallback Templates ──────────────────────────────────────────────────

function buildFallbackAd(input: CampaignInput, index: number): Omit<AdVariation, "id"> {
  const templates = [
    {
      headline: `${input.businessName}: ${input.productService.slice(0, 30)}`,
      body: `${input.businessName} helps ${input.targetAudience} ${
        input.campaignObjective === "conversions" ? "get results faster" :
        input.campaignObjective === "leads" ? "get started for free" :
        "achieve their goals"
      }. ${input.offer ? input.offer + "." : ""}`,
      cta: input.cta,
    },
    {
      headline: `Discover ${input.productService.slice(0, 35)} Today`,
      body: `Designed for ${input.targetAudience}. ${input.businessName} delivers ${
        input.productService.slice(0, 50)
      }. ${input.offer || "Try it now."}`,
      cta: input.cta,
    },
    {
      headline: `${input.targetAudience}? This Is For You`,
      body: `${input.businessName} offers ${input.productService.slice(0, 60)}. ${
        input.offer ? "Special offer: " + input.offer + "." : "Start today."
      }`,
      cta: input.cta,
    },
  ];

  const t = templates[index % templates.length];
  const breakdown = scoreRelevance(t, input);
  return {
    ...t,
    hook: input.platform === "tiktok" ? `Wait — ${input.productService.slice(0, 20)} for ${input.targetAudience}?` : undefined,
    relevanceScore: breakdown.total,
    relevanceBreakdown: breakdown,
    type: "Fallback",
    platform: input.platform,
    isFromFallback: true,
    debugLog: `[FALLBACK] Used template ${index}. Score: ${breakdown.total}/100`,
  };
}

// ── LLM Prompt Builder ────────────────────────────────────────────────────────

function buildSystemPrompt(input: CampaignInput): string {
  return `You are an expert digital advertising copywriter. Your ONLY job is to generate ad variations based STRICTLY on the campaign details provided by the user.

CRITICAL RULES:
1. Use ONLY the information provided. Do NOT invent products, services, audiences, or offers.
2. Every ad MUST mention the actual business name or product name provided.
3. The CTA in every ad MUST be derived from the user's specified CTA.
4. Match the tone exactly: ${input.tone}.
5. Adapt style for the platform: ${PLATFORM_STYLE[input.platform] || "Write clear, engaging copy."}
6. Adapt for the campaign objective: ${OBJECTIVE_STYLE[input.campaignObjective] || "Focus on the user's goal."}
7. Do NOT generate generic ads that could apply to any business.
8. Do NOT hallucinate random industries, fake offers, or incorrect audiences.

CAMPAIGN CONTEXT (use ONLY this):
- Business: ${input.businessName}
- Product/Service: ${input.productService}
- Target Audience: ${input.targetAudience}
- Campaign Goal: ${input.campaignObjective}
- Tone: ${input.tone}
- Platform: ${input.platform}
- Offer: ${input.offer || "None specified"}
- CTA: ${input.cta}
- Website: ${input.websiteUrl || "Not provided"}
- Keywords: ${input.keywords || "None specified"}`;
}

function buildUserPrompt(input: CampaignInput): string {
  return `Generate exactly 3 distinct ad variations for the campaign described above.

Each variation must:
- Have a unique angle (e.g., benefit-focused, urgency-focused, social proof-focused)
- Mention "${input.businessName}" or "${input.productService}" directly
- Target "${input.targetAudience}" specifically
- Include a CTA based on "${input.cta}"
${input.platform === "tiktok" ? '- Include a short "hook" line (first 3 words that grab attention)' : ""}

Return ONLY valid JSON in this exact format:
{
  "variations": [
    {
      "headline": "...",
      "body": "...",
      "cta": "...",
      "hook": "..."
    }
  ]
}`;
}

// ── Router ────────────────────────────────────────────────────────────────────

export const adGeneratorRouter = router({
  /**
   * POST /api/trpc/adGenerator.generate
   * Generates 3 grounded, platform-specific ad variations using the LLM.
   * Falls back to templates if LLM fails or scores are too low.
   */
  generate: publicProcedure
    .input(CampaignInputSchema)
    .mutation(async ({ input }): Promise<GenerateAdsResult> => {
      const debugLogs: string[] = [];
      let usedFallback = false;
      let rejectedCount = 0;
      const QUALITY_THRESHOLD = 45; // minimum relevance score to show

      debugLogs.push(`[PAYLOAD] ${JSON.stringify({
        business: input.businessName,
        product: input.productService,
        audience: input.targetAudience,
        objective: input.campaignObjective,
        platform: input.platform,
        tone: input.tone,
        cta: input.cta,
      })}`);

      // ── Step 1: Try LLM generation ──────────────────────────────────────────
      let rawVariations: Array<{ headline: string; body: string; cta: string; hook?: string }> = [];

      try {
        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: buildSystemPrompt(input) },
            { role: "user",   content: buildUserPrompt(input) },
          ],
          response_format: { type: "json_object" },
        });

        const content = String(llmResponse?.choices?.[0]?.message?.content ?? "");
        debugLogs.push(`[LLM_RESPONSE] ${content.slice(0, 500)}`);

        const parsed = JSON.parse(content);
        rawVariations = Array.isArray(parsed?.variations) ? parsed.variations : [];

        debugLogs.push(`[PARSED] ${rawVariations.length} variations from LLM`);
      } catch (err) {
        debugLogs.push(`[LLM_ERROR] ${err instanceof Error ? err.message : String(err)}`);
        usedFallback = true;
      }

      // ── Step 2: Score and filter LLM results ───────────────────────────────
      const scoredVariations: AdVariation[] = [];

      for (let i = 0; i < rawVariations.length; i++) {
        const raw = rawVariations[i];
        if (!raw?.headline || !raw?.body || !raw?.cta) {
          debugLogs.push(`[REJECTED] Variation ${i}: missing required fields`);
          rejectedCount++;
          continue;
        }

        const breakdown = scoreRelevance(raw, input);
        const score = breakdown.total;
        debugLogs.push(`[SCORE] Variation ${i}: ${score}/100 — ${JSON.stringify(breakdown)}`);

        if (score < QUALITY_THRESHOLD) {
          debugLogs.push(`[REJECTED] Variation ${i}: score ${score} below threshold ${QUALITY_THRESHOLD}`);
          rejectedCount++;
          continue;
        }

        scoredVariations.push({
          id: `llm-${i}-${Date.now()}`,
          headline: raw.headline,
          body: raw.body,
          cta: raw.cta,
          hook: raw.hook,
          relevanceScore: score,
          relevanceBreakdown: breakdown,
          type: getVariationType(score),
          platform: input.platform,
          isFromFallback: false,
          debugLog: debugLogs.join("\n"),
        });
      }

      // ── Step 3: Fill with fallbacks if needed ──────────────────────────────
      const needed = 3 - scoredVariations.length;
      if (needed > 0) {
        usedFallback = true;
        debugLogs.push(`[FALLBACK] Generating ${needed} fallback variation(s)`);
        for (let i = 0; i < needed; i++) {
          const fallback = buildFallbackAd(input, scoredVariations.length + i);
          scoredVariations.push({
            id: `fallback-${i}-${Date.now()}`,
            ...fallback,
            debugLog: fallback.debugLog,
          });
        }
      }

      // ── Step 4: Sort by score descending ───────────────────────────────────
      scoredVariations.sort((a, b) => b.relevanceScore - a.relevanceScore);

      const campaignSummary = `${input.businessName} · ${input.productService} · ${input.targetAudience} · ${input.platform}`;

      debugLogs.push(`[RESULT] ${scoredVariations.length} variations returned, ${rejectedCount} rejected, fallback=${usedFallback}`);

      return {
        variations: scoredVariations,
        totalGenerated: rawVariations.length + (usedFallback ? needed : 0),
        rejectedCount,
        usedFallback,
        platform: input.platform,
        campaignSummary,
      };
    }),

  /**
   * POST /api/trpc/adGenerator.regenerateSingle
   * Regenerates a single variation at a given index with a fresh prompt.
   */
  regenerateSingle: publicProcedure
    .input(CampaignInputSchema.extend({ variationIndex: z.number().int().min(0).max(2) }))
    .mutation(async ({ input }): Promise<AdVariation> => {
      const angleHints = [
        "Focus on the primary benefit and urgency.",
        "Use social proof and trust signals.",
        "Lead with the offer and value proposition.",
      ];
      const angle = angleHints[input.variationIndex] || angleHints[0];

      try {
        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: buildSystemPrompt(input) },
            {
              role: "user",
              content: `Generate ONE ad variation for the campaign above. Angle: ${angle}\n${input.platform === "tiktok" ? "Include a hook line." : ""}\nReturn JSON: { "headline": "...", "body": "...", "cta": "...", "hook": "..." }`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const content = String(llmResponse?.choices?.[0]?.message?.content ?? "");
        const parsed = JSON.parse(content);
        const raw = parsed?.headline ? parsed : parsed?.variation ?? parsed;

        if (!raw?.headline || !raw?.body || !raw?.cta) {
          throw new Error("Invalid LLM response structure");
        }

        const breakdown = scoreRelevance(raw, input);
        return {
          id: `regen-${input.variationIndex}-${Date.now()}`,
          headline: raw.headline,
          body: raw.body,
          cta: raw.cta,
          hook: raw.hook,
          relevanceScore: breakdown.total,
          relevanceBreakdown: breakdown,
          type: getVariationType(breakdown.total),
          platform: input.platform,
          isFromFallback: false,
        };
      } catch {
        const fallback = buildFallbackAd(input, input.variationIndex);
        return {
          id: `regen-fallback-${input.variationIndex}-${Date.now()}`,
          ...fallback,
        };
      }
    }),
});
