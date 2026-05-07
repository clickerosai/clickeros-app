import { FeatureScreen } from "@/components/feature-screen";

export default function StrategyCopilotScreen() {
  return (
    <FeatureScreen
      title="Strategy Copilot"
      subtitle="Your weekly AI-powered growth action plan"
      iconName="lightbulb.fill"
      iconColor="#F59E0B"
      stats={[
        { label: "Weekly Focus", value: "3 Tasks", change: "This Week" },
        { label: "Keyword Gaps", value: "18", change: "+5 new" },
        { label: "Competitor Insights", value: "7", change: "Updated" },

      ]}
      features={[
        { title: "AI Strategy Copilot", desc: "Get a weekly action plan tailored to your site. Keyword gaps, competitor insights, and the exact content to write.", icon: "🤖", badge: "AI" },
        { title: "Content Roadmap", desc: "Prioritized list of content pieces that will drive the most traffic and revenue", icon: "🗺️" },
        { title: "Competitor Gap Analysis", desc: "See exactly what content your competitors rank for that you're missing", icon: "📊" },
        { title: "Revenue Projections", desc: "AI estimates the revenue impact of each recommended action", icon: "💰" },

      ]}
      ctaLabel="Get My Action Plan"

    />
  );
}
