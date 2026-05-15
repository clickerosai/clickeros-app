import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CampaignForm {
  // Step 1 — Campaign Basics
  campaignName: string;
  objective: string;
  platform: string;
  // Step 2 — Business Info
  businessName: string;
  productService: string;
  websiteUrl: string;
  // Step 3 — Audience
  targetAudience: string;
  ageRange: string;
  gender: string;
  location: string;
  interests: string;
  // Step 4 — Budget & Schedule
  dailyBudget: string;
  totalBudget: string;
  startDate: string;
  endDate: string;
  // Step 5 — Ad Details
  offer: string;
  cta: string;
  tone: string;
  keywords: string;
}

const INITIAL_FORM: CampaignForm = {
  campaignName: "", objective: "", platform: "",
  businessName: "", productService: "", websiteUrl: "",
  targetAudience: "", ageRange: "25-44", gender: "all", location: "", interests: "",
  dailyBudget: "", totalBudget: "", startDate: "", endDate: "",
  offer: "", cta: "", tone: "casual", keywords: "",
};

const OBJECTIVES = [
  { id: "awareness",   label: "Brand Awareness", icon: "📢", desc: "Reach new audiences" },
  { id: "traffic",     label: "Drive Traffic",   icon: "🖱️", desc: "Send people to your site" },
  { id: "conversions", label: "Conversions",     icon: "💰", desc: "Get sales and sign-ups" },
  { id: "leads",       label: "Lead Generation", icon: "📋", desc: "Collect contact info" },
  { id: "retargeting", label: "Retargeting",     icon: "🔄", desc: "Re-engage past visitors" },
];

const PLATFORMS = [
  { id: "facebook",  label: "Facebook",  icon: "👥", color: "#1877F2" },
  { id: "instagram", label: "Instagram", icon: "📸", color: "#E1306C" },
  { id: "google",    label: "Google",    icon: "🔍", color: "#4285F4" },
  { id: "tiktok",    label: "TikTok",    icon: "🎵", color: "#010101" },
  { id: "youtube",   label: "YouTube",   icon: "▶️", color: "#FF0000" },
  { id: "linkedin",  label: "LinkedIn",  icon: "💼", color: "#0077B5" },
  { id: "pinterest", label: "Pinterest", icon: "📌", color: "#E60023" },
];

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+", "All Ages"];
const GENDERS = [{ id: "all", label: "All" }, { id: "male", label: "Male" }, { id: "female", label: "Female" }];
const TONES = ["casual", "professional", "urgent", "inspirational", "humorous"];
const CTAS = ["Shop Now", "Learn More", "Sign Up Free", "Get Started", "Book Now", "Download", "Contact Us", "Get Offer"];

