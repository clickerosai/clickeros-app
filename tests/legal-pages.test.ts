import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SERVER_DIR = path.join(__dirname, "../server");
const APP_DIR = path.join(__dirname, "../app");
const HANDLER = path.join(__dirname, "../server/_core/privacyPolicy.ts");

describe("Legal Pages — HTML Files", () => {
  it("cookie-policy.html exists", () => {
    expect(fs.existsSync(path.join(SERVER_DIR, "cookie-policy.html"))).toBe(true);
  });
  it("data-safety.html exists", () => {
    expect(fs.existsSync(path.join(SERVER_DIR, "data-safety.html"))).toBe(true);
  });
  it("permission-camera.html exists", () => {
    expect(fs.existsSync(path.join(SERVER_DIR, "permission-camera.html"))).toBe(true);
  });
  it("permission-record-audio.html exists", () => {
    expect(fs.existsSync(path.join(SERVER_DIR, "permission-record-audio.html"))).toBe(true);
  });
  it("permission-get-accounts.html exists", () => {
    expect(fs.existsSync(path.join(SERVER_DIR, "permission-get-accounts.html"))).toBe(true);
  });
});

describe("Legal Pages — HTML Content", () => {
  it("cookie-policy.html has correct title and key sections", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "cookie-policy.html"), "utf-8");
    expect(html).toContain("Cookie Policy");
    expect(html).toContain("Strictly Necessary");
    expect(html).toContain("Analytics");
    expect(html).toContain("No Advertising Cookies");
    expect(html).toContain("GDPR");
  });
  it("data-safety.html covers all permissions and Google Play requirements", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "data-safety.html"), "utf-8");
    expect(html).toContain("CAMERA");
    expect(html).toContain("RECORD_AUDIO");
    expect(html).toContain("READ_PHONE_STATE");
    expect(html).toContain("GET_ACCOUNTS");
    expect(html).toContain("Data Deletion");
    expect(html).toContain("Google Play");
    expect(html).toContain("AES-256");
  });
  it("permission-camera.html has correct content", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "permission-camera.html"), "utf-8");
    expect(html).toContain("CAMERA");
    expect(html).toContain("android.permission.CAMERA");
    expect(html).toContain("AI Ads Creator");
    expect(html).toContain("QR Code Scanner");
    expect(html).toContain("AES-256");
  });
  it("permission-record-audio.html has correct content", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "permission-record-audio.html"), "utf-8");
    expect(html).toContain("RECORD_AUDIO");
    expect(html).toContain("android.permission.RECORD_AUDIO");
    expect(html).toContain("24 hours");
    expect(html).toContain("AI Strategy Copilot");
  });
  it("permission-get-accounts.html has correct content", () => {
    const html = fs.readFileSync(path.join(SERVER_DIR, "permission-get-accounts.html"), "utf-8");
    expect(html).toContain("GET_ACCOUNTS");
    expect(html).toContain("android.permission.GET_ACCOUNTS");
    expect(html).toContain("Google Sign-In");
    expect(html).toContain("myaccount.google.com");
  });
});

describe("Legal Pages — Server Routes", () => {
  it("privacyPolicy.ts registers /cookie-policy route", () => {
    const handler = fs.readFileSync(HANDLER, "utf-8");
    expect(handler).toContain("/cookie-policy");
    expect(handler).toContain("cookie-policy.html");
  });
  it("privacyPolicy.ts registers /data-safety route", () => {
    const handler = fs.readFileSync(HANDLER, "utf-8");
    expect(handler).toContain("/data-safety");
    expect(handler).toContain("data-safety.html");
  });
  it("privacyPolicy.ts registers /permissions/camera route", () => {
    const handler = fs.readFileSync(HANDLER, "utf-8");
    expect(handler).toContain("/permissions/camera");
    expect(handler).toContain("permission-camera.html");
  });
  it("privacyPolicy.ts registers /permissions/record-audio route", () => {
    const handler = fs.readFileSync(HANDLER, "utf-8");
    expect(handler).toContain("/permissions/record-audio");
    expect(handler).toContain("permission-record-audio.html");
  });
  it("privacyPolicy.ts registers /permissions/get-accounts route", () => {
    const handler = fs.readFileSync(HANDLER, "utf-8");
    expect(handler).toContain("/permissions/get-accounts");
    expect(handler).toContain("permission-get-accounts.html");
  });
});

describe("Legal Pages — In-App Screens", () => {
  it("legal.tsx hub screen exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "legal.tsx"))).toBe(true);
  });
  it("cookie-policy.tsx in-app screen exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "cookie-policy.tsx"))).toBe(true);
  });
  it("data-safety.tsx in-app screen exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "data-safety.tsx"))).toBe(true);
  });
  it("permissions/camera.tsx in-app screen exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "permissions/camera.tsx"))).toBe(true);
  });
  it("permissions/record-audio.tsx in-app screen exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "permissions/record-audio.tsx"))).toBe(true);
  });
  it("permissions/get-accounts.tsx in-app screen exists", () => {
    expect(fs.existsSync(path.join(APP_DIR, "permissions/get-accounts.tsx"))).toBe(true);
  });
  it("settings.tsx links to cookie-policy, data-safety, and legal hub", () => {
    const settings = fs.readFileSync(path.join(APP_DIR, "settings.tsx"), "utf-8");
    expect(settings).toContain("cookie-policy");
    expect(settings).toContain("data-safety");
    expect(settings).toContain("/legal");
  });
});
