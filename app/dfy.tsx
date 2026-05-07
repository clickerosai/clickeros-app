import { FeatureScreen } from "@/components/feature-screen";

export default function DfyScreen() {
  return (
    <FeatureScreen
      title="Done-For-You"
      subtitle="Let our team manage your growth"
      iconName="star.fill"
      iconColor="#F59E0B"
      stats={[
        { label: "Managed Accounts", value: "12", change: "Active" },
        { label: "Avg. ROAS", value: "5.2x", change: "Managed" },
        { label: "Time Saved", value: "40hrs", change: "Per Month" },

      ]}
      features={[
        { title: "Full Campaign Management", desc: "Our team handles strategy, creation, and optimization", icon: "👨‍💼" },
        { title: "Weekly Strategy Calls", desc: "Regular calls to review performance and plan next steps", icon: "📞" },
        { title: "Dedicated Account Manager", desc: "A dedicated expert focused on your growth", icon: "🤝" },
        { title: "Guaranteed Results", desc: "Performance guarantees with money-back if targets aren't met", icon: "✅" },

      ]}
      ctaLabel="Get Started"

    />
  );
}
