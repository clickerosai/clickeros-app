import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { trpc } from "@/lib/trpc";
import { StaleDataStore } from "@/hooks/use-stale-data";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { Campaign } from "@/server/dashboardRouter";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Active:  { bg: "#DCFCE7", text: "#16A34A" },
  Paused:  { bg: "#FEF9C3", text: "#CA8A04" },
  Scaling: { bg: "#EDE9FE", text: "#7C3AED" },
  Stopped: { bg: "#FEE2E2", text: "#DC2626" },
};

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function CampaignsScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();

  // ── Real API query via tRPC ────────────────────────────────────────────────
  const query = trpc.dashboard.campaigns.useQuery(undefined, { staleTime: 60_000 });

  const isLoading    = query.isLoading;
  const isRefreshing = query.isFetching && !isLoading;
  const lastUpdated  = query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : new Date();
  const campaigns    = query.data ?? [];

  // Mark stale after 5 minutes, mark fresh when data arrives
  useEffect(() => {
    if (query.dataUpdatedAt) {
      StaleDataStore.setStale("campaigns", false);
      const timer = setTimeout(() => StaleDataStore.setStale("campaigns", true), 5 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [query.dataUpdatedAt]);

  const activeCount  = campaigns.filter((c) => c.status === "Active").length;
  const pausedCount  = campaigns.filter((c) => c.status === "Paused").length;
  const scalingCount = campaigns.filter((c) => c.status === "Scaling").length;

  // ── Pull-to-refresh ────────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await query.refetch();
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [query]);

  // ── Skeleton placeholder ───────────────────────────────────────────────────
  const skeletonData: Campaign[] = Array.from({ length: 4 }, (_, i) => ({
    id: `skeleton-${i}`,
    name: "Loading campaign…",
    platform: "—",
    status: "Active" as const,
    budget: "—",
    spend: "—",
    roas: "—",
    ctr: "—",
    impressions: "—",
    color: colors.border,
  }));

  const displayData = isLoading ? skeletonData : campaigns;

  return (
    <ScreenContainer>
      {/* Fixed Header */}
      <View style={{ paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize["2xl"], fontWeight: "700" }}>Campaign Manager</Text>
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
          <TouchableOpacity
            style={{ backgroundColor: "#7C3AED", borderRadius: 10, paddingHorizontal: 14, height: 44, flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 0 }}
            onPress={() => router.push("/creator" as any)}
            activeOpacity={0.8}
          >
            <IconSymbol name="plus" size={16} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.sm, fontWeight: "600" }}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Row */}
        <View style={{ flexDirection: "row", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
          {[
            { label: "Active",  value: String(activeCount),  color: "#22C55E" },
            { label: "Paused",  value: String(pausedCount),  color: "#F59E0B" },
            { label: "Scaling", value: String(scalingCount), color: "#7C3AED" },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
              <Text style={{ color: colors.muted, fontSize: r.fontSize.sm }}>
                <Text style={{ color: colors.foreground, fontWeight: "600" }}>{item.value}</Text> {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Campaign FlatList with Pull-to-Refresh */}
      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: r.px, gap: 12 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
            colors={["#7C3AED", "#9333EA"]}
            progressBackgroundColor={colors.background}
            title="Updating campaigns…"
            titleColor={colors.muted}
          />
        }
        renderItem={({ item }) => {
          const statusStyle = STATUS_COLORS[item.status] ?? { bg: "#F3F4F6", text: "#6B7280" };
          return (
            <TouchableOpacity
              style={{
                backgroundColor: colors.background, borderRadius: 16,
                padding: r.isXs ? 12 : 16, borderWidth: 1, borderColor: colors.border,
                shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
                opacity: isLoading ? 0.4 : isRefreshing ? 0.65 : 1,
              }}
              activeOpacity={0.7}
            >
              {/* Campaign Header */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: `${item.color}15`, alignItems: "center", justifyContent: "center", marginRight: 12, flexShrink: 0 }}>
                  <IconSymbol name="megaphone.fill" size={20} color={item.color} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }} numberOfLines={1}>{item.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>{item.platform} · Budget: {item.budget}</Text>
                </View>
                <View style={{ backgroundColor: statusStyle.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexShrink: 0 }}>
                  <Text style={{ color: statusStyle.text, fontSize: r.fontSize.xs, fontWeight: "600" }}>{item.status}</Text>
                </View>
              </View>

              {/* Metrics Row */}
              <View style={{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 10, padding: 10, overflow: "hidden" }}>
                {[
                  { label: "ROAS", value: item.roas },
                  { label: "CTR",  value: item.ctr  },
                  { label: "Spend", value: item.spend },
                  { label: "Impressions", value: item.impressions },
                ].map((metric, idx) => (
                  <View key={metric.label} style={{ flex: 1, alignItems: "center", borderLeftWidth: idx > 0 ? 1 : 0, borderLeftColor: colors.border, minWidth: 0 }}>
                    <Text style={{ color: colors.foreground, fontSize: r.isXs ? 12 : 14, fontWeight: "700" }} numberOfLines={1}>{metric.value}</Text>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }}>{metric.label}</Text>
                  </View>
                ))}
              </View>

              {/* Action Row */}
              <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: "#7C3AED15", borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center" }} activeOpacity={0.7}>
                  <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Optimize</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }} activeOpacity={0.7}>
                  <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600" }}>
                    {item.status === "Active" || item.status === "Scaling" ? "Pause" : "Resume"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: colors.surface, borderRadius: 8, width: 44, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }} activeOpacity={0.7}>
                  <IconSymbol name="chart.bar.fill" size={16} color={colors.muted} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </ScreenContainer>
  );
}
