/**
 * What's New Modal — shown once per app version after updates.
 *
 * Usage: Render <WhatsNewModal /> in the root layout or Dashboard.
 * It checks AsyncStorage for the last seen version and shows automatically.
 *
 * To add new features, update the CHANGELOG array below.
 */
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";

const WHATS_NEW_KEY = "@clickeros:last_seen_version";

// ── Changelog Data ────────────────────────────────────────────────────────────
// Add new entries at the TOP of the array when releasing a new version.

const APP_VERSION = "1.3.0";

interface ChangelogEntry {
  version: string;
  date: string;
  headline: string;
  features: Array<{
    icon: string;
    title: string;
    desc: string;
    badge?: "New" | "Improved" | "Fixed";
  }>;
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.3.0",
    date: "May 2026",
    headline: "Notifications, Security & Polish",
    features: [
      {
        icon: "🔔",
        title: "Push Notification Alerts",
        desc: "Get alerted when ROAS drops below your threshold or daily budget is exhausted.",
        badge: "New",
      },
      {
        icon: "📬",
        title: "In-App Notification Center",
        desc: "All campaign events, optimization results, and system messages in one place.",
        badge: "New",
      },
      {
        icon: "🔐",
        title: "Sign Out Everywhere",
        desc: "Instantly revoke all sessions and clear biometric sign-in from all devices.",
        badge: "New",
      },
      {
        icon: "📣",
        title: "Campaign Toast Notifications",
        desc: "Instant feedback when you pause, resume, or optimize a campaign.",
        badge: "Improved",
      },
    ],
  },
  {
    version: "1.2.0",
    date: "May 2026",
    headline: "Biometric Sign-In & Remember Me",
    features: [
      {
        icon: "👆",
        title: "Face ID & Touch ID Sign-In",
        desc: "Sign in with one tap using Face ID, Touch ID, or fingerprint on iOS and Android.",
        badge: "New",
      },
      {
        icon: "☑️",
        title: "Remember Me",
        desc: "Stay signed in and use biometrics for quick access on your next visit.",
        badge: "New",
      },
      {
        icon: "⚠️",
        title: "Session Expired Toast",
        desc: "Clear notification when your session expires, with a one-tap sign-in button.",
        badge: "Improved",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "April 2026",
    headline: "AI Ads Generator Overhaul",
    features: [
      {
        icon: "🤖",
        title: "Better AI Ad Quality",
        desc: "Grounded prompts, relevance scoring, and industry-specific templates for 7 verticals.",
        badge: "Improved",
      },
      {
        icon: "📋",
        title: "Campaign Templates",
        desc: "Pre-built templates for eCommerce, Local Business, Real Estate, SaaS, and more.",
        badge: "New",
      },
      {
        icon: "🔄",
        title: "AI Retry System",
        desc: "Automatically retries low-scoring ads and falls back to smart templates.",
        badge: "New",
      },
    ],
  },
];

// ── Badge Colors ──────────────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  New:      { bg: "#EDE9FE", text: "#7C3AED" },
  Improved: { bg: "#DCFCE7", text: "#16A34A" },
  Fixed:    { bg: "#FEF9C3", text: "#CA8A04" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function WhatsNewModal() {
  const colors = useColors();
  const r = useResponsive();
  const [visible, setVisible] = useState(false);
  const [currentEntry] = useState<ChangelogEntry>(CHANGELOG[0]);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const lastSeen = await AsyncStorage.getItem(WHATS_NEW_KEY);
        if (lastSeen !== APP_VERSION) {
          setVisible(true);
        }
      } catch {
        // Non-critical
      }
    };
    // Small delay so the app renders first
    const timer = setTimeout(checkVersion, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleDismiss = async () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      setVisible(false);
      try {
        await AsyncStorage.setItem(WHATS_NEW_KEY, APP_VERSION);
      } catch {}
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      {/* Backdrop */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          opacity: opacityAnim,
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: colors.background,
            borderRadius: 24,
            overflow: "hidden",
            transform: [{ scale: scaleAnim }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.3,
            shadowRadius: 40,
            elevation: 20,
          }}
        >
          {/* Header */}
          <View
            style={{
              backgroundColor: "#7C3AED",
              padding: 24,
              paddingBottom: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Text style={{ fontSize: 28 }}>🎉</Text>
              <View>
                <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: r.fontSize.xs, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  What's New in v{currentEntry.version}
                </Text>
                <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.xl, fontWeight: "800", marginTop: 1 }}>
                  {currentEntry.headline}
                </Text>
              </View>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: r.fontSize.xs }}>
              {currentEntry.date} · Clickeros AI
            </Text>
          </View>

          {/* Feature List */}
          <ScrollView
            style={{ maxHeight: 340 }}
            contentContainerStyle={{ padding: 20, gap: 14 }}
            showsVerticalScrollIndicator={false}
          >
            {currentEntry.features.map((feature, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 14,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "#7C3AED15",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{feature.icon}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <Text
                      style={{
                        color: colors.foreground,
                        fontSize: r.fontSize.base,
                        fontWeight: "700",
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {feature.title}
                    </Text>
                    {feature.badge && (
                      <View
                        style={{
                          backgroundColor: BADGE_STYLES[feature.badge].bg,
                          borderRadius: 4,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          flexShrink: 0,
                        }}
                      >
                        <Text
                          style={{
                            color: BADGE_STYLES[feature.badge].text,
                            fontSize: 9,
                            fontWeight: "700",
                          }}
                        >
                          {feature.badge.toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: r.fontSize.sm,
                      lineHeight: 18,
                    }}
                  >
                    {feature.desc}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={{ padding: 20, paddingTop: 12, gap: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#7C3AED",
                borderRadius: 14,
                height: 52,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleDismiss}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.lg, fontWeight: "700" }}>
                Got it — Let's go! 🚀
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: colors.muted,
                fontSize: r.fontSize.xs,
                textAlign: "center",
              }}
            >
              You can view the full changelog in Settings → What's New
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
