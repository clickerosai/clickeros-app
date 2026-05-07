import { FeatureScreen } from "@/components/feature-screen";

export default function IntegrationsScreen() {
  return (
    <FeatureScreen
      title="Integrations"
      subtitle="Connect your favorite platforms and tools"
      iconName="link"
      iconColor="#F59E0B"
      stats={[
        { label: "Connected", value: "6", change: "Platforms" },
        { label: "Available", value: "24+", change: "Integrations" },

      ]}
      features={[
        { title: "Facebook & Instagram", desc: "Sync campaigns, audiences, and pixel data", icon: "📱", badge: "Connected" },
        { title: "Google Ads & Analytics", desc: "Import campaign data and conversion tracking", icon: "🔍", badge: "Connected" },
        { title: "TikTok Ads", desc: "Manage TikTok campaigns and creative performance", icon: "🎵" },
        { title: "Shopify & WooCommerce", desc: "Connect your store for revenue attribution", icon: "🛒" },
        { title: "HubSpot & Salesforce", desc: "Sync leads and customer data", icon: "💼" },
        { title: "Webflow & WordPress", desc: "Auto-publish SEO content to your website", icon: "🌐" },

      ]}
      ctaLabel="Connect Platform"

    />
  );
}
