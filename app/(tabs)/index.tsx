import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const STATS = [
  { label: "Active Campaigns", value: "12", change: "+3", icon: "megaphone.fill" as const, color: "#7C3AED" },
  { label: "Total Revenue", value: "$48.2K", change: "+18%", icon: "dollarsign.circle.fill" as const, color: "#22C55E" },
  { label: "Avg. ROAS", value: "3.8x", change: "+0.4", icon: "chart.line.uptrend.xyaxis" as const, color: "#F59E0B" },
  { label: "CTR", value: "4.7%", change: "+1.2%", icon: "percent" as const, color: "#06B6D4" },
];

const QUICK_ACTIONS = [
  { label: "New Campaign", icon: "plus.circle.fill" as const, route: "/campaigns", color: "#7C3AED" },
  { label: "AI Creator", icon: "wand.and.stars" as const, route: "/creator", color: "#9333EA" },
  { label: "SEO Insights", icon: "chart.line.uptrend.xyaxis" as const, route: "/seo-insights", color: "#0EA5E9" },
  { label: "Reports", icon: "doc.text.fill" as const, route: "/reports", color: "#22C55E" },
];

const RECENT_CAMPAIGNS = [
  { id: "1", name: "Summer Sale FB", platform: "Facebook", status: "Active", roas: "4.2x", spend: "$1,240", color: "#1877F2" },
  { id: "2", name: "Product Launch IG", platform: "Instagram", status: "Active", roas: "3.8x", spend: "$890", color: "#E1306C" },
  { id: "3", name: "Google Search Q2", platform: "Google", status: "Paused", roas: "2.9x", spend: "$2,100", color: "#4285F4" },
  { id: "4", name: "TikTok Awareness", platform: "TikTok", status: "Active", roas: "5.1x", spend: "$560", color: "#000000" },
];

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View style={{ backgroundColor: "#7C3AED", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "500" }}>Welcome back 👋</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "700", marginTop: 2 }}>Clickeros Dashboard</Text>
            </View>
            <TouchableOpacity
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}
              onPress={() => router.push("/settings" as any)}
            >
              <IconSymbol name="bell.fill" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 8 }}>
            Turn Content Into Revenue — Automatically
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: 16, marginTop: -16 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {STATS.map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  minWidth: "45%",
                  backgroundColor: colors.background,
                  borderRadius: 16,
                  padding: 14,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${stat.color}15`, alignItems: "center", justifyContent: "center" }}>
                    <IconSymbol name={stat.icon} size={18} color={stat.color} />
                  </View>
                  <View style={{ backgroundColor: "#DCFCE7", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ color: "#16A34A", fontSize: 11, fontWeight: "600" }}>{stat.change}</Text>
                  </View>
                </View>
                <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "700", marginTop: 10 }}>{stat.value}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700", marginBottom: 12 }}>Quick Actions</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${action.color}15`, alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                  <IconSymbol name={action.icon} size={20} color={action.color} />
                </View>
                <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: "600", textAlign: "center" }}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Insight Banner */}
        <View style={{ marginHorizontal: 16, marginTop: 20, borderRadius: 16, overflow: "hidden" }}>
          <View style={{ backgroundColor: "#7C3AED", padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="sparkles" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>AI Strategy Copilot</Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>3 new growth opportunities detected this week</Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}
              onPress={() => router.push("/strategy-copilot" as any)}
              activeOpacity={0.7}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Campaigns */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700" }}>Recent Campaigns</Text>
            <TouchableOpacity onPress={() => router.push("/campaigns" as any)} activeOpacity={0.7}>
              <Text style={{ color: "#7C3AED", fontSize: 13, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          {RECENT_CAMPAIGNS.map((campaign) => (
            <TouchableOpacity
              key={campaign.id}
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
              onPress={() => router.push("/campaigns" as any)}
              activeOpacity={0.7}
            >
              <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: `${campaign.color}15`, alignItems: "center", justifyContent: "center" }}>
                <IconSymbol name="megaphone.fill" size={20} color={campaign.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>{campaign.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{campaign.platform} • Spend: {campaign.spend}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <View style={{
                  backgroundColor: campaign.status === "Active" ? "#DCFCE7" : "#FEF9C3",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  marginBottom: 4,
                }}>
                  <Text style={{ color: campaign.status === "Active" ? "#16A34A" : "#CA8A04", fontSize: 11, fontWeight: "600" }}>{campaign.status}</Text>
                </View>
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700" }}>ROAS {campaign.roas}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Banner */}
        <View style={{ marginHorizontal: 16, marginTop: 20, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", marginBottom: 12 }}>Platform Stats</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {[
              { label: "Users", value: "12K+" },
              { label: "Rating", value: "4.9/5" },
              { label: "Revenue", value: "$2.4M" },
            ].map((stat) => (
              <View key={stat.label} style={{ alignItems: "center" }}>
                <Text style={{ color: "#7C3AED", fontSize: 20, fontWeight: "800" }}>{stat.value}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
