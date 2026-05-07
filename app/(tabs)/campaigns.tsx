import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const CAMPAIGNS = [
  {
    id: "1",
    name: "Summer Sale — Facebook",
    platform: "Facebook",
    status: "Active",
    budget: "$50/day",
    spend: "$1,240",
    roas: "4.2x",
    ctr: "5.1%",
    impressions: "48.2K",
    color: "#1877F2",
  },
  {
    id: "2",
    name: "Product Launch — Instagram",
    platform: "Instagram",
    status: "Active",
    budget: "$30/day",
    spend: "$890",
    roas: "3.8x",
    ctr: "4.7%",
    impressions: "32.1K",
    color: "#E1306C",
  },
  {
    id: "3",
    name: "Google Search Q2",
    platform: "Google",
    status: "Paused",
    budget: "$80/day",
    spend: "$2,100",
    roas: "2.9x",
    ctr: "3.2%",
    impressions: "91.4K",
    color: "#4285F4",
  },
  {
    id: "4",
    name: "TikTok Brand Awareness",
    platform: "TikTok",
    status: "Active",
    budget: "$25/day",
    spend: "$560",
    roas: "5.1x",
    ctr: "6.8%",
    impressions: "124.7K",
    color: "#010101",
  },
  {
    id: "5",
    name: "YouTube Pre-Roll",
    platform: "YouTube",
    status: "Scaling",
    budget: "$60/day",
    spend: "$1,780",
    roas: "6.2x",
    ctr: "7.3%",
    impressions: "87.3K",
    color: "#FF0000",
  },
  {
    id: "6",
    name: "Retargeting — All Platforms",
    platform: "Multi",
    status: "Active",
    budget: "$40/day",
    spend: "$980",
    roas: "8.4x",
    ctr: "9.1%",
    impressions: "22.6K",
    color: "#7C3AED",
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Active: { bg: "#DCFCE7", text: "#16A34A" },
  Paused: { bg: "#FEF9C3", text: "#CA8A04" },
  Scaling: { bg: "#EDE9FE", text: "#7C3AED" },
  Stopped: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function CampaignsScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "700" }}>Campaign Manager</Text>
          <TouchableOpacity
            style={{ backgroundColor: "#7C3AED", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 6 }}
            onPress={() => router.push("/creator" as any)}
            activeOpacity={0.8}
          >
            <IconSymbol name="plus" size={16} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600" }}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Row */}
        <View style={{ flexDirection: "row", gap: 16, marginTop: 12 }}>
          {[
            { label: "Active", value: "4", color: "#22C55E" },
            { label: "Paused", value: "1", color: "#F59E0B" },
            { label: "Scaling", value: "1", color: "#7C3AED" },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
              <Text style={{ color: colors.muted, fontSize: 13 }}>
                <Text style={{ color: colors.foreground, fontWeight: "600" }}>{item.value}</Text> {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={CAMPAIGNS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: colors.background,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
            activeOpacity={0.7}
          >
            {/* Campaign Header */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${item.color}15`, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                <IconSymbol name="megaphone.fill" size={20} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }} numberOfLines={1}>{item.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{item.platform} • Budget: {item.budget}</Text>
              </View>
              <View style={{
                backgroundColor: STATUS_COLORS[item.status]?.bg || "#F3F4F6",
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}>
                <Text style={{ color: STATUS_COLORS[item.status]?.text || "#6B7280", fontSize: 11, fontWeight: "600" }}>{item.status}</Text>
              </View>
            </View>

            {/* Metrics Row */}
            <View style={{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 10, padding: 10, gap: 0 }}>
              {[
                { label: "ROAS", value: item.roas },
                { label: "CTR", value: item.ctr },
                { label: "Spend", value: item.spend },
                { label: "Impressions", value: item.impressions },
              ].map((metric, idx) => (
                <View key={metric.label} style={{ flex: 1, alignItems: "center", borderLeftWidth: idx > 0 ? 1 : 0, borderLeftColor: colors.border }}>
                  <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{metric.value}</Text>
                  <Text style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}>{metric.label}</Text>
                </View>
              ))}
            </View>

            {/* Action Row */}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: "#7C3AED15", borderRadius: 8, paddingVertical: 8, alignItems: "center" }}
                activeOpacity={0.7}
              >
                <Text style={{ color: "#7C3AED", fontSize: 12, fontWeight: "600" }}>Optimize</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 8, paddingVertical: 8, alignItems: "center", borderWidth: 1, borderColor: colors.border }}
                activeOpacity={0.7}
              >
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600" }}>
                  {item.status === "Active" ? "Pause" : "Resume"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: colors.surface, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, alignItems: "center", borderWidth: 1, borderColor: colors.border }}
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
