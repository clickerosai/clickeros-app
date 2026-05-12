import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";

const INITIAL_STATS = [
  { label: "Active Campaigns", value: "12", change: "+3", icon: "megaphone.fill" as const, color: "#7C3AED" },
  { label: "Total Revenue", value: "$48.2K", change: "+18%", icon: "dollarsign.circle.fill" as const, color: "#22C55E" },
  { label: "Avg. ROAS", value: "3.8x", change: "+0.4", icon: "chart.line.uptrend.xyaxis" as const, color: "#F59E0B" },
  { label: "CTR", value: "4.7%", change: "+1.2%", icon: "percent" as const, color: "#06B6D4" },
];

const REFRESHED_STATS = [
  { label: "Active Campaigns", value: "14", change: "+5", icon: "megaphone.fill" as const, color: "#7C3AED" },
  { label: "Total Revenue", value: "$51.8K", change: "+22%", icon: "dollarsign.circle.fill" as const, color: "#22C55E" },
  { label: "Avg. ROAS", value: "4.1x", change: "+0.7", icon: "chart.line.uptrend.xyaxis" as const, color: "#F59E0B" },
  { label: "CTR", value: "5.2%", change: "+1.7%", icon: "percent" as const, color: "#06B6D4" },
];

const QUICK_ACTIONS = [
  { label: "New Campaign", icon: "plus.circle.fill" as const, route: "/campaigns", color: "#7C3AED" },
  { label: "AI Creator", icon: "wand.and.stars" as const, route: "/creator", color: "#9333EA" },
  { label: "SEO Insights", icon: "chart.line.uptrend.xyaxis" as const, route: "/seo-insights", color: "#0EA5E9" },
  { label: "Reports", icon: "doc.text.fill" as const, route: "/reports", color: "#22C55E" },
];

const INITIAL_CAMPAIGNS = [
  { id: "1", name: "Summer Sale FB", platform: "Facebook", status: "Active", roas: "4.2x", spend: "$1,240", color: "#1877F2" },
  { id: "2", name: "Product Launch IG", platform: "Instagram", status: "Active", roas: "3.8x", spend: "$890", color: "#E1306C" },
  { id: "3", name: "Google Search Q2", platform: "Google", status: "Paused", roas: "2.9x", spend: "$2,100", color: "#4285F4" },
  { id: "4", name: "TikTok Awareness", platform: "TikTok", status: "Active", roas: "5.1x", spend: "$560", color: "#000000" },
];

