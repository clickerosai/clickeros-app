import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";

const TIME_RANGES = ["7D", "30D", "90D", "All"];

const METRICS = [
  { label: "Total Revenue", value: "$48,240", change: "+18%", positive: true, icon: "dollarsign.circle.fill" as const, color: "#22C55E" },
  { label: "Total Sessions", value: "142.8K", change: "+24%", positive: true, icon: "chart.line.uptrend.xyaxis" as const, color: "#7C3AED" },
  { label: "Conversions", value: "3,847", change: "+31%", positive: true, icon: "checkmark.circle.fill" as const, color: "#0EA5E9" },
  { label: "Avg. ROAS", value: "3.8x", change: "+0.4", positive: true, icon: "chart.bar.fill" as const, color: "#F59E0B" },
  { label: "Total Clicks", value: "28.4K", change: "+15%", positive: true, icon: "arrow.up.right" as const, color: "#EC4899" },
  { label: "Avg. CPA", value: "$12.54", change: "-8%", positive: true, icon: "percent" as const, color: "#06B6D4" },
];

const CHANNEL_DATA = [
  { channel: "Facebook Ads", revenue: "$18,420", sessions: "52.1K", roas: "4.2x", share: 38, color: "#1877F2" },
  { channel: "Google Ads", revenue: "$14,200", sessions: "41.3K", roas: "3.1x", share: 29, color: "#4285F4" },
  { channel: "Organic SEO", revenue: "$9,840", sessions: "31.2K", roas: "∞", share: 20, color: "#22C55E" },
  { channel: "TikTok Ads", revenue: "$5,780", sessions: "18.2K", roas: "5.1x", share: 13, color: "#010101" },
];

const TOP_CONTENT = [
  { title: "10 AI Tools That Replace Your Marketing Team", traffic: "12.4K", revenue: "$4,820", rank: 1 },
  { title: "How to 3x Your ROAS with Retargeting", traffic: "8.7K", revenue: "$3,210", rank: 2 },
  { title: "Complete Guide to Programmatic SEO", traffic: "6.2K", revenue: "$2,140", rank: 3 },
  { title: "Facebook Ads vs Google Ads in 2025", traffic: "5.1K", revenue: "$1,890", rank: 4 },
];

