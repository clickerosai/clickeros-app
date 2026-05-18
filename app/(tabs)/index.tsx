import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { trpc } from "@/lib/trpc";
import { StaleDataStore } from "@/hooks/use-stale-data";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getUnreadCount, checkCampaignAlerts } from "@/lib/notifications";

const STAT_ICONS: Record<string, { icon: Parameters<typeof IconSymbol>[0]["name"]; color: string }> = {
  "Active Campaigns": { icon: "megaphone.fill", color: "#7C3AED" },
  "Total Revenue":    { icon: "dollarsign.circle.fill", color: "#22C55E" },
  "Avg. ROAS":        { icon: "chart.line.uptrend.xyaxis", color: "#F59E0B" },
  "CTR":              { icon: "percent", color: "#06B6D4" },
};

const PLATFORM_COLORS: Record<string, string> = {
  Facebook: "#1877F2", Instagram: "#E1306C", Google: "#4285F4",
  TikTok: "#010101", YouTube: "#FF0000", Multi: "#7C3AED",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Active:  { bg: "#DCFCE7", text: "#16A34A" },
  Paused:  { bg: "#FEF9C3", text: "#CA8A04" },
  Scaling: { bg: "#EDE9FE", text: "#7C3AED" },
  Stopped: { bg: "#FEE2E2", text: "#DC2626" },
};