const REFRESHED_CAMPAIGNS = [
  { id: "1", name: "Summer Sale FB", platform: "Facebook", status: "Scaling", roas: "4.8x", spend: "$1,490", color: "#1877F2" },
  { id: "2", name: "Product Launch IG", platform: "Instagram", status: "Active", roas: "4.1x", spend: "$1,020", color: "#E1306C" },
  { id: "3", name: "Google Search Q2", platform: "Google", status: "Active", roas: "3.4x", spend: "$2,380", color: "#4285F4" },
  { id: "4", name: "TikTok Awareness", platform: "TikTok", status: "Active", roas: "5.6x", spend: "$640", color: "#000000" },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [stats, setStats] = useState(INITIAL_STATS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Haptic feedback on pull start (native only)
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Simulate network request (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Toggle between two data sets to show visible refresh
    const isEven = refreshCount % 2 === 0;
    setStats(isEven ? REFRESHED_STATS : INITIAL_STATS);
    setCampaigns(isEven ? REFRESHED_CAMPAIGNS : INITIAL_CAMPAIGNS);
    setRefreshCount((c) => c + 1);
    setLastUpdated(new Date());

    // Success haptic on completion (native only)
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setRefreshing(false);
  }, [refreshCount]);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
            colors={["#7C3AED", "#9333EA"]}
            progressBackgroundColor={colors.background}
            title="Updating dashboard..."
            titleColor={colors.muted}
          />
        }
      >
        {/* Header */}
        <View style={{
          backgroundColor: "#7C3AED",
          paddingHorizontal: r.px,
          paddingTop: 20,
          paddingBottom: 28,
        }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: r.fontSize.sm, fontWeight: "500" }}>
                Welcome back 👋
              </Text>
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize["2xl"], fontWeight: "700", marginTop: 2 }} numberOfLines={1}>
                Clickeros Dashboard
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center", justifyContent: "center",
              }}
              onPress={() => router.push("/settings" as any)}
              activeOpacity={0.7}
            >
              <IconSymbol name="bell.fill" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Last Updated Row */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <IconSymbol
              name={refreshing ? "arrow.triangle.2.circlepath" : "checkmark.circle.fill"}
              size={12}
              color={refreshing ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.7)"}
            />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: r.fontSize.xs }}>
              {refreshing ? "Refreshing…" : `Updated at ${formatTime(lastUpdated)}`}
            </Text>
            {!refreshing && (
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: r.fontSize.xs }}>
                · Pull down to refresh
              </Text>
            )}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: r.px, marginTop: -16 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {stats.map((stat) => (
              <View
                key={stat.label}
                style={{
                  width: r.statCardWidth,
                  backgroundColor: colors.background,
                  borderRadius: 16,
                  padding: r.isXs ? 12 : 14,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: colors.border,
                  overflow: "hidden",
                  opacity: refreshing ? 0.6 : 1,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={{
                    width: 34, height: 34, borderRadius: 10,
                    backgroundColor: `${stat.color}15`,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <IconSymbol name={stat.icon} size={17} color={stat.color} />
                  </View>
                  <View style={{ backgroundColor: "#DCFCE7", borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 }}>
                    <Text style={{ color: "#16A34A", fontSize: r.fontSize.xs, fontWeight: "600" }}>{stat.change}</Text>
                  </View>
                </View>
                <Text style={{ color: colors.foreground, fontSize: r.isXs ? 18 : 22, fontWeight: "700", marginTop: 8 }} numberOfLines={1}>
                  {stat.value}
                </Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>
            Quick Actions
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: r.isXs ? 10 : 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 44,
                }}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View style={{
                  width: 38, height: 38, borderRadius: 10,
                  backgroundColor: `${action.color}15`,
                  alignItems: "center", justifyContent: "center",
                  marginBottom: 5,
                }}>
                  <IconSymbol name={action.icon} size={18} color={action.color} />
                </View>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.xs, fontWeight: "600", textAlign: "center" }} numberOfLines={2}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Insight Banner */}
        <View style={{ marginHorizontal: r.px, marginTop: 20, borderRadius: 16, overflow: "hidden" }}>
          <View style={{
            backgroundColor: "#7C3AED",
            padding: r.isXs ? 14 : 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}>
            <View style={{
              width: 42, height: 42, borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <IconSymbol name="sparkles" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.base, fontWeight: "700" }} numberOfLines={1}>
                AI Strategy Copilot
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={2}>
                3 new growth opportunities detected this week
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 8,
                paddingHorizontal: 10,
                height: 44,
                justifyContent: "center",
                flexShrink: 0,
              }}
              onPress={() => router.push("/strategy-copilot" as any)}
              activeOpacity={0.7}
            >
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.sm, fontWeight: "600" }}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Campaigns */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>
              Recent Campaigns
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/campaigns" as any)}
              activeOpacity={0.7}
              style={{ minHeight: 44, justifyContent: "center", paddingLeft: 8 }}
            >
              <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          {campaigns.map((campaign) => (
            <TouchableOpacity
              key={campaign.id}
              style={{
                backgroundColor: colors.background,
                borderRadius: 14,
                padding: r.isXs ? 12 : 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                minHeight: 44,
                opacity: refreshing ? 0.6 : 1,
              }}
              onPress={() => router.push("/campaigns" as any)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: `${campaign.color}15`,
                alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <IconSymbol name="megaphone.fill" size={18} color={campaign.color} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }} numberOfLines={1}>
                  {campaign.name}
                </Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>
                  {campaign.platform} · Spend: {campaign.spend}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", flexShrink: 0 }}>
                <View style={{
                  backgroundColor: campaign.status === "Active" ? "#DCFCE7" : campaign.status === "Scaling" ? "#EDE9FE" : "#FEF9C3",
                  borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginBottom: 4,
                }}>
                  <Text style={{
                    color: campaign.status === "Active" ? "#16A34A" : campaign.status === "Scaling" ? "#7C3AED" : "#CA8A04",
                    fontSize: r.fontSize.xs, fontWeight: "600",
                  }}>
                    {campaign.status}
                  </Text>
                </View>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "700" }}>
                  ROAS {campaign.roas}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Platform Stats */}
        <View style={{
          marginHorizontal: r.px,
          marginTop: 20,
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: r.isXs ? 14 : 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 12 }}>
            Platform Stats
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {[
              { label: "Users", value: "12K+" },
              { label: "Rating", value: "4.9/5" },
              { label: "Revenue", value: "$2.4M" },
            ].map((stat) => (
              <View key={stat.label} style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#7C3AED", fontSize: r.isXs ? 18 : 20, fontWeight: "800" }}>{stat.value}</Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
