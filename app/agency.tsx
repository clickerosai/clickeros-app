import { FeatureScreen } from "@/components/feature-screen";

export default function AgencyScreen() {
  return (
    <FeatureScreen
      title="Agency Mode"
      subtitle="Manage unlimited client accounts"
      iconName="building.2.fill"
      iconColor="#6366F1"
      stats={[
        { label: "Client Accounts", value: "12", change: "Active" },
        { label: "Total Revenue", value: "$284K", change: "Managed" },
        { label: "Team Members", value: "8", change: "Users" },

      ]}
      features={[
        { title: "Client Management", desc: "Manage unlimited client accounts from a single dashboard", icon: "👥" },
        { title: "White-label Reports", desc: "Branded PDF reports with your agency logo in one click", icon: "📄", badge: "Pro" },
        { title: "Team Roles", desc: "Granular permission controls for team members", icon: "🔐" },
        { title: "Auto Updates", desc: "Scheduled performance reports sent to clients automatically", icon: "📊" },

      ]}
      ctaLabel="Upgrade to Agency"

    />
  );
}
