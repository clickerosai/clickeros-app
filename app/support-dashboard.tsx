import { FeatureScreen } from "@/components/feature-screen";

export default function SupportDashboardScreen() {
  return (
    <FeatureScreen
      title="Support"
      subtitle="Help center and support tickets"
      iconName="questionmark.circle.fill"
      iconColor="#64748B"
      stats={[
        { label: "Open Tickets", value: "2", change: "Active" },
        { label: "Avg. Response", value: "2hrs", change: "Time" },
        { label: "Rating", value: "4.9/5", change: "Support" },

      ]}
      features={[
        { title: "Help Center", desc: "Browse 200+ articles and tutorials", icon: "📚" },
        { title: "Live Chat", desc: "Chat with our support team in real-time", icon: "💬" },
        { title: "Video Tutorials", desc: "Step-by-step video guides for all features", icon: "🎬" },
        { title: "Community Forum", desc: "Connect with 12,000+ Clickeros users", icon: "👥" },

      ]}
      ctaLabel="Get Help"

    />
  );
}
