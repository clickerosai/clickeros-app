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

## Notification Improvements
- [x] Notification settings screen (thresholds, type toggles, AsyncStorage)
- [x] Notification permission prompt on Dashboard after first campaign
- [x] Wire checkCampaignAlerts to Dashboard pull-to-refresh

## Advanced Notifications
- [x] Quiet hours (Do Not Disturb) in Notification Settings
- [x] Per-campaign alert overrides (custom ROAS threshold per campaign)
- [x] Daily performance digest (scheduled 9 AM push summary)

## Final Polish & Missing Features
- [x] Wire per-campaign overrides into checkCampaignAlerts loop
- [x] Weekly performance report (scheduleWeeklyReport, every Monday 9 AM)
- [x] Digest time customization in Notification Settings (7 AM–10 AM picker)
- [x] Error boundary component for screen-level crash recovery
- [x] Empty states on all list screens (Campaigns, Analytics, Notifications)
- [x] Offline/network error banner
- [x] Loading skeleton for Dashboard stats cards
- [x] App version display in Settings footer
- [x] Deep link handling for notification taps (navigate to relevant screen)

## Production Readiness
- [x] Wrap all tab screens in ErrorBoundary
- [x] Campaign search and status filter bar
- [x] Connect to real Clickeros AI backend (replace mock data)

## Campaign Detail & Database Persistence
- [x] Campaign Detail screen /campaigns/[id] (metrics history, creative previews, optimization timeline)
- [x] Drizzle ORM schema: user_notification_settings table
- [x] Drizzle ORM schema: campaign_alert_overrides table
- [x] tRPC endpoints: getSettings, saveSettings, getOverrides, saveOverride, deleteOverride
- [x] Update client to sync settings/overrides to DB when user is authenticated
- [x] Navigate to Campaign Detail from campaign card tap

## DB Sync Wiring
- [x] Wire useSettingsSync into notification-settings.tsx handleSave
- [x] Wire syncOverrideToDb into campaign-alert-sheet.tsx handleSave
- [x] Add metrics history API to Clickeros client and tRPC router
- [x] Update Campaign Detail screen to use real metrics history

## Session Timeout System (10-Minute Inactivity)
- [x] Create useSessionTimeout hook with activity tracking (clicks, taps, scrolls, keyboard)
- [x] Implement 9-minute inactivity timer with warning trigger
- [x] Build SessionTimeoutWarningModal with 60-second countdown (MM:SS format)
- [x] Add color-coded timer (violet/amber/red based on time remaining)
- [x] Implement "Stay Logged In" button to cancel logout
- [x] Implement "Log Out Now" button for immediate logout
- [x] Create session-timeout-handler.ts for logout orchestration
- [x] Wire draft campaign auto-save before logout
- [x] Create session-timeout-notifications.ts for push + in-app alerts
- [x] Send push notification on warning (native platforms only)
- [x] Add in-app notification to notification center
- [x] Integrate SessionTimeoutManager into root layout
- [x] Add authentication check before enabling timeout
- [x] Handle foreground/background state transitions (AppState)
- [x] Implement activity debouncing (500ms) to avoid excessive timer resets
- [x] Disable timeout on auth screens (/signup, /oauth/callback)
- [x] Clear query cache and auth tokens on logout
- [x] Show security message on timeout logout
- [x] Redirect to /signup after timeout logout
- [x] Support web (document events) and mobile (AppState) activity tracking
- [x] Create comprehensive test suite (session-timeout.test.ts)
- [x] Ensure cross-platform compatibility (iOS, Android, web, tablets)


## AI Ads Variation to Campaign Integration
- [x] Implement temporary storage for selected ad variation
- [x] Connect 'Use This Ad' button to store selected ad variation and navigate to campaign creation
- [x] Pre-fill campaign creation form with selected ad variation data
- [x] Test the complete flow from ad selection to campaign creation
- [x] Verify campaign management receives and displays selected ad data

## Dropdown Lists (Call to Action, Target Audience, Offer/Promotion)
- [x] Create reusable Dropdown component with open/close state
- [x] Add Call to Action dropdown (Learn More, Shop Now, Click Here, Buy Now, Click to See)
- [x] Add Target Audience dropdown (18-24, 25-34, 35-44, 45-54, 55-64, 65+)
- [x] Add Offer/Promotion dropdown (10% off, 20% off, 30% off, Free shipping, Buy one get one, Limited time offer)
- [x] Integrate dropdowns into Dashboard screen
- [x] Add state management for dropdown selections
- [x] Test dropdowns on mobile and tablet

## Header Layout Fix
- [x] Fix Campaign Manager header padding and font size on mobile
- [x] Reduce top padding from 16px to 12px to prevent text cutoff
- [x] Change title font size from 2xl to xl for better mobile fit
- [x] Adjust header alignment from center to flex-start
