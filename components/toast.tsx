/**
 * Global Toast Notification System
 *
 * Usage:
 *   // In any component:
 *   const { showToast } = useToast();
 *   showToast({ message: "Session expired", type: "warning" });
 *
 *   // Wrap app in <ToastProvider> (done in _layout.tsx)
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Platform,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  message: string;
  subMessage?: string;
  type?: ToastType;
  duration?: number; // ms, default 4000
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  hideToast: (id: string) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
  hideToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

// ── Toast Item Component ──────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ToastType, { bg: string; border: string; icon: string; textColor: string }> = {
  success: { bg: "#F0FDF4", border: "#22C55E", icon: "✅", textColor: "#166534" },
  error:   { bg: "#FEF2F2", border: "#EF4444", icon: "❌", textColor: "#991B1B" },
  warning: { bg: "#FFFBEB", border: "#F59E0B", icon: "⚠️", textColor: "#92400E" },
  info:    { bg: "#EFF6FF", border: "#3B82F6", icon: "ℹ️", textColor: "#1E40AF" },
};

function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const { width } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = TYPE_CONFIG[item.type ?? "info"];

  React.useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss
    const timer = setTimeout(() => {
      dismiss();
    }, item.duration ?? 4000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(item.id));
  }, [item.id, onDismiss]);

  const maxWidth = Math.min(width - 32, 480);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        width: maxWidth,
        alignSelf: "center",
        marginBottom: 8,
      }}
    >
      <View
        style={{
          backgroundColor: config.bg,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: config.border,
          padding: 14,
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {/* Icon */}
        <Text style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{config.icon}</Text>

        {/* Content */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              color: config.textColor,
              fontSize: 14,
              fontWeight: "700",
              lineHeight: 20,
            }}
          >
            {item.message}
          </Text>
          {item.subMessage && (
            <Text
              style={{
                color: config.textColor,
                fontSize: 12,
                lineHeight: 18,
                marginTop: 2,
                opacity: 0.8,
              }}
            >
              {item.subMessage}
            </Text>
          )}
          {item.action && (
            <TouchableOpacity
              onPress={() => {
                item.action?.onPress();
                dismiss();
              }}
              activeOpacity={0.7}
              style={{ marginTop: 8 }}
            >
              <Text
                style={{
                  color: config.border,
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                {item.action.label} →
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dismiss button */}
        <TouchableOpacity
          onPress={dismiss}
          activeOpacity={0.7}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: `${config.border}20`,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Text style={{ color: config.textColor, fontSize: 14, fontWeight: "700" }}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ── Toast Provider ────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((options: ToastOptions) => {
    const id = `toast-${++counterRef.current}-${Date.now()}`;
    setToasts((prev) => {
      // Limit to 3 toasts at once
      const next = [...prev, { ...options, id }];
      return next.slice(-3);
    });
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Toast container — floats above all content */}
      {toasts.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: Platform.OS === "ios" ? 56 : 24,
            left: 16,
            right: 16,
            zIndex: 9999,
            pointerEvents: "box-none",
          }}
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} item={toast} onDismiss={hideToast} />
          ))}
        </View>
      )}
    </ToastContext.Provider>
  );
}
