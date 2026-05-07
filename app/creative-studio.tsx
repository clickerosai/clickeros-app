import { FeatureScreen } from "@/components/feature-screen";

export default function CreativeStudioScreen() {
  return (
    <FeatureScreen
      title="Creative Studio"
      subtitle="Build and manage ad creative assets"
      iconName="photo.fill"
      iconColor="#EC4899"
      stats={[
        { label: "Assets Created", value: "128", change: "Total" },
        { label: "Templates", value: "47", change: "Available" },
        { label: "Avg. Score", value: "84", change: "AI Rating" },

      ]}
      features={[
        { title: "AI Image Generation", desc: "Generate ad images from text descriptions", icon: "🎨", badge: "AI" },
        { title: "Video Script Writer", desc: "AI writes compelling video scripts for any platform", icon: "📝", badge: "AI" },
        { title: "Template Library", desc: "47+ proven ad templates across all formats and platforms", icon: "📚" },
        { title: "Brand Kit", desc: "Store your brand colors, fonts, and assets for consistent creatives", icon: "🎨" },

      ]}
      ctaLabel="Open Studio"

    />
  );
}
