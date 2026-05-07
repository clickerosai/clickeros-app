import { FeatureScreen } from "@/components/feature-screen";

export default function OpportunityScannerScreen() {
  return (
    <FeatureScreen
      title="Opportunity Scanner"
      subtitle="Find untapped growth opportunities"
      iconName="magnifyingglass"
      iconColor="#F59E0B"
      stats={[
        { label: "Opportunities Found", value: "47", change: "This Week" },
        { label: "High Value", value: "12", change: "Urgent" },
        { label: "Est. Revenue", value: "$28K", change: "Potential" },

      ]}
      features={[
        { title: "Keyword Gap Scanner", desc: "Find high-value keywords you're not targeting yet", icon: "🔍" },
        { title: "Competitor Weakness Finder", desc: "Identify gaps in competitor strategies you can exploit", icon: "🕵️" },
        { title: "Platform Opportunity Alerts", desc: "Get notified of underpriced ad inventory and trends", icon: "🔔", badge: "AI" },
        { title: "Revenue Opportunity Scoring", desc: "Each opportunity ranked by estimated revenue impact", icon: "💰", badge: "AI" },

      ]}
      ctaLabel="Scan Opportunities"

    />
  );
}
