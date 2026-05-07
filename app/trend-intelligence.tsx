import { FeatureScreen } from "@/components/feature-screen";

export default function TrendIntelligenceScreen() {
  return (
    <FeatureScreen
      title="Trend Intelligence"
      subtitle="Stay ahead of market trends"
      iconName="chart.xyaxis.line"
      iconColor="#F59E0B"
      stats={[
        { label: "Trending Topics", value: "124", change: "This Week" },
        { label: "Opportunities", value: "18", change: "High Value" },
        { label: "Competitor Moves", value: "7", change: "New" },

      ]}
      features={[
        { title: "Real-Time Trend Monitoring", desc: "Track emerging trends across social media, search, and news", icon: "📡" },
        { title: "Competitor Trend Adoption", desc: "See which trends your competitors are capitalizing on", icon: "🕵️" },
        { title: "Content Opportunity Alerts", desc: "Get notified when high-opportunity trends align with your niche", icon: "🔔", badge: "AI" },
        { title: "Trend Lifecycle Analysis", desc: "Understand where each trend is in its lifecycle", icon: "📈" },

      ]}
      ctaLabel="Explore Trends"

    />
  );
}
