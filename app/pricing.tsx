import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const FREE_FEATURES = [
  "5 AI ad generations / month",
  "Basic targeting options",
  "Facebook & Instagram ads",
  "Campaign preview",
  "AI support chat",
  "Email support",
];

const PRO_FEATURES = [
  "Unlimited AI ad generations",
  "Advanced targeting",
  "All 5 platforms (FB, IG, Google, TikTok, YouTube)",
  "5 ad variations per campaign",
  "Creative generation",
  "AI Optimization Panel",
  "SEO Insights Dashboard",
  "Strategy Copilot",
  "A/B Testing",
  "Priority support",
];

const AGENCY_FEATURES = [
  "Everything in Pro",
  "Unlimited client accounts",
  "White-label reports",
  "Team roles and permissions",
  "Scheduled auto-reports",
  "Dedicated account manager",
  "Custom integrations",
  "SLA support",
];

function PlanCard({ name, price, period, desc, popular, features, cta, ctaFilled }: {
  name: string; price: string; period: string; desc: string; popular: boolean;
  features: string[]; cta: string; ctaFilled: boolean;
}) {
  const colors = useColors();
  return (
    <View style={{
      backgroundColor: colors.background, borderRadius: 20, padding: 20,
      borderWidth: popular ? 2 : 1, borderColor: popular ? "#7C3AED" : colors.border,
      shadowColor: popular ? "#7C3AED" : "#000", shadowOffset: { width: 0, height: popular ? 8 : 2 },
      shadowOpacity: popular ? 0.15 : 0.05, shadowRadius: popular ? 20 : 8,
      elevation: popular ? 8 : 2, marginTop: popular ? 8 : 0,
    }}>
      {popular && (
        <View style={{ position: "absolute", top: -14, left: 0, right: 0, alignItems: "center" }}>
          <View style={{ backgroundColor: "#7C3AED", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, flexDirection: "row", alignItems: "center", gap: 4 }}>
            <IconSymbol name="star.fill" size={12} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}>Most Popular</Text>
          </View>
        </View>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <View>
          <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "700" }}>{name}</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>{desc}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
          <Text style={{ color: popular ? "#7C3AED" : colors.foreground, fontSize: 30, fontWeight: "800" }}>{price}</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 5 }}>{period}</Text>
        </View>
      </View>
      <View style={{ gap: 8, marginBottom: 16 }}>
        {features.map((feature) => (
          <View key={feature} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
            <IconSymbol name="checkmark.circle.fill" size={16} color="#22C55E" style={{ marginTop: 1 }} />
            <Text style={{ color: colors.foreground, fontSize: 13, flex: 1, lineHeight: 18 }}>{feature}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={{ backgroundColor: ctaFilled ? "#7C3AED" : "transparent", borderRadius: 12, paddingVertical: 14, alignItems: "center", borderWidth: ctaFilled ? 0 : 1.5, borderColor: ctaFilled ? undefined : colors.border }}
        activeOpacity={0.8}
      >
        <Text style={{ color: ctaFilled ? "#FFFFFF" : colors.foreground, fontSize: 15, fontWeight: "700" }}>{cta}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PricingScreen() {
  const router = useRouter();
  const colors = useColors();
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }} onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="chevron.left" size={18} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.foreground, fontSize: 26, fontWeight: "800", marginBottom: 4 }}>Choose Your Plan</Text>
          <Text style={{ color: colors.muted, fontSize: 14 }}>Start free, upgrade when ready. No hidden fees, cancel anytime.</Text>
        </View>
        <View style={{ paddingHorizontal: 16, marginTop: 20, gap: 16 }}>
          <PlanCard name="Free" price="$0" period="/month" desc="Perfect for getting started" popular={false} features={FREE_FEATURES} cta="Get Started Free" ctaFilled={false} />
          <PlanCard name="Pro" price="$49" period="/month" desc="For growing businesses" popular={true} features={PRO_FEATURES} cta="Start Pro Trial" ctaFilled={true} />
          <PlanCard name="Agency" price="$149" period="/month" desc="For agencies and teams" popular={false} features={AGENCY_FEATURES} cta="Start Agency Trial" ctaFilled={false} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
