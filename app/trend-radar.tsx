import { FeatureScreen } from "@/components/feature-screen";

export default function TrendRadarScreen() {
  return (
    <FeatureScreen
      title="Trend Radar"
      subtitle="Discover emerging market opportunities"
      iconName="antenna.radiowaves.left.and.right"
      iconColor="#6366F1"
      stats={[
        { label: "Trends Tracked", value: "284", change: "Active" },
        { label: "High Opportunity", value: "18", change: "This Week" },
        { label: "Avg. Confidence", value: "87%", change: "AI Score" },

      ]}
      features={[
        { title: "Emerging Keyword Trends", desc: "Spot keywords gaining search volume before competitors do", icon: "🔍" },
        { title: "Social Trend Detection", desc: "Monitor viral content patterns on TikTok, Instagram, and Twitter", icon: "📱" },
        { title: "Industry News Monitoring", desc: "Track industry publications and news for trend signals", icon: "📰" },
        { title: "AI Trend Scoring", desc: "Each trend scored by opportunity size and competition level", icon: "🤖", badge: "AI" },

      ]}
      ctaLabel="Scan Trends"

    />
  );
}
