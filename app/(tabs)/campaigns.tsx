import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
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

const CAMPAIGNS_A = [
  { id: "1", name: "Summer Sale — Facebook", platform: "Facebook", status: "Active", budget: "$50/day", spend: "$1,240", roas: "4.2x", ctr: "5.1%", impressions: "48.2K", color: "#1877F2" },
  { id: "2", name: "Product Launch — Instagram", platform: "Instagram", status: "Active", budget: "$30/day", spend: "$890", roas: "3.8x", ctr: "4.7%", impressions: "32.1K", color: "#E1306C" },
  { id: "3", name: "Google Search Q2", platform: "Google", status: "Paused", budget: "$80/day", spend: "$2,100", roas: "2.9x", ctr: "3.2%", impressions: "91.4K", color: "#4285F4" },
  { id: "4", name: "TikTok Brand Awareness", platform: "TikTok", status: "Active", budget: "$25/day", spend: "$560", roas: "5.1x", ctr: "6.8%", impressions: "124.7K", color: "#010101" },
  { id: "5", name: "YouTube Pre-Roll", platform: "YouTube", status: "Scaling", budget: "$60/day", spend: "$1,780", roas: "6.2x", ctr: "7.3%", impressions: "87.3K", color: "#FF0000" },
  { id: "6", name: "Retargeting — All Platforms", platform: "Multi", status: "Active", budget: "$40/day", spend: "$980", roas: "8.4x", ctr: "9.1%", impressions: "22.6K", color: "#7C3AED" },
];

const CAMPAIGNS_B = [
  { id: "1", name: "Summer Sale — Facebook", platform: "Facebook", status: "Scaling", budget: "$65/day", spend: "$1,490", roas: "4.8x", ctr: "5.6%", impressions: "52.1K", color: "#1877F2" },
  { id: "2", name: "Product Launch — Instagram", platform: "Instagram", status: "Active", budget: "$30/day", spend: "$1,020", roas: "4.1x", ctr: "5.0%", impressions: "35.4K", color: "#E1306C" },
  { id: "3", name: "Google Search Q2", platform: "Google", status: "Active", budget: "$80/day", spend: "$2,380", roas: "3.4x", ctr: "3.8%", impressions: "98.2K", color: "#4285F4" },
  { id: "4", name: "TikTok Brand Awareness", platform: "TikTok", status: "Active", budget: "$25/day", spend: "$640", roas: "5.6x", ctr: "7.2%", impressions: "131.4K", color: "#010101" },
  { id: "5", name: "YouTube Pre-Roll", platform: "YouTube", status: "Scaling", budget: "$75/day", spend: "$2,010", roas: "6.8x", ctr: "7.9%", impressions: "94.1K", color: "#FF0000" },
  { id: "6", name: "Retargeting — All Platforms", platform: "Multi", status: "Active", budget: "$40/day", spend: "$1,120", roas: "9.2x", ctr: "9.8%", impressions: "24.8K", color: "#7C3AED" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Active:  { bg: "#DCFCE7", text: "#16A34A" },
  Paused:  { bg: "#FEF9C3", text: "#CA8A04" },
  Scaling: { bg: "#EDE9FE", text: "#7C3AED" },
  Stopped: { bg: "#FEE2E2", text: "#DC2626" },
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type Campaign = typeof CAMPAIGNS_A[number];

export default function CampaignsScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_A);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Simulate network fetch
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isEven = refreshCount % 2 === 0;
    setCampaigns(isEven ? CAMPAIGNS_B : CAMPAIGNS_A);
    setRefreshCount((c) => c + 1);
    setLastUpdated(new Date());

    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setRefreshing(false);
  }, [refreshCount]);

  // Compute summary counts
  const activeCount = campaigns.filter((c) => c.status === "Active").length;
  const pausedCount = campaigns.filter((c) => c.status === "Paused").length;
  const scalingCount = campaigns.filter((c) => c.status === "Scaling").length;

  return (
    <ScreenContainer>
      {/* Fixed Header */}
      <View style={{
        paddingHorizontal: r.px,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize["2xl"], fontWeight: "700" }}>
              Campaign Manager
            </Text>
            {/* Last Updated */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
              <IconSymbol
                name={refreshing ? "arrow.triangle.2.circlepath" : "checkmark.circle.fill"}
                size={11}
                color={refreshing ? colors.muted : "#22C55E"}
              />
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>
                {refreshing ? "Refreshing…" : `Updated ${formatTime(lastUpdated)} · Pull to refresh`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#7C3AED",
              borderRadius: 10,
              paddingHorizontal: 14,
              height: 44,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
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
            { label: "Active", value: String(activeCount), color: "#22C55E" },
            { label: "Paused", value: String(pausedCount), color: "#F59E0B" },
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

      {/* Campaign List with Pull-to-Refresh */}
      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: r.px, gap: 12 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
            colors={["#7C3AED", "#9333EA"]}
            progressBackgroundColor={colors.background}
            title="Updating campaigns..."
            titleColor={colors.muted}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: colors.background,
              borderRadius: 16,
              padding: r.isXs ? 12 : 16,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
              opacity: refreshing ? 0.65 : 1,
            }}
            activeOpacity={0.7}
          >
            {/* Campaign Header */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{
                width: 42, height: 42, borderRadius: 12,
                backgroundColor: `${item.color}15`,
                alignItems: "center", justifyContent: "center",
                marginRight: 12, flexShrink: 0,
              }}>
                <IconSymbol name="megaphone.fill" size={20} color={item.color} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>
                  {item.platform} · Budget: {item.budget}
                </Text>
              </View>
              <View style={{
                backgroundColor: STATUS_COLORS[item.status]?.bg || "#F3F4F6",
                borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexShrink: 0,
              }}>
                <Text style={{ color: STATUS_COLORS[item.status]?.text || "#6B7280", fontSize: r.fontSize.xs, fontWeight: "600" }}>
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Metrics Row */}
            <View style={{
              flexDirection: "row",
              backgroundColor: colors.surface,
              borderRadius: 10,
              padding: 10,
              overflow: "hidden",
            }}>
              {[
                { label: "ROAS", value: item.roas },
                { label: "CTR", value: item.ctr },
                { label: "Spend", value: item.spend },
                { label: "Impressions", value: item.impressions },
              ].map((metric, idx) => (
                <View key={metric.label} style={{
                  flex: 1, alignItems: "center",
                  borderLeftWidth: idx > 0 ? 1 : 0,
                  borderLeftColor: colors.border,
                  minWidth: 0,
                }}>
                  <Text style={{ color: colors.foreground, fontSize: r.isXs ? 12 : 14, fontWeight: "700" }} numberOfLines={1}>
                    {metric.value}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }}>{metric.label}</Text>
                </View>
              ))}
            </View>

            {/* Action Row */}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1, backgroundColor: "#7C3AED15",
                  borderRadius: 8, height: 44,
                  alignItems: "center", justifyContent: "center",
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Optimize</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1, backgroundColor: colors.surface,
                  borderRadius: 8, height: 44,
                  alignItems: "center", justifyContent: "center",
                  borderWidth: 1, borderColor: colors.border,
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600" }}>
                  {item.status === "Active" || item.status === "Scaling" ? "Pause" : "Resume"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 8, width: 44, height: 44,
                  alignItems: "center", justifyContent: "center",
                  borderWidth: 1, borderColor: colors.border,
                }}
                activeOpacity={0.7}
              >
                <IconSymbol name="chart.bar.fill" size={16} color={colors.muted} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
}