export default function AnalyticsScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const [activeRange, setActiveRange] = useState("30D");

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 12,
          borderBottomWidth: 1, borderBottomColor: colors.border,
        }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize["2xl"], fontWeight: "700", marginBottom: 12 }}>
            Analytics
          </Text>
          {/* Time Range Selector */}
          <View style={{
            flexDirection: "row", backgroundColor: colors.surface,
            borderRadius: 10, padding: 3, gap: 2,
          }}>
            {TIME_RANGES.map((range) => (
              <TouchableOpacity
                key={range}
                style={{
                  flex: 1, height: 36, borderRadius: 8,
                  alignItems: "center", justifyContent: "center",
                  backgroundColor: activeRange === range ? "#7C3AED" : "transparent",
                }}
                onPress={() => setActiveRange(range)}
                activeOpacity={0.7}
              >
                <Text style={{
                  color: activeRange === range ? "#FFFFFF" : colors.muted,
                  fontSize: r.fontSize.sm, fontWeight: "600",
                }}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Metrics Grid — 2 columns, responsive */}
        <View style={{ paddingHorizontal: r.px, marginTop: 16 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {METRICS.map((metric) => (
              <View
                key={metric.label}
                style={{
                  width: r.statCardWidth,
                  backgroundColor: colors.background,
                  borderRadius: 14, padding: r.isXs ? 12 : 14,
                  borderWidth: 1, borderColor: colors.border,
                  overflow: "hidden",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <View style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: `${metric.color}15`,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <IconSymbol name={metric.icon} size={15} color={metric.color} />
                  </View>
                  <View style={{
                    backgroundColor: metric.positive ? "#DCFCE7" : "#FEE2E2",
                    borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2,
                  }}>
                    <Text style={{ color: metric.positive ? "#16A34A" : "#DC2626", fontSize: r.fontSize.xs, fontWeight: "600" }}>
                      {metric.change}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: colors.foreground, fontSize: r.isXs ? 16 : 18, fontWeight: "700" }} numberOfLines={1}>
                  {metric.value}
                </Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>
                  {metric.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={{ marginHorizontal: r.px, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>Revenue Trend</Text>
            <TouchableOpacity
              onPress={() => router.push("/analytics-sales" as any)}
              activeOpacity={0.7}
              style={{ minHeight: 44, justifyContent: "center", paddingLeft: 8 }}
            >
              <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Details</Text>
            </TouchableOpacity>
          </View>
          <View style={{
            backgroundColor: colors.surface, borderRadius: 16, padding: 16,
            borderWidth: 1, borderColor: colors.border, height: 160, justifyContent: "flex-end",
            overflow: "hidden",
          }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 100 }}>
              {[40, 65, 55, 80, 70, 90, 85, 95, 75, 88, 92, 100, 87, 96].map((height, idx) => (
                <View
                  key={idx}
                  style={{
                    flex: 1, marginHorizontal: 2,
                    height: `${height}%` as any,
                    backgroundColor: idx >= 10 ? "#7C3AED" : "#7C3AED40",
                    borderRadius: 4,
                  }}
                />
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
            <TouchableOpacity
              onPress={() => router.push("/analytics-attribution" as any)}
              activeOpacity={0.7}
              style={{ minHeight: 44, justifyContent: "center", paddingLeft: 8 }}
            >
              <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Attribution</Text>
            </TouchableOpacity>
          </View>
          {CHANNEL_DATA.map((channel) => (
            <View
              key={channel.channel}
              style={{
                backgroundColor: colors.background, borderRadius: 14,
                padding: r.isXs ? 12 : 14, marginBottom: 10,
                borderWidth: 1, borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: channel.color, flexShrink: 0 }} />
                  <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }} numberOfLines={1}>
                    {channel.channel}
                  </Text>
                </View>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700", flexShrink: 0 }}>
                  {channel.revenue}
                </Text>
              </View>
              <View style={{ backgroundColor: colors.surface, borderRadius: 4, height: 6, marginBottom: 8, overflow: "hidden" }}>
                <View style={{ backgroundColor: channel.color, borderRadius: 4, height: 6, width: `${channel.share}%` as any }} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>Sessions: {channel.sessions}</Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>
                  ROAS: <Text style={{ color: colors.foreground, fontWeight: "600" }}>{channel.roas}</Text>
                </Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>{channel.share}% share</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Content */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>Top Content</Text>
            <TouchableOpacity
              onPress={() => router.push("/revenue-attribution" as any)}
              activeOpacity={0.7}
              style={{ minHeight: 44, justifyContent: "center", paddingLeft: 8 }}
            >
              <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Full Report</Text>
            </TouchableOpacity>
          </View>
          {TOP_CONTENT.map((content) => (
            <View
              key={content.rank}
              style={{
                backgroundColor: colors.background, borderRadius: 14,
                padding: r.isXs ? 12 : 14, marginBottom: 10,
                borderWidth: 1, borderColor: colors.border,
                flexDirection: "row", alignItems: "center", gap: 12,
              }}
            >
              <View style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: "#7C3AED15", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "700" }}>#{content.rank}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600" }} numberOfLines={2}>
                  {content.title}
                </Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }}>Traffic: {content.traffic}</Text>
              </View>
              <Text style={{ color: "#22C55E", fontSize: r.fontSize.base, fontWeight: "700", flexShrink: 0 }}>
                {content.revenue}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>Deep Analytics</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "Campaign Performance", route: "/campaign-performance", color: "#7C3AED" },
              { label: "Customer Journey", route: "/customer-journey", color: "#0EA5E9" },
              { label: "Revenue Intelligence", route: "/revenue-intelligence", color: "#22C55E" },
              { label: "Audience Intelligence", route: "/audience-intelligence", color: "#F59E0B" },
            ].map((link) => (
              <TouchableOpacity
                key={link.label}
                style={{
                  width: r.statCardWidth,
                  backgroundColor: `${link.color}10`,
                  borderRadius: 12, padding: 14,
                  borderWidth: 1, borderColor: `${link.color}30`,
                  minHeight: 44,
                }}
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
