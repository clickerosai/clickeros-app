/**
 * ErrorBoundary — Screen-level crash recovery component.
 *
 * Catches JavaScript errors in the component tree and shows
 * a friendly recovery screen instead of a white crash screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <MyScreen />
 *   </ErrorBoundary>
 */
import React, { Component, type ReactNode } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error.message);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
    this.setState({ errorInfo: info.componentStack ?? null });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937", textAlign: "center", marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 22, marginBottom: 24, maxWidth: 300 }}>
            This screen encountered an unexpected error. Your data is safe — tap below to try again.
          </Text>

          {/* Error details (dev only) */}
          {__DEV__ && this.state.error && (
            <ScrollView
              style={{ maxHeight: 120, width: "100%", backgroundColor: "#FEF2F2", borderRadius: 8, marginBottom: 20, padding: 10 }}
              showsVerticalScrollIndicator
            >
              <Text style={{ fontSize: 11, color: "#DC2626", fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" }}>
                {this.state.error.message}
              </Text>
            </ScrollView>
          )}

          <TouchableOpacity
            style={{ backgroundColor: "#7C3AED", borderRadius: 12, paddingHorizontal: 28, paddingVertical: 14, marginBottom: 12 }}
            onPress={this.handleReset}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ minHeight: 44, justifyContent: "center" }}
            onPress={() => {
              // Navigate to home as a last resort
              try {
                const { router } = require("expo-router");
                router.replace("/(tabs)");
              } catch {
                this.handleReset();
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={{ color: "#7C3AED", fontSize: 14, fontWeight: "600" }}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