const STEPS = [
  { id: 1, label: "Basics",   icon: "flag.fill" as const },
  { id: 2, label: "Business", icon: "building.2.fill" as const },
  { id: 3, label: "Audience", icon: "person.2.fill" as const },
  { id: 4, label: "Budget",   icon: "dollarsign.circle.fill" as const },
  { id: 5, label: "Ad Copy",  icon: "sparkles" as const },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StepHeader({ current, total }: { current: number; total: number }) {
  const colors = useColors();
  const r = useResponsive();
  return (
    <View style={{ paddingHorizontal: r.px, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }}>
          Step {current} of {total}
        </Text>
        <Text style={{ color: colors.muted, fontSize: r.fontSize.sm }}>
          {STEPS[current - 1]?.label}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {STEPS.map((step) => (
          <View
            key={step.id}
            style={{
              flex: 1, height: 4, borderRadius: 2,
              backgroundColor: step.id <= current ? "#7C3AED" : colors.surface,
            }}
          />
        ))}
      </View>
    </View>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  const colors = useColors();
  return (
    <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
      {label}{required && <Text style={{ color: "#EF4444" }}> *</Text>}
    </Text>
  );
}

function InlineError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
      <IconSymbol name="exclamationmark.triangle.fill" size={11} color="#EF4444" />
      <Text style={{ color: "#EF4444", fontSize: 11 }}>{message}</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function CreateCampaignScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const scrollRef = useRef<ScrollView>(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CampaignForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CampaignForm, string>>>({});

  const update = useCallback(<K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  // ── Validation per step ───────────────────────────────────────────────────
  const validateStep = useCallback((s: number): boolean => {
    const newErrors: Partial<Record<keyof CampaignForm, string>> = {};

    if (s === 1) {
      if (!form.campaignName.trim()) newErrors.campaignName = "Campaign name is required";
      if (!form.objective) newErrors.objective = "Select a campaign objective";
      if (!form.platform) newErrors.platform = "Select at least one platform";
    }
    if (s === 2) {
      if (!form.businessName.trim()) newErrors.businessName = "Business name is required";
      if (!form.productService.trim()) newErrors.productService = "Product or service is required";
      if (form.websiteUrl && !/^https?:\/\/.+/.test(form.websiteUrl)) {
        newErrors.websiteUrl = "Enter a valid URL (https://...)";
      }
    }
    if (s === 3) {
      if (!form.targetAudience.trim()) newErrors.targetAudience = "Describe your target audience";
      if (!form.location.trim()) newErrors.location = "Enter at least one target location";
    }
    if (s === 4) {
      if (!form.dailyBudget.trim()) newErrors.dailyBudget = "Daily budget is required";
      else if (isNaN(Number(form.dailyBudget)) || Number(form.dailyBudget) <= 0) {
        newErrors.dailyBudget = "Enter a valid budget amount";
      }
    }
    if (s === 5) {
      if (!form.cta.trim()) newErrors.cta = "Call-to-action is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleNext = useCallback(async () => {
    if (!validateStep(step)) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step < STEPS.length) {
      setStep((s) => s + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      // Final step — go to AI generation
      router.push({
        pathname: "/generate-ads",
        params: {
          businessName:      form.businessName,
          productService:    form.productService,
          targetAudience:    form.targetAudience,
          campaignObjective: form.objective,
          tone:              form.tone,
          offer:             form.offer,
          cta:               form.cta,
          websiteUrl:        form.websiteUrl,
          platform:          form.platform,
          keywords:          form.keywords,
          campaignName:      form.campaignName,
          dailyBudget:       form.dailyBudget,
          location:          form.location,
        },
      } as any);
    }
  }, [step, validateStep, form, router]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      router.back();
    }
  }, [step, router]);

  const platformColor = PLATFORMS.find((p) => p.id === form.platform)?.color ?? "#7C3AED";

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        {/* Back + Step Progress */}
        <View style={{ paddingHorizontal: r.px, paddingTop: 14, paddingBottom: 4 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, minHeight: 44 }}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: r.fontSize.base }}>
              {step > 1 ? "Back" : "Cancel"}
            </Text>
          </TouchableOpacity>
        </View>

        <StepHeader current={step} total={STEPS.length} />

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: r.px, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* ── STEP 1: Campaign Basics ── */}
          {step === 1 && (
            <View style={{ gap: 20 }}>
              <View>
                <FieldLabel label="Campaign Name" required />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: errors.campaignName ? 1.5 : 1, borderColor: errors.campaignName ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="e.g., Summer Sale 2026"
                  placeholderTextColor={colors.muted}
                  value={form.campaignName}
                  onChangeText={(v) => update("campaignName", v)}
                  returnKeyType="done"
                />
                <InlineError message={errors.campaignName} />
              </View>

              <View>
                <FieldLabel label="Campaign Objective" required />
                {errors.objective && <InlineError message={errors.objective} />}
                <View style={{ gap: 8, marginTop: 4 }}>
                  {OBJECTIVES.map((obj) => {
                    const sel = form.objective === obj.id;
                    return (
                      <TouchableOpacity
                        key={obj.id}
                        style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: sel ? "#7C3AED" : colors.border, backgroundColor: sel ? "#7C3AED10" : colors.background, minHeight: 56 }}
                        onPress={() => update("objective", obj.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 22, flexShrink: 0 }}>{obj.icon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: sel ? "#7C3AED" : colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }}>{obj.label}</Text>
                          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }}>{obj.desc}</Text>
                        </View>
                        {sel && <IconSymbol name="checkmark.circle.fill" size={20} color="#7C3AED" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View>
                <FieldLabel label="Platform" required />
                {errors.platform && <InlineError message={errors.platform} />}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {PLATFORMS.map((p) => {
                    const sel = form.platform === p.id;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, height: 44, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? p.color : colors.border, backgroundColor: sel ? `${p.color}10` : colors.background }}
                        onPress={() => update("platform", p.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 14 }}>{p.icon}</Text>
                        <Text style={{ color: sel ? p.color : colors.muted, fontSize: r.fontSize.sm, fontWeight: sel ? "600" : "400" }}>{p.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* ── STEP 2: Business Info ── */}
          {step === 2 && (
            <View style={{ gap: 20 }}>
              <View>
                <FieldLabel label="Business Name" required />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: errors.businessName ? 1.5 : 1, borderColor: errors.businessName ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="e.g., Clickeros AI"
                  placeholderTextColor={colors.muted}
                  value={form.businessName}
                  onChangeText={(v) => update("businessName", v)}
                  returnKeyType="next"
                />
                <InlineError message={errors.businessName} />
              </View>

              <View>
                <FieldLabel label="Product / Service" required />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: errors.productService ? 1.5 : 1, borderColor: errors.productService ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 80, textAlignVertical: "top" }}
                  placeholder="Describe what you're advertising..."
                  placeholderTextColor={colors.muted}
                  value={form.productService}
                  onChangeText={(v) => update("productService", v)}
                  multiline
                  numberOfLines={3}
                />
                <InlineError message={errors.productService} />
              </View>

              <View>
                <FieldLabel label="Website URL (optional)" />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: errors.websiteUrl ? 1.5 : 1, borderColor: errors.websiteUrl ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="https://yourwebsite.com"
                  placeholderTextColor={colors.muted}
                  value={form.websiteUrl}
                  onChangeText={(v) => update("websiteUrl", v)}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                />
                <InlineError message={errors.websiteUrl} />
              </View>
            </View>
          )}

          {/* ── STEP 3: Audience ── */}
          {step === 3 && (
            <View style={{ gap: 20 }}>
              <View>
                <FieldLabel label="Target Audience Description" required />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: errors.targetAudience ? 1.5 : 1, borderColor: errors.targetAudience ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 80, textAlignVertical: "top" }}
                  placeholder="e.g., e-commerce store owners aged 25-45 who want to grow their online sales"
                  placeholderTextColor={colors.muted}
                  value={form.targetAudience}
                  onChangeText={(v) => update("targetAudience", v)}
                  multiline
                  numberOfLines={3}
                />
                <InlineError message={errors.targetAudience} />
              </View>

              <View>
                <FieldLabel label="Age Range" />
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {AGE_RANGES.map((age) => {
                    const sel = form.ageRange === age;
                    return (
                      <TouchableOpacity
                        key={age}
                        style={{ paddingHorizontal: 14, height: 40, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? "#7C3AED" : colors.border, backgroundColor: sel ? "#7C3AED10" : colors.background, justifyContent: "center" }}
                        onPress={() => update("ageRange", age)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ color: sel ? "#7C3AED" : colors.muted, fontSize: r.fontSize.sm, fontWeight: sel ? "600" : "400" }}>{age}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View>
                <FieldLabel label="Gender" />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {GENDERS.map((g) => {
                    const sel = form.gender === g.id;
                    return (
                      <TouchableOpacity
                        key={g.id}
                        style={{ flex: 1, height: 44, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? "#7C3AED" : colors.border, backgroundColor: sel ? "#7C3AED10" : colors.background, alignItems: "center", justifyContent: "center" }}
                        onPress={() => update("gender", g.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ color: sel ? "#7C3AED" : colors.muted, fontSize: r.fontSize.sm, fontWeight: sel ? "600" : "400" }}>{g.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View>
                <FieldLabel label="Target Location(s)" required />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: errors.location ? 1.5 : 1, borderColor: errors.location ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="e.g., United States, New York, Los Angeles"
                  placeholderTextColor={colors.muted}
                  value={form.location}
                  onChangeText={(v) => update("location", v)}
                  returnKeyType="next"
                />
                <InlineError message={errors.location} />
              </View>

              <View>
                <FieldLabel label="Interests / Keywords (optional)" />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="e.g., e-commerce, digital marketing, Shopify"
                  placeholderTextColor={colors.muted}
                  value={form.interests}
                  onChangeText={(v) => update("interests", v)}
                  returnKeyType="done"
                />
              </View>
            </View>
          )}

          {/* ── STEP 4: Budget & Schedule ── */}
          {step === 4 && (
            <View style={{ gap: 20 }}>
              <View style={{ backgroundColor: "#EDE9FE", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#7C3AED30" }}>
                <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, lineHeight: 20 }}>
                  💡 <Text style={{ fontWeight: "700" }}>AI Budget Tip:</Text> We recommend starting with $20–50/day to gather enough data for optimization. You can scale up once you see results.
                </Text>
              </View>

              <View>
                <FieldLabel label="Daily Budget (USD)" required />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: errors.dailyBudget ? 1.5 : 1, borderColor: errors.dailyBudget ? "#EF4444" : colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="e.g., 50"
                  placeholderTextColor={colors.muted}
                  value={form.dailyBudget}
                  onChangeText={(v) => update("dailyBudget", v)}
                  keyboardType="decimal-pad"
                  returnKeyType="next"
                />
                <InlineError message={errors.dailyBudget} />
              </View>

              <View>
                <FieldLabel label="Total Budget (optional)" />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="e.g., 1000 (leave blank for no limit)"
                  placeholderTextColor={colors.muted}
                  value={form.totalBudget}
                  onChangeText={(v) => update("totalBudget", v)}
                  keyboardType="decimal-pad"
                  returnKeyType="next"
                />
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <FieldLabel label="Start Date" />
                  <TextInput
                    style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.muted}
                    value={form.startDate}
                    onChangeText={(v) => update("startDate", v)}
                    returnKeyType="next"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FieldLabel label="End Date" />
                  <TextInput
                    style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.muted}
                    value={form.endDate}
                    onChangeText={(v) => update("endDate", v)}
                    returnKeyType="done"
                  />
                </View>
              </View>

              {/* Budget Preview */}
              {form.dailyBudget && !isNaN(Number(form.dailyBudget)) && (
                <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600", marginBottom: 8 }}>Budget Summary</Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.sm }}>Daily</Text>
                    <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "600" }}>${Number(form.dailyBudget).toFixed(2)}/day</Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.sm }}>Monthly Est.</Text>
                    <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>${(Number(form.dailyBudget) * 30).toFixed(0)}/month</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── STEP 5: Ad Copy Details ── */}
          {step === 5 && (
            <View style={{ gap: 20 }}>
              <View>
                <FieldLabel label="Call-to-Action (CTA)" required />
                {errors.cta && <InlineError message={errors.cta} />}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4, marginBottom: 8 }}>
                  {CTAS.map((c) => {
                    const sel = form.cta === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        style={{ paddingHorizontal: 12, height: 40, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? platformColor : colors.border, backgroundColor: sel ? `${platformColor}10` : colors.background, justifyContent: "center" }}
                        onPress={() => update("cta", c)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ color: sel ? platformColor : colors.muted, fontSize: r.fontSize.sm, fontWeight: sel ? "600" : "400" }}>{c}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="Or type a custom CTA..."
                  placeholderTextColor={colors.muted}
                  value={form.cta}
                  onChangeText={(v) => update("cta", v)}
                  returnKeyType="next"
                />
              </View>

              <View>
                <FieldLabel label="Offer / Promotion (optional)" />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="e.g., 30% off first month, Free shipping"
                  placeholderTextColor={colors.muted}
                  value={form.offer}
                  onChangeText={(v) => update("offer", v)}
                  returnKeyType="next"
                />
              </View>

              <View>
                <FieldLabel label="Ad Tone" />
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {TONES.map((t) => {
                    const sel = form.tone === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        style={{ paddingHorizontal: 14, height: 40, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? platformColor : colors.border, backgroundColor: sel ? `${platformColor}10` : colors.background, justifyContent: "center" }}
                        onPress={() => update("tone", t)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ color: sel ? platformColor : colors.muted, fontSize: r.fontSize.sm, fontWeight: sel ? "600" : "400", textTransform: "capitalize" }}>{t}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View>
                <FieldLabel label="Keywords (optional)" />
                <TextInput
                  style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: r.fontSize.base, minHeight: 44 }}
                  placeholder="e.g., AI marketing, ad automation, ROAS"
                  placeholderTextColor={colors.muted}
                  value={form.keywords}
                  onChangeText={(v) => update("keywords", v)}
                  returnKeyType="done"
                />
              </View>

              {/* Campaign Summary */}
              <View style={{ backgroundColor: "#EDE9FE", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#7C3AED30" }}>
                <Text style={{ color: "#7C3AED", fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 10 }}>
                  📋 Campaign Summary
                </Text>
                {[
                  { label: "Campaign", value: form.campaignName },
                  { label: "Platform", value: PLATFORMS.find((p) => p.id === form.platform)?.label ?? form.platform },
                  { label: "Objective", value: OBJECTIVES.find((o) => o.id === form.objective)?.label ?? form.objective },
                  { label: "Business", value: form.businessName },
                  { label: "Audience", value: form.targetAudience.slice(0, 50) + (form.targetAudience.length > 50 ? "…" : "") },
                  { label: "Budget", value: form.dailyBudget ? `$${form.dailyBudget}/day` : "Not set" },
                ].map((row) => (
                  <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ color: "#7C3AED", fontSize: r.fontSize.xs, fontWeight: "600", flex: 1 }}>{row.label}</Text>
                    <Text style={{ color: "#4C1D95", fontSize: r.fontSize.xs, flex: 2, textAlign: "right" }} numberOfLines={1}>{row.value || "—"}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Fixed Bottom Navigation */}
        <View style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          backgroundColor: colors.background,
          paddingHorizontal: r.px, paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? 32 : 16,
          borderTopWidth: 1, borderTopColor: colors.border,
        }}>
          <TouchableOpacity
            style={{ backgroundColor: "#7C3AED", borderRadius: 14, height: 56, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.lg, fontWeight: "700" }}>
              {step < STEPS.length ? `Next: ${STEPS[step]?.label}` : "Generate Ads →"}
            </Text>
            <IconSymbol name={step < STEPS.length ? "chevron.right" : "sparkles"} size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
