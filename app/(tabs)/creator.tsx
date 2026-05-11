import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";

const PLATFORMS = [
  { id: "facebook", label: "Facebook", color: "#1877F2", icon: "👥" },
  { id: "instagram", label: "Instagram", color: "#E1306C", icon: "📸" },
  { id: "google", label: "Google", color: "#4285F4", icon: "🔍" },
  { id: "tiktok", label: "TikTok", color: "#010101", icon: "🎵" },
  { id: "youtube", label: "YouTube", color: "#FF0000", icon: "▶️" },
];

const AD_TYPES = [
  { id: "awareness", label: "Brand Awareness" },
  { id: "traffic", label: "Drive Traffic" },
  { id: "conversions", label: "Conversions" },
  { id: "retargeting", label: "Retargeting" },
];

const GENERATED_ADS = [
  { id: "1", headline: "Turn Your Content Into Revenue — Automatically", body: "Clickeros finds opportunities, creates high-ranking content, distributes it across channels, and tracks real revenue impact. Start free today.", cta: "Start Free →", score: 94, type: "High Performer" },
  { id: "2", headline: "Stop Guessing. Start Growing with AI.", body: "Join 12,000+ marketers using Clickeros to automate SEO, ads, and content distribution. See results in 60 days or your money back.", cta: "Get Started", score: 87, type: "Strong" },
  { id: "3", headline: "3x Your Traffic in 60 Days", body: "Our AI Strategy Copilot tells you exactly what to write, where to post, and how to convert. No guesswork, just growth.", cta: "Try Free", score: 82, type: "Good" },
];

export default function CreatorScreen() {
  const colors = useColors();
  const r = useResponsive();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["facebook"]);
  const [selectedAdType, setSelectedAdType] = useState("conversions");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); setShowResults(true); }, 2000);
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#7C3AED15", alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="wand.and.stars" size={20} color="#7C3AED" />
            </View>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize["2xl"], fontWeight: "700" }}>AI Ads Creator</Text>
          </View>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.base }}>Generate high-converting ad copy in seconds</Text>
        </View>

        {/* Platform Selector */}
        <View style={{ paddingHorizontal: r.px, marginBottom: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600", marginBottom: 10 }}>Platforms</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {PLATFORMS.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <TouchableOpacity
                  key={platform.id}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 6,
                    paddingHorizontal: 12, height: 44, borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: isSelected ? platform.color : colors.border,
                    backgroundColor: isSelected ? `${platform.color}10` : colors.background,
                  }}
                  onPress={() => togglePlatform(platform.id)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14 }}>{platform.icon}</Text>
                  <Text style={{
                    color: isSelected ? platform.color : colors.muted,
                    fontSize: r.fontSize.sm,
                    fontWeight: isSelected ? "600" : "400",
                  }}>
                    {platform.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Ad Type */}
        <View style={{ paddingHorizontal: r.px, marginBottom: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600", marginBottom: 10 }}>Campaign Goal</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {AD_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={{
                  paddingHorizontal: 14, height: 44, borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: selectedAdType === type.id ? "#7C3AED" : colors.border,
                  backgroundColor: selectedAdType === type.id ? "#7C3AED10" : colors.background,
                  justifyContent: "center",
                }}
                onPress={() => setSelectedAdType(type.id)}
                activeOpacity={0.7}
              >
                <Text style={{
                  color: selectedAdType === type.id ? "#7C3AED" : colors.muted,
                  fontSize: r.fontSize.sm,
                  fontWeight: selectedAdType === type.id ? "600" : "400",
                }}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={{ paddingHorizontal: r.px, marginBottom: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600", marginBottom: 10 }}>Product / Service</Text>
          <TextInput
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1, borderColor: colors.border,
              borderRadius: 12, padding: 14,
              color: colors.foreground, fontSize: r.fontSize.base,
              marginBottom: 10, minHeight: 44,
            }}
            placeholder="e.g., Clickeros AI Marketing Platform"
            placeholderTextColor={colors.muted}
            value={productName}
            onChangeText={setProductName}
            returnKeyType="next"
          />
          <TextInput
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1, borderColor: colors.border,
              borderRadius: 12, padding: 14,
              color: colors.foreground, fontSize: r.fontSize.base,
              minHeight: 100, textAlignVertical: "top",
            }}
            placeholder="Describe your product, target audience, and key benefits..."
            placeholderTextColor={colors.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            returnKeyType="done"
          />
        </View>

        {/* Generate Button */}
        <View style={{ paddingHorizontal: r.px, marginBottom: 24 }}>
          <TouchableOpacity
            style={{
              backgroundColor: isGenerating ? "#9333EA" : "#7C3AED",
              borderRadius: 14, height: 56,
              alignItems: "center", justifyContent: "center",
              flexDirection: "row", gap: 8,
            }}
            onPress={handleGenerate}
            activeOpacity={0.8}
            disabled={isGenerating}
          >
            <IconSymbol name="sparkles" size={20} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.lg, fontWeight: "700" }}>
              {isGenerating ? "AI is generating..." : "Generate Ad Variations"}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, textAlign: "center", marginTop: 8 }}>
            Generates 3 high-converting variations with AI scoring
          </Text>
        </View>

        {/* Generated Results */}
        {showResults && (
          <View style={{ paddingHorizontal: r.px }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <IconSymbol name="checkmark.circle.fill" size={18} color="#22C55E" />
              <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>3 Variations Generated</Text>
            </View>
            {GENERATED_ADS.map((ad, idx) => (
              <View
                key={ad.id}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 16, padding: r.isXs ? 14 : 16,
                  marginBottom: 12, borderWidth: 1,
                  borderColor: idx === 0 ? "#7C3AED40" : colors.border,
                  borderLeftWidth: idx === 0 ? 3 : 1,
                  borderLeftColor: idx === 0 ? "#7C3AED" : colors.border,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <View style={{
                    backgroundColor: idx === 0 ? "#7C3AED15" : colors.surface,
                    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
                  }}>
                    <Text style={{ color: idx === 0 ? "#7C3AED" : colors.muted, fontSize: r.fontSize.xs, fontWeight: "600" }}>
                      {idx === 0 ? "⭐ " : ""}{ad.type}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>AI Score:</Text>
                    <Text style={{
                      color: ad.score >= 90 ? "#22C55E" : ad.score >= 80 ? "#F59E0B" : "#64748B",
                      fontSize: r.fontSize.base, fontWeight: "700",
                    }}>{ad.score}</Text>
                  </View>
                </View>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.md, fontWeight: "700", marginBottom: 6 }}>
                  {ad.headline}
                </Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 20, marginBottom: 12 }}>
                  {ad.body}
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: "#7C3AED", borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center" }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.sm, fontWeight: "600" }}>Use This Ad</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.surface, borderRadius: 8,
                      width: 44, height: 44, alignItems: "center", justifyContent: "center",
                      borderWidth: 1, borderColor: colors.border,
                    }}
                    activeOpacity={0.7}
                  >
                    <IconSymbol name="square.and.arrow.up" size={16} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
