import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By downloading, installing, or using the Clickeros AI application or website (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

These Terms constitute a legally binding agreement between you and Clickeros AI, Inc. ("Clickeros," "we," "us," or "our"), a Delaware corporation. By using the Service, you represent that you are at least 13 years of age (or 16 in the EU) and have the legal capacity to enter into this agreement.`,
  },
  {
    id: "service",
    title: "2. Description of Service",
    content: `Clickeros AI provides an AI-powered digital advertising platform that enables users to create, manage, and optimize advertising campaigns across multiple platforms including Facebook, Instagram, Google Ads, TikTok, YouTube, LinkedIn, and Pinterest.

The Service includes AI ad generation, campaign management tools, analytics dashboards, audience intelligence features, SEO insights, and related marketing automation capabilities.

We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice to users.`,
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: `To access most features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

You agree to provide accurate, current, and complete information during registration and to update this information as necessary. You agree to notify us immediately at support@clickeros.ai if you suspect unauthorized access to your account.

We reserve the right to terminate accounts that violate these Terms, remain inactive for more than 12 months, or are used for fraudulent or harmful purposes.`,
  },
  {
    id: "subscriptions",
    title: "4. Subscriptions & Billing",
    content: `Clickeros AI offers the following subscription plans:

Free Plan: $0/month — Includes 5 AI ad generations per month, basic targeting, and Facebook/Instagram ads.

Pro Plan: $49/month — Includes unlimited AI ad generations, all 6 platforms, advanced targeting, A/B testing, and priority support.

Agency Plan: $149/month — Includes everything in Pro plus unlimited client accounts, white-label reports, team roles, and a dedicated account manager.

Billing occurs monthly or annually (annual plans receive a 20% discount). Subscriptions automatically renew unless cancelled at least 24 hours before the renewal date.

Refund Policy: We offer a 14-day money-back guarantee for new paid subscriptions. Refunds are not available after the 14-day period or for partial months. To request a refund, contact billing@clickeros.ai.

If you purchase through the Apple App Store or Google Play Store, billing is handled by the respective platform and their refund policies apply.`,
  },
  {
    id: "acceptable-use",
    title: "5. Acceptable Use Policy",
    content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service to:

Create or distribute misleading, deceptive, or fraudulent advertising content.

Advertise illegal products or services, including controlled substances, counterfeit goods, or services that violate applicable law.

Violate the advertising policies of any connected platform (Facebook, Google, TikTok, etc.).

Infringe upon the intellectual property rights of any third party.

Collect or harvest personal information from other users without their consent.

Attempt to gain unauthorized access to our systems or other users' accounts.

Use the Service to send spam, unsolicited communications, or bulk messages.

Engage in any activity that could damage, disable, or impair the Service.

Violation of this policy may result in immediate account suspension or termination without refund.`,
  },
  {
    id: "ip",
    title: "6. Intellectual Property",
    content: `The Service and its original content, features, and functionality are and will remain the exclusive property of Clickeros AI, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws.

Your Content: You retain ownership of all campaign data, ad copy, creative assets, and other content you create or upload through the Service ("Your Content"). By using the Service, you grant Clickeros a limited, non-exclusive license to process, store, and display Your Content solely for the purpose of providing the Service to you.

AI-Generated Content: Ad variations generated by our AI system based on your campaign inputs are owned by you. We do not claim ownership of AI-generated outputs created from your specific campaign data.

Feedback: If you provide feedback, suggestions, or ideas about the Service, you grant us a perpetual, irrevocable, royalty-free license to use that feedback without obligation to you.`,
  },
  {
    id: "third-party",
    title: "7. Third-Party Integrations",
    content: `The Service integrates with third-party advertising platforms (Facebook, Google, TikTok, etc.) and other services. Your use of these integrations is subject to the terms and policies of those third parties.

We are not responsible for the availability, accuracy, or content of third-party services. We do not endorse and are not responsible for any third-party advertising policies, decisions, or actions, including campaign approvals, rejections, or suspensions by ad platforms.

When you connect a third-party account, you authorize us to access and use data from that account as necessary to provide the Service.`,
  },
  {
    id: "disclaimers",
    title: "8. Disclaimers & Limitations",
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, CLICKEROS DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the Service will be uninterrupted, error-free, or free of viruses. We do not guarantee any specific advertising results, ROAS, conversion rates, or revenue outcomes. Advertising performance depends on many factors outside our control.

TO THE FULLEST EXTENT PERMITTED BY LAW, CLICKEROS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.

OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.`,
  },
  {
    id: "indemnification",
    title: "9. Indemnification",
    content: `You agree to defend, indemnify, and hold harmless Clickeros AI, Inc. and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.`,
  },
  {
    id: "termination",
    title: "10. Termination",
    content: `You may terminate your account at any time by contacting support@clickeros.ai or through the account settings in the app. Upon termination, your right to use the Service ceases immediately.

We may terminate or suspend your account immediately, without prior notice or liability, if you breach these Terms. Upon termination, we will delete your data in accordance with our Privacy Policy.

Provisions of these Terms that by their nature should survive termination shall survive, including intellectual property provisions, disclaimers, indemnification, and dispute resolution.`,
  },
  {
    id: "disputes",
    title: "11. Dispute Resolution",
    content: `Governing Law: These Terms are governed by the laws of the State of Delaware, without regard to its conflict of law provisions.

Arbitration: Any dispute arising from these Terms or your use of the Service shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, rather than in court. The arbitration shall take place in Delaware.

Class Action Waiver: You agree that any arbitration or proceeding shall be limited to the dispute between you and Clickeros individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.

EU/UK Exception: If you are a consumer in the EU or UK, you retain the right to bring claims in your local courts and to use the EU Online Dispute Resolution platform at ec.europa.eu/consumers/odr.

Small Claims: Either party may bring claims in small claims court if the claims qualify.`,
  },
  {
    id: "changes",
    title: "12. Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will provide at least 30 days' notice of material changes by posting the updated Terms in the app and sending an email notification to your registered address.

Your continued use of the Service after the effective date of any changes constitutes your acceptance of the new Terms. If you do not agree to the new Terms, you must stop using the Service and cancel your subscription before the effective date.`,
  },
  {
    id: "contact",
    title: "13. Contact Information",
    content: `For questions about these Terms, please contact:

Clickeros AI, Inc.
Legal Department
Email: legal@clickeros.ai
Support: support@clickeros.ai
Billing: billing@clickeros.ai

We aim to respond to all inquiries within 2 business days.`,
  },
];

