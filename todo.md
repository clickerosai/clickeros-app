# Clickeros AI Mobile App — TODO

## Branding & Configuration
- [x] Generate custom app logo (violet/purple gradient with "C" icon)
- [x] Update theme colors to Clickeros brand (violet primary)
- [x] Update app.config.ts with app name "Clickeros"
- [x] Update splash screen and icons

## Core Navigation
- [x] Configure bottom tab bar (Dashboard, Campaigns, AI Creator, Analytics, More)
- [x] Add icon mappings for all tab icons
- [x] Create More screen with full navigation list

## Auth Screens
- [x] Landing/Splash screen with hero section
- [x] Login screen
- [x] Sign Up screen

## Dashboard Screen
- [x] Stats cards (Campaigns, Revenue, ROAS, CTR)
- [x] Quick action buttons
- [x] Recent campaigns list
- [x] Welcome message

## Campaigns Screen
- [x] Campaign list with status badges
- [x] Campaign card with metrics
- [x] Create campaign button

## AI Creator Screen
- [x] Ad generation form (product, audience, platform)
- [x] Platform selector (Facebook, Instagram, Google, TikTok, YouTube)
- [x] Generated ad variations display
- [x] Copy/export functionality

## Analytics Screen
- [x] Traffic overview cards
- [x] Performance chart
- [x] Campaign performance table

## More Screen (Navigation Hub)
- [x] Grouped navigation sections
- [x] Analytics section links
- [x] Intelligence section links
- [x] Tools section links
- [x] AI Features section links
- [x] Growth Tools section links
- [x] Advanced section links
- [x] Account section links

## Secondary Screens
- [x] Campaign Performance screen
- [x] SEO Insights screen
- [x] Strategy Copilot screen
- [x] Revenue Attribution screen
- [x] Pricing screen (Free / Pro $49 / Agency $149)
- [x] Settings screen
- [x] Billing & Plans screen
- [x] Competitor Spy screen
- [x] Budget Optimizer screen
- [x] Content Distribution screen
- [x] AI Video Generator screen
- [x] Creative Lab screen
- [x] Audience Intelligence screen
- [x] Trend Radar screen
- [x] Agency Mode screen
- [x] Integrations screen

## Privacy Policy & Google Play Compliance
- [x] Create Privacy Policy screen (CAMERA, RECORD_AUDIO, READ_PHONE_STATE, GET_ACCOUNTS)
- [x] Add Privacy Policy link to Settings screen
- [x] Declare all required Android permissions in app.config.ts
- [x] Configure Android build for .aab format (Android App Bundle)
- [x] Host Privacy Policy at public URL for Google Play Console submission

## Public Web Privacy Policy
- [x] Create public /privacy-policy web page (HTML, SEO-friendly, Google Play submittable)

## Terms of Service
- [x] Create public /terms-of-service web page (HTML, Google Play / App Store submittable)
- [x] Create in-app Terms of Service screen
- [x] Link Terms of Service from Settings screen

## Additional Legal Pages
- [x] Cookie Policy page (/cookie-policy) — web + in-app
- [x] Data Safety form page (/data-safety) — web + in-app
- [x] CAMERA permission policy page (/permissions/camera) — web + in-app
- [x] RECORD_AUDIO permission policy page (/permissions/record-audio) — web + in-app
- [x] GET_ACCOUNTS permission policy page (/permissions/get-accounts) — web + in-app
- [x] Register all new routes in Express server
- [x] Add all new pages to Settings Legal section

## Responsive Design & Layout Fixes
- [x] Update global CSS / NativeWind config with responsive tokens and breakpoints
- [x] Fix Dashboard screen — responsive cards, safe areas, touch targets
- [x] Fix Campaigns screen — FlatList cards, horizontal scroll tables
- [x] Fix AI Creator screen — form inputs, platform selector, results cards
- [x] Fix Analytics screen — charts, metric grid, responsive tables
- [x] Fix More screen — navigation list, section headers
- [x] Fix all secondary/feature screens — stat cards, feature lists
- [x] Fix legal HTML pages — viewport, responsive tables, mobile layout
- [x] Fix Settings screen — list items, touch targets
- [x] Ensure all touch targets are minimum 44x44px
- [x] Eliminate horizontal overflow on all screens
- [x] Add responsive typography (clamp, rem units)

## Pull-to-Refresh
- [x] Add pull-to-refresh to Dashboard screen with haptic feedback and last-updated timestamp
- [x] Add pull-to-refresh to Campaigns screen with haptic feedback and last-updated timestamp

