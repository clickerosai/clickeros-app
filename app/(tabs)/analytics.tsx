import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { trpc } from "@/lib/trpc";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ErrorBoundary } from "@/components/error-boundary";

const TIME_RANGES = ["7D", "30D", "90D", "All"];

const METRIC_META: Record<string, { icon: Parameters<typeof IconSymbol>[0]["name"]; color: string }> = {
  "Total Revenue":   { icon: "dollarsign.circle.fill", color: "#22C55E" },
  "Total Sessions":  { icon: "chart.line.uptrend.xyaxis", color: "#7C3AED" },
  "Conversions":     { icon: "checkmark.circle.fill", color: "#0EA5E9" },
  "Avg. ROAS":       { icon: "chart.bar.fill", color: "#F59E0B" },
  "Total Clicks":    { icon: "arrow.up.right", color: "#EC4899" },
  "Avg. CPA":        { icon: "percent", color: "#06B6D4" },
};

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function AnalyticsScreenInner() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const [activeRange, setActiveRange] = useState("30D");

  // ── Real API queries via tRPC ──────────────────────────────────────────────
  const metricsQuery  = trpc.dashboard.analyticsMetrics.useQuery(undefined, { staleTime: 60_000 });
  const channelQuery  = trpc.dashboard.channelBreakdown.useQuery(undefined, { staleTime: 60_000 });
  const contentQuery  = trpc.dashboard.topContent.useQuery(undefined, { staleTime: 60_000 });

  const isLoading    = metricsQuery.isLoading || channelQuery.isLoading || contentQuery.isLoading;
  const isRefreshing = (metricsQuery.isFetching || channelQuery.isFetching || contentQuery.isFetching) && !isLoading;
  const lastUpdated  = metricsQuery.dataUpdatedAt ? new Date(metricsQuery.dataUpdatedAt) : new Date();

  const metrics  = metricsQuery.data  ?? [];
  const channels = channelQuery.data  ?? [];
  const content  = contentQuery.data  ?? [];

  // ── Pull-to-refresh ────────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await Promise.all([
      metricsQuery.refetch(),
      channelQuery.refetch(),
      contentQuery.refetch(),
    ]);
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [metricsQuery, channelQuery, contentQuery]);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
            colors={["#7C3AED", "#9333EA"]}
            progressBackgroundColor={colors.background}
            title="Updating analytics…"
            titleColor={colors.muted}
          />
        }
      >
        {/* Header */}
        <View style={{ paddingHorizontal: r.px, paddingTop: r.isXs ? 10 : 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: colors.foreground, fontSize: r.isXs ? r.fontSize.lg : r.fontSize.xl, fontWeight: "700" }}>Analytics</Text>
              {/* Live status */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.muted} />
                ) : (
                  <IconSymbol
                    name={isRefreshing ? "arrow.triangle.2.circlepath" : "checkmark.circle.fill"}
                    size={11}
                    color={isRefreshing ? colors.muted : "#22C55E"}
                  />
                )}
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>
                  {isLoading ? "Loading…" : isRefreshing ? "Refreshing…" : `Updated ${formatTime(lastUpdated)} · Pull to refresh`}
                </Text>
              </View>
            </View>
          </View>

          {/* Time Range Selector */}
          <View style={{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 10, padding: 3, gap: 2 }}>
            {TIME_RANGES.map((range) => (
              <TouchableOpacity
                key={range}
                style={{ flex: 1, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: activeRange === range ? "#7C3AED" : "transparent" }}
                onPress={() => setActiveRange(range)}
                activeOpacity={0.7}
              >
                <Text style={{ color: activeRange === range ? "#FFFFFF" : colors.muted, fontSize: r.fontSize.sm, fontWeight: "600" }}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={{ paddingHorizontal: r.px, marginTop: 16 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <View key={i} style={{ width: r.statCardWidth, height: 80, backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, opacity: 0.5 }} />
                ))
              : metrics.map((metric) => {
                  const meta = METRIC_META[metric.label] ?? { icon: "chart.bar.fill" as const, color: "#7C3AED" };
                  return (
                    <View
                      key={metric.label}
                      style={{
                        width: r.statCardWidth,
                        backgroundColor: colors.background, borderRadius: 14,
                        padding: r.isXs ? 12 : 14, borderWidth: 1, borderColor: colors.border,
                        overflow: "hidden", opacity: isRefreshing ? 0.6 : 1,
                      }}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${meta.color}15`, alignItems: "center", justifyContent: "center" }}>
                          <IconSymbol name={meta.icon} size={15} color={meta.color} />
                        </View>
                        <View style={{ backgroundColor: metric.positive ? "#DCFCE7" : "#FEE2E2", borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 }}>
                          <Text style={{ color: metric.positive ? "#16A34A" : "#DC2626", fontSize: r.fontSize.xs, fontWeight: "600" }}>{metric.change}</Text>
                        </View>
                      </View>
                      <Text style={{ color: colors.foreground, fontSize: r.isXs ? 16 : 18, fontWeight: "700" }} numberOfLines={1}>{metric.value}</Text>
                      <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>{metric.label}</Text>
                    </View>
                  );
                })}
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={{ marginHorizontal: r.px, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>Revenue Trend</Text>
            <TouchableOpacity onPress={() => router.push("/analytics-sales" as any)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center", paddingLeft: 8 }}>
              <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Details</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, height: 160, justifyContent: "flex-end", overflow: "hidden", opacity: isRefreshing ? 0.6 : 1 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 100 }}>
              {[40, 65, 55, 80, 70, 90, 85, 95, 75, 88, 92, 100, 87, 96].map((height, idx) => (
                <View key={idx} style={{ flex: 1, marginHorizontal: 2, height: `${height}%` as any, backgroundColor: idx >= 10 ? "#7C3AED" : "#7C3AED40", borderRadius: 4 }} />
              ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>Apr 1</Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>Apr 15</Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>Apr 30</Text>
            </View>
          </View>
        </View>

        {/* Channel Breakdown */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>Channel Breakdown</Text>
            <TouchableOpacity onPress={() => router.push("/analytics-attribution" as any)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center", paddingLeft: 8 }}>
              <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Attribution</Text>
            </TouchableOpacity>
          </View>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <View key={i} style={{ height: 80, backgroundColor: colors.surface, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, opacity: 0.5 }} />
              ))
            : channels.map((ch) => (
                <View key={ch.channel} style={{ backgroundColor: colors.background, borderRadius: 14, padding: r.isXs ? 12 : 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, opacity: isRefreshing ? 0.6 : 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: ch.color, flexShrink: 0 }} />
                      <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }} numberOfLines={1}>{ch.channel}</Text>
                    </View>
                    <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700", flexShrink: 0 }}>{ch.revenue}</Text>
                  </View>
                  <View style={{ backgroundColor: colors.surface, borderRadius: 4, height: 6, marginBottom: 8, overflow: "hidden" }}>
                    <View style={{ backgroundColor: ch.color, borderRadius: 4, height: 6, width: `${ch.share}%` as any }} />
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>Sessions: {ch.sessions}</Text>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>ROAS: <Text style={{ color: colors.foreground, fontWeight: "600" }}>{ch.roas}</Text></Text>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>{ch.share}% share</Text>
                  </View>
                </View>
              ))}
        </View>

        {/* Top Content */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>Top Content</Text>
            <TouchableOpacity onPress={() => router.push("/revenue-attribution" as any)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center", paddingLeft: 8 }}>
              <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Full Report</Text>
            </TouchableOpacity>
          </View>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <View key={i} style={{ height: 60, backgroundColor: colors.surface, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, opacity: 0.5 }} />
              ))
            : content.map((item) => (
                <View key={item.rank} style={{ backgroundColor: colors.background, borderRadius: 14, padding: r.isXs ? 12 : 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 12, opacity: isRefreshing ? 0.6 : 1 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#7C3AED15", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "700" }}>#{item.rank}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600" }} numberOfLines={2}>{item.title}</Text>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }}>Traffic: {item.traffic}</Text>
                  </View>
                  <Text style={{ color: "#22C55E", fontSize: r.fontSize.base, fontWeight: "700", flexShrink: 0 }}>{item.revenue}</Text>
                </View>
              ))}
        </View>

        {/* Deep Analytics Links */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>Deep Analytics</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "Campaign Performance", route: "/campaign-performance", color: "#7C3AED" },
              { label: "Customer Journey",     route: "/customer-journey",     color: "#0EA5E9" },
              { label: "Revenue Intelligence", route: "/revenue-intelligence", color: "#22C55E" },
              { label: "Audience Intelligence",route: "/audience-intelligence",color: "#F59E0B" },
            ].map((link) => (
              <TouchableOpacity
                key={link.label}
                style={{ width: r.statCardWidth, backgroundColor: `${link.color}10`, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: `${link.color}30`, minHeight: 44 }}
                onPress={() => router.push(link.route as any)}
                activeOpacity={0.7}
              >
                <Text style={{ color: link.color, fontSize: r.fontSize.sm, fontWeight: "600" }}>{link.label}</Text>
                <IconSymbol name="chevron.right" size={14} color={link.color} style={{ marginTop: 4 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

export default function AnalyticsScreen() {
  return (
    <ErrorBoundary>
      <AnalyticsScreenInner />
    </ErrorBoundary>
  );
}
