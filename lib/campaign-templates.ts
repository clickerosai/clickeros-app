/**
 * Campaign Templates — 7 industry-specific presets
 * Each template pre-fills the campaign form with industry-appropriate defaults
 * and includes AI prompt hints for better generation quality.
 */

export interface CampaignTemplate {
  id: string;
  name: string;
  industry: string;
  icon: string;
  color: string;
  description: string;
  // Pre-filled form values
  defaults: {
    objective: string;
    tone: string;
    targetAudience: string;
    cta: string;
    offer: string;
    keywords: string;
    dailyBudget: string;
    ageRange: string;
    gender: string;
  };
  // AI prompt enhancement hints injected into the system prompt
  promptHints: {
    industryContext: string;
    painPoints: string[];
    valuePropositions: string[];
    platformRecommendations: Record<string, string>;
    exampleHeadlines: string[];
    avoidPhrases: string[];
  };
  // Example ad variations shown as inspiration
  exampleAds: Array<{
    platform: string;
    headline: string;
    body: string;
    cta: string;
  }>;
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  // ── 1. eCommerce ────────────────────────────────────────────────────────────
  {
    id: "ecommerce",
    name: "eCommerce Store",
    industry: "eCommerce",
    icon: "🛒",
    color: "#F59E0B",
    description: "Drive product sales, recover abandoned carts, and grow your online store",
    defaults: {
      objective: "conversions",
      tone: "urgent",
      targetAudience: "online shoppers aged 18-45 interested in [your product category]",
      cta: "Shop Now",
      offer: "Free shipping on orders over $50",
      keywords: "buy online, best price, fast shipping, sale, discount",
      dailyBudget: "30",
      ageRange: "18-44",
      gender: "all",
    },
    promptHints: {
      industryContext: "This is an eCommerce product ad. Focus on the product benefits, price value, and ease of purchase. Create urgency with limited-time offers.",
      painPoints: [
        "Worried about product quality before buying",
        "Unsure if shipping will be fast and reliable",
        "Looking for the best price",
        "Comparing multiple options",
      ],
      valuePropositions: [
        "Fast & free shipping",
        "Easy returns",
        "Best price guarantee",
        "Thousands of 5-star reviews",
        "Limited stock / sale ending soon",
      ],
      platformRecommendations: {
        facebook: "Use product images with price overlay. Lead with the offer. Include social proof numbers.",
        instagram: "Lifestyle imagery. Show the product in use. Aspirational tone.",
        google: "Include product name + key benefit + price in headline. Use shopping ad format.",
        tiktok: "Hook with a problem the product solves. Show before/after. Use trending sounds.",
        pinterest: "Visual product showcase. Include price. Target by interest category.",
      },
      exampleHeadlines: [
        "🔥 [Product] — 40% Off Today Only",
        "Why 50,000+ Shoppers Love [Product]",
        "The [Product] That Sells Out Every Week",
        "Free Shipping + Free Returns on [Product]",
      ],
      avoidPhrases: ["cheap", "low quality", "generic", "just another"],
    },
    exampleAds: [
      {
        platform: "Facebook",
        headline: "🔥 Summer Sale — Up to 40% Off",
        body: "Don't miss our biggest sale of the year. Free shipping on all orders + easy 30-day returns. Shop now before stock runs out!",
        cta: "Shop Now",
      },
      {
        platform: "Google",
        headline: "Best [Product] — Free Shipping",
        body: "Top-rated [product] with 10,000+ reviews. Fast delivery, easy returns. Order today.",
        cta: "Buy Now",
      },
    ],
  },

  // ── 2. Local Business ───────────────────────────────────────────────────────
  {
    id: "local-business",
    name: "Local Business",
    industry: "Local Business",
    icon: "📍",
    color: "#22C55E",
    description: "Drive foot traffic, phone calls, and local bookings for your business",
    defaults: {
      objective: "traffic",
      tone: "casual",
      targetAudience: "people within 10 miles of [your city] looking for [your service]",
      cta: "Get Directions",
      offer: "First visit 20% off",
      keywords: "near me, local, best in [city], open now, same day",
      dailyBudget: "20",
      ageRange: "25-54",
      gender: "all",
    },
    promptHints: {
      industryContext: "This is a local business ad targeting nearby customers. Emphasize proximity, convenience, and community trust. Include the city/area name when possible.",
      painPoints: [
        "Hard to find a reliable local provider",
        "Worried about quality and pricing",
        "Needs service quickly / same day",
        "Wants to support local businesses",
      ],
      valuePropositions: [
        "Locally owned and operated",
        "Same-day service available",
        "Trusted by [X] local customers",
        "Convenient location / easy parking",
        "Family-friendly / community-focused",
      ],
      platformRecommendations: {
        facebook: "Use location targeting radius. Show the storefront or team. Include address and phone.",
        google: "Use local search ads. Include city name in headline. Add call extension.",
        instagram: "Show the atmosphere and experience. Behind-the-scenes content works well.",
      },
      exampleHeadlines: [
        "The Best [Service] in [City] — Book Today",
        "Trusted by 2,000+ [City] Families",
        "[Service] Near You — Open 7 Days",
        "Same-Day [Service] Available in [City]",
      ],
      avoidPhrases: ["nationwide", "global", "international", "corporate"],
    },
    exampleAds: [
      {
        platform: "Facebook",
        headline: "Best [Service] in [City] — Book Today",
        body: "Trusted by over 2,000 local families. Same-day appointments available. First visit 20% off — limited spots this week!",
        cta: "Book Now",
      },
    ],
  },

