import { FeatureScreen } from "@/components/feature-screen";

export default function CommandCenterScreen() {
  return (
    <FeatureScreen
      title="Command Center"
      subtitle="Automate your marketing operations"
      iconName="cpu.fill"
      iconColor="#6366F1"
      stats={[
        { label: "Active Rules", value: "12", change: "Running" },
        { label: "Actions Triggered", value: "847", change: "This Month" },
        { label: "Budget Saved", value: "$2.4K", change: "Auto-Optimized" },

      ]}
      features={[
        { title: "Automated Rules", desc: "Set rules to automatically pause, scale, or adjust campaigns", icon: "⚙️" },
        { title: "Smart Scaling", desc: "AI automatically scales winning campaigns when ROAS targets are met", icon: "🤖", badge: "AI" },
        { title: "Budget Automation", desc: "Auto-redistribute budget from underperformers to winners", icon: "💰", badge: "AI" },
        { title: "Alert System", desc: "Get notified of significant changes in campaign performance", icon: "🔔" },

      ]}
      ctaLabel="Configure Automation"

    />
  );
}
