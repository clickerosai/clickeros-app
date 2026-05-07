import { FeatureScreen } from "@/components/feature-screen";

export default function TemplatesScreen() {
  return (
    <FeatureScreen
      title="Campaign Templates"
      subtitle="Pre-built campaign templates"
      iconName="bookmark.fill"
      iconColor="#F59E0B"
      stats={[
        { label: "Templates", value: "47+", change: "Available" },
        { label: "Categories", value: "12", change: "Types" },
        { label: "Avg. ROAS", value: "4.2x", change: "Template Avg." },

      ]}
      features={[
        { title: "Industry Templates", desc: "Templates for e-commerce, SaaS, local business, and more", icon: "🏢" },
        { title: "Platform Templates", desc: "Optimized templates for Facebook, Google, TikTok, and YouTube", icon: "📱" },
        { title: "Seasonal Templates", desc: "Holiday, Black Friday, and seasonal campaign templates", icon: "🎄" },
        { title: "AI Customization", desc: "AI adapts any template to your brand and audience", icon: "🤖", badge: "AI" },

      ]}
      ctaLabel="Browse Templates"

    />
  );
}
