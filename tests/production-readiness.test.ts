import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR    = path.join(__dirname, "../app");
const TABS_DIR   = path.join(__dirname, "../app/(tabs)");
const LIB_DIR    = path.join(__dirname, "../lib");
const SERVER_DIR = path.join(__dirname, "../server");
const COMPONENTS = path.join(__dirname, "../components");

// ── ErrorBoundary on Tab Screens ──────────────────────────────────────────────
describe("ErrorBoundary on Tab Screens", () => {
  const tabScreens = ["index.tsx", "campaigns.tsx", "creator.tsx", "analytics.tsx", "more.tsx"];

  tabScreens.forEach((screen) => {
    it(`${screen} imports and uses ErrorBoundary`, () => {
      const content = fs.readFileSync(path.join(TABS_DIR, screen), "utf-8");
      expect(content).toContain("ErrorBoundary");
      expect(content).toContain("@/components/error-boundary");
    });

    it(`${screen} wraps inner component in ErrorBoundary`, () => {
      const content = fs.readFileSync(path.join(TABS_DIR, screen), "utf-8");
      expect(content).toContain("<ErrorBoundary>");
      expect(content).toContain("</ErrorBoundary>");
    });

    it(`${screen} has an Inner component pattern`, () => {
      const content = fs.readFileSync(path.join(TABS_DIR, screen), "utf-8");
      expect(content).toContain("Inner");
    });
  });
});

// ── Campaign Search & Filter ──────────────────────────────────────────────────
describe("Campaign Search & Filter Bar", () => {
  const campaignsContent = fs.readFileSync(path.join(TABS_DIR, "campaigns.tsx"), "utf-8");

  it("has search query state", () => {
    expect(campaignsContent).toContain("searchQuery");
    expect(campaignsContent).toContain("setSearchQuery");
  });

  it("has status filter state", () => {
    expect(campaignsContent).toContain("statusFilter");
    expect(campaignsContent).toContain("setStatusFilter");
  });

  it("filters campaigns by name and platform", () => {
    expect(campaignsContent).toContain("filteredCampaigns");
    expect(campaignsContent).toContain("toLowerCase().includes");
    expect(campaignsContent).toContain("c.platform");
  });

  it("has All, Active, Paused, Scaling, Stopped filter chips", () => {
    expect(campaignsContent).toContain("\"All\"");
    expect(campaignsContent).toContain("\"Active\"");
    expect(campaignsContent).toContain("\"Paused\"");
    expect(campaignsContent).toContain("\"Scaling\"");
    expect(campaignsContent).toContain("\"Stopped\"");
  });

  it("shows result count when filter is active", () => {
    expect(campaignsContent).toContain("filteredCampaigns.length");
    expect(campaignsContent).toContain("campaigns.length");
  });

  it("has TextInput for search with magnifying glass icon", () => {
    expect(campaignsContent).toContain("TextInput");
    expect(campaignsContent).toContain("magnifyingglass");
    expect(campaignsContent).toContain("Search campaigns");
  });

  it("has clear button when search is active", () => {
    expect(campaignsContent).toContain("searchQuery.length > 0");
    expect(campaignsContent).toContain("setSearchQuery(\"\")");
    expect(campaignsContent).toContain("xmark");
  });

  it("FlatList uses filteredCampaigns instead of raw campaigns", () => {
    expect(campaignsContent).toContain("isLoading ? skeletonData : filteredCampaigns");
  });
});

// ── Clickeros API Client ──────────────────────────────────────────────────────
describe("Clickeros API Client (lib/clickeros-api.ts)", () => {
  const apiContent = fs.readFileSync(path.join(LIB_DIR, "clickeros-api.ts"), "utf-8");

  it("file exists", () => {
    expect(fs.existsSync(path.join(LIB_DIR, "clickeros-api.ts"))).toBe(true);
  });

  it("uses CLICKEROS_API_KEY environment variable", () => {
    expect(apiContent).toContain("CLICKEROS_API_KEY");
    expect(apiContent).toContain("process.env.CLICKEROS_API_KEY");
  });

  it("uses CLICKEROS_API_URL environment variable with default", () => {
    expect(apiContent).toContain("CLICKEROS_API_URL");
    expect(apiContent).toContain("https://api.clickeros.ai/v1");
  });

  it("exports isApiConfigured helper", () => {
    expect(apiContent).toContain("export function isApiConfigured");
  });

  it("exports clickerosApi singleton", () => {
    expect(apiContent).toContain("export const clickerosApi");
  });

  it("has getDashboardStats method", () => {
    expect(apiContent).toContain("getDashboardStats");
    expect(apiContent).toContain("/dashboard/stats");
  });

  it("has getCampaigns method", () => {
    expect(apiContent).toContain("getCampaigns");
    expect(apiContent).toContain("/campaigns");
  });

  it("has pauseCampaign and resumeCampaign methods", () => {
    expect(apiContent).toContain("pauseCampaign");
    expect(apiContent).toContain("resumeCampaign");
  });

  it("has optimizeCampaign method", () => {
    expect(apiContent).toContain("optimizeCampaign");
  });

  it("has getChannelBreakdown and getTopContent methods", () => {
    expect(apiContent).toContain("getChannelBreakdown");
    expect(apiContent).toContain("getTopContent");
  });

  it("has generateAds method for AI ad generation", () => {
    expect(apiContent).toContain("generateAds");
    expect(apiContent).toContain("/ai/generate-ads");
  });

  it("returns null gracefully when API fails", () => {
    expect(apiContent).toContain("return null");
    expect(apiContent).toContain("catch");
  });

  it("logs API connection status on init", () => {
    expect(apiContent).toContain("Initialized with API key");
    expect(apiContent).toContain("No API key configured");
  });
});

// ── Dashboard Router — Real API Integration ───────────────────────────────────
describe("Dashboard Router — Real API Integration", () => {
  const routerContent = fs.readFileSync(
    path.join(SERVER_DIR, "dashboardRouter.ts"),
    "utf-8"
  );

  it("imports clickerosApi and isApiConfigured", () => {
    expect(routerContent).toContain("clickerosApi");
    expect(routerContent).toContain("isApiConfigured");
  });

  it("stats procedure tries real API first", () => {
    expect(routerContent).toContain("isApiConfigured()");
    expect(routerContent).toContain("clickerosApi.getDashboardStats");
  });

  it("campaigns procedure tries real API first", () => {
    expect(routerContent).toContain("clickerosApi.getCampaigns");
  });

  it("falls back to mock data when API is not configured", () => {
    expect(routerContent).toContain("Fallback: mock data");
  });

  it("logs API connection status on startup", () => {
    expect(routerContent).toContain("Connected to Clickeros AI API");
    expect(routerContent).toContain("CLICKEROS_API_KEY not set");
  });
});
