import { FeatureScreen } from "@/components/feature-screen";

export default function ProgrammaticSeoScreen() {
  return (
    <FeatureScreen
      title="Programmatic SEO"
      subtitle="Generate thousands of SEO pages at scale"
      iconName="doc.text.fill"
      iconColor="#22C55E"
      stats={[
        { label: "Pages Generated", value: "2,847", change: "Total" },
        { label: "Ranking Pages", value: "847", change: "Top 10" },
        { label: "Organic Traffic", value: "42.1K", change: "Monthly" },

      ]}
      features={[
        { title: "Template-Based Generation", desc: "Create thousands of location, product, or comparison pages", icon: "📄" },
        { title: "AI Content Quality", desc: "Each page gets unique, high-quality AI-written content", icon: "🤖", badge: "AI" },
        { title: "Auto Internal Linking", desc: "AI builds internal link structures for maximum SEO impact", icon: "🔗", badge: "AI" },
        { title: "Schema Markup", desc: "Automatic structured data for rich search results", icon: "⚙️" },

      ]}
      ctaLabel="Generate Pages"

    />
  );
}
