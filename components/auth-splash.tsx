/**
 * AuthSplash — Branded loading screen shown during session establishment.
 *
 * Displayed between the OAuth provider redirect and the Dashboard loading,
 * so users never see a blank white screen during the 1–2 second callback.
 *
 * Usage:
 *   if (isEstablishingSession) return <AuthSplash message="Signing you in…" />;
 */
import { View, Text, Image, ActivityIndicator, Animated, Platform } from "react-native";
import { useEffect, useRef } from "react";

interface AuthSplashProps {
  message?: string;
  subMessage?: string;
}

export function AuthSplash({
  message = "Signing you in…",
  subMessage = "Setting up your dashboard",
}: AuthSplashProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#7C3AED",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      {/* Animated Logo */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
          marginBottom: 48,
        }}
      >
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 72, height: 72, borderRadius: 16 }}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: "800",
            letterSpacing: -0.5,
            marginBottom: 6,
          }}
        >
          Clickeros AI
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 14,
            fontWeight: "400",
          }}
        >
          Turn Content Into Revenue — Automatically
        </Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          alignItems: "center",
          gap: 14,
        }}
      >
        <ActivityIndicator size="large" color="rgba(255,255,255,0.9)" />
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {message}
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          {subMessage}
        </Text>
      </Animated.View>

      {/* Bottom branding */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          position: "absolute",
          bottom: Platform.OS === "ios" ? 48 : 32,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 12,
          }}
        >
          © 2026 Clickeros AI, Inc.
        </Text>
      </Animated.View>
    </View>
  );
}
