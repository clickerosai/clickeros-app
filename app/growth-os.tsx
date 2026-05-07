import { FeatureScreen } from "@/components/feature-screen";

export default function GrowthOsScreen() {
  return (
    <FeatureScreen
      title="Growth OS"
      subtitle="Your complete AI growth operating system"
      iconName="bolt.fill"
      iconColor="#7C3AED"
      stats={[
        { label: "Growth Score", value: "87/100", change: "Excellent" },
        { label: "Active Automations", value: "24", change: "Running" },
        { label: "Revenue Impact", value: "$48K", change: "This Month" },

      ]}
      features={[
        { title: "Unified Growth Dashboard", desc: "All your growth metrics in one intelligent dashboard", icon: "📊" },
        { title: "AI Growth Brain", desc: "Central AI that coordinates all your marketing activities", icon: "🧠", badge: "AI" },
        { title: "Automated Growth Loops", desc: "Set up self-improving growth systems that run on autopilot", icon: "🔄", badge: "AI" },
        { title: "Growth Playbooks", desc: "Step-by-step playbooks for every growth stage", icon: "📚" },

      ]}
      ctaLabel="Activate Growth OS"

    />
  );
}
