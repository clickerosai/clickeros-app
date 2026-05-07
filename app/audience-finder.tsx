import { FeatureScreen } from "@/components/feature-screen";

export default function AudienceFinderScreen() {
  return (
    <FeatureScreen
      title="Audience Finder"
      subtitle="Discover new high-value audience segments"
      iconName="magnifyingglass"
      iconColor="#0EA5E9"
      stats={[
        { label: "Segments Found", value: "24", change: "New" },
        { label: "Total Reach", value: "8.4M", change: "Available" },
        { label: "Avg. Match Score", value: "91%", change: "AI" },

      ]}
      features={[
        { title: "Interest-Based Targeting", desc: "Find audiences based on interests, behaviors, and demographics", icon: "🎯" },
        { title: "Lookalike Generation", desc: "Create lookalike audiences from your best customers", icon: "👥", badge: "AI" },
        { title: "Cross-Platform Audiences", desc: "Build audiences that work across Facebook, Google, and TikTok", icon: "🌐" },
        { title: "Audience Testing", desc: "Test multiple audience segments simultaneously", icon: "🔬" },

      ]}
      ctaLabel="Find Audiences"

    />
  );
}
