# Clickeros AI — Mobile App Design

## Brand Identity
- **Primary Color:** Violet/Purple gradient (`#7C3AED` → `#9333EA`)
- **Background:** White (`#FFFFFF`) / Dark (`#0F172A`)
- **Text:** Slate (`#0F172A`) / Muted (`#64748B`)
- **Accent:** Violet-600 (`#7C3AED`)
- **Font:** Inter (system-ui fallback)
- **Tagline:** "Turn Content Into Revenue — Automatically"

## Screen List

### Auth Screens
1. **Splash / Landing** — Hero with tagline, CTA buttons (Start Free, Log In)
2. **Login** — Email/password login, Google OAuth
3. **Sign Up** — Name, email, password, Google OAuth

### Main App Screens (Tab Bar)
4. **Dashboard** — Stats overview, quick actions, recent campaigns
5. **Campaigns** — Campaign Manager list with status indicators
6. **AI Creator** — AI Ads Creator tool
7. **Analytics** — Traffic analytics overview
8. **More** — Navigation to all other sections

### Secondary Screens (from More tab)
9. **Campaign Performance** — ROAS, CTR, CPA charts
10. **Customer Journey** — Attribution funnel
11. **Audience Intelligence** — Audience segments
12. **Creative Performance** — Ad creative scoring
13. **Trend Intelligence** — Trending topics
14. **Revenue Intelligence** — Revenue breakdown
15. **Trend Radar** — Market trends
16. **Audience Finder** — Find new audiences
17. **Competitor Spy** — Competitor analysis
18. **Creative Studio** — Creative asset builder
19. **Retargeting** — Retargeting campaigns
20. **Creative Lab** — A/B testing creatives
21. **Budget Optimizer** — Budget allocation AI
22. **Opportunity Scanner** — Growth opportunities
23. **Command Center** — Automation hub
24. **Profit Pilot** — Profit optimization
25. **Retargeting Engine** — Advanced retargeting
26. **Marketing Reports** — PDF report generation
27. **Campaign Templates** — Pre-built templates
28. **Marketing Score** — Brand health score
29. **SEO Insights** — SEO dashboard
30. **AI Search Visibility** — LLM visibility tracker
31. **Revenue Attribution** — Attribution dashboard
32. **Content Distribution** — Multi-channel distribution
33. **AI Video Generator** — Video creation tool
34. **Strategy Copilot** — Weekly AI action plan
35. **A/B Testing** — Split testing
36. **Competitor Reverse** — Reverse-engineer competitors
37. **Programmatic SEO** — Bulk page generation
38. **Agency Mode** — Multi-client management
39. **Integrations** — Platform connections
40. **Done-For-You** — Managed service
41. **Growth OS** — Full growth operating system
42. **Settings** — Account settings
43. **Billing & Plans** — Subscription management
44. **Pricing** — Plan comparison (Free / Pro $49 / Agency $149)

## Key User Flows

### Onboarding Flow
1. Splash screen → "Start Free" → Sign Up → Onboarding → Dashboard

### Campaign Creation Flow
1. Dashboard → "Create Campaign" → AI Creator → Set audience → Generate ads → Launch

### Analytics Flow
1. Dashboard → Analytics tab → Campaign Performance → Drill into specific campaign

### Upgrade Flow
1. Any premium feature → Upgrade prompt → Pricing screen → Billing

## Color Choices
- **Primary:** `#7C3AED` (Violet-600) — brand identity
- **Primary Gradient:** `from-violet-600 to-purple-600`
- **Background:** `#FFFFFF` light / `#0F172A` dark
- **Surface:** `#F8FAFC` light / `#1E293B` dark
- **Border:** `#E2E8F0` light / `#334155` dark
- **Success:** `#22C55E`
- **Warning:** `#F59E0B`
- **Error:** `#EF4444`

## Navigation Structure
- **Bottom Tab Bar:** Dashboard | Campaigns | AI Creator | Analytics | More
- **Stack Navigation:** Each tab can push detail screens
- **Drawer/Sheet:** More tab opens a full list of all sections
