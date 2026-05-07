import { FeatureScreen } from "@/components/feature-screen";

export default function MarketingScoreScreen() {
  return (
    <FeatureScreen
      title="Marketing Score"
      subtitle="Your brand health score"
      iconName="trophy.fill"
      iconColor="#F59E0B"
      stats={[
        { label: "Overall Score", value: "78/100", change: "Good" },
        { label: "SEO Score", value: "82", change: "+4pts" },
        { label: "Ad Score", value: "74", change: "+8pts" },

      ]}
      features={[
        { title: "Overall Marketing Health", desc: "Composite score across SEO, ads, content, and social", icon: "🏆" },
        { title: "Benchmark Comparison", desc: "See how you compare to industry averages and competitors", icon: "📊" },
        { title: "Improvement Roadmap", desc: "Prioritized list of actions to improve your score", icon: "🗺️", badge: "AI" },
        { title: "Weekly Score Updates", desc: "Track your progress with weekly score updates and insights", icon: "📈" },

      ]}
      ctaLabel="Improve Score"

    />
  );
}
