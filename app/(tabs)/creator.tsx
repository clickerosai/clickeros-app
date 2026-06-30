import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { useState, useRef, useCallback, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { saveSelectedAd } from "@/lib/selected-ad-context";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { AdVariation, CampaignInput } from "@/server/adGeneratorRouter";
import { ErrorBoundary } from "@/components/error-boundary";

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "facebook",  label: "Facebook",  icon: "👥", color: "#1877F2" },
  { id: "instagram", label: "Instagram", icon: "📸", color: "#E1306C" },
  { id: "google",    label: "Google",    icon: "🔍", color: "#4285F4" },
  { id: "tiktok",    label: "TikTok",    icon: "🎵", color: "#010101" },
  { id: "youtube",   label: "YouTube",   icon: "▶️", color: "#FF0000" },
  { id: "linkedin",  label: "LinkedIn",  icon: "💼", color: "#0077B5" },
] as const;

const OBJECTIVES = [
  { id: "awareness",   label: "Brand Awareness", icon: "📢" },
  { id: "traffic",     label: "Drive Traffic",   icon: "🖱️" },
  { id: "conversions", label: "Conversions",     icon: "💰" },
  { id: "retargeting", label: "Retargeting",     icon: "🔄" },
  { id: "leads",       label: "Generate Leads",  icon: "📋" },
] as const;

const TONES = [
  { id: "casual",        label: "Casual" },
  { id: "professional",  label: "Professional" },
  { id: "urgent",        label: "Urgent" },
  { id: "inspirational", label: "Inspirational" },
  { id: "humorous",      label: "Humorous" },
] as const;

const PROGRESS_STEPS = [
  "Analyzing campaign details…",
  "Building grounded prompt…",
  "Generating ad variations…",
  "Scoring relevance…",
  "Finalizing results…",
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  const colors = useColors();
  return (
    <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
      {label}
      {required && <Text style={{ color: "#EF4444" }}> *</Text>}
    </Text>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
      <IconSymbol name="exclamationmark.triangle.fill" size={12} color="#EF4444" />
      <Text style={{ color: "#EF4444", fontSize: 11 }}>{message}</Text>
    </View>
  );
}

