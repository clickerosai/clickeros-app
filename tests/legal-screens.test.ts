import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR = path.join(__dirname, "../app");

// ── Permission Disclosures ────────────────────────────────────────────────────
describe("Permission Disclosures Screen", () => {
  const content = fs.readFileSync(path.join(APP_DIR, "permission-disclosures.tsx"), "utf-8");

  it("file exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "permission-disclosures.tsx"))).toBe(true);
  });

  it("covers CAMERA permission", () => {
    expect(content).toContain("CAMERA");
    expect(content).toContain("android.permission.CAMERA");
    expect(content).toContain("NSCameraUsageDescription");
  });

  it("covers RECORD_AUDIO permission", () => {
    expect(content).toContain("RECORD_AUDIO");
    expect(content).toContain("android.permission.RECORD_AUDIO");
    expect(content).toContain("NSMicrophoneUsageDescription");
  });

  it("covers READ_PHONE_STATE permission", () => {
    expect(content).toContain("READ_PHONE_STATE");
    expect(content).toContain("android.permission.READ_PHONE_STATE");
  });

  it("covers GET_ACCOUNTS permission", () => {
    expect(content).toContain("GET_ACCOUNTS");
    expect(content).toContain("android.permission.GET_ACCOUNTS");
  });

  it("shows when each permission is used", () => {
    expect(content).toContain("whenUsed");
    expect(content).toContain("When Is It Used");
  });

  it("shows data collected for each permission", () => {
    expect(content).toContain("dataCollected");
    expect(content).toContain("What Data Is Collected");
  });

  it("shows data retention for each permission", () => {
    expect(content).toContain("dataRetention");
    expect(content).toContain("How Long Is Data Kept");
  });

  it("shows data sharing policy", () => {
    expect(content).toContain("dataSharing");
    expect(content).toContain("Data Sharing");
  });

  it("shows how to revoke each permission", () => {
    expect(content).toContain("howToRevoke");
    expect(content).toContain("How to Revoke");
  });

  it("shows impact if permission is denied", () => {
    expect(content).toContain("impact");
    expect(content).toContain("Impact if Denied");
  });

  it("has expandable/collapsible permission cards", () => {
    expect(content).toContain("isExpanded");
    expect(content).toContain("onToggle");
  });

  it("has a permission summary table", () => {
    expect(content).toContain("Permission Summary");
    expect(content).toContain("Required");
    expect(content).toContain("Shared");
  });

  it("links to Privacy Policy and Terms of Service", () => {
    expect(content).toContain("privacy-policy");
    expect(content).toContain("terms-of-service");
  });

  it("includes contact email for privacy questions", () => {
    expect(content).toContain("privacy@clickeros.ai");
  });

  it("includes Your Rights section", () => {
    expect(content).toContain("Your Rights");
  });
});

// ── Privacy Policy Screen ─────────────────────────────────────────────────────
describe("Privacy Policy Screen", () => {
  const content = fs.readFileSync(path.join(APP_DIR, "privacy-policy-screen.tsx"), "utf-8");

  it("file exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "privacy-policy-screen.tsx"))).toBe(true);
  });

  it("has all required sections", () => {
    expect(content).toContain("Overview");
    expect(content).toContain("Information We Collect");
    expect(content).toContain("How We Use Your Information");
    expect(content).toContain("Information Sharing");
    expect(content).toContain("Data Security");
    expect(content).toContain("Data Retention");
    expect(content).toContain("Your Rights");
    expect(content).toContain("Cookies");
    expect(content).toContain("Children");
    expect(content).toContain("International Data Transfers");
    expect(content).toContain("Changes to This Policy");
    expect(content).toContain("Contact Us");
  });

  it("mentions TLS and AES-256 encryption", () => {
    expect(content).toContain("TLS");
    expect(content).toContain("AES-256");
  });

  it("covers GDPR rights for EU users", () => {
    expect(content).toContain("GDPR");
    expect(content).toContain("EU");
  });

  it("covers CCPA rights for California users", () => {
    expect(content).toContain("CCPA");
    expect(content).toContain("California");
  });

  it("has data deletion request button", () => {
    expect(content).toContain("Data Deletion Request");
    expect(content).toContain("privacy@clickeros.ai");
  });

  it("has a short summary at the top", () => {
    expect(content).toContain("short version");
  });

  it("has table of contents", () => {
    expect(content).toContain("Table of Contents");
  });

  it("links to Permission Disclosures and Terms of Service", () => {
    expect(content).toContain("permission-disclosures");
    expect(content).toContain("terms-of-service");
  });
});

// ── Terms of Service Screen ───────────────────────────────────────────────────
describe("Terms of Service Screen", () => {
  const content = fs.readFileSync(path.join(APP_DIR, "terms-of-service-screen.tsx"), "utf-8");

  it("file exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "terms-of-service-screen.tsx"))).toBe(true);
  });

  it("has all required sections", () => {
    expect(content).toContain("Acceptance of Terms");
    expect(content).toContain("Description of Service");
    expect(content).toContain("User Accounts");
    expect(content).toContain("Subscriptions");
    expect(content).toContain("Acceptable Use Policy");
    expect(content).toContain("Intellectual Property");
    expect(content).toContain("Third-Party Integrations");
    expect(content).toContain("Disclaimers");
    expect(content).toContain("Indemnification");
    expect(content).toContain("Termination");
    expect(content).toContain("Dispute Resolution");
    expect(content).toContain("Changes to Terms");
    expect(content).toContain("Contact Information");
  });

  it("includes all three pricing plans", () => {
    expect(content).toContain("Free");
    expect(content).toContain("$0/mo");
    expect(content).toContain("Pro");
    expect(content).toContain("$49/mo");
    expect(content).toContain("Agency");
    expect(content).toContain("$149/mo");
  });

  it("includes 14-day money-back guarantee", () => {
    expect(content).toContain("14-day money-back");
  });

  it("includes arbitration clause", () => {
    expect(content).toContain("arbitration");
    expect(content).toContain("AAA");
  });

  it("includes class action waiver", () => {
    expect(content).toContain("class action");
  });

  it("includes EU/UK exception for dispute resolution", () => {
    expect(content).toContain("EU");
    expect(content).toContain("UK");
  });

  it("has a short summary at the top", () => {
    expect(content).toContain("short version");
  });

  it("includes pricing summary table", () => {
    expect(content).toContain("Subscription Plans");
  });

  it("links to Privacy Policy and Permission Disclosures", () => {
    expect(content).toContain("privacy-policy-screen");
    expect(content).toContain("permission-disclosures");
  });

  it("includes legal contact email", () => {
    expect(content).toContain("legal@clickeros.ai");
  });
});

// ── Settings Navigation ───────────────────────────────────────────────────────
describe("Settings Screen — Legal Navigation", () => {
  const content = fs.readFileSync(path.join(APP_DIR, "settings.tsx"), "utf-8");

  it("links to Privacy Policy screen", () => {
    expect(content).toContain("privacy-policy-screen");
  });

  it("links to Terms of Service screen", () => {
    expect(content).toContain("terms-of-service-screen");
  });

  it("links to Permission Disclosures screen", () => {
    expect(content).toContain("permission-disclosures");
  });

  it("has Legal & Privacy section", () => {
    expect(content).toContain("Legal & Privacy");
  });

  it("has Legal Documents quick access panel", () => {
    expect(content).toContain("Legal Documents");
  });
});
