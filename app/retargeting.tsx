import { FeatureScreen } from "@/components/feature-screen";

export default function RetargetingScreen() {
  return (
    <FeatureScreen
      title="Retargeting"
      subtitle="Re-engage visitors who didn't convert"
      iconName="repeat"
      iconColor="#14B8A6"
      stats={[
        { label: "Audience Size", value: "84K", change: "Retargetable" },
        { label: "Recovered Sales", value: "38%", change: "Of Abandoners" },
        { label: "Better ROAS", value: "3x", change: "vs Cold" },

      ]}
      features={[
        { title: "Cart Abandonment Recovery", desc: "Automatically retarget users who abandoned their cart", icon: "🛒" },
        { title: "Dynamic Product Ads", desc: "Show personalized ads based on products viewed", icon: "🎯", badge: "AI" },
        { title: "Cross-Platform Retargeting", desc: "Reach users across Facebook, Google, TikTok, and more", icon: "🌐" },
        { title: "Frequency Management", desc: "Prevent ad fatigue with smart frequency capping", icon: "⚡", badge: "AI" },

      ]}
      ctaLabel="Launch Retargeting"

    />
  );
}
