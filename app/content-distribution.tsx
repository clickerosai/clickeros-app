import { FeatureScreen } from "@/components/feature-screen";

export default function ContentDistributionScreen() {
  return (
    <FeatureScreen
      title="Content Distribution"
      subtitle="Turn one piece of content into 10+ assets"
      iconName="square.and.arrow.up"
      iconColor="#14B8A6"
      stats={[
        { label: "Content Pieces", value: "48", change: "Published" },
        { label: "Channels", value: "8", change: "Connected" },
        { label: "Total Reach", value: "284K", change: "+42%" },

      ]}
      features={[
        { title: "LinkedIn & Twitter Repurposing", desc: "Auto-transform blog posts into social media threads and posts", icon: "📱", badge: "AI" },
        { title: "Email Newsletter Drafts", desc: "Generate newsletter content from your existing blog articles", icon: "📧" },
        { title: "Short-form Video Scripts", desc: "Create TikTok and Reels scripts from long-form content", icon: "🎬", badge: "AI" },
        { title: "Multi-Platform Scheduling", desc: "Schedule and publish across all channels from one dashboard", icon: "📅" },

      ]}
      ctaLabel="Distribute Content"

    />
  );
}
