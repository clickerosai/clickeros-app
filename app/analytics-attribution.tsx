import { FeatureScreen } from "@/components/feature-screen";

export default function AnalyticsAttributionScreen() {
  return (
    <FeatureScreen
      title="Attribution Analytics"
      subtitle="Track revenue across all marketing channels"
      iconName="dollarsign.circle.fill"
      iconColor="#22C55E"
      stats={[
        { label: "Revenue Attributed", value: "$284K", change: "+24%" },
        { label: "Attribution Accuracy", value: "94%", change: "AI Model" },
        { label: "Platforms Tracked", value: "8", change: "Connected" },
        { label: "Data Refresh", value: "15min", change: "Real-time" },
      ]}
      features={[
        { title: "Multi-Channel Attribution", desc: "See how each channel contributes to revenue across the full funnel", icon: "📊" },
        { title: "First/Last Click Models", desc: "Compare attribution models to understand true channel value", icon: "🔄" },
        { title: "Data-Driven Attribution", desc: "AI-powered attribution using ML-weighted touchpoint scoring", icon: "🤖", badge: "AI" },
        { title: "Revenue Tracking", desc: "Connect ad spend directly to revenue for accurate ROAS calculation", icon: "💰" },
      ]}
      ctaLabel="View Attribution Report"
    />
  );
}
