import { FeatureScreen } from "@/components/feature-screen";

export default function CustomerJourneyScreen() {
  return (
    <FeatureScreen
      title="Customer Journey"
      subtitle="Visualize the full attribution funnel"
      iconName="chart.line.uptrend.xyaxis"
      iconColor="#0EA5E9"
      stats={[
        { label: "Total Touchpoints", value: "8.4K", change: "Tracked" },
        { label: "Avg. Journey Length", value: "4.2", change: "Touchpoints" },
        { label: "Attribution Accuracy", value: "94%", change: "AI Scored" },
        { label: "Conversion Rate", value: "3.8%", change: "+0.8%" },
      ]}
      features={[
        { title: "Multi-Touch Attribution", desc: "See every touchpoint in the customer journey from first click to purchase", icon: "🔄" },
        { title: "Channel Contribution", desc: "Understand how each channel contributes to final conversions", icon: "📊" },
        { title: "Journey Visualization", desc: "Interactive funnel showing the most common paths to conversion", icon: "🗺️" },
        { title: "AI Attribution Modeling", desc: "AI weights each touchpoint by its true contribution to revenue", icon: "🤖", badge: "AI" },
      ]}
      ctaLabel="View Full Journey"
    />
  );
}
