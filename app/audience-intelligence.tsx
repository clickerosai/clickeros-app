import { FeatureScreen } from "@/components/feature-screen";

export default function AudienceIntelligenceScreen() {
  return (
    <FeatureScreen
      title="Audience Intelligence"
      subtitle="Deep insights into your audience segments"
      iconName="person.2.fill"
      iconColor="#0EA5E9"
      stats={[
        { label: "Segments Found", value: "8", change: "Active" },
        { label: "Total Reach", value: "2.4M", change: "+18%" },
        { label: "AI Scored", value: "100%", change: "All" },

      ]}
      features={[
        { title: "Behavioral Segmentation", desc: "Group audiences by actions, interests, and purchase intent", icon: "👥" },
        { title: "Lookalike Audiences", desc: "AI finds new customers who match your best existing customers", icon: "🤖", badge: "AI" },
        { title: "Audience Overlap Analysis", desc: "Identify and eliminate audience overlap between campaigns", icon: "📊" },
        { title: "Demographic Insights", desc: "Age, gender, location, and interest breakdowns", icon: "📈" },

      ]}
      ctaLabel="Analyze Audience"

    />
  );
}
