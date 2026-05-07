import { FeatureScreen } from "@/components/feature-screen";

export default function SeoInsightsScreen() {
  return (
    <FeatureScreen
      title="SEO Insights"
      subtitle="Track rankings, keywords, and organic growth"
      iconName="chart.line.uptrend.xyaxis"
      iconColor="#22C55E"
      stats={[
        { label: "Ranking Keywords", value: "847", change: "+124", positive: true },
        { label: "Potential Traffic", value: "42.1K", change: "+18%", positive: true },
        { label: "AI Suggestions", value: "23", change: "New", positive: true },
        { label: "Top Opportunity", value: "#3", change: "Rank", positive: true },

      ]}
      features={[
        { title: "Keyword Gap Analysis", desc: "Find keywords your competitors rank for but you don't", icon: "🔍", badge: "AI" },
        { title: "Competitor Intelligence", desc: "Track competitor rankings and content strategies", icon: "🕵️" },
        { title: "Weekly Content Roadmap", desc: "AI-generated content plan based on opportunities", icon: "📅", badge: "AI" },
        { title: "Ranking Tracker", desc: "Monitor your keyword positions over time", icon: "📈" },

      ]}
      ctaLabel="Analyze My Site"

    />
  );
}
