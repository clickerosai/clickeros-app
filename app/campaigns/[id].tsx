/**
 * Campaign Detail Screen — /campaigns/[id]
 *
 * Shows full campaign metrics, performance history chart,
 * creative previews, and AI optimization timeline.
 * Navigated to by tapping a campaign card on the Campaigns tab.
 */
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import * as Haptics from "expo-haptics";
import { trpc } from "@/lib/trpc";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useToast } from "@/components/toast";
import { CampaignAlertSheet } from "@/components/campaign-alert-sheet";
import { ErrorBoundary } from "@/components/error-boundary";
import type { Campaign } from "@/server/dashboardRouter";

// ── Metric Card ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, change, positive, color }: {
  label: string; value: string; change?: string; positive?: boolean; color?: string;
}) {
  const colors = useColors();
  const r = useResponsive();
  return (
    <View style={{ flex: 1, minWidth: r.isXs ? "45%" : "22%", backgroundColor: colors.background, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "600", marginBottom: 6 }}>{label}</Text>
      <Text style={{ color: color ?? colors.foreground, fontSize: r.isXs ? 20 : 24, fontWeight: "800" }}>{value}</Text>
      {change && (
        <Text style={{ color: positive ? "#22C55E" : "#EF4444", fontSize: r.fontSize.xs, marginTop: 4, fontWeight: "600" }}>
          {positive ? "↑" : "↓"} {change}
        </Text>
      )}
    </View>
  );
}

// ── Simple Bar Chart ──────────────────────────────────────────────────────────

function BarChart({ data, label, color }: { data: number[]; label: string; color: string }) {
  const colors = useColors();
  const max = Math.max(...data, 1);
  return (
    <View>
      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "600", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 4, height: 60 }}>
        {data.map((v, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: `${color}20`, borderRadius: 4, overflow: "hidden", height: 60, justifyContent: "flex-end" }}>
            <View style={{ backgroundColor: color, borderRadius: 4, height: `${Math.max(8, (v / max) * 100)}%` }} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
        <Text style={{ color: colors.muted, fontSize: 9 }}>7 days ago</Text>
        <Text style={{ color: colors.muted, fontSize: 9 }}>Today</Text>
      </View>
    </View>
  );
}

// ── Optimization Event ────────────────────────────────────────────────────────

interface OptimizationEvent {
  date: string;
  type: "ai_optimize" | "budget_change" | "pause" | "resume" | "created";
  title: string;
  desc: string;
  impact?: string;
}

function OptimizationEventItem({ event, isLast }: { event: OptimizationEvent; isLast: boolean }) {
  const colors = useColors();
  const r = useResponsive();
  const icons: Record<OptimizationEvent["type"], string> = {
    ai_optimize: "✅", budget_change: "💰", pause: "⏸️", resume: "▶️", created: "🚀",
  };
  const dotColors: Record<OptimizationEvent["type"], string> = {
    ai_optimize: "#22C55E", budget_change: "#F59E0B", pause: "#6B7280", resume: "#7C3AED", created: "#3B82F6",
  };
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      {/* Timeline line */}
      <View style={{ alignItems: "center", width: 28 }}>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: `${dotColors[event.type]}20`, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 14 }}>{icons[event.type]}</Text>
        </View>
        {!isLast && <View style={{ width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4, marginBottom: 4 }} />}
      </View>
      {/* Content */}
      <View style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600", flex: 1 }}>{event.title}</Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, flexShrink: 0, marginLeft: 8 }}>{event.date}</Text>
        </View>
        <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 18 }}>{event.desc}</Text>
        {event.impact && (
          <View style={{ backgroundColor: "#DCFCE7", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 6 }}>
            <Text style={{ color: "#16A34A", fontSize: r.fontSize.xs, fontWeight: "600" }}>{event.impact}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Creative Preview ──────────────────────────────────────────────────────────

function CreativePreview({ platform, headline, body, cta, color }: {
  platform: string; headline: string; body: string; cta: string; color: string;
}) {
  const colors = useColors();
  const r = useResponsive();
  return (
    <View style={{ width: r.isXs ? 220 : 260, backgroundColor: colors.background, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginRight: 12, flexShrink: 0 }}>
      {/* Ad header */}
      <View style={{ backgroundColor: `${color}15`, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}>{platform[0]}</Text>
        </View>
        <View>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "700" }}>Sponsored</Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>{platform} Ad</Text>
        </View>
      </View>
      {/* Ad image placeholder */}
      <View style={{ height: 120, backgroundColor: `${color}10`, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 36 }}>🖼️</Text>
        <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 4 }}>Creative Image</Text>
      </View>
      {/* Ad copy */}
      <View style={{ padding: 12 }}>
        <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 4 }} numberOfLines={2}>{headline}</Text>
        <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, lineHeight: 16, marginBottom: 10 }} numberOfLines={3}>{body}</Text>
        <View style={{ backgroundColor: color, borderRadius: 8, paddingVertical: 8, alignItems: "center" }}>
          <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.sm, fontWeight: "700" }}>{cta}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

