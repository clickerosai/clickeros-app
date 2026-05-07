import { FeatureScreen } from "@/components/feature-screen";

export default function CampaignPerformanceScreen() {
  return (
    <FeatureScreen
      title="Campaign Performance"
      subtitle="Deep-dive into your campaign metrics"
      iconName="chart.bar.fill"
      iconColor="#7C3AED"
      stats={[
        { label: "Total ROAS", value: "3.8x", change: "+0.4", positive: true },
        { label: "Total Spend", value: "$6,570", change: "+12%" },
        { label: "Conversions", value: "847", change: "+31%", positive: true },
        { label: "Avg. CPA", value: "$7.76", change: "-8%", positive: true },

      ]}
      features={[
        { title: "ROAS Tracking", desc: "Monitor return on ad spend across all campaigns and platforms", icon: "📈" },
        { title: "CTR Analysis", desc: "Click-through rate trends and benchmarks by platform", icon: "🖱️" },
        { title: "Budget Efficiency", desc: "See which campaigns deliver the best results per dollar", icon: "💰" },
        { title: "AI Optimization", desc: "Automated suggestions to improve underperforming campaigns", icon: "🤖", badge: "AI" },

      ]}
      ctaLabel="Optimize Campaigns"

    />
  );
}
