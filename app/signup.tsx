import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { startOAuthLogin } from "@/constants/oauth";

const FEATURES = [
  { icon: "🤖", title: "AI Ads Creator", desc: "Generate high-converting ads in seconds" },
  { icon: "📊", title: "Smart Analytics", desc: "Real-time ROAS, CTR, and revenue tracking" },
  { icon: "🚀", title: "Campaign Manager", desc: "Launch and optimize across all platforms" },
  { icon: "🎯", title: "Audience Intelligence", desc: "Find and target your ideal customers" },
];

const STATS = [
  { value: "12K+", label: "Active Users" },
  { value: "4.9★", label: "App Rating" },
  { value: "$2.4M", label: "Revenue Generated" },
];

export default function SignUpScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"google" | "apple" | null>(null);

  const handleOAuthLogin = useCallback(async (provider: "google" | "apple") => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsLoading(true);
    setLoadingType(provider);
    try {
      await startOAuthLogin();
    } catch (err) {
      Alert.alert(
        "Sign In Failed",
        "Could not connect to the authentication service. Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  }, []);

  const handleContinueAsGuest = useCallback(() => {
    router.replace("/(tabs)");
  }, [router]);

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Header */}
        <View style={{
          backgroundColor: "#7C3AED",
          paddingHorizontal: r.px,
          paddingTop: 40,
          paddingBottom: 48,
          alignItems: "center",
        }}>
          {/* Logo */}
          <View style={{
            width: 80, height: 80, borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 60, height: 60, borderRadius: 12 }}
              resizeMode="contain"
            />
          </View>

          <Text style={{ color: "#FFFFFF", fontSize: r.isXs ? 26 : 30, fontWeight: "800", textAlign: "center", marginBottom: 8 }}>
            Clickeros AI
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: r.fontSize.base, textAlign: "center", lineHeight: 22, maxWidth: 280 }}>
            Turn Content Into Revenue — Automatically
          </Text>

          {/* Stats Row */}
          <View style={{ flexDirection: "row", gap: 24, marginTop: 24 }}>
            {STATS.map((stat) => (
              <View key={stat.label} style={{ alignItems: "center" }}>
                <Text style={{ color: "#FFFFFF", fontSize: r.isXs ? 18 : 20, fontWeight: "800" }}>{stat.value}</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: r.fontSize.xs, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sign In Buttons */}
        <View style={{ paddingHorizontal: r.px, paddingTop: 28 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.xl, fontWeight: "700", marginBottom: 6, textAlign: "center" }}>
            Get Started Free
          </Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.base, textAlign: "center", marginBottom: 24 }}>
            No credit card required · Cancel anytime
          </Text>

          {/* Google Sign In */}
          <TouchableOpacity
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 14, height: 56,
              flexDirection: "row", alignItems: "center", justifyContent: "center",
              gap: 12, marginBottom: 12,
              borderWidth: 1, borderColor: colors.border,
              shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
              opacity: isLoading && loadingType !== "google" ? 0.5 : 1,
            }}
            onPress={() => handleOAuthLogin("google")}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading && loadingType === "google" ? (
              <ActivityIndicator color="#7C3AED" />
            ) : (
              <Text style={{ fontSize: 20 }}>🔍</Text>
            )}
            <Text style={{ color: "#1F2937", fontSize: r.fontSize.md, fontWeight: "600" }}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Apple Sign In (iOS only) */}
          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={{
                backgroundColor: "#000000",
                borderRadius: 14, height: 56,
                flexDirection: "row", alignItems: "center", justifyContent: "center",
                gap: 12, marginBottom: 12,
                opacity: isLoading && loadingType !== "apple" ? 0.5 : 1,
              }}
              onPress={() => handleOAuthLogin("apple")}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading && loadingType === "apple" ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={{ fontSize: 20, color: "#FFFFFF" }}>🍎</Text>
              )}
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.md, fontWeight: "600" }}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          )}

          {/* Divider */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 16 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Text style={{ color: colors.muted, fontSize: r.fontSize.sm }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>

          {/* Guest / Explore */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: 14, height: 56,
              flexDirection: "row", alignItems: "center", justifyContent: "center",
              gap: 8, borderWidth: 1, borderColor: colors.border,
            }}
            onPress={handleContinueAsGuest}
            activeOpacity={0.8}
          >
            <IconSymbol name="eye.fill" size={18} color={colors.muted} />
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.md, fontWeight: "600" }}>
              Explore Without Account
            </Text>
          </TouchableOpacity>

          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, textAlign: "center", marginTop: 12, lineHeight: 18 }}>
            By continuing, you agree to our{" "}
            <Text style={{ color: "#7C3AED" }} onPress={() => router.push("/terms-of-service" as any)}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={{ color: "#7C3AED" }} onPress={() => router.push("/privacy-policy" as any)}>
              Privacy Policy
            </Text>
          </Text>
        </View>

        {/* Feature Highlights */}
        <View style={{ paddingHorizontal: r.px, marginTop: 32 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 16, textAlign: "center" }}>
            Everything you need to grow
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {FEATURES.map((feature) => (
              <View
                key={feature.title}
                style={{
                  width: r.statCardWidth,
                  backgroundColor: colors.surface,
                  borderRadius: 14, padding: 14,
                  borderWidth: 1, borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 8 }}>{feature.icon}</Text>
                <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600", marginBottom: 4 }}>
                  {feature.title}
                </Text>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, lineHeight: 16 }}>
                  {feature.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Already have account */}
        <View style={{ paddingHorizontal: r.px, marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.sm }}>
            Already have an account?{" "}
            <Text
              style={{ color: "#7C3AED", fontWeight: "600" }}
              onPress={() => handleOAuthLogin("google")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
