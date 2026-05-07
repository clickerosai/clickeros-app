import { FeatureScreen } from "@/components/feature-screen";

export default function ProfitPilotScreen() {
  return (
    <FeatureScreen
      title="Profit Pilot"
      subtitle="Maximize profit, not just revenue"
      iconName="chart.line.uptrend.xyaxis"
      iconColor="#22C55E"
      stats={[
        { label: "Net Profit", value: "$38.4K", change: "+22%" },
        { label: "Profit ROAS", value: "2.8x", change: "+0.3" },
        { label: "Profit/Customer", value: "$84", change: "+$12" },

      ]}
      features={[
        { title: "Profit-First Attribution", desc: "Track net profit, not just revenue, for every campaign", icon: "💰" },
        { title: "COGS Integration", desc: "Factor in cost of goods sold for accurate profit calculations", icon: "📊" },
        { title: "Profit Forecasting", desc: "AI predicts profit impact of budget changes before you make them", icon: "🔮", badge: "AI" },
        { title: "Margin Optimization", desc: "Identify which products and campaigns have the best margins", icon: "📈" },

      ]}
      ctaLabel="Optimize Profit"

    />
  );
}