  // ── 3. Real Estate ──────────────────────────────────────────────────────────
  {
    id: "real-estate",
    name: "Real Estate",
    industry: "Real Estate",
    icon: "🏠",
    color: "#0EA5E9",
    description: "Generate buyer and seller leads, showcase listings, and grow your client base",
    defaults: {
      objective: "leads",
      tone: "professional",
      targetAudience: "homebuyers and sellers aged 28-55 in [target area] with household income $75K+",
      cta: "View Listings",
      offer: "Free home valuation",
      keywords: "homes for sale, real estate agent, buy home, sell home, property listings",
      dailyBudget: "50",
      ageRange: "25-54",
      gender: "all",
    },
    promptHints: {
      industryContext: "This is a real estate ad. Focus on trust, expertise, and the dream of homeownership. Use aspirational language. Highlight market knowledge and local expertise.",
      painPoints: [
        "Overwhelmed by the home buying/selling process",
        "Unsure of current market value",
        "Worried about finding the right agent",
        "Concerned about timing the market",
      ],
      valuePropositions: [
        "Local market expert with X years experience",
        "Free home valuation",
        "Proven track record of X homes sold",
        "Personalized service from search to close",
        "Access to off-market listings",
      ],
      platformRecommendations: {
        facebook: "Use carousel ads to showcase multiple listings. Lead gen forms work extremely well for free valuations.",
        instagram: "Beautiful property photography. Virtual tour teasers. Lifestyle imagery of the neighborhood.",
        google: "Target 'homes for sale [city]' and 'real estate agent [city]' keywords.",
        linkedin: "Target professionals relocating for work. B2B real estate and commercial properties.",
      },
      exampleHeadlines: [
        "Your Dream Home in [Area] — See New Listings",
        "Sell Your Home for Top Dollar in [City]",
        "Free Home Valuation — What's Your Home Worth?",
        "[X] Homes Sold in [Area] — Let's Find Yours",
      ],
      avoidPhrases: ["cheap property", "distressed", "foreclosure spam", "get rich quick"],
    },
    exampleAds: [
      {
        platform: "Facebook",
        headline: "New Listings in [Area] — See Them First",
        body: "Looking to buy or sell in [Area]? Get exclusive access to new listings before they hit the market. Free home valuation included.",
        cta: "View Listings",
      },
    ],
  },

  // ── 4. Coaches & Consultants ────────────────────────────────────────────────
  {
    id: "coaches",
    name: "Coaches & Consultants",
    industry: "Coaching",
    icon: "🎯",
    color: "#7C3AED",
    description: "Attract high-ticket clients, fill your programs, and grow your coaching business",
    defaults: {
      objective: "leads",
      tone: "inspirational",
      targetAudience: "professionals and entrepreneurs aged 25-50 looking to [achieve specific transformation]",
      cta: "Book Free Call",
      offer: "Free 30-minute strategy session",
      keywords: "coaching, consultant, transformation, results, success, growth mindset",
      dailyBudget: "40",
      ageRange: "25-49",
      gender: "all",
    },
    promptHints: {
      industryContext: "This is a coaching/consulting ad. Focus on transformation, results, and the client's desired outcome. Use aspirational and empowering language. The offer is usually a free discovery call or lead magnet.",
      painPoints: [
        "Stuck and not making progress toward goals",
        "Tried everything but nothing works",
        "Overwhelmed and lacking direction",
        "Wants accountability and expert guidance",
        "Tired of going it alone",
      ],
      valuePropositions: [
        "Proven framework with X clients transformed",
        "Results guaranteed or money back",
        "1-on-1 personalized coaching",
        "Free discovery call to see if it's a fit",
        "Join a community of like-minded achievers",
      ],
      platformRecommendations: {
        facebook: "Video testimonials perform best. Use lead gen forms for free call bookings. Retarget video viewers.",
        instagram: "Share transformation stories. Behind-the-scenes of coaching sessions. Quote graphics.",
        linkedin: "Professional tone. Focus on business ROI and career advancement. Target by job title.",
        youtube: "Long-form content showing expertise. Pre-roll ads before relevant videos.",
      },
      exampleHeadlines: [
        "How [X] Clients Achieved [Result] in 90 Days",
        "Stop Struggling Alone — Get a Proven System",
        "Free Strategy Call: [Specific Transformation]",
        "The [Method] That Changed Everything for [Audience]",
      ],
      avoidPhrases: ["get rich quick", "overnight success", "magic formula", "secret hack"],
    },
    exampleAds: [
      {
        platform: "Facebook",
        headline: "How 200+ Clients Doubled Their Revenue in 6 Months",
        body: "Stop guessing and start growing. Our proven framework has helped 200+ entrepreneurs break through plateaus. Book your free 30-min strategy call today — spots are limited.",
        cta: "Book Free Call",
      },
    ],
  },