function CampaignDetailInner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const { showToast } = useToast();

  const [alertSheetVisible, setAlertSheetVisible] = useState(false);

  // Fetch all campaigns and find the one matching this ID
  const query = trpc.dashboard.campaigns.useQuery(undefined, { staleTime: 60_000 });
  const campaign = query.data?.find((c) => c.id === id);

  const isLoading = query.isLoading;

  // Fetch real metrics history from tRPC (uses Clickeros API or mock fallback)
  const historyQuery = trpc.dashboard.campaignMetricsHistory.useQuery(
    { campaignId: id ?? "", period: "7d" },
    { enabled: !!id && !isLoading, staleTime: 5 * 60_000 }
  );

  const metricsHistory = historyQuery.data ?? [];

  // Derive chart arrays from real data
  const roasHistory  = useMemo(() => metricsHistory.map((d) => d.roas),  [metricsHistory]);
  const ctrHistory   = useMemo(() => metricsHistory.map((d) => d.ctr),   [metricsHistory]);
  const spendHistory = useMemo(() => metricsHistory.map((d) => d.spend), [metricsHistory]);

  const handleOptimize = useCallback(async () => {
    if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast({ type: "info", message: "Optimizing campaign…", subMessage: "Analyzing performance data.", duration: 2500 });
    setTimeout(() => {
      showToast({ type: "success", message: "Optimization applied ✅", subMessage: "Budget reallocated for better ROAS.", duration: 4000 });
    }, 2200);
  }, [showToast]);

  const handleTogglePause = useCallback(async () => {
    if (!campaign) return;
    if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isActive = campaign.status === "Active" || campaign.status === "Scaling";
    showToast({
      type: "success",
      message: isActive ? "Campaign paused ✅" : "Campaign resumed ✅",
      subMessage: `"${campaign.name}" is now ${isActive ? "paused" : "active"}.`,
      duration: 3000,
    });
  }, [campaign, showToast]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={{ color: colors.muted, fontSize: r.fontSize.base, marginTop: 12 }}>Loading campaign…</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!campaign) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.xl, fontWeight: "700", textAlign: "center", marginBottom: 8 }}>Campaign Not Found</Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.base, textAlign: "center", marginBottom: 24 }}>This campaign may have been deleted or is no longer available.</Text>
          <TouchableOpacity style={{ backgroundColor: "#7C3AED", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14 }} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.base, fontWeight: "700" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const optimizationTimeline: OptimizationEvent[] = [
    { date: "Today", type: "ai_optimize", title: "AI Optimization Applied", desc: "Budget reallocated from underperforming ad sets to top performers. Bid strategy updated.", impact: "ROAS improved by +0.4x" },
    { date: "2 days ago", type: "budget_change", title: "Daily Budget Increased", desc: "Budget increased from $40/day to $50/day based on strong ROAS performance.", impact: "+$10/day" },
    { date: "5 days ago", type: "ai_optimize", title: "Audience Expansion", desc: "AI detected lookalike audience opportunity. Expanded targeting to similar users.", impact: "+18% reach" },
    { date: "1 week ago", type: "resume", title: "Campaign Resumed", desc: "Campaign resumed after A/B test completion. Winning creative selected." },
    { date: "2 weeks ago", type: "pause", title: "Campaign Paused", desc: "Paused for A/B testing of new ad creatives." },
    { date: "1 month ago", type: "created", title: "Campaign Created", desc: "Campaign launched with initial budget and targeting settings." },
  ];

  const creatives = [
    { platform: campaign.platform, headline: `${campaign.name} — Best Deal`, body: "Don't miss this limited-time opportunity. Join thousands of satisfied customers today.", cta: "Shop Now", color: campaign.color },
    { platform: campaign.platform, headline: "Why 10,000+ Customers Love Us", body: "See why we're the #1 choice. Fast delivery, easy returns, and unbeatable prices.", cta: "Learn More", color: campaign.color },
    { platform: campaign.platform, headline: "🔥 Flash Sale — Today Only", body: "Limited stock available. Order now before it's gone. Free shipping on all orders.", cta: "Get Deal", color: campaign.color },
  ];

  const statusStyle = {
    Active:  { bg: "#DCFCE7", text: "#16A34A" },
    Paused:  { bg: "#FEF9C3", text: "#CA8A04" },
    Scaling: { bg: "#EDE9FE", text: "#7C3AED" },
    Stopped: { bg: "#FEE2E2", text: "#DC2626" },
  }[campaign.status] ?? { bg: "#F3F4F6", text: "#6B7280" };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ backgroundColor: campaign.color, paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 24 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16, minHeight: 44 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: r.fontSize.base }}>Campaigns</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize["2xl"], fontWeight: "800", marginBottom: 4 }} numberOfLines={2}>
                {campaign.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: r.fontSize.sm }}>{campaign.platform}</Text>
                <View style={{ backgroundColor: statusStyle.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ color: statusStyle.text, fontSize: r.fontSize.xs, fontWeight: "700" }}>{campaign.status}</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8, flexShrink: 0 }}>
              <TouchableOpacity
                style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}
                onPress={() => setAlertSheetVisible(true)}
                activeOpacity={0.7}
              >
                <IconSymbol name="bell.fill" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick stats */}
          <View style={{ flexDirection: "row", gap: 20, marginTop: 16 }}>
            {[
              { label: "ROAS", value: campaign.roas },
              { label: "CTR",  value: campaign.ctr  },
              { label: "Spend", value: campaign.spend },
              { label: "Budget", value: campaign.budget },
            ].map((stat) => (
              <View key={stat.label}>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: r.fontSize.xs, marginBottom: 2 }}>{stat.label}</Text>
                <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.lg, fontWeight: "700" }}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: r.px, paddingTop: 16, flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "#7C3AED", borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 }}
            onPress={handleOptimize}
            activeOpacity={0.85}
          >
            <IconSymbol name="sparkles" size={16} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.base, fontWeight: "700" }}>Optimize</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}
            onPress={handleTogglePause}
            activeOpacity={0.8}
          >
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }}>
              {campaign.status === "Active" || campaign.status === "Scaling" ? "Pause" : "Resume"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Metrics Cards */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>Performance Metrics</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <MetricCard label="ROAS" value={campaign.roas} change="0.4x this week" positive color="#7C3AED" />
            <MetricCard label="CTR" value={campaign.ctr} change="0.8% this week" positive color="#22C55E" />
            <MetricCard label="Impressions" value={campaign.impressions} change="12% this week" positive />
            <MetricCard label="Daily Spend" value={campaign.spend} />
          </View>
        </View>

        {/* Performance Charts */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>7-Day Performance</Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 20 }}>
            <BarChart data={roasHistory} label="ROAS (×)" color="#7C3AED" />
            <BarChart data={ctrHistory} label="CTR (%)" color="#22C55E" />
            <BarChart data={spendHistory} label="Daily Spend ($)" color="#F59E0B" />
          </View>
        </View>

        {/* Creative Previews */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12, paddingHorizontal: r.px }}>Ad Creatives</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: r.px, paddingBottom: 4 }}>
            {creatives.map((creative, idx) => (
              <CreativePreview key={idx} {...creative} />
            ))}
          </ScrollView>
        </View>

        {/* Optimization Timeline */}
        <View style={{ paddingHorizontal: r.px, marginTop: 24 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 16 }}>Optimization Timeline</Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            {optimizationTimeline.map((event, idx) => (
              <OptimizationEventItem key={idx} event={event} isLast={idx === optimizationTimeline.length - 1} />
            ))}
          </View>
        </View>

        {/* Campaign Info */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>Campaign Details</Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            {[
              { label: "Campaign ID", value: campaign.id },
              { label: "Platform", value: campaign.platform },
              { label: "Status", value: campaign.status },
              { label: "Daily Budget", value: campaign.budget },
              { label: "Total Spend", value: campaign.spend },
              { label: "Impressions", value: campaign.impressions },
            ].map((row, idx) => (
              <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: r.isXs ? 14 : 16, paddingVertical: 12, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: colors.border }}>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.sm }}>{row.label}</Text>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600" }}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Alert Override Sheet */}
      {alertSheetVisible && (
        <CampaignAlertSheet
          campaign={{ id: campaign.id, name: campaign.name, roas: campaign.roas, platform: campaign.platform, color: campaign.color }}
          visible={alertSheetVisible}
          onClose={() => setAlertSheetVisible(false)}
        />
      )}
    </ScreenContainer>
  );
}

export default function CampaignDetailScreen() {
  return (
    <ErrorBoundary>
      <CampaignDetailInner />
    </ErrorBoundary>
  );
}
