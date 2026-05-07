import { FeatureScreen } from "@/components/feature-screen";

export default function RevenueAttributionScreen() {
  return (
    <FeatureScreen
      title="Revenue Attribution"
      subtitle="Track what content makes money"
      iconName="dollarsign.circle.fill"
      iconColor="#22C55E"
      stats={[
        { label: "Total Revenue Tracked", value: "$284K", change: "+24%" },
        { label: "Revenue Per Click", value: "$4.82", change: "+18%" },
        { label: "Avg. ROAS Improvement", value: "47%", change: "+12%" },
        { label: "Reduction in CAC", value: "38%", change: "-38%" },

      ]}
      features={[
        { title: "Keyword-to-Revenue Mapping", desc: "See exactly which keywords drive revenue, not just traffic", icon: "🔑", badge: "AI" },
        { title: "ROI Per Content Piece", desc: "Know the exact dollar value of every blog post and landing page", icon: "📊" },
        { title: "Full Funnel Attribution", desc: "Track the complete journey from first click to final purchase", icon: "🔄" },
        { title: "Multi-Touch Attribution", desc: "AI determines contribution of each touchpoint in the customer journey", icon: "🤖", badge: "AI" },

      ]}
      ctaLabel="View Attribution"

    />
  );
}