## Improvements (Step 1-2-3)
- [x] Pull-to-refresh on Analytics screen
- [x] tRPC backend router for dashboard stats, campaigns, and analytics data
- [x] Connect Dashboard screen to real API data via TanStack Query
- [x] Connect Campaigns screen to real API data via TanStack Query
- [x] Connect Analytics screen to real API data via TanStack Query
- [x] Stale-data badge on Dashboard and Campaigns tab bar icons

## AI Ads Generator Overhaul
- [x] tRPC adGenerator endpoint with grounded prompt engine and LLM integration
- [x] Post-generation relevance scoring (keyword match, audience, goal, CTA)
- [x] Smart fallback mode (template-based ads when AI fails)
- [x] Multi-platform style differentiation (Meta, TikTok, Google, LinkedIn)
- [x] Form validation with inline errors (required fields)
- [x] Progress UX: loading animation, step-by-step status messages
- [x] Regenerate button and Edit variation option
- [x] Context memory fix: always use latest form state, no stale data
- [x] Expo Go mobile optimizations (keyboard, double-click prevention)
- [x] Developer debug logs for payload, result, score, rejections

## Bug Fixes (Full Audit)
- [ ] Fix broken layouts (overflow, clipping, missing flex constraints)
- [ ] Fix loading issues (missing error states, infinite spinners)
- [ ] Fix crashes (missing icon mappings, undefined data access)
- [ ] Fix slow responses (add request timeouts, optimistic UI)
- [ ] Fix incorrect AI outputs (prompt grounding, fallback validation)
- [ ] Fix mobile responsiveness (safe areas, keyboard avoidance)
- [ ] Fix form validation (inline errors, required field checks)
- [ ] Fix auth/session bugs (error handling, token refresh)

## Complete User Flow (End-to-End)
- [ ] Sign Up / Onboarding screen (OAuth + email, welcome, feature highlights)
- [ ] Connect Accounts screen (Facebook, Google, TikTok, YouTube, LinkedIn)
- [ ] Create Campaign flow (step-by-step wizard with validation)
- [ ] Generate Ads integrated into campaign flow
- [ ] Launch Campaign screen (review, budget, schedule, confirm)
- [ ] Success/confirmation screen after launch
- [ ] Navigation guard: redirect unauthenticated users to Sign Up
- [ ] Persistent session handling (token refresh, logout)
- [ ] Error boundaries on all screens
- [ ] Empty states on all list screens

## AI Quality Improvements
- [ ] 7 industry campaign templates (eCommerce, Local, Real Estate, Coaches, Restaurants, SaaS, Fashion)
- [ ] Upgraded prompt grounding with industry-specific context injection
- [ ] Campaign memory (persist last campaign form values in AsyncStorage)
- [ ] Relevance scoring UI with per-dimension breakdown bars
- [ ] AI retry system (auto-retry up to 3x if score < threshold)
- [ ] Ad tone selector with platform-aware recommendations
- [ ] Generate Ads screen wired from Create Campaign flow
- [ ] Launch Campaign screen with review, budget, schedule, confirm
- [ ] Campaign success screen after launch

## In-App Legal Pages
- [x] Permission Disclosures screen (CAMERA, RECORD_AUDIO, READ_PHONE_STATE, GET_ACCOUNTS)
- [x] Privacy Policy in-app screen
- [x] Terms of Service in-app screen
- [x] Update Settings to link all three pages

## Auth & Session Polish
- [x] Test full OAuth login flow end-to-end
- [x] Branded loading splash screen during session establishment
- [x] Global UNAUTHORIZED session expiry handler in root layout

## Auth UX Improvements
- [x] Global Toast notification component
- [x] Session expired toast before redirect
- [x] Biometric re-authentication (Face ID / fingerprint) on native
- [x] Remember Me checkbox on Sign Up with silent token refresh

## UX Polish
- [x] Sign Out Everywhere in Settings (clearBiometricToken + removeSessionToken + clearUserInfo + toast)
- [x] Campaign toast notifications (pause, resume, optimize)
- [x] Biometric enrollment prompt after sign-in

## Notification Features
- [x] Push notification service (expo-notifications, ROAS drop, budget exhausted)
- [x] In-app notification center (bell icon, read/unread, campaign events)
- [x] What's New changelog modal (one-time per version, AsyncStorage)
