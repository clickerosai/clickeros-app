import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR = path.join(__dirname, "../app");
const SERVER_DIR = path.join(__dirname, "../server");

describe("Terms of Service", () => {
  it("should have the terms-of-service HTML file", () => {
    expect(fs.existsSync(path.join(SERVER_DIR, "terms-of-service.html"))).toBe(true);
  });

  it("should have the in-app terms-of-service screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "terms-of-service.tsx"))).toBe(true);
  });

  it("terms-of-service HTML should have correct title", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "terms-of-service.html"), "utf-8");
    expect(html).toContain("Terms of Service — Clickeros AI");
  });

  it("terms-of-service HTML should cover all 16 required sections", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "terms-of-service.html"), "utf-8");
    expect(html).toContain("Acceptance of Terms");
    expect(html).toContain("Description of Service");
    expect(html).toContain("Eligibility");
    expect(html).toContain("User Accounts");
    expect(html).toContain("Subscriptions");
    expect(html).toContain("Acceptable Use");
    expect(html).toContain("Intellectual Property");
    expect(html).toContain("User Content");
    expect(html).toContain("Third-Party Services");
    expect(html).toContain("Disclaimers");
    expect(html).toContain("Limitation of Liability");
    expect(html).toContain("Indemnification");
    expect(html).toContain("Termination");
    expect(html).toContain("Dispute Resolution");
    expect(html).toContain("Changes to");
    expect(html).toContain("Contact Us");
  });

  it("terms-of-service HTML should include all three pricing plans", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "terms-of-service.html"), "utf-8");
    expect(html).toContain("$0");
    expect(html).toContain("$49");
    expect(html).toContain("$149");
  });

  it("terms-of-service HTML should include contact emails", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "terms-of-service.html"), "utf-8");
    expect(html).toContain("support@clickeros.ai");
    expect(html).toContain("legal@clickeros.ai");
    expect(html).toContain("billing@clickeros.ai");
  });

  it("terms-of-service HTML should link to privacy policy", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "terms-of-service.html"), "utf-8");
    expect(html).toContain("/privacy-policy");
  });

  it("terms-of-service HTML should have Google Play in-app purchase note", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "terms-of-service.html"), "utf-8");
    expect(html).toContain("Google Play");
    expect(html).toContain("Apple App Store");
  });

  it("privacyPolicy.ts should register the /terms-of-service route", () => {
    const handler = fs.readFileSync(
      path.join(__dirname, "../server/_core/privacyPolicy.ts"),
      "utf-8"
    );
    expect(handler).toContain("/terms-of-service");
    expect(handler).toContain("terms-of-service.html");
  });

  it("settings screen should link to terms-of-service", () => {
    const settings = fs.readFileSync(path.join(APP_DIR, "settings.tsx"), "utf-8");
    expect(settings).toContain("terms-of-service");
  });

  it("in-app screen should contain all key sections", () => {
    const screen = fs.readFileSync(path.join(APP_DIR, "terms-of-service.tsx"), "utf-8");
    expect(screen).toContain("Acceptance of Terms");
    expect(screen).toContain("Acceptable Use");
    expect(screen).toContain("Limitation of Liability");
    expect(screen).toContain("Dispute Resolution");
    expect(screen).toContain("Termination");
  });
});
