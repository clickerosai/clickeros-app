import { FeatureScreen } from "@/components/feature-screen";

export default function RevenueIntelligenceScreen() {
  return (
    <FeatureScreen
      title="Revenue Intelligence"
      subtitle="AI-powered revenue insights and forecasting"
      iconName="dollarsign.circle.fill"
      iconColor="#22C55E"
      stats={[
        { label: "Total Revenue", value: "$284K", change: "+24%" },
        { label: "Projected Next Month", value: "$340K", change: "+20%" },
        { label: "Revenue Growth", value: "18%", change: "MoM" },

      ]}
      features={[
        { title: "Revenue Forecasting", desc: "AI predicts next month revenue based on current campaign performance", icon: "🔮", badge: "AI" },
        { title: "CLV Prediction", desc: "Predict customer lifetime value for better acquisition decisions", icon: "💎", badge: "AI" },
        { title: "Revenue Segmentation", desc: "Break down revenue by channel, campaign, content, and audience", icon: "📊" },
        { title: "Profit Analysis", desc: "Net profit, profit ROAS, and profit per customer metrics", icon: "💰" },

      ]}
      ctaLabel="View Revenue"

    />
  );
}
