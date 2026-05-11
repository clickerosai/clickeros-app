import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";

const SETTINGS_SECTIONS = [
  {
    title: "Account",
    items: [
      { label: "Profile", desc: "Name, email, and profile photo", icon: "👤", route: null },
      { label: "Notifications", desc: "Email and push notification preferences", icon: "🔔", route: null },
      { label: "Security", desc: "Password and two-factor authentication", icon: "🔒", route: null },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "Connected Accounts", desc: "Facebook, Google, TikTok, and more", icon: "🔗", route: "/integrations" },
      { label: "Team Members", desc: "Invite and manage team access", icon: "👥", route: null },
      { label: "API Access", desc: "Generate and manage API keys", icon: "⚙️", route: null },
    ],
  },
  {
    title: "Billing",
    items: [
      { label: "Billing & Plans", desc: "Subscription and payment management", icon: "💳", route: "/billing" },
      { label: "Pricing", desc: "View all available plans", icon: "🏷️", route: "/pricing" },
    ],
  },
  {
    title: "Legal & Privacy",
    items: [
      { label: "Privacy Policy", desc: "How we collect and use your data", icon: "🔐", route: "/privacy-policy" },
      { label: "Terms of Service", desc: "Terms governing use of Clickeros AI", icon: "📄", route: "/terms-of-service" },
      { label: "Cookie Policy", desc: "Cookies and tracking technologies", icon: "🍪", route: "/cookie-policy" },
      { label: "Data Safety", desc: "Google Play data safety information", icon: "🛡️", route: "/data-safety" },
      { label: "All Legal Documents", desc: "Privacy, permissions, and compliance hub", icon: "⚖️", route: "/legal" },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 16,
          borderBottomWidth: 1, borderBottomColor: colors.border,
        }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12, minHeight: 44 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: r.fontSize.base }}>Back</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize["2xl"], fontWeight: "700" }}>Settings</Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.base, marginTop: 4 }}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={{ paddingHorizontal: r.px, marginTop: 20 }}>
            <Text style={{
              color: colors.muted, fontSize: r.fontSize.xs,
              fontWeight: "700", textTransform: "uppercase",
              letterSpacing: 0.8, marginBottom: 8,
            }}>
              {section.title}
            </Text>
            <View style={{
              backgroundColor: colors.background, borderRadius: 16,
              borderWidth: 1, borderColor: colors.border, overflow: "hidden",
            }}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={{
                    flexDirection: "row", alignItems: "center",
                    paddingHorizontal: r.isXs ? 14 : 16,
                    minHeight: 56,
                    borderTopWidth: idx > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                    gap: 12,
                  }}
                  onPress={() => item.route && router.push(item.route as any)}
                  activeOpacity={item.route ? 0.7 : 1}
                >
                  <View style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: colors.surface,
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }} numberOfLines={1}>
                      {item.label}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }} numberOfLines={1}>
                      {item.desc}
                    </Text>
                  </View>
                  {item.route && (
                    <IconSymbol name="chevron.right" size={16} color={colors.muted} style={{ flexShrink: 0 }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Privacy Policy Highlight */}
        <View style={{ marginHorizontal: r.px, marginTop: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#7C3AED10", borderRadius: 16, padding: r.isXs ? 14 : 16,
              borderWidth: 1, borderColor: "#7C3AED30",
              flexDirection: "row", alignItems: "center", gap: 12,
              minHeight: 56,
            }}
            onPress={() => router.push("/legal" as any)}
            activeOpacity={0.7}
          >
            <View style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: "#7C3AED20", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <IconSymbol name="lock.fill" size={22} color="#7C3AED" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: "#7C3AED", fontSize: r.fontSize.base, fontWeight: "700" }}>Legal & Privacy Hub</Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>
                Privacy · Terms · Cookies · Data Safety · Permissions
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#7C3AED" style={{ flexShrink: 0 }} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ marginHorizontal: r.px, marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, textAlign: "center", lineHeight: 18 }}>
            Clickeros AI v1.0.0{"\n"}© 2026 Clickeros AI, Inc.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
