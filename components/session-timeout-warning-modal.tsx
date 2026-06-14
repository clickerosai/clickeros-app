/**
 * SessionTimeoutWarningModal — Shows a 60-second countdown before auto-logout.
 *
 * Features:
 * - Animated modal with backdrop
 * - Large countdown timer (MM:SS format)
 * - Security warning message
 * - "Stay Logged In" button to cancel logout
 * - "Log Out Now" button for immediate logout
 * - Professional violet branding
 * - Works on web, iOS, Android, and tablets
 */

import React, { useMemo } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface SessionTimeoutWarningModalProps {
  visible: boolean;
  secondsRemaining: number;
  onStayLoggedIn: () => void;
  onLogOutNow: () => void;
  isLoggingOut?: boolean;
}

export function SessionTimeoutWarningModal({
  visible,
  secondsRemaining,
  onStayLoggedIn,
  onLogOutNow,
  isLoggingOut = false,
}: SessionTimeoutWarningModalProps) {
  const colors = useColors();
  const { width, height } = useWindowDimensions();

  // Format seconds as MM:SS
  const timeDisplay = useMemo(() => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [secondsRemaining]);

  // Color warning based on time remaining
  const timerColor = useMemo(() => {
    if (secondsRemaining <= 10) return "#EF4444"; // Red
    if (secondsRemaining <= 30) return "#F59E0B"; // Amber
    return "#7C3AED"; // Violet
  }, [secondsRemaining]);

  // Web: Use fixed positioning overlay
  if (Platform.OS === "web") {
    return (
      <div
        style={{
          display: visible ? "flex" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10000,
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 32,
            maxWidth: 400,
            width: "90%",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
            }}
          >
            ⏱️
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: colors.foreground,
              marginBottom: 8,
              margin: "0 0 8px 0",
            }}
          >
            Session Expiring Soon
          </h2>

          {/* Message */}
          <p
            style={{
              fontSize: 14,
              color: colors.muted,
              marginBottom: 24,
              lineHeight: 1.5,
              margin: "0 0 24px 0",
            }}
          >
            Your session will expire due to inactivity. Please interact with the app to stay logged in.
          </p>

          {/* Timer */}
          <div
            style={{
              fontSize: 56,
              fontWeight: "700",
              color: timerColor,
              fontFamily: "monospace",
              marginBottom: 24,
              letterSpacing: 2,
            }}
          >
            {timeDisplay}
          </div>

          {/* Subtext */}
          <p
            style={{
              fontSize: 12,
              color: colors.muted,
              marginBottom: 24,
              margin: "0 0 24px 0",
            }}
          >
            seconds remaining
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexDirection: "column",
            }}
          >
            {/* Stay Logged In Button */}
            <button
              onClick={onStayLoggedIn}
              disabled={isLoggingOut}
              style={{
                backgroundColor: colors.primary,
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 16,
                fontWeight: "600",
                cursor: isLoggingOut ? "not-allowed" : "pointer",
                opacity: isLoggingOut ? 0.6 : 1,
                transition: "opacity 200ms",
              }}
            >
              {isLoggingOut ? "Logging Out..." : "Stay Logged In"}
            </button>

            {/* Log Out Now Button */}
            <button
              onClick={onLogOutNow}
              disabled={isLoggingOut}
              style={{
                backgroundColor: "transparent",
                color: "#EF4444",
                border: `2px solid #EF4444`,
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 16,
                fontWeight: "600",
                cursor: isLoggingOut ? "not-allowed" : "pointer",
                opacity: isLoggingOut ? 0.6 : 1,
                transition: "opacity 200ms",
              }}
            >
              Log Out Now
            </button>
          </div>

          {/* Security Note */}
          <p
            style={{
              fontSize: 11,
              color: colors.muted,
              marginTop: 16,
              fontStyle: "italic",
            }}
          >
            🔒 Your session is being logged out for security. Any unsaved work will be preserved.
          </p>
        </div>
      </div>
    );
  }

  // Mobile: Use React Native Modal
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      {/* Backdrop */}
      <View
        className="absolute inset-0 bg-black/50"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />

      {/* Modal Content */}
      <View
        className="flex-1 items-center justify-center p-6"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          zIndex: 2,
        }}
      >
        <View
          className="w-full rounded-2xl p-8 shadow-lg"
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 32,
            maxWidth: 400,
            width: "100%",
          }}
        >
          {/* Icon */}
          <Text
            style={{
              fontSize: 48,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            ⏱️
          </Text>

          {/* Title */}
          <Text
            className="text-center text-xl font-bold mb-2"
            style={{
              color: colors.foreground,
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Session Expiring Soon
          </Text>

          {/* Message */}
          <Text
            className="text-center text-sm text-muted mb-6"
            style={{
              color: colors.muted,
              fontSize: 14,
              marginBottom: 24,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Your session will expire due to inactivity. Please interact with the app to stay logged in.
          </Text>

          {/* Timer */}
          <Text
            style={{
              fontSize: 56,
              fontWeight: "700",
              color: timerColor,
              fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
              marginBottom: 24,
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            {timeDisplay}
          </Text>

          {/* Subtext */}
          <Text
            className="text-center text-xs text-muted mb-6"
            style={{
              color: colors.muted,
              fontSize: 12,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            seconds remaining
          </Text>

          {/* Buttons */}
          <View className="gap-3 w-full">
            {/* Stay Logged In Button */}
            <Pressable
              onPress={onStayLoggedIn}
              disabled={isLoggingOut}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 16,
                opacity: pressed || isLoggingOut ? 0.8 : 1,
              })}
            >
              <Text
                className="text-center font-semibold"
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {isLoggingOut ? "Logging Out..." : "Stay Logged In"}
              </Text>
            </Pressable>

            {/* Log Out Now Button */}
            <Pressable
              onPress={onLogOutNow}
              disabled={isLoggingOut}
              style={({ pressed }) => ({
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: "#EF4444",
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 16,
                opacity: pressed || isLoggingOut ? 0.8 : 1,
              })}
            >
              <Text
                className="text-center font-semibold"
                style={{
                  color: "#EF4444",
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Log Out Now
              </Text>
            </Pressable>
          </View>

          {/* Security Note */}
          <Text
            className="text-center text-xs text-muted mt-4 italic"
            style={{
              color: colors.muted,
              fontSize: 11,
              marginTop: 16,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            🔒 Your session is being logged out for security. Any unsaved work will be preserved.
          </Text>
        </View>
      </View>
    </Modal>
  );
}
