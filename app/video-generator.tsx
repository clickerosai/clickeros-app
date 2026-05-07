import { FeatureScreen } from "@/components/feature-screen";

export default function VideoGeneratorScreen() {
  return (
    <FeatureScreen
      title="AI Video Generator"
      subtitle="Turn content into scroll-stopping videos"
      iconName="video.fill"
      iconColor="#EC4899"
      stats={[
        { label: "Videos Created", value: "24", change: "This Month" },
        { label: "Avg. Watch Time", value: "47s", change: "+12s" },
        { label: "Total Views", value: "142K", change: "+68%" },

      ]}
      features={[
        { title: "Auto Script Generation", desc: "AI writes compelling video scripts from your content or brief", icon: "📝", badge: "AI" },
        { title: "AI Voiceover", desc: "Professional voiceovers in multiple languages and styles", icon: "🎙️", badge: "AI" },
        { title: "Auto Captions", desc: "Accurate captions generated and synced automatically", icon: "💬" },
        { title: "Platform Optimization", desc: "Formats optimized for TikTok, Reels, YouTube Shorts, and more", icon: "📱" },

      ]}
      ctaLabel="Create Video"

    />
  );
}
