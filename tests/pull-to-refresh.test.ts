import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const TABS_DIR = path.join(__dirname, "../app/(tabs)");

describe("Pull-to-Refresh — Dashboard Screen", () => {
  const dashboardContent = fs.readFileSync(path.join(TABS_DIR, "index.tsx"), "utf-8");

  it("imports RefreshControl from react-native", () => {
    expect(dashboardContent).toContain("RefreshControl");
  });

  it("imports expo-haptics for feedback", () => {
    expect(dashboardContent).toContain("expo-haptics");
    expect(dashboardContent).toContain("Haptics");
  });

  it("has onRefresh callback", () => {
    expect(dashboardContent).toContain("onRefresh");
  });

  it("has refreshing state", () => {
    expect(dashboardContent).toContain("refreshing");
    expect(dashboardContent).toContain("setRefreshing");
  });

  it("passes RefreshControl to ScrollView", () => {
    expect(dashboardContent).toContain("refreshControl=");
    expect(dashboardContent).toContain("<RefreshControl");
  });

  it("shows last updated timestamp", () => {
    expect(dashboardContent).toContain("lastUpdated");
    expect(dashboardContent).toContain("formatTime");
  });

  it("uses violet brand color for refresh indicator", () => {
    expect(dashboardContent).toContain("tintColor");
    expect(dashboardContent).toContain("#7C3AED");
  });

  it("triggers haptic feedback on refresh start", () => {
    expect(dashboardContent).toContain("ImpactFeedbackStyle.Medium");
  });

  it("triggers success haptic on refresh complete", () => {
    expect(dashboardContent).toContain("NotificationFeedbackType.Success");
  });

  it("dims cards while refreshing with opacity", () => {
    expect(dashboardContent).toContain("opacity: refreshing ? 0.6 : 1");
  });

  it("guards haptics with Platform.OS check for web compatibility", () => {
    expect(dashboardContent).toContain("Platform.OS !== \"web\"");
  });
});

describe("Pull-to-Refresh — Campaigns Screen", () => {
  const campaignsContent = fs.readFileSync(path.join(TABS_DIR, "campaigns.tsx"), "utf-8");

  it("imports RefreshControl from react-native", () => {
    expect(campaignsContent).toContain("RefreshControl");
  });

  it("imports expo-haptics for feedback", () => {
    expect(campaignsContent).toContain("expo-haptics");
    expect(campaignsContent).toContain("Haptics");
  });

  it("has onRefresh callback", () => {
    expect(campaignsContent).toContain("onRefresh");
  });

  it("has refreshing state", () => {
    expect(campaignsContent).toContain("refreshing");
    expect(campaignsContent).toContain("setRefreshing");
  });

  it("passes RefreshControl to FlatList", () => {
    expect(campaignsContent).toContain("refreshControl=");
    expect(campaignsContent).toContain("<RefreshControl");
  });

  it("shows last updated timestamp in header", () => {
    expect(campaignsContent).toContain("lastUpdated");
    expect(campaignsContent).toContain("formatTime");
  });

  it("uses violet brand color for refresh indicator", () => {
    expect(campaignsContent).toContain("tintColor");
    expect(campaignsContent).toContain("#7C3AED");
  });

  it("triggers haptic feedback on refresh start", () => {
    expect(campaignsContent).toContain("ImpactFeedbackStyle.Medium");
  });

  it("triggers success haptic on refresh complete", () => {
    expect(campaignsContent).toContain("NotificationFeedbackType.Success");
  });

  it("dims campaign cards while refreshing", () => {
    expect(campaignsContent).toContain("opacity: refreshing ? 0.65 : 1");
  });

  it("guards haptics with Platform.OS check for web compatibility", () => {
    expect(campaignsContent).toContain("Platform.OS !== \"web\"");
  });

  it("dynamically computes status summary counts", () => {
    expect(campaignsContent).toContain("activeCount");
    expect(campaignsContent).toContain("pausedCount");
    expect(campaignsContent).toContain("scalingCount");
  });
});
