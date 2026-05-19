import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/components/toast";
import { CampaignAlertSheet } from "@/components/campaign-alert-sheet";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StaleDataStore } from "@/hooks/use-stale-data";
import type { Campaign } from "@/server/dashboardRouter";
import { ErrorBoundary } from "@/components/error-boundary";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Active:  { bg: "#DCFCE7", text: "#16A34A" },
  Paused:  { bg: "#FEF9C3", text: "#CA8A04" },
  Scaling: { bg: "#EDE9FE", text: "#7C3AED" },
  Stopped: { bg: "#FEE2E2", text: "#DC2626" },
};

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function CampaignsScreenInner() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const { showToast } = useToast();

  // ── Real API query via tRPC ────────────────────────────────────────────────
  const query = trpc.dashboard.campaigns.useQuery(undefined, { staleTime: 60_000 });

  const isLoading    = query.isLoading;
  const isRefreshing = query.isFetching && !isLoading;
  const lastUpdated  = query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : new Date();
  const campaigns    = query.data ?? [];

  // Local optimistic state for campaign statuses (so UI updates instantly)
  const [localStatuses, setLocalStatuses] = useState<Record<string, Campaign["status"]>>({});
  // Track which campaigns are currently processing an action
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [alertSheetCampaign, setAlertSheetCampaign] = useState<Campaign | null>(null);

  // ── Search & Filter ─────────────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Paused" | "Scaling" | "Stopped">("All");

  // Filtered campaigns based on search + status filter
  const filteredCampaigns = campaigns.filter((c) => {
    const effectiveStatus = localStatuses[c.id] ?? c.status;
    const matchesStatus = statusFilter === "All" || effectiveStatus === statusFilter;
    const matchesSearch = searchQuery.trim() === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Mark stale after 5 minutes
  useEffect(() => {
    if (query.dataUpdatedAt) {
      StaleDataStore.setStale("campaigns", false);
      const timer = setTimeout(() => StaleDataStore.setStale("campaigns", true), 5 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [query.dataUpdatedAt]);

  const activeCount  = campaigns.filter((c) => (localStatuses[c.id] ?? c.status) === "Active").length;
  const pausedCount  = campaigns.filter((c) => (localStatuses[c.id] ?? c.status) === "Paused").length;
  const scalingCount = campaigns.filter((c) => (localStatuses[c.id] ?? c.status) === "Scaling").length;

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

  // ── Pause / Resume Campaign ────────────────────────────────────────────────
  const handleTogglePause = useCallback(async (campaign: Campaign) => {
    const currentStatus = localStatuses[campaign.id] ?? campaign.status;
    const isActive = currentStatus === "Active" || currentStatus === "Scaling";
    const newStatus: Campaign["status"] = isActive ? "Paused" : "Active";

    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Optimistic update
    setLocalStatuses((prev) => ({ ...prev, [campaign.id]: newStatus }));
    setProcessingIds((prev) => new Set([...prev, campaign.id]));

    try {
      // Simulate API call (replace with real mutation when backend supports it)
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      showToast({
        type: "success",
        message: isActive ? `Campaign paused ✅` : `Campaign resumed ✅`,
        subMessage: `"${campaign.name}" is now ${newStatus.toLowerCase()}.`,
        duration: 3500,
      });
    } catch (err) {
      // Revert optimistic update on failure
      setLocalStatuses((prev) => ({ ...prev, [campaign.id]: currentStatus }));

      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      showToast({
        type: "error",
        message: isActive ? "Failed to pause campaign" : "Failed to resume campaign",
        subMessage: "Please try again or check your connection.",
        duration: 4000,
        action: {
          label: "Retry",
          onPress: () => handleTogglePause(campaign),
        },
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(campaign.id);
        return next;
      });
    }
  }, [localStatuses, showToast]);

  // ── Optimize Campaign ──────────────────────────────────────────────────────
  const handleOptimize = useCallback(async (campaign: Campaign) => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setProcessingIds((prev) => new Set([...prev, `opt-${campaign.id}`]));

    // Show "optimizing" toast immediately
    showToast({
      type: "info",
      message: "Optimizing campaign…",
      subMessage: `Analyzing "${campaign.name}" performance data.`,
      duration: 2500,
    });

    try {
      // Simulate AI optimization (replace with real mutation)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Simulate a ROAS improvement
      showToast({
        type: "success",
        message: "Optimization applied ✅",
        subMessage: `Budget reallocated for better ROAS on "${campaign.name}".`,
        duration: 4500,
        action: {
          label: "View changes",
          onPress: () => router.push("/analytics" as any),
        },
      });
    } catch {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      showToast({
        type: "error",
        message: "Optimization failed",
        subMessage: "Please try again. If the issue persists, contact support.",
        duration: 4000,
        action: {
          label: "Retry",
          onPress: () => handleOptimize(campaign),
        },
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(`opt-${campaign.id}`);
        return next;
      });
    }
  }, [showToast, router]);

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

        {/* Search Bar */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 12, height: 44, gap: 8, marginTop: 10, borderWidth: 1, borderColor: colors.border }}>
          <IconSymbol name="magnifyingglass" size={16} color={colors.muted} />
          <TextInput
            style={{ flex: 1, color: colors.foreground, fontSize: r.fontSize.base, height: 44 }}
            placeholder="Search campaigns or platforms…"
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7} style={{ minWidth: 28, minHeight: 28, alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="xmark" size={14} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Status Filter Chips */}
        <View style={{ flexDirection: "row", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {(["All", "Active", "Paused", "Scaling", "Stopped"] as const).map((status) => {
            const sel = statusFilter === status;
            const chipColors: Record<string, string> = { All: "#7C3AED", Active: "#22C55E", Paused: "#F59E0B", Scaling: "#7C3AED", Stopped: "#EF4444" };
            const chipColor = chipColors[status] ?? "#7C3AED";
            return (
              <TouchableOpacity
                key={status}
                style={{ paddingHorizontal: 12, height: 32, borderRadius: 8, borderWidth: 1.5, borderColor: sel ? chipColor : colors.border, backgroundColor: sel ? `${chipColor}15` : colors.background, justifyContent: "center" }}
                onPress={() => setStatusFilter(status)}
                activeOpacity={0.7}
              >
                <Text style={{ color: sel ? chipColor : colors.muted, fontSize: r.fontSize.xs, fontWeight: sel ? "700" : "400" }}>{status}</Text>
              </TouchableOpacity>
            );
          })}
          {(searchQuery || statusFilter !== "All") && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, height: 32 }}>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>
                {filteredCampaigns.length} of {campaigns.length}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Campaign FlatList with Pull-to-Refresh */}
      <FlatList
        data={isLoading ? skeletonData : filteredCampaigns}
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
          const effectiveStatus = localStatuses[item.id] ?? item.status;
          const statusStyle = STATUS_COLORS[effectiveStatus] ?? { bg: "#F3F4F6", text: "#6B7280" };
          const isProcessing = processingIds.has(item.id);
          const isOptimizing = processingIds.has(`opt-${item.id}`);
          const isActive = effectiveStatus === "Active" || effectiveStatus === "Scaling";

          return (
            <TouchableOpacity
              style={{
                backgroundColor: colors.background, borderRadius: 16,
                padding: r.isXs ? 12 : 16, borderWidth: 1, borderColor: colors.border,
                shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
                opacity: isLoading ? 0.4 : isRefreshing ? 0.65 : 1,
              }}
              onPress={() => router.push(`/campaigns/${item.id}` as any)}
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
                  {isProcessing ? (
                    <ActivityIndicator size="small" color={statusStyle.text} />
                  ) : (
                    <Text style={{ color: statusStyle.text, fontSize: r.fontSize.xs, fontWeight: "600" }}>{effectiveStatus}</Text>
                  )}
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
                {/* Optimize */}
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: "#7C3AED15", borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 }}
                  onPress={() => handleOptimize(item)}
                  activeOpacity={0.7}
                  disabled={isOptimizing || isLoading}
                >
                  {isOptimizing ? (
                    <ActivityIndicator size="small" color="#7C3AED" />
                  ) : (
                    <IconSymbol name="sparkles" size={14} color="#7C3AED" />
                  )}
                  <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>
                    {isOptimizing ? "Optimizing…" : "Optimize"}
                  </Text>
                </TouchableOpacity>

                {/* Pause / Resume */}
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}
                  onPress={() => handleTogglePause(item)}
                  activeOpacity={0.7}
                  disabled={isProcessing || isLoading}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color={colors.muted} />
                  ) : (
                    <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600" }}>
                      {isActive ? "Pause" : "Resume"}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Analytics */}
                <TouchableOpacity
                  style={{ backgroundColor: colors.surface, borderRadius: 8, width: 44, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}
                  onPress={() => router.push("/analytics" as any)}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="chart.bar.fill" size={16} color={colors.muted} />
                </TouchableOpacity>

                {/* Alert Override Bell */}
                <TouchableOpacity
                  style={{ backgroundColor: colors.surface, borderRadius: 8, width: 44, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}
                  onPress={() => setAlertSheetCampaign(item)}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="bell.fill" size={16} color="#7C3AED" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Per-Campaign Alert Override Sheet */}
      {alertSheetCampaign && (
        <CampaignAlertSheet
          campaign={alertSheetCampaign}
          visible={!!alertSheetCampaign}
          onClose={() => setAlertSheetCampaign(null)}
        />
      )}
    </ScreenContainer>
  );
}

export default function CampaignsScreen() {
  return (
    <ErrorBoundary>
      <CampaignsScreenInner />
    </ErrorBoundary>
  );
}