function ScoreBar({ score, breakdown }: { score: number; breakdown: AdVariation["relevanceBreakdown"] }) {
  const colors = useColors();
  const scoreColor = score >= 80 ? "#22C55E" : score >= 65 ? "#F59E0B" : score >= 50 ? "#0EA5E9" : "#64748B";
  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "600" }}>Relevance Score</Text>
        <Text style={{ color: scoreColor, fontSize: 13, fontWeight: "700" }}>{score}/100</Text>
      </View>
      <View style={{ backgroundColor: colors.surface, borderRadius: 4, height: 6, overflow: "hidden" }}>
        <View style={{ backgroundColor: scoreColor, height: 6, width: `${score}%` as any, borderRadius: 4 }} />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
        {[
          { label: "Keywords", val: breakdown.keywordMatch, max: 20 },
          { label: "Business", val: breakdown.businessMention, max: 20 },
          { label: "Audience", val: breakdown.audienceMatch, max: 20 },
          { label: "Objective", val: breakdown.objectiveAlignment, max: 20 },
          { label: "CTA", val: breakdown.ctaRelevance, max: 20 },
        ].map((item) => (
          <View key={item.label} style={{ backgroundColor: colors.surface, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.muted, fontSize: 10 }}>
              {item.label}: <Text style={{ color: item.val >= item.max * 0.7 ? "#22C55E" : colors.foreground, fontWeight: "600" }}>{item.val}/{item.max}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

function CreatorScreenInner() {
  const colors = useColors();
  const r = useResponsive();
  const router = useRouter();

  // ── Form state ────────────────────────────────────────────────────────────
  const [businessName,      setBusinessName]      = useState("");
  const [productService,    setProductService]    = useState("");
  const [targetAudience,    setTargetAudience]    = useState("");
  const [campaignObjective, setCampaignObjective] = useState<CampaignInput["campaignObjective"]>("conversions");
  const [tone,              setTone]              = useState<CampaignInput["tone"]>("casual");
  const [offer,             setOffer]             = useState("");
  const [cta,               setCta]               = useState("");
  const [websiteUrl,        setWebsiteUrl]        = useState("");
  const [platform,          setPlatform]          = useState<CampaignInput["platform"]>("facebook");
  const [keywords,          setKeywords]          = useState("");

  // ── Validation errors ─────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // ── Progress animation ────────────────────────────────────────────────────
  const [progressStep, setProgressStep] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Results state ─────────────────────────────────────────────────────────
  const [variations, setVariations] = useState<AdVariation[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editHeadline, setEditHeadline] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCta, setEditCta] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0);

  // ── tRPC mutations ────────────────────────────────────────────────────────
  const generateMutation = trpc.adGenerator.generate.useMutation();
  const regenMutation    = trpc.adGenerator.regenerateSingle.useMutation();

  const isGenerating  = generateMutation.isPending;
  const isRegenerating = regenMutation.isPending;

  // ── Progress stepper ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isGenerating) {
      setProgressStep(0);
      progressTimer.current = setInterval(() => {
        setProgressStep((s) => Math.min(s + 1, PROGRESS_STEPS.length - 1));
      }, 600);
    } else {
      if (progressTimer.current) clearInterval(progressTimer.current);
      setProgressStep(0);
    }
    return () => { if (progressTimer.current) clearInterval(progressTimer.current); };
  }, [isGenerating]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!businessName.trim())   newErrors.businessName   = "Business name is required";
    if (!productService.trim()) newErrors.productService = "Product or service is required";
    if (!targetAudience.trim()) newErrors.targetAudience = "Target audience is required";
    if (!cta.trim())            newErrors.cta            = "Call-to-action is required";
    if (websiteUrl && !/^https?:\/\/.+/.test(websiteUrl)) {
      newErrors.websiteUrl = "Enter a valid URL starting with http:// or https://";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [businessName, productService, targetAudience, cta, websiteUrl]);

  // ── Generate ──────────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!validate()) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setVariations([]);
    setEditingIndex(null);

    try {
      const result = await generateMutation.mutateAsync({
        businessName:      businessName.trim(),
        productService:    productService.trim(),
        targetAudience:    targetAudience.trim(),
        campaignObjective,
        tone,
        offer:             offer.trim() || undefined,
        cta:               cta.trim(),
        websiteUrl:        websiteUrl.trim() || undefined,
        platform,
        keywords:          keywords.trim() || undefined,
      });

      setVariations(result.variations);
      setUsedFallback(result.usedFallback);
      setRejectedCount(result.rejectedCount);

      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Generation Failed", "Could not generate ads. Please try again.");
    }
  }, [validate, businessName, productService, targetAudience, campaignObjective, tone, offer, cta, websiteUrl, platform, keywords, generateMutation]);

  // ── Regenerate single ─────────────────────────────────────────────────────
  const handleRegenerate = useCallback(async (index: number) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const result = await regenMutation.mutateAsync({
        businessName:      businessName.trim(),
        productService:    productService.trim(),
        targetAudience:    targetAudience.trim(),
        campaignObjective,
        tone,
        offer:             offer.trim() || undefined,
        cta:               cta.trim(),
        websiteUrl:        websiteUrl.trim() || undefined,
        platform,
        keywords:          keywords.trim() || undefined,
        variationIndex:    index,
      });
      setVariations((prev) => {
        const next = [...prev];
        next[index] = result;
        return next;
      });
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert("Regeneration Failed", "Could not regenerate this variation. Please try again.");
    }
  }, [businessName, productService, targetAudience, campaignObjective, tone, offer, cta, websiteUrl, platform, keywords, regenMutation]);

  // ── Edit variation ────────────────────────────────────────────────────────
  const startEdit = (index: number) => {
    const v = variations[index];
    setEditingIndex(index);
    setEditHeadline(v.headline);
    setEditBody(v.body);
    setEditCta(v.cta);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    setVariations((prev) => {
      const next = [...prev];
      next[editingIndex] = { ...next[editingIndex], headline: editHeadline, body: editBody, cta: editCta };
      return next;
    });
    setEditingIndex(null);
  };

  const platformColor = PLATFORMS.find((p) => p.id === platform)?.color ?? "#7C3AED";

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* ── Header ── */}
          <View style={{ paddingHorizontal: r.px, paddingTop: r.isXs ? 10 : 12, paddingBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#7C3AED15", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconSymbol name="wand.and.stars" size={20} color="#7C3AED" />
              </View>
              <Text style={{ color: colors.foreground, fontSize: r.isXs ? r.fontSize.lg : r.fontSize.xl, fontWeight: "700" }} numberOfLines={1}>AI Ads Creator</Text>
            </View>
            <Text style={{ color: colors.muted, fontSize: r.fontSize.base }}>
              Fill in your campaign details — the AI generates ads using ONLY your inputs.
            </Text>
          </View>

          {/* ── Platform Selector ── */}
          <View style={{ paddingHorizontal: r.px, marginBottom: 20 }}>
            <FieldLabel label="Platform" required />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {PLATFORMS.map((p) => {
                const sel = platform === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, height: 44, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? p.color : colors.border, backgroundColor: sel ? `${p.color}10` : colors.background }}
                    onPress={() => setPlatform(p.id as CampaignInput["platform"])}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 14 }}>{p.icon}</Text>
                    <Text style={{ color: sel ? p.color : colors.muted, fontSize: r.fontSize.sm, fontWeight: sel ? "600" : "400" }}>{p.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ── Campaign Objective ── */}
          <View style={{ paddingHorizontal: r.px, marginBottom: 20 }}>
            <FieldLabel label="Campaign Goal" required />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {OBJECTIVES.map((obj) => {
                const sel = campaignObjective === obj.id;
                return (
                  <TouchableOpacity
                    key={obj.id}
                    style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, height: 44, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? "#7C3AED" : colors.border, backgroundColor: sel ? "#7C3AED10" : colors.background }}
                    onPress={() => setCampaignObjective(obj.id as CampaignInput["campaignObjective"])}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 13 }}>{obj.icon}</Text>
                    <Text style={{ color: sel ? "#7C3AED" : colors.muted, fontSize: r.fontSize.sm, fontWeight: sel ? "600" : "400" }}>{obj.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Business & Product ── */}
          <View style={{ paddingHorizontal: r.px, marginBottom: 16 }}>
            <FieldLabel label="Business Name" required />
            <TextInput
              style={{ backgroundColor: colors.surface, borderWidth: errors.businessName ? 1.5 : 1, borderColor: errors.businessName ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
              placeholder="e.g., Clickeros AI"
              placeholderTextColor={colors.muted}
              value={businessName}
              onChangeText={(v) => { setBusinessName(v); if (errors.businessName) setErrors((e) => ({ ...e, businessName: undefined })); }}
              returnKeyType="next"
              autoCorrect={false}
            />
            <FieldError message={errors.businessName} />
          </View>

          <View style={{ paddingHorizontal: r.px, marginBottom: 16 }}>
            <FieldLabel label="Product / Service" required />
            <TextInput
              style={{ backgroundColor: colors.surface, borderWidth: errors.productService ? 1.5 : 1, borderColor: errors.productService ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
              placeholder="e.g., AI-powered ad generation platform"
              placeholderTextColor={colors.muted}
              value={productService}
              onChangeText={(v) => { setProductService(v); if (errors.productService) setErrors((e) => ({ ...e, productService: undefined })); }}
              returnKeyType="next"
            />
            <FieldError message={errors.productService} />
          </View>

          <View style={{ paddingHorizontal: r.px, marginBottom: 16 }}>
            <FieldLabel label="Target Audience" required />
            <TextInput
              style={{ backgroundColor: colors.surface, borderWidth: errors.targetAudience ? 1.5 : 1, borderColor: errors.targetAudience ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
              placeholder="e.g., e-commerce store owners aged 25–45"
              placeholderTextColor={colors.muted}
              value={targetAudience}
              onChangeText={(v) => { setTargetAudience(v); if (errors.targetAudience) setErrors((e) => ({ ...e, targetAudience: undefined })); }}
              returnKeyType="next"
            />
            <FieldError message={errors.targetAudience} />
          </View>

          <View style={{ paddingHorizontal: r.px, marginBottom: 16 }}>
            <FieldLabel label="Call-to-Action (CTA)" required />
            <TextInput
              style={{ backgroundColor: colors.surface, borderWidth: errors.cta ? 1.5 : 1, borderColor: errors.cta ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
              placeholder="e.g., Start Free Trial, Shop Now, Get 50% Off"
              placeholderTextColor={colors.muted}
              value={cta}
              onChangeText={(v) => { setCta(v); if (errors.cta) setErrors((e) => ({ ...e, cta: undefined })); }}
              returnKeyType="next"
            />
            <FieldError message={errors.cta} />
          </View>

          {/* ── Optional Fields ── */}
          <View style={{ paddingHorizontal: r.px, marginBottom: 16 }}>
            <FieldLabel label="Offer / Promotion (optional)" />
            <TextInput
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
              placeholder="e.g., 30% off first month, Free shipping"
              placeholderTextColor={colors.muted}
              value={offer}
              onChangeText={setOffer}
              returnKeyType="next"
            />
          </View>

          <View style={{ paddingHorizontal: r.px, marginBottom: 16 }}>
            <FieldLabel label="Website URL (optional)" />
            <TextInput
              style={{ backgroundColor: colors.surface, borderWidth: errors.websiteUrl ? 1.5 : 1, borderColor: errors.websiteUrl ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
              placeholder="https://yourwebsite.com"
              placeholderTextColor={colors.muted}
              value={websiteUrl}
              onChangeText={(v) => { setWebsiteUrl(v); if (errors.websiteUrl) setErrors((e) => ({ ...e, websiteUrl: undefined })); }}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <FieldError message={errors.websiteUrl} />
          </View>

          <View style={{ paddingHorizontal: r.px, marginBottom: 16 }}>
            <FieldLabel label="Keywords (optional)" />
            <TextInput
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
              placeholder="e.g., AI marketing, ad automation, ROAS"
              placeholderTextColor={colors.muted}
              value={keywords}
              onChangeText={setKeywords}
              returnKeyType="done"
            />
          </View>

          {/* ── Tone Selector ── */}
          <View style={{ paddingHorizontal: r.px, marginBottom: 24 }}>
            <FieldLabel label="Ad Tone" />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TONES.map((t) => {
                const sel = tone === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={{ paddingHorizontal: 14, height: 40, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? platformColor : colors.border, backgroundColor: sel ? `${platformColor}10` : colors.background, justifyContent: "center" }}
                    onPress={() => setTone(t.id as CampaignInput["tone"])}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: sel ? platformColor : colors.muted, fontSize: r.fontSize.sm, fontWeight: sel ? "600" : "400" }}>{t.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Generate Button ── */}
          <View style={{ paddingHorizontal: r.px, marginBottom: 24 }}>
            <TouchableOpacity
              style={{ backgroundColor: isGenerating ? "#9333EA" : "#7C3AED", borderRadius: 14, height: 56, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, opacity: isGenerating ? 0.9 : 1 }}
              onPress={handleGenerate}
              activeOpacity={0.85}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.lg, fontWeight: "700" }}>
                    {PROGRESS_STEPS[progressStep]}
                  </Text>
                </>
              ) : (
                <>
                  <IconSymbol name="sparkles" size={20} color="#FFFFFF" />
                  <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.lg, fontWeight: "700" }}>
                    Generate Ad Variations
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Progress bar */}
            {isGenerating && (
              <View style={{ marginTop: 10 }}>
                <View style={{ backgroundColor: colors.surface, borderRadius: 4, height: 4, overflow: "hidden" }}>
                  <View style={{ backgroundColor: "#7C3AED", height: 4, width: `${((progressStep + 1) / PROGRESS_STEPS.length) * 100}%` as any, borderRadius: 4 }} />
                </View>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, textAlign: "center", marginTop: 6 }}>
                  Step {progressStep + 1} of {PROGRESS_STEPS.length} · Using ONLY your campaign details
                </Text>
              </View>
            )}

            {!isGenerating && variations.length === 0 && (
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, textAlign: "center", marginTop: 8 }}>
                Generates 3 grounded variations · Relevance scored · Platform-specific styles
              </Text>
            )}
          </View>

          {/* ── Results ── */}
          {variations.length > 0 && (
            <View style={{ paddingHorizontal: r.px }}>
              {/* Results header */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <IconSymbol name="checkmark.circle.fill" size={18} color="#22C55E" />
                  <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>
                    {variations.length} Variations Generated
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowDebug((v) => !v)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center", paddingLeft: 8 }}>
                  <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>
                    {showDebug ? "Hide" : "Debug"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Fallback / rejection notice */}
              {(usedFallback || rejectedCount > 0) && (
                <View style={{ backgroundColor: "#FEF9C3", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#FDE68A", marginBottom: 14 }}>
                  <Text style={{ color: "#92400E", fontSize: r.fontSize.xs, lineHeight: 18 }}>
                    {rejectedCount > 0 && `⚠️ ${rejectedCount} variation(s) scored below quality threshold and were replaced. `}
                    {usedFallback && "🔄 Smart fallback mode was used for some variations to ensure relevance."}
                  </Text>
                </View>
              )}

              {/* Variation cards */}
              {variations.map((ad, idx) => (
                <View
                  key={ad.id}
                  style={{
                    backgroundColor: colors.background, borderRadius: 16,
                    padding: r.isXs ? 14 : 16, marginBottom: 14,
                    borderWidth: 1, borderColor: idx === 0 ? `${platformColor}40` : colors.border,
                    borderLeftWidth: idx === 0 ? 3 : 1,
                    borderLeftColor: idx === 0 ? platformColor : colors.border,
                  }}
                >
                  {/* Card header */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <View style={{ backgroundColor: idx === 0 ? `${platformColor}15` : colors.surface, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                        <Text style={{ color: idx === 0 ? platformColor : colors.muted, fontSize: r.fontSize.xs, fontWeight: "600" }}>
                          {idx === 0 ? "⭐ " : ""}{ad.type}
                        </Text>
                      </View>
                      {ad.isFromFallback && (
                        <View style={{ backgroundColor: "#FEF9C3", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
                          <Text style={{ color: "#D97706", fontSize: 10, fontWeight: "600" }}>Fallback</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>
                      Variation {idx + 1}
                    </Text>
                  </View>

                  {/* Edit mode */}
                  {editingIndex === idx ? (
                    <View style={{ gap: 10 }}>
                      <TextInput
                        style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: "#7C3AED", borderRadius: 10, padding: 12, color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700" }}
                        value={editHeadline}
                        onChangeText={setEditHeadline}
                        placeholder="Headline"
                        placeholderTextColor={colors.muted}
                        multiline
                      />
                      <TextInput
                        style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.foreground, fontSize: r.fontSize.sm, minHeight: 80, textAlignVertical: "top" }}
                        value={editBody}
                        onChangeText={setEditBody}
                        placeholder="Body copy"
                        placeholderTextColor={colors.muted}
                        multiline
                        numberOfLines={3}
                      />
                      <TextInput
                        style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.foreground, fontSize: r.fontSize.sm }}
                        value={editCta}
                        onChangeText={setEditCta}
                        placeholder="CTA"
                        placeholderTextColor={colors.muted}
                      />
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: "#7C3AED", borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center" }} onPress={saveEdit} activeOpacity={0.8}>
                          <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.sm, fontWeight: "700" }}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }} onPress={() => setEditingIndex(null)} activeOpacity={0.7}>
                          <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600" }}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <>
                      {/* Hook line (TikTok) */}
                      {ad.hook && (
                        <View style={{ backgroundColor: "#FEF9C3", borderRadius: 8, padding: 8, marginBottom: 8 }}>
                          <Text style={{ color: "#92400E", fontSize: r.fontSize.xs, fontWeight: "700" }}>🎣 Hook: </Text>
                          <Text style={{ color: "#78350F", fontSize: r.fontSize.sm, fontStyle: "italic" }}>{ad.hook}</Text>
                        </View>
                      )}

                      <Text style={{ color: colors.foreground, fontSize: r.fontSize.md, fontWeight: "700", marginBottom: 6 }}>
                        {ad.headline}
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 20, marginBottom: 10 }}>
                        {ad.body}
                      </Text>
                      <View style={{ backgroundColor: `${platformColor}10`, borderRadius: 8, padding: 8, marginBottom: 10, alignSelf: "flex-start" }}>
                        <Text style={{ color: platformColor, fontSize: r.fontSize.sm, fontWeight: "700" }}>
                          → {ad.cta}
                        </Text>
                      </View>

                      {/* Relevance score */}
                      <ScoreBar score={ad.relevanceScore} breakdown={ad.relevanceBreakdown} />

                      {/* Debug log */}
                      {showDebug && ad.debugLog && (
                        <View style={{ backgroundColor: "#0F172A", borderRadius: 8, padding: 10, marginTop: 8 }}>
                          <Text style={{ color: "#22C55E", fontSize: 10, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
                            {ad.debugLog}
                          </Text>
                        </View>
                      )}

                      {/* Action buttons */}
                      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                        <TouchableOpacity
                          style={{ flex: 1, backgroundColor: "#7C3AED", borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center" }}
                          activeOpacity={0.7}
                          onPress={async () => {
                            try {
                              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              console.log("[Creator] Selected Ad Variation:", ad.id);
                              await saveSelectedAd({
                                ...ad,
                                platform,
                                campaignObjective,
                              });
                              router.push("/create-campaign");
                            } catch (error) {
                              console.error("[Creator] Failed to save selected ad:", error);
                              Alert.alert("Error", "Failed to save ad. Please try again.");
                            }
                          }}
                        >
                          <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.sm, fontWeight: "600" }}>Use This Ad</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}
                          onPress={() => startEdit(idx)}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600" }}>✏️ Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ backgroundColor: colors.surface, borderRadius: 8, width: 44, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, opacity: isRegenerating ? 0.5 : 1 }}
                          onPress={() => handleRegenerate(idx)}
                          activeOpacity={0.7}
                          disabled={isRegenerating}
                        >
                          {isRegenerating ? (
                            <ActivityIndicator size="small" color={colors.muted} />
                          ) : (
                            <IconSymbol name="arrow.triangle.2.circlepath" size={16} color={colors.muted} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              ))}

              {/* Regenerate all */}
              <TouchableOpacity
                style={{ backgroundColor: colors.surface, borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8 }}
                onPress={handleGenerate}
                activeOpacity={0.7}
                disabled={isGenerating}
              >
                <IconSymbol name="arrow.triangle.2.circlepath" size={16} color="#7C3AED" />
                <Text style={{ color: "#7C3AED", fontSize: r.fontSize.base, fontWeight: "600" }}>
                  Regenerate All Variations
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

export default function CreatorScreen() {
  return (
    <ErrorBoundary>
      <CreatorScreenInner />
    </ErrorBoundary>
  );
}
