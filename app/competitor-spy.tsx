import { FeatureScreen } from "@/components/feature-screen";

export default function CompetitorSpyScreen() {
  return (
    <FeatureScreen
      title="Competitor Spy"
      subtitle="Analyze competitor strategies and ads"
      iconName="eye.fill"
      iconColor="#0EA5E9"
      stats={[
        { label: "Competitors Tracked", value: "8", change: "Active" },
        { label: "New Ads Found", value: "47", change: "This Week" },
        { label: "Keyword Gaps", value: "124", change: "Opportunities" },

      ]}
      features={[
        { title: "Ad Library", desc: "See all active ads your competitors are running across platforms", icon: "📚" },
        { title: "Keyword Intelligence", desc: "Discover keywords competitors rank for that you're missing", icon: "🔑" },
        { title: "Budget Estimation", desc: "AI estimates competitor ad spend and budget allocation", icon: "💸", badge: "AI" },
        { title: "Creative Analysis", desc: "Identify winning ad formats and messaging strategies", icon: "🎨" },

      ]}
      ctaLabel="Analyze Competitors"

    />
  );
}
