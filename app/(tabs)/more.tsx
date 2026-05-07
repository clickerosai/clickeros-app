import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const NAV_SECTIONS = [
  {
    title: "Analytics",
    color: "#7C3AED",
    items: [
      { label: "Campaign Performance", route: "/campaign-performance", icon: "chart.bar.fill" as const, desc: "ROAS, CTR, CPA metrics" },
      { label: "Customer Journey", route: "/customer-journey", icon: "chart.line.uptrend.xyaxis" as const, desc: "Full attribution funnel" },
      { label: "Audience Intelligence", route: "/audience-intelligence", icon: "person.2.fill" as const, desc: "Segment insights" },
      { label: "Creative Performance", route: "/creative-performance", icon: "photo.fill" as const, desc: "Ad creative scoring" },
      { label: "Trend Intelligence", route: "/trend-intelligence", icon: "chart.xyaxis.line" as const, desc: "Market trend data" },
      { label: "Revenue Intelligence", route: "/revenue-intelligence", icon: "dollarsign.circle.fill" as const, desc: "Revenue breakdown" },
    ],
  },
  {
    title: "Intelligence",
    color: "#0EA5E9",
    items: [
      { label: "Trend Radar", route: "/trend-radar", icon: "antenna.radiowaves.left.and.right" as const, desc: "Emerging trends" },
      { label: "Audience Finder", route: "/audience-finder", icon: "magnifyingglass" as const, desc: "Find new audiences" },
      { label: "Competitor Spy", route: "/competitor-spy", icon: "eye.fill" as const, desc: "Competitor analysis" },
    ],
  },
  {
    title: "Tools",
    color: "#22C55E",
    items: [
      { label: "Creative Studio", route: "/creative-studio", icon: "photo.fill" as const, desc: "Build ad creatives" },
      { label: "Retargeting", route: "/retargeting", icon: "repeat" as const, desc: "Retargeting campaigns" },
      { label: "Traffic Analytics", route: "/analytics", icon: "chart.bar.fill" as const, desc: "Traffic overview" },
    ],
  },
  {
    title: "AI Features",
    color: "#F59E0B",
    items: [
      { label: "Creative Lab", route: "/creative-lab", icon: "sparkles" as const, desc: "A/B test creatives" },
      { label: "Budget Optimizer", route: "/budget-optimizer", icon: "dollarsign.circle.fill" as const, desc: "AI budget allocation" },
      { label: "Opportunity Scanner", route: "/opportunity-scanner", icon: "magnifyingglass" as const, desc: "Growth opportunities" },
      { label: "Command Center", route: "/command-center", icon: "cpu.fill" as const, desc: "Automation hub" },
      { label: "Profit Pilot", route: "/profit-pilot", icon: "chart.line.uptrend.xyaxis" as const, desc: "Profit optimization" },
      { label: "Retargeting Engine", route: "/retargeting-engine", icon: "repeat" as const, desc: "Advanced retargeting" },
    ],
  },
  {
    title: "Growth Tools",
    color: "#EC4899",
    items: [
      { label: "AI Search Visibility", route: "/ai-search", icon: "magnifyingglass" as const, desc: "LLM visibility tracker" },
      { label: "Revenue Attribution", route: "/revenue-attribution", icon: "dollarsign.circle.fill" as const, desc: "Attribution dashboard" },
      { label: "Content Distribution", route: "/content-distribution", icon: "square.and.arrow.up" as const, desc: "Multi-channel distribution" },
      { label: "AI Video Generator", route: "/video-generator", icon: "video.fill" as const, desc: "AI video creation" },
      { label: "Strategy Copilot", route: "/strategy-copilot", icon: "lightbulb.fill" as const, desc: "Weekly AI action plan" },
    ],
  },
  {
    title: "Advanced",
    color: "#6366F1",
    items: [
      { label: "A/B Testing", route: "/ab-testing", icon: "slider.horizontal.3" as const, desc: "Split testing" },
      { label: "Competitor Reverse", route: "/competitor-reverse", icon: "arrow.triangle.2.circlepath" as const, desc: "Reverse-engineer competitors" },
      { label: "Programmatic SEO", route: "/programmatic-seo", icon: "doc.text.fill" as const, desc: "Bulk page generation" },
      { label: "Agency Mode", route: "/agency", icon: "building.2.fill" as const, desc: "Multi-client management" },
      { label: "Integrations", route: "/integrations", icon: "link" as const, desc: "Platform connections" },
      { label: "Done-For-You", route: "/dfy", icon: "star.fill" as const, desc: "Managed service" },
      { label: "Growth OS", route: "/growth-os", icon: "bolt.fill" as const, desc: "Full growth system" },
    ],
  },
  {
    title: "Community",
    color: "#14B8A6",
    items: [
      { label: "Marketing Reports", route: "/reports", icon: "doc.text.fill" as const, desc: "PDF report generation" },
      { label: "Campaign Templates", route: "/templates", icon: "bookmark.fill" as const, desc: "Pre-built templates" },
      { label: "Marketing Score", route: "/marketing-score", icon: "trophy.fill" as const, desc: "Brand health score" },
      { label: "SEO Insights", route: "/seo-insights", icon: "chart.line.uptrend.xyaxis" as const, desc: "SEO dashboard" },
      { label: "Support", route: "/support-dashboard", icon: "questionmark.circle.fill" as const, desc: "Help & support" },
    ],
  },
  {
    title: "Account",
    color: "#64748B",
    items: [
      { label: "Settings", route: "/settings", icon: "gear" as const, desc: "Account settings" },
      { label: "Billing & Plans", route: "/billing", icon: "creditcard.fill" as const, desc: "Subscription management" },
      { label: "Pricing", route: "/pricing", icon: "tag.fill" as const, desc: "View all plans" },
    ],
  },
];

export default function MoreScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "700" }}>All Features</Text>
          <Text style={{ color: colors.muted, fontSize: 14, marginTop: 4 }}>Explore all Clickeros AI tools</Text>
        </View>

        {NAV_SECTIONS.map((section) => (
          <View key={section.title} style={{ paddingHorizontal: 16, marginTop: 20 }}>
            {/* Section Header */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <View style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: section.color }} />
              <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700" }}>{section.title}</Text>
            </View>

            {/* Section Items */}
            <View style={{ backgroundColor: colors.background, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    borderTopWidth: idx > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                    gap: 12,
                  }}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${section.color}15`, alignItems: "center", justifyContent: "center" }}>
                    <IconSymbol name={item.icon} size={18} color={section.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>{item.label}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 1 }}>{item.desc}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