function Section({ section }: { section: typeof SECTIONS[0] }) {
  const colors = useColors();
  const r = useResponsive();
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: colors.foreground, fontSize: r.fontSize.md, fontWeight: "700", marginBottom: 10 }}>
        {section.title}
      </Text>
      <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 22 }}>
        {section.content}
      </Text>
    </View>
  );
}

export default function TermsOfServiceScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ backgroundColor: "#064E3B", paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 28 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16, minHeight: 44 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: r.fontSize.base }}>Back</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Text style={{ fontSize: 24 }}>📋</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize["2xl"], fontWeight: "800" }}>
                Terms of Service
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: r.fontSize.xs, marginTop: 2 }}>
                Clickeros AI, Inc. · Effective May 15, 2026
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, marginTop: 16 }}>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: r.fontSize.sm, lineHeight: 20, fontWeight: "600" }}>
              The short version:
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: r.fontSize.xs, lineHeight: 18, marginTop: 4 }}>
              Use the Service lawfully. Don't misuse it. We offer a 14-day money-back guarantee. You own your content. We're not liable for ad performance results.
            </Text>
          </View>
        </View>

        {/* Pricing Summary */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 12 }}>
            Subscription Plans
          </Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            {[
              { plan: "Free", price: "$0/mo", features: "5 AI generations, basic targeting" },
              { plan: "Pro", price: "$49/mo", features: "Unlimited AI, all platforms, A/B testing" },
              { plan: "Agency", price: "$149/mo", features: "Everything + unlimited clients, white-label" },
            ].map((row, idx) => (
              <View key={row.plan} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: colors.border }}>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "700", width: 60 }}>{row.plan}</Text>
                <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "700", width: 70 }}>{row.price}</Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, flex: 1 }}>{row.features}</Text>
              </View>
            ))}
          </View>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 8 }}>
            14-day money-back guarantee on all paid plans. Annual plans save 20%.
          </Text>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: r.px, marginTop: 24 }}>
          {SECTIONS.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </View>

        {/* Footer Links */}
        <View style={{ paddingHorizontal: r.px, marginTop: 8 }}>
          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#BBF7D0" }}>
            <Text style={{ color: "#166534", fontSize: r.fontSize.sm, fontWeight: "700", marginBottom: 8 }}>
              Questions About These Terms?
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL("mailto:legal@clickeros.ai")}
              activeOpacity={0.7}
            >
              <Text style={{ color: "#16A34A", fontSize: r.fontSize.sm }}>
                legal@clickeros.ai
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Links */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, flexDirection: "row", justifyContent: "center", gap: 20 }}>
          <TouchableOpacity onPress={() => router.push("/privacy-policy-screen" as any)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center" }}>
            <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.border, fontSize: r.fontSize.sm, lineHeight: 44 }}>|</Text>
          <TouchableOpacity onPress={() => router.push("/permission-disclosures" as any)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center" }}>
            <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Permissions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
