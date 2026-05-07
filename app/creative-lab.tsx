import { FeatureScreen } from "@/components/feature-screen";

export default function CreativeLabScreen() {
  return (
    <FeatureScreen
      title="Creative Lab"
      subtitle="AI-powered A/B testing for creatives"
      iconName="sparkles"
      iconColor="#7C3AED"
      stats={[
        { label: "Active Tests", value: "8", change: "Running" },
        { label: "Winner Found", value: "5", change: "This Month" },
        { label: "Avg. CTR Lift", value: "+34%", change: "From Tests" },

      ]}
      features={[
        { title: "Automated A/B Testing", desc: "AI creates and tests multiple creative variations automatically", icon: "🤖", badge: "AI" },
        { title: "Multivariate Testing", desc: "Test headlines, images, CTAs, and copy simultaneously", icon: "🔬" },
        { title: "Statistical Significance", desc: "Know when you have a winner with 95% confidence", icon: "📊" },
        { title: "Auto-Scale Winners", desc: "Automatically increase budget for winning creatives", icon: "⚡", badge: "AI" },

      ]}
      ctaLabel="Start A/B Test"

    />
  );
}