  // ── 5. Restaurants ──────────────────────────────────────────────────────────
  {
    id: "restaurants",
    name: "Restaurants & Food",
    industry: "Food & Beverage",
    icon: "🍽️",
    color: "#EF4444",
    description: "Fill tables, drive delivery orders, and build a loyal customer base",
    defaults: {
      objective: "traffic",
      tone: "casual",
      targetAudience: "food lovers aged 21-50 within 5 miles of [restaurant location]",
      cta: "Order Now",
      offer: "Free dessert with any entree",
      keywords: "restaurant near me, best food, delivery, dine in, takeout, [cuisine type]",
      dailyBudget: "25",
      ageRange: "21-49",
      gender: "all",
    },
    promptHints: {
      industryContext: "This is a restaurant/food ad. Use sensory language that makes people hungry. Mention specific dishes, ingredients, or flavors. Create urgency with limited-time offers or events.",
      painPoints: [
        "Tired of cooking at home",
        "Looking for a new dining experience",
        "Wants reliable, delicious food delivery",
        "Planning a special occasion dinner",
        "Craving a specific cuisine",
      ],
      valuePropositions: [
        "Fresh ingredients, made to order",
        "Fast delivery in under 30 minutes",
        "Perfect for date night / family dinner",
        "Award-winning [cuisine type]",
        "Exclusive weekly specials",
      ],
      platformRecommendations: {
        facebook: "High-quality food photography. Promote daily specials and events. Use local targeting.",
        instagram: "Mouth-watering food photos and videos. Stories for daily specials. Reels for behind-the-scenes.",
        tiktok: "Food preparation videos. ASMR cooking content. 'What I eat in a day' style.",
        google: "Target 'restaurant near me' and '[cuisine] delivery [city]'. Use call extensions.",
      },
      exampleHeadlines: [
        "🍕 Fresh [Dish] Made Daily — Order Now",
        "The [City]'s #1 [Cuisine] Restaurant",
        "Free Dessert This Weekend Only 🎂",
        "Delivery in 30 Min or It's Free",
      ],
      avoidPhrases: ["processed", "frozen", "microwaved", "artificial"],
    },
    exampleAds: [
      {
        platform: "Instagram",
        headline: "🔥 Our Famous [Dish] Is Back",
        body: "Hand-crafted with fresh local ingredients. Order online for delivery or dine in tonight. Free dessert with every order this week!",
        cta: "Order Now",
      },
    ],
  },

  // ── 6. SaaS ─────────────────────────────────────────────────────────────────
  {
    id: "saas",
    name: "SaaS / Software",
    industry: "Software",
    icon: "💻",
    color: "#6366F1",
    description: "Drive free trial sign-ups, demo requests, and paid conversions for your software",
    defaults: {
      objective: "leads",
      tone: "professional",
      targetAudience: "business owners, marketers, and team leads aged 25-45 who use software tools daily",
      cta: "Start Free Trial",
      offer: "14-day free trial, no credit card required",
      keywords: "software, tool, automation, productivity, SaaS, platform, dashboard",
      dailyBudget: "60",
      ageRange: "25-44",
      gender: "all",
    },
    promptHints: {
      industryContext: "This is a SaaS/software ad. Focus on the specific problem the software solves and the measurable outcome it delivers. Use data and metrics when possible. The primary goal is free trial or demo sign-ups.",
      painPoints: [
        "Wasting time on manual repetitive tasks",
        "Losing money due to inefficient processes",
        "Struggling to scale without the right tools",
        "Using too many disconnected tools",
        "Lack of visibility into key metrics",
      ],
      valuePropositions: [
        "Save X hours per week",
        "Increase revenue by X%",
        "Replace X tools with one platform",
        "Set up in minutes, no technical skills needed",
        "Trusted by X,000+ companies",
        "Free trial, cancel anytime",
      ],
      platformRecommendations: {
        google: "Target problem-aware keywords like 'automate [task]' and '[competitor] alternative'.",
        linkedin: "Target by job title and company size. Focus on ROI and business impact.",
        facebook: "Retargeting works extremely well. Show feature demos and customer testimonials.",
        youtube: "Product demo videos. Case study testimonials. 'How to' tutorials.",
      },
      exampleHeadlines: [
        "Save 10 Hours/Week with [Product] — Free Trial",
        "The [Category] Tool 50,000 Teams Trust",
        "Stop Doing [Manual Task] — Automate It",
        "[Competitor] Alternative That Actually Works",
      ],
      avoidPhrases: ["complicated", "requires training", "enterprise only", "expensive"],
    },
    exampleAds: [
      {
        platform: "LinkedIn",
        headline: "Save 10 Hours/Week on [Task] — Free Trial",
        body: "Join 50,000+ teams who automated [pain point] with [Product]. Set up in 5 minutes. No credit card required. See results in your first week.",
        cta: "Start Free Trial",
      },
    ],
  },

