import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
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
  const [activeRange, setActiveRange] = useState("30D");

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "700", marginBottom: 12 }}>Analytics</Text>
          {/* Time Range Selector */}
          <View style={{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 10, padding: 3, gap: 2 }}>
            {TIME_RANGES.map((range) => (
              <TouchableOpacity
                key={range}
                style={{
                  flex: 1,
                  paddingVertical: 7,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor: activeRange === range ? "#7C3AED" : "transparent",
                }}
                onPress={() => setActiveRange(range)}
                activeOpacity={0.7}
              >
                <Text style={{ color: activeRange === range ? "#FFFFFF" : colors.muted, fontSize: 13, fontWeight: "600" }}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {METRICS.map((metric) => (
              <View
                key={metric.label}
                style={{
                  width: "47%",
                  backgroundColor: colors.background,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${metric.color}15`, alignItems: "center", justifyContent: "center" }}>
                    <IconSymbol name={metric.icon} size={16} color={metric.color} />
                  </View>
                  <View style={{ backgroundColor: metric.positive ? "#DCFCE7" : "#FEE2E2", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ color: metric.positive ? "#16A34A" : "#DC2626", fontSize: 11, fontWeight: "600" }}>{metric.change}</Text>
                  </View>
                </View>
                <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "700" }}>{metric.value}</Text>
                <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Revenue Chart Placeholder */}
        <View style={{ marginHorizontal: 16, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700" }}>Revenue Trend</Text>
            <TouchableOpacity onPress={() => router.push("/analytics-sales" as any)} activeOpacity={0.7}>
              <Text style={{ color: "#7C3AED", fontSize: 13, fontWeight: "600" }}>Details</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, height: 160, justifyContent: "flex-end" }}>
            {/* Simple bar chart visualization */}
            <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 100 }}>
              {[40, 65, 55, 80, 70, 90, 85, 95, 75, 88, 92, 100, 87, 96].map((height, idx) => (
                <View
                  key={idx}
                  style={{
                    flex: 1,
                    marginHorizontal: 2,
                    height: `${height}%`,
                    backgroundColor: idx >= 10 ? "#7C3AED" : "#7C3AED40",
                    borderRadius: 4,
                  }}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={{ color: colors.muted, fontSize: 10 }}>Apr 1</Text>
              <Text style={{ color: colors.muted, fontSize: 10 }}>Apr 15</Text>
              <Text style={{ color: colors.muted, fontSize: 10 }}>Apr 30</Text>
            </View>
          </View>
        </View>

        {/* Channel Breakdown */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700" }}>Channel Breakdown</Text>
            <TouchableOpacity onPress={() => router.push("/analytics-attribution" as any)} activeOpacity={0.7}>
              <Text style={{ color: "#7C3AED", fontSize: 13, fontWeight: "600" }}>Attribution</Text>
            </TouchableOpacity>
          </View>
          {CHANNEL_DATA.map((channel) => (
            <View
              key={channel.channel}
              style={{
                backgroundColor: colors.background,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: channel.color }} />
                  <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>{channel.channel}</Text>
                </View>
                <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{channel.revenue}</Text>
              </View>
              {/* Progress Bar */}
              <View style={{ backgroundColor: colors.surface, borderRadius: 4, height: 6, marginBottom: 8 }}>
                <View style={{ backgroundColor: channel.color, borderRadius: 4, height: 6, width: `${channel.share}%` }} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Sessions: {channel.sessions}</Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>ROAS: <Text style={{ color: colors.foreground, fontWeight: "600" }}>{channel.roas}</Text></Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>{channel.share}% share</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Content */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700" }}>Top Content by Revenue</Text>
            <TouchableOpacity onPress={() => router.push("/revenue-attribution" as any)} activeOpacity={0.7}>
              <Text style={{ color: "#7C3AED", fontSize: 13, fontWeight: "600" }}>Full Report</Text>
            </TouchableOpacity>
          </View>
          {TOP_CONTENT.map((content) => (
            <View
              key={content.rank}
              style={{
                backgroundColor: colors.background,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#7C3AED15", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#7C3AED", fontSize: 14, fontWeight: "700" }}>#{content.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }} numberOfLines={2}>{content.title}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Traffic: {content.traffic}</Text>
              </View>
              <Text style={{ color: "#22C55E", fontSize: 14, fontWeight: "700" }}>{content.revenue}</Text>
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700", marginBottom: 12 }}>Deep Analytics</Text>
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
                  width: "47%",
                  backgroundColor: `${link.color}10`,
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: `${link.color}30`,
                }}
                onPress={() => router.push(link.route as any)}
                activeOpacity={0.7}
              >
                <Text style={{ color: link.color, fontSize: 13, fontWeight: "600" }}>{link.label}</Text>
                <IconSymbol name="chevron.right" size={14} color={link.color} style={{ marginTop: 4 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

