/**
 * OfflineBanner — Shows a persistent banner when the device is offline.
 *
 * Monitors network connectivity and displays a non-intrusive banner
 * at the top of the screen when there's no internet connection.
 *
 * Usage: Render inside ToastProvider in the root layout.
 *   <OfflineBanner />
 */
import { useEffect, useRef, useState } from "react";
import { Animated, Platform, Text, View } from "react-native";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === "web") return;

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const offline = !state.isConnected || state.isInternetReachable === false;
      setIsOffline((prev) => {
        if (!prev && offline) setWasOffline(false);
        if (prev && !offline) setWasOffline(true);
        return offline;
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOffline) {
      // Slide in
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else if (wasOffline) {
      // Show "back online" briefly then slide out
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: -60, duration: 300, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setWasOffline(false));
      }, 2000);
    }
  }, [isOffline, wasOffline]);

  if (!isOffline && !wasOffline) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        transform: [{ translateY }],
        opacity,
      }}
      pointerEvents="none"
    >
      <View
        style={{
          backgroundColor: isOffline ? "#1F2937" : "#22C55E",
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 14 }}>{isOffline ? "📡" : "✅"}</Text>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {isOffline
            ? "No internet connection — working offline"
            : "Back online"}
        </Text>
      </View>
    </Animated.View>
  );
}