const QUICK_ACTIONS = [
  { label: "New Campaign", icon: "plus.circle.fill" as const, route: "/campaigns", color: "#7C3AED" },
  { label: "AI Creator",   icon: "wand.and.stars" as const,   route: "/creator",   color: "#9333EA" },
  { label: "SEO Insights", icon: "chart.line.uptrend.xyaxis" as const, route: "/seo-insights", color: "#0EA5E9" },
  { label: "Reports",      icon: "doc.text.fill" as const,    route: "/reports",   color: "#22C55E" },
];

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Load unread notification count
  useEffect(() => {
    getUnreadCount().then(setUnreadNotifCount);
  }, []);

  // ── Real API queries via tRPC ──────────────────────────────────────────────
  const statsQuery     = trpc.dashboard.stats.useQuery(undefined, { staleTime: 60_000 });
  const campaignsQuery = trpc.dashboard.campaigns.useQuery(undefined, { staleTime: 60_000 });

  const isLoading    = statsQuery.isLoading || campaignsQuery.isLoading;
  const isRefreshing = statsQuery.isFetching || campaignsQuery.isFetching;
  const lastUpdated  = statsQuery.dataUpdatedAt
    ? new Date(statsQuery.dataUpdatedAt)
    : new Date();

  // Mark stale after 5 minutes, mark fresh when data arrives
  useEffect(() => {
    if (statsQuery.dataUpdatedAt) {
      StaleDataStore.setStale("dashboard", false);
      const timer = setTimeout(() => StaleDataStore.setStale("dashboard", true), 5 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [statsQuery.dataUpdatedAt]);

  const stats    = statsQuery.data    ?? [];
  const campaigns = campaignsQuery.data ?? [];

  // ── Pull-to-refresh ────────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await Promise.all([
      statsQuery.refetch(),
      campaignsQuery.refetch(),
    ]);
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [statsQuery, campaignsQuery]);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing && !isLoading}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
            colors={["#7C3AED", "#9333EA"]}
            progressBackgroundColor={colors.background}
            title="Updating dashboard…"
            titleColor={colors.muted}
          />
        }
      >
        {/* Header */}
        <View style={{ backgroundColor: "#7C3AED", paddingHorizontal: r.px, paddingTop: 20, paddingBottom: 28 }}>
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
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}
              onPress={() => {
                setUnreadNotifCount(0);
                router.push("/notifications" as any);
              }}
              activeOpacity={0.7}
            >
              <IconSymbol name="bell.fill" size={20} color="#FFFFFF" />
              {unreadNotifCount > 0 && (
                <View style={{
                  position: "absolute", top: 6, right: 6,
                  width: 16, height: 16, borderRadius: 8,
                  backgroundColor: "#EF4444",
                  alignItems: "center", justifyContent: "center",
                  borderWidth: 1.5, borderColor: "#7C3AED",
                }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 9, fontWeight: "800" }}>
                    {unreadNotifCount > 9 ? "9+" : String(unreadNotifCount)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {/* Live status row */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            {isLoading ? (
              <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
            ) : (
              <IconSymbol
                name={isRefreshing ? "arrow.triangle.2.circlepath" : "checkmark.circle.fill"}
                size={12}
                color={isRefreshing ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.7)"}
              />
            )}
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: r.fontSize.xs }}>
              {isLoading ? "Loading data…" : isRefreshing ? "Refreshing…" : `Updated ${formatTime(lastUpdated)} · Pull to refresh`}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: r.px, marginTop: -16 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <View key={i} style={{ width: r.statCardWidth, height: 90, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, opacity: 0.5 }} />
                ))
              : stats.map((stat) => {
                  const meta = STAT_ICONS[stat.label] ?? { icon: "chart.bar.fill" as const, color: "#7C3AED" };
                  return (
                    <View
                      key={stat.label}
                      style={{
                        width: r.statCardWidth,
                        backgroundColor: colors.background,
                        borderRadius: 16, padding: r.isXs ? 12 : 14,
                        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
                        borderWidth: 1, borderColor: colors.border, overflow: "hidden",
                        opacity: isRefreshing ? 0.6 : 1,
                      }}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: `${meta.color}15`, alignItems: "center", justifyContent: "center" }}>
                          <IconSymbol name={meta.icon} size={17} color={meta.color} />
                        </View>
                        <View style={{ backgroundColor: stat.positive ? "#DCFCE7" : "#FEE2E2", borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 }}>
                          <Text style={{ color: stat.positive ? "#16A34A" : "#DC2626", fontSize: r.fontSize.xs, fontWeight: "600" }}>{stat.change}</Text>
                        </View>
                      </View>
                      <Text style={{ color: colors.foreground, fontSize: r.isXs ? 18 : 22, fontWeight: "700", marginTop: 8 }} numberOfLines={1}>{stat.value}</Text>
                      <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>{stat.label}</Text>
                    </View>
                  );
                })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>Quick Actions</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 14, padding: r.isXs ? 10 : 12, alignItems: "center", borderWidth: 1, borderColor: colors.border, minHeight: 44 }}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: `${action.color}15`, alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
                  <IconSymbol name={action.icon} size={18} color={action.color} />
                </View>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.xs, fontWeight: "600", textAlign: "center" }} numberOfLines={2}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Insight Banner */}
        <View style={{ marginHorizontal: r.px, marginTop: 20, borderRadius: 16, overflow: "hidden" }}>
          <View style={{ backgroundColor: "#7C3AED", padding: r.isXs ? 14 : 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <IconSymbol name="sparkles" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.base, fontWeight: "700" }} numberOfLines={1}>AI Strategy Copilot</Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={2}>3 new growth opportunities detected this week</Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 10, height: 44, justifyContent: "center", flexShrink: 0 }}
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
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>Recent Campaigns</Text>
            <TouchableOpacity onPress={() => router.push("/campaigns" as any)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center", paddingLeft: 8 }}>
              <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <View key={i} style={{ height: 70, backgroundColor: colors.surface, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, opacity: 0.5 }} />
              ))
            : campaigns.slice(0, 4).map((campaign) => {
                const statusStyle = STATUS_COLORS[campaign.status] ?? { bg: "#F3F4F6", text: "#6B7280" };
                const color = PLATFORM_COLORS[campaign.platform] ?? "#7C3AED";
                return (
                  <TouchableOpacity
                    key={campaign.id}
                    style={{
                      backgroundColor: colors.background, borderRadius: 14,
                      padding: r.isXs ? 12 : 14, marginBottom: 10,
                      borderWidth: 1, borderColor: colors.border,
                      flexDirection: "row", alignItems: "center", gap: 12,
                      minHeight: 44, opacity: isRefreshing ? 0.6 : 1,
                    }}
                    onPress={() => router.push("/campaigns" as any)}
                    activeOpacity={0.7}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${color}15`, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <IconSymbol name="megaphone.fill" size={18} color={color} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }} numberOfLines={1}>{campaign.name}</Text>
                      <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>{campaign.platform} · Spend: {campaign.spend}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end", flexShrink: 0 }}>
                      <View style={{ backgroundColor: statusStyle.bg, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginBottom: 4 }}>
                        <Text style={{ color: statusStyle.text, fontSize: r.fontSize.xs, fontWeight: "600" }}>{campaign.status}</Text>
                      </View>
                      <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "700" }}>ROAS {campaign.roas}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
        </View>

        {/* Platform Stats */}
        <View style={{ marginHorizontal: r.px, marginTop: 20, backgroundColor: colors.surface, borderRadius: 16, padding: r.isXs ? 14 : 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 12 }}>Platform Stats</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {[{ label: "Users", value: "12K+" }, { label: "Rating", value: "4.9/5" }, { label: "Revenue", value: "$2.4M" }].map((stat) => (
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
