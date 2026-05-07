import { FeatureScreen } from "@/components/feature-screen";

export default function AbTestingScreen() {
  return (
    <FeatureScreen
      title="A/B Testing"
      subtitle="Scientific split testing for campaigns"
      iconName="slider.horizontal.3"
      iconColor="#7C3AED"
      stats={[
        { label: "Active Tests", value: "8", change: "Running" },
        { label: "Tests Completed", value: "47", change: "Total" },
        { label: "Avg. Lift", value: "+34%", change: "CTR" },

      ]}
      features={[
        { title: "Campaign A/B Tests", desc: "Test different campaign structures, budgets, and targeting", icon: "🔬" },
        { title: "Creative Testing", desc: "Compare ad images, videos, headlines, and copy", icon: "🎨" },
        { title: "Audience Testing", desc: "Test different audience segments against each other", icon: "👥" },
        { title: "Statistical Analysis", desc: "Automated significance testing with confidence intervals", icon: "📊", badge: "AI" },

      ]}
      ctaLabel="Create Test"

    />
  );
}
