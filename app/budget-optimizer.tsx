import { FeatureScreen } from "@/components/feature-screen";

export default function BudgetOptimizerScreen() {
  return (
    <FeatureScreen
      title="Budget Optimizer"
      subtitle="AI-powered budget allocation across platforms"
      iconName="dollarsign.circle.fill"
      iconColor="#22C55E"
      stats={[
        { label: "Current Budget", value: "$285/day", change: "Active" },
        { label: "Recommended", value: "$320/day", change: "+12%" },
        { label: "Projected ROAS", value: "4.6x", change: "+0.8" },
        { label: "Revenue Increase", value: "+$8,400", change: "Monthly" },

      ]}
      features={[
        { title: "Smart Budget Allocation", desc: "AI redistributes budget to highest-performing campaigns automatically", icon: "🤖", badge: "AI" },
        { title: "Platform Comparison", desc: "Compare ROI across Facebook, Google, TikTok, and more", icon: "📊" },
        { title: "Budget Forecasting", desc: "Predict revenue outcomes for different budget scenarios", icon: "🔮" },
        { title: "Auto-Scaling Rules", desc: "Set rules to automatically scale winning campaigns", icon: "⚡" },

      ]}
      ctaLabel="Optimize Budget"

    />
  );
}
