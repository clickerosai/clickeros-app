import { FeatureScreen } from "@/components/feature-screen";

export default function CreativePerformanceScreen() {
  return (
    <FeatureScreen
      title="Creative Performance"
      subtitle="Score and optimize your ad creatives"
      iconName="photo.fill"
      iconColor="#EC4899"
      stats={[
        { label: "Active Ads", value: "47", change: "Running" },
        { label: "Avg. CTR", value: "4.7%", change: "+1.2%" },
        { label: "AI Score Avg.", value: "82", change: "+8pts" },

      ]}
      features={[
        { title: "Creative Scoring", desc: "AI rates each ad on hook strength, messaging, and visual appeal", icon: "⭐", badge: "AI" },
        { title: "A/B Test Results", desc: "See which creative variations perform best across platforms", icon: "🔬" },
        { title: "Hook Analysis", desc: "Identify which opening lines capture attention most effectively", icon: "🎣" },
        { title: "Format Performance", desc: "Compare video, image, carousel, and story ad performance", icon: "📱" },

      ]}
      ctaLabel="Optimize Creatives"

    />
  );
}
