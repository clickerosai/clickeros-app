import { FeatureScreen } from "@/components/feature-screen";

export default function AiSearchScreen() {
  return (
    <FeatureScreen
      title="AI Search Visibility"
      subtitle="Track your brand in AI search engines"
      iconName="magnifyingglass"
      iconColor="#7C3AED"
      stats={[
        { label: "AI Mentions", value: "47", change: "This Month" },
        { label: "ChatGPT Visibility", value: "High", change: "Score" },
        { label: "Perplexity Rank", value: "#3", change: "Category" },

      ]}
      features={[
        { title: "ChatGPT Citation Tracking", desc: "Monitor when ChatGPT mentions your brand or content", icon: "🤖" },
        { title: "Perplexity Visibility", desc: "Track your presence in Perplexity AI search results", icon: "🔍" },
        { title: "Prompt Optimization", desc: "Optimize content to appear in AI-generated answers", icon: "✨", badge: "AI" },
        { title: "LLM Mention Alerts", desc: "Get notified when AI engines mention your brand", icon: "🔔" },

      ]}
      ctaLabel="Track AI Visibility"

    />
  );
}
