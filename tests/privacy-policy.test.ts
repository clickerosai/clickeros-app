import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const APP_DIR = path.join(__dirname, "../app");
const ROOT_DIR = path.join(__dirname, "..");

describe("Privacy Policy & Google Play Compliance", () => {
  it("should have the privacy policy screen", () => {
    expect(fs.existsSync(path.join(APP_DIR, "privacy-policy.tsx"))).toBe(true);
  });

  it("should have the eas.json build configuration", () => {
    expect(fs.existsSync(path.join(ROOT_DIR, "eas.json"))).toBe(true);
  });

  it("eas.json should configure app-bundle (AAB) for production build", () => {
    const easConfig = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "eas.json"), "utf-8"));
    expect(easConfig.build.production.android.buildType).toBe("app-bundle");
  });

  it("eas.json should configure app-bundle for google-play build profile", () => {
    const easConfig = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "eas.json"), "utf-8"));
    expect(easConfig.build["google-play"].android.buildType).toBe("app-bundle");
  });

  it("eas.json should configure APK for preview build", () => {
    const easConfig = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "eas.json"), "utf-8"));
    expect(easConfig.build.preview.android.buildType).toBe("apk");
  });

  it("app.config.ts should declare CAMERA permission", () => {
    const appConfig = fs.readFileSync(path.join(ROOT_DIR, "app.config.ts"), "utf-8");
    expect(appConfig).toContain("CAMERA");
  });

  it("app.config.ts should declare RECORD_AUDIO permission", () => {
    const appConfig = fs.readFileSync(path.join(ROOT_DIR, "app.config.ts"), "utf-8");
    expect(appConfig).toContain("RECORD_AUDIO");
  });

  it("app.config.ts should declare READ_PHONE_STATE permission", () => {
    const appConfig = fs.readFileSync(path.join(ROOT_DIR, "app.config.ts"), "utf-8");
    expect(appConfig).toContain("READ_PHONE_STATE");
  });

  it("app.config.ts should declare GET_ACCOUNTS permission", () => {
    const appConfig = fs.readFileSync(path.join(ROOT_DIR, "app.config.ts"), "utf-8");
    expect(appConfig).toContain("GET_ACCOUNTS");
  });

  it("app.config.ts should have expo-camera plugin with permission rationale", () => {
    const appConfig = fs.readFileSync(path.join(ROOT_DIR, "app.config.ts"), "utf-8");
    expect(appConfig).toContain("expo-camera");
    expect(appConfig).toContain("cameraPermission");
  });

  it("privacy policy screen should mention all four permissions", () => {
    const privacyPolicy = fs.readFileSync(path.join(APP_DIR, "privacy-policy.tsx"), "utf-8");
    expect(privacyPolicy).toContain("CAMERA");
    expect(privacyPolicy).toContain("RECORD_AUDIO");
    expect(privacyPolicy).toContain("READ_PHONE_STATE");
    expect(privacyPolicy).toContain("GET_ACCOUNTS");
  });

  it("privacy policy screen should have a contact email", () => {
    const privacyPolicy = fs.readFileSync(path.join(APP_DIR, "privacy-policy.tsx"), "utf-8");
    expect(privacyPolicy).toContain("privacy@clickeros.ai");
  });

  it("privacy policy screen should have a last updated date", () => {
    const privacyPolicy = fs.readFileSync(path.join(APP_DIR, "privacy-policy.tsx"), "utf-8");
    expect(privacyPolicy).toContain("Last updated");
  });

  it("settings screen should link to privacy policy", () => {
    const settings = fs.readFileSync(path.join(APP_DIR, "settings.tsx"), "utf-8");
    expect(settings).toContain("privacy-policy");
  });

  it("app.config.ts should target Android SDK 34 for Google Play compliance", () => {
    const appConfig = fs.readFileSync(path.join(ROOT_DIR, "app.config.ts"), "utf-8");
    expect(appConfig).toContain("targetSdkVersion: 34");
  });
});
