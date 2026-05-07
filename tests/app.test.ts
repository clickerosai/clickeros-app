import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR = path.join(__dirname, "../app");
const TABS_DIR = path.join(APP_DIR, "(tabs)");

describe("Clickeros App Structure", () => {
  it("should have all required tab screens", () => {
    const tabScreens = ["index.tsx", "campaigns.tsx", "creator.tsx", "analytics.tsx", "more.tsx", "_layout.tsx"];
    for (const screen of tabScreens) {
      const filePath = path.join(TABS_DIR, screen);
      expect(fs.existsSync(filePath), `Missing tab screen: ${screen}`).toBe(true);
    }
  });

  it("should have the pricing screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "pricing.tsx"))).toBe(true);
  });

  it("should have the settings screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "settings.tsx"))).toBe(true);
  });

  it("should have the SEO insights screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "seo-insights.tsx"))).toBe(true);
  });

  it("should have the strategy copilot screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "strategy-copilot.tsx"))).toBe(true);
  });

  it("should have the campaign performance screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "campaign-performance.tsx"))).toBe(true);
  });

  it("should have the competitor spy screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "competitor-spy.tsx"))).toBe(true);
  });

  it("should have the budget optimizer screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "budget-optimizer.tsx"))).toBe(true);
  });

  it("should have the content distribution screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "content-distribution.tsx"))).toBe(true);
  });

  it("should have the video generator screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "video-generator.tsx"))).toBe(true);
  });

  it("should have the agency screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "agency.tsx"))).toBe(true);
  });

  it("should have the integrations screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "integrations.tsx"))).toBe(true);
  });

  it("should have the growth-os screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "growth-os.tsx"))).toBe(true);
  });

  it("should have the billing screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "billing.tsx"))).toBe(true);
  });

  it("should have the theme config with violet primary color", () => {
    const themeConfig = fs.readFileSync(path.join(__dirname, "../theme.config.js"), "utf-8");
    expect(themeConfig).toContain("#7C3AED");
  });

  it("should have the app config with Clickeros name", () => {
    const appConfig = fs.readFileSync(path.join(__dirname, "../app.config.ts"), "utf-8");
    expect(appConfig).toContain("Clickeros");
  });

  it("should have the feature screen component", () => {
    expect(fs.existsSync(path.join(__dirname, "../components/feature-screen.tsx"))).toBe(true);
  });

  it("should have at least 35 app screens total", () => {
    const appScreens = fs.readdirSync(APP_DIR).filter(f => f.endsWith(".tsx") && !f.startsWith("_"));
    expect(appScreens.length).toBeGreaterThanOrEqual(35);
  });
});