  // ── 7. Fashion Brands ───────────────────────────────────────────────────────
  {
    id: "fashion",
    name: "Fashion Brand",
    industry: "Fashion & Apparel",
    icon: "👗",
    color: "#EC4899",
    description: "Showcase collections, drive purchases, and build a loyal fashion community",
    defaults: {
      objective: "conversions",
      tone: "inspirational",
      targetAudience: "fashion-conscious shoppers aged 18-35 who follow style trends and shop online",
      cta: "Shop the Collection",
      offer: "Free shipping + 15% off first order",
      keywords: "fashion, style, trendy, new collection, outfit, clothing, apparel",
      dailyBudget: "35",
      ageRange: "18-34",
      gender: "female",
    },
    promptHints: {
      industryContext: "This is a fashion brand ad. Use aspirational, style-forward language. Focus on how the clothing makes the wearer feel — confident, stylish, unique. Reference current trends and seasons.",
      painPoints: [
        "Struggling to find clothes that fit their personal style",
        "Tired of wearing the same outfits",
        "Wants to look put-together effortlessly",
        "Looking for quality pieces that last",
        "Wants to express their personality through fashion",
      ],
      valuePropositions: [
        "Curated styles for every occasion",
        "Sustainable and ethically made",
        "Sizes XS-3XL — inclusive sizing",
        "New arrivals every week",
        "Styled by professional fashion editors",
        "Free returns on all orders",
      ],
      platformRecommendations: {
        instagram: "High-fashion photography and reels. Influencer collaborations. Story polls for style preferences.",
        tiktok: "Outfit-of-the-day videos. Get-ready-with-me content. Trending audio with fashion reveals.",
        pinterest: "Outfit inspiration boards. Seasonal lookbooks. Style guides by occasion.",
        facebook: "Dynamic product ads showing recently viewed items. Retargeting with abandoned cart.",
      },
      exampleHeadlines: [
        "✨ New Collection Just Dropped — Shop Now",
        "Dress Like You Mean It — [Brand Name]",
        "The Outfit That Sells Out Every Week",
        "Style That Speaks Before You Do",
      ],
      avoidPhrases: ["cheap clothes", "fast fashion", "low quality", "generic styles"],
    },
    exampleAds: [
      {
        platform: "Instagram",
        headline: "✨ New Collection Just Dropped",
        body: "Effortlessly stylish pieces for every occasion. New arrivals every week, curated by our style team. Free shipping + 15% off your first order.",
        cta: "Shop the Collection",
      },
    ],
  },
];

export const TEMPLATE_MAP = Object.fromEntries(
  CAMPAIGN_TEMPLATES.map((t) => [t.id, t])
);

/**
 * Build an enhanced system prompt using the campaign template's industry hints.
 * This is injected into the AI generation prompt for dramatically better results.
 */
export function buildIndustryPromptEnhancement(templateId: string | null): string {
  if (!templateId) return "";
  const template = TEMPLATE_MAP[templateId];
  if (!template) return "";

  return `
INDUSTRY CONTEXT: ${template.promptHints.industryContext}

CUSTOMER PAIN POINTS TO ADDRESS:
${template.promptHints.painPoints.map((p) => `- ${p}`).join("\n")}

KEY VALUE PROPOSITIONS TO HIGHLIGHT:
${template.promptHints.valuePropositions.map((v) => `- ${v}`).join("\n")}

EXAMPLE HEADLINE STYLES (adapt, don't copy exactly):
${template.promptHints.exampleHeadlines.map((h) => `- "${h}"`).join("\n")}

PHRASES TO AVOID:
${template.promptHints.avoidPhrases.map((p) => `- "${p}"`).join("\n")}
`.trim();
}
