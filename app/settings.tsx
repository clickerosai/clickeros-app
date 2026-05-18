import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useToast } from "@/components/toast";
import { clearBiometricToken } from "@/lib/biometric-auth";
import * as Auth from "@/lib/_core/auth";
import { trpc } from "@/lib/trpc";

const SETTINGS_SECTIONS = [
  {
    title: "Account",
    items: [
      { label: "Profile", desc: "Name, email, and profile photo", icon: "👤", route: null, action: null },
      { label: "Notifications", desc: "Email and push notification preferences", icon: "🔔", route: null, action: null },
      { label: "Security", desc: "Password and two-factor authentication", icon: "🔒", route: null, action: null },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "Connected Accounts", desc: "Facebook, Google, TikTok, and more", icon: "🔗", route: "/connect-accounts", action: null },
      { label: "Team Members", desc: "Invite and manage team access", icon: "👥", route: null, action: null },
      { label: "API Access", desc: "Generate and manage API keys", icon: "⚙️", route: null, action: null },
    ],
  },
  {
    title: "Billing",
    items: [
      { label: "Billing & Plans", desc: "Subscription and payment management", icon: "💳", route: "/billing", action: null },
      { label: "Pricing", desc: "View all available plans", icon: "🏷️", route: "/pricing", action: null },
    ],
  },
  {
    title: "Legal & Privacy",
    items: [
      { label: "Privacy Policy", desc: "How we collect, use, and protect your data", icon: "🔐", route: "/privacy-policy-screen", action: null },
      { label: "Terms of Service", desc: "The agreement governing your use of Clickeros AI", icon: "📋", route: "/terms-of-service-screen", action: null },
      { label: "Permission Disclosures", desc: "Camera, microphone, phone state, and accounts", icon: "📱", route: "/permission-disclosures", action: null },
      { label: "Cookie Policy", desc: "Cookies and tracking technologies", icon: "🍪", route: "/cookie-policy", action: null },
      { label: "Data Safety", desc: "Google Play data safety information", icon: "🛡️", route: "/data-safety", action: null },
      { label: "All Legal Documents", desc: "Full legal hub with all policies", icon: "⚖️", route: "/legal", action: null },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", desc: "FAQs, guides, and tutorials", icon: "❓", route: "/support-dashboard", action: null },
      { label: "Contact Support", desc: "Chat with our support team", icon: "💬", route: null, action: null },
      { label: "Report a Bug", desc: "Help us improve the app", icon: "🐛", route: null, action: null },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const { showToast } = useToast();
  const logoutMutation = trpc.auth.logout.useMutation();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSigningOutEverywhere, setIsSigningOutEverywhere] = useState(false);

  // ── Sign Out (current device only) ────────────────────────────────────────
  const handleSignOut = useCallback(() => {
    Alert.alert(
      "Sign Out",
      "You will be signed out of this device. Your campaigns and data will remain saved.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            setIsSigningOut(true);
            try {
              // Call server logout to clear cookie
              await logoutMutation.mutateAsync();
            } catch {
              // Continue even if server call fails
            }
            // Clear local session data
            await Auth.removeSessionToken();
            await Auth.clearUserInfo();

            showToast({
              type: "success",
              message: "Signed out successfully",
              subMessage: "See you next time!",
              duration: 3000,
            });

            setTimeout(() => {
              router.replace("/signup" as any);
            }, 500);
            setIsSigningOut(false);
          },
        },
      ]
    );
  }, [logoutMutation, router, showToast]);

  // ── Sign Out Everywhere (all devices + biometric token) ───────────────────
  const handleSignOutEverywhere = useCallback(() => {
    Alert.alert(
      "Sign Out Everywhere",
      "This will sign you out of all devices, clear your biometric sign-in, and invalidate all active sessions. You will need to sign in again on every device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out Everywhere",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
            setIsSigningOutEverywhere(true);
            try {
              // 1. Call server logout to clear session cookie
              await logoutMutation.mutateAsync();
            } catch {
              // Continue even if server call fails
            }

            // 2. Clear biometric token from keychain
            await clearBiometricToken();

            // 3. Clear local session token and user info
            await Auth.removeSessionToken();
            await Auth.clearUserInfo();

            if (Platform.OS !== "web") {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            showToast({
              type: "success",
              message: "Signed out everywhere ✅",
              subMessage: "All sessions cleared. Biometric sign-in removed.",
              duration: 4000,
            });

            setTimeout(() => {
              router.replace("/signup" as any);
            }, 800);
            setIsSigningOutEverywhere(false);
          },
        },
      ]
    );
  }, [logoutMutation, router, showToast]);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
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

        {/* Legal Quick Access */}
        <View style={{ marginHorizontal: r.px, marginTop: 20 }}>
          <View style={{
            backgroundColor: "#7C3AED10", borderRadius: 16, padding: r.isXs ? 14 : 16,
            borderWidth: 1, borderColor: "#7C3AED30",
          }}>
            <Text style={{ color: "#7C3AED", fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 12 }}>
              📄 Legal Documents
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {[
                { label: "Privacy Policy", route: "/privacy-policy-screen" },
                { label: "Terms of Service", route: "/terms-of-service-screen" },
                { label: "Permissions", route: "/permission-disclosures" },
              ].map((link) => (
                <TouchableOpacity
                  key={link.label}
                  style={{ backgroundColor: "#7C3AED20", borderRadius: 8, paddingHorizontal: 12, height: 36, alignItems: "center", justifyContent: "center" }}
                  onPress={() => router.push(link.route as any)}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: "#7C3AED", fontSize: r.fontSize.xs, fontWeight: "600" }}>{link.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Sign Out Section ── */}
        <View style={{ paddingHorizontal: r.px, marginTop: 24 }}>
          <Text style={{
            color: colors.muted, fontSize: r.fontSize.xs,
            fontWeight: "700", textTransform: "uppercase",
            letterSpacing: 0.8, marginBottom: 8,
          }}>
            Session
          </Text>

          {/* Sign Out (this device) */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.background,
              borderRadius: 14, borderWidth: 1, borderColor: colors.border,
              flexDirection: "row", alignItems: "center",
              paddingHorizontal: r.isXs ? 14 : 16, minHeight: 56,
              gap: 12, marginBottom: 10,
              opacity: isSigningOut ? 0.6 : 1,
            }}
            onPress={handleSignOut}
            activeOpacity={0.7}
            disabled={isSigningOut || isSigningOutEverywhere}
          >
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#FEF9C3", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isSigningOut ? (
                <ActivityIndicator size="small" color="#D97706" />
              ) : (
                <Text style={{ fontSize: 18 }}>🚪</Text>
              )}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: "#D97706", fontSize: r.fontSize.base, fontWeight: "600" }}>
                {isSigningOut ? "Signing out…" : "Sign Out"}
              </Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }}>
                Sign out of this device only
              </Text>
            </View>
          </TouchableOpacity>

          {/* Sign Out Everywhere */}
          <TouchableOpacity
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 14, borderWidth: 1.5, borderColor: "#FCA5A5",
              flexDirection: "row", alignItems: "center",
              paddingHorizontal: r.isXs ? 14 : 16, minHeight: 56,
              gap: 12,
              opacity: isSigningOutEverywhere ? 0.6 : 1,
            }}
            onPress={handleSignOutEverywhere}
            activeOpacity={0.7}
            disabled={isSigningOut || isSigningOutEverywhere}
          >
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isSigningOutEverywhere ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <Text style={{ fontSize: 18 }}>🔐</Text>
              )}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: "#DC2626", fontSize: r.fontSize.base, fontWeight: "700" }}>
                {isSigningOutEverywhere ? "Signing out everywhere…" : "Sign Out Everywhere"}
              </Text>
              <Text style={{ color: "#DC2626", fontSize: r.fontSize.xs, marginTop: 1, opacity: 0.75 }}>
                Clears all sessions, biometric sign-in, and keychain tokens
              </Text>
            </View>
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
