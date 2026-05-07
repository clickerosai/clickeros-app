import { FeatureScreen } from "@/components/feature-screen";

export default function RetargetingEngineScreen() {
  return (
    <FeatureScreen
      title="Retargeting Engine"
      subtitle="Advanced AI-powered retargeting"
      iconName="repeat"
      iconColor="#14B8A6"
      stats={[
        { label: "Segments", value: "18", change: "Active" },
        { label: "Conversion Rate", value: "8.4%", change: "+3.2%" },
        { label: "Lower CPA", value: "47%", change: "vs Prospecting" },

      ]}
      features={[
        { title: "Predictive Retargeting", desc: "AI predicts which visitors are most likely to convert", icon: "🤖", badge: "AI" },
        { title: "Sequential Messaging", desc: "Show different ads based on where users are in the funnel", icon: "🔄" },
        { title: "Cross-Device Tracking", desc: "Follow users across devices for consistent retargeting", icon: "📱" },
        { title: "Suppression Lists", desc: "Automatically exclude recent purchasers from retargeting", icon: "🚫" },

      ]}
      ctaLabel="Configure Engine"

    />
  );
}
