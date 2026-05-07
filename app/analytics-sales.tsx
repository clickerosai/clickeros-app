import { FeatureScreen } from "@/components/feature-screen";

export default function AnalyticsSalesScreen() {
  return (
    <FeatureScreen
      title="Sales & Revenue"
      subtitle="Deep-dive into your sales performance"
      iconName="dollarsign.circle.fill"
      iconColor="#22C55E"
      stats={[
        { label: "Total Revenue", value: "$284K", change: "+24%" },
        { label: "Total Orders", value: "3,847", change: "+31%" },
        { label: "Avg. Order Value", value: "$73.80", change: "+8%" },
        { label: "Repeat Rate", value: "42%", change: "+5%" },
      ]}
      features={[
        { title: "Revenue Trends", desc: "Daily, weekly, and monthly revenue charts with trend analysis", icon: "📈" },
        { title: "Product Performance", desc: "See which products drive the most revenue and profit", icon: "🛍️" },
        { title: "Customer Segments", desc: "Revenue breakdown by customer type: new, returning, champion", icon: "👥" },
        { title: "Revenue Forecasting", desc: "AI predicts next month revenue based on current trends", icon: "🔮", badge: "AI" },
      ]}
      ctaLabel="View Full Report"
    />
  );
}
