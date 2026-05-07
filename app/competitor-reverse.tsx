import { FeatureScreen } from "@/components/feature-screen";

export default function CompetitorReverseScreen() {
  return (
    <FeatureScreen
      title="Competitor Reverse"
      subtitle="Reverse-engineer competitor strategies"
      iconName="arrow.triangle.2.circlepath"
      iconColor="#6366F1"
      stats={[
        { label: "Competitors Analyzed", value: "12", change: "Total" },
        { label: "Strategies Decoded", value: "47", change: "This Month" },
        { label: "Opportunities", value: "18", change: "Found" },

      ]}
      features={[
        { title: "Ad Strategy Decoding", desc: "Understand the exact targeting and messaging competitors use", icon: "🕵️" },
        { title: "Funnel Mapping", desc: "Map out competitor sales funnels from ad to landing page", icon: "🗺️" },
        { title: "Budget Estimation", desc: "AI estimates competitor monthly ad spend", icon: "💰", badge: "AI" },
        { title: "Content Strategy Analysis", desc: "Identify what content drives the most traffic for competitors", icon: "📊" },

      ]}
      ctaLabel="Analyze Competitor"

    />
  );
}
