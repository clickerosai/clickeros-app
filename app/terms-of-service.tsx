import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const EFFECTIVE_DATE = "May 11, 2026";
const COMPANY = "Clickeros AI, Inc.";

interface SectionProps {
  id: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
}

function Section({ title, accent = "#7C3AED", children }: SectionProps) {
  const colors = useColors();
  return (
    <View style={{ marginBottom: 24 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <View style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: accent }} />
        <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700" }}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Para({ text }: { text: string }) {
  const colors = useColors();
  return (
    <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 21, marginBottom: 8 }}>
      {text}
    </Text>
  );
}

function BulletItem({ text, color = "#7C3AED", num }: { text: string; color?: string; num: string }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
      <View style={{
        width: 22, height: 22, borderRadius: 6,
        backgroundColor: `${color}15`,
        alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}>
        <Text style={{ color, fontSize: 10, fontWeight: "700" }}>{num}</Text>
      </View>
      <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 21, flex: 1 }}>{text}</Text>
    </View>
  );
}

function HighlightBox({ text, type = "warning" }: { text: string; type?: "warning" | "info" | "success" }) {
  const styles = {
    warning: { bg: "#FEF2F2", border: "#FECACA", text: "#991B1B" },
    info:    { bg: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF" },
    success: { bg: "#F0FDF4", border: "#BBF7D0", text: "#166534" },
  }[type];
  return (
    <View style={{ backgroundColor: styles.bg, borderWidth: 1, borderColor: styles.border, borderRadius: 10, padding: 12, marginBottom: 10 }}>
      <Text style={{ color: styles.text, fontSize: 13, lineHeight: 20 }}>{text}</Text>
    </View>
  );
}

const PLAN_ROWS = [
  { plan: "Free", price: "$0/mo", features: "5 AI generations/month, basic targeting, FB & IG ads" },
  { plan: "Pro", price: "$49/mo", features: "Unlimited generations, all 5 platforms, SEO tools, A/B testing" },
  { plan: "Agency", price: "$149/mo", features: "Everything in Pro + unlimited clients, white-label, team roles" },
];

export default function TermsOfServiceScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={{ backgroundColor: "#1E1B4B", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="doc.text.fill" size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>Terms of Service</Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>
                {COMPANY} · Effective {EFFECTIVE_DATE}
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 12 }}>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 20 }}>
              By using the Clickeros AI app, you agree to these Terms of Service. Please read them carefully.
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>

          {/* Acceptance */}
          <Section id="acceptance" title="1. Acceptance of Terms">
            <Para text={`These Terms of Service ("Terms") govern your use of the Clickeros AI mobile application and platform operated by ${COMPANY}. By downloading or using the app, you agree to be bound by these Terms and our Privacy Policy.`} />
            <Para text="If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms." />
          </Section>

          {/* Description */}
          <Section id="description" title="2. Description of Service" accent="#0EA5E9">
            <Para text="Clickeros AI is an AI-powered marketing platform providing:" />
            {[
              ["01", "AI Ads Creator — automated ad copy for Facebook, Instagram, Google, TikTok, and YouTube."],
              ["02", "Campaign Manager — create, manage, and optimize campaigns across platforms."],
              ["03", "SEO & Content Tools — AI-powered SEO insights, content generation, and distribution."],
              ["04", "Analytics & Attribution — revenue attribution, audience intelligence, and competitor analysis."],
              ["05", "AI Growth Features — Strategy Copilot, Budget Optimizer, Opportunity Scanner, and more."],
            ].map(([num, text]) => (
              <BulletItem key={num} num={num} text={text} color="#0EA5E9" />
            ))}
          </Section>

          {/* Eligibility */}
          <Section id="eligibility" title="3. Eligibility" accent="#22C55E">
            <Para text="To use the Service you must be at least 13 years old, have legal capacity to enter a binding contract, and not be located in a country subject to a U.S. Government embargo." />
            <HighlightBox type="warning" text="The Service is not directed to children under 13. If we become aware that a user is under 13, we will immediately terminate their account and delete associated data." />
          </Section>

          {/* Accounts */}
          <Section id="accounts" title="4. User Accounts" accent="#F59E0B">
            <Para text="You agree to provide accurate information during registration, maintain the security of your password, and notify us immediately of any unauthorized use of your account at support@clickeros.ai." />
            <Para text="You may not share your account credentials with any third party or create multiple accounts to circumvent usage limits." />
          </Section>

          {/* Subscriptions */}
          <Section id="subscriptions" title="5. Subscriptions & Billing" accent="#7C3AED">
            <Para text="Clickeros AI offers the following subscription plans (USD, subject to change with 30 days' notice):" />
            <View style={{ backgroundColor: colors.surface, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: colors.border, marginBottom: 12 }}>
              {/* Header */}
              <View style={{ flexDirection: "row", backgroundColor: colors.border, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: "700", flex: 1, textTransform: "uppercase" }}>Plan</Text>
                <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: "700", width: 70, textTransform: "uppercase" }}>Price</Text>
              </View>
              {PLAN_ROWS.map((row, idx) => (
                <View key={row.plan} style={{ paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: colors.border }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
                    <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", flex: 1 }}>{row.plan}</Text>
                    <Text style={{ color: "#7C3AED", fontSize: 13, fontWeight: "700", width: 70 }}>{row.price}</Text>
                  </View>
                  <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 17 }}>{row.features}</Text>
                </View>
              ))}
            </View>
            <Para text="Paid subscriptions are billed in advance. You may cancel at any time; cancellation takes effect at the end of the current billing period. We offer a 14-day money-back guarantee for first-time paid subscribers." />
            <HighlightBox type="info" text="In-App Purchases: If you subscribe through Google Play or the App Store, billing is managed by that platform. Their refund and cancellation policies apply." />
          </Section>

          {/* Acceptable Use */}
          <Section id="acceptable-use" title="6. Acceptable Use Policy" accent="#EF4444">
            <Para text="The following activities are strictly prohibited:" />
            {[
              "Creating illegal, harmful, or deceptive advertising content.",
              "Attempting to gain unauthorized access to the Service or other accounts.",
              "Using bots or automated tools to scrape data from the Service.",
              "Reverse engineering or decompiling any part of the Service.",
              "Reselling or sublicensing the Service without written permission.",
              "Violating any advertising platform's terms of service.",
            ].map((text, idx) => (
              <BulletItem key={idx} num="✗" text={text} color="#EF4444" />
            ))}
            <Para text="Violations may result in immediate account suspension or termination without refund." />
          </Section>

          {/* Intellectual Property */}
          <Section id="ip" title="7. Intellectual Property" accent="#0EA5E9">
            <Para text="The Service and all its content (excluding User Content) are owned by or licensed to Clickeros AI, Inc. and protected by intellectual property laws. We grant you a limited, non-exclusive, revocable license to use the app for your own business or personal use." />
            <Para text="AI-generated content (ad copy, suggestions, etc.) is provided for your use. You own the output you generate, but are responsible for ensuring it complies with applicable laws and platform policies before use." />
          </Section>

          {/* User Content */}
          <Section id="user-content" title="8. User Content" accent="#EC4899">
            <Para text="You retain ownership of content you upload (images, videos, campaign data). By submitting content, you grant us a license to host and process it solely to provide the Service." />
            <Para text="You are solely responsible for your content. You warrant that it does not infringe any third party's rights and complies with these Terms and all applicable laws." />
          </Section>

          {/* Disclaimers */}
          <Section id="disclaimers" title="9. Disclaimers" accent="#64748B">
            <HighlightBox type="warning" text='THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT AI-GENERATED CONTENT WILL BE SUITABLE FOR YOUR SPECIFIC USE CASE.' />
            <Para text="We make no guarantees about advertising performance, ROAS, revenue outcomes, or any other business results from using the Service." />
          </Section>

          {/* Limitation of Liability */}
          <Section id="limitation" title="10. Limitation of Liability" accent="#EF4444">
            <HighlightBox type="warning" text="TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY TO YOU SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID US IN THE PRECEDING 12 MONTHS, OR (B) $100 USD." />
            <Para text="We are not liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits or data." />
          </Section>

          {/* Termination */}
          <Section id="termination" title="11. Termination" accent="#F59E0B">
            <Para text="You may terminate your account at any time via app settings or by emailing support@clickeros.ai. We may suspend or terminate your access immediately for violations of these Terms." />
            <Para text="Upon termination, your right to use the Service ceases immediately. Sections on Intellectual Property, Disclaimers, Limitation of Liability, and Dispute Resolution survive termination." />
          </Section>

          {/* Dispute Resolution */}
          <Section id="disputes" title="12. Dispute Resolution" accent="#0EA5E9">
            <Para text="These Terms are governed by the laws of the State of Delaware, USA. Before filing any formal claim, you agree to first contact us at legal@clickeros.ai to attempt informal resolution within 30 days." />
            <Para text="Unresolved disputes shall be settled by binding arbitration under AAA rules on an individual basis only. Class action lawsuits and class-wide arbitration are waived." />
            <HighlightBox type="info" text="EU/UK Users: You retain the right to bring claims before your local courts or data protection authority under applicable EU/UK consumer protection law." />
          </Section>

          {/* Changes */}
          <Section id="changes" title="13. Changes to These Terms" accent="#64748B">
            <Para text="We may update these Terms at any time. We will notify you of material changes via in-app notification and email at least 30 days before changes take effect. Continued use of the Service after changes constitutes acceptance." />
          </Section>

          {/* Contact */}
          <Section id="contact" title="14. Contact Us" accent="#7C3AED">
            <Para text="For questions about these Terms, please contact us:" />
            <View style={{ backgroundColor: "#7C3AED10", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#7C3AED30", gap: 8 }}>
              {[
                ["Company", COMPANY],
                ["General Support", "support@clickeros.ai"],
                ["Legal Inquiries", "legal@clickeros.ai"],
                ["Billing Issues", "billing@clickeros.ai"],
                ["Website", "https://clickeros.ai"],
              ].map(([label, value]) => (
                <View key={label} style={{ flexDirection: "row", gap: 8 }}>
                  <Text style={{ color: "#7C3AED", fontSize: 12, fontWeight: "700", width: 120 }}>{label}:</Text>
                  <Text style={{ color: colors.foreground, fontSize: 12, flex: 1 }}>{value}</Text>
                </View>
              ))}
            </View>
          </Section>

          {/* Privacy Policy Link */}
          <TouchableOpacity
            style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}
            onPress={() => router.push("/privacy-policy" as any)}
            activeOpacity={0.7}
          >
            <IconSymbol name="lock.fill" size={20} color="#7C3AED" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>Privacy Policy</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 1 }}>View how we collect and use your data</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.muted} />
          </TouchableOpacity>

          {/* Footer */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: "center" }}>
            <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", lineHeight: 18 }}>
              © 2026 Clickeros AI, Inc. All rights reserved.{"\n"}
              These Terms are effective as of {EFFECTIVE_DATE}.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
