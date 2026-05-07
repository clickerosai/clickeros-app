import { FeatureScreen } from "@/components/feature-screen";

export default function SettingsScreen() {
  return (
    <FeatureScreen
      title="Settings"
      subtitle="Manage your account and preferences"
      iconName="gear"
      iconColor="#64748B"
      stats={[

      ]}
      features={[
        { title: "Profile", desc: "Update your name, email, and profile photo", icon: "👤" },
        { title: "Notifications", desc: "Configure email and push notification preferences", icon: "🔔" },
        { title: "Security", desc: "Password, two-factor authentication, and sessions", icon: "🔒" },
        { title: "Connected Accounts", desc: "Manage Facebook, Google, TikTok, and other integrations", icon: "🔗" },
        { title: "Team Members", desc: "Invite and manage team access", icon: "👥" },
        { title: "API Access", desc: "Generate and manage API keys", icon: "⚙️" },

      ]}
      ctaLabel="Save Changes"

    />
  );
}
