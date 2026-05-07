// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  // Tab bar icons
  "chart.bar.fill": "bar-chart",
  "megaphone.fill": "campaign",
  "wand.and.stars": "auto-awesome",
  "ellipsis.circle.fill": "more-horiz",
  "person.fill": "person",
  // Dashboard
  "bolt.fill": "bolt",
  "arrow.up.right": "trending-up",
  "plus.circle.fill": "add-circle",
  "eye.fill": "visibility",
  // Analytics
  "chart.line.uptrend.xyaxis": "show-chart",
  "chart.pie.fill": "pie-chart",
  "arrow.triangle.2.circlepath": "refresh",
  // Campaigns
  "flag.fill": "flag",
  "checkmark.circle.fill": "check-circle",
  "clock.fill": "access-time",
  "xmark.circle.fill": "cancel",
  // AI Features
  "sparkles": "auto-awesome",
  "brain": "psychology",
  "cpu.fill": "memory",
  "lightbulb.fill": "lightbulb",
  // Tools
  "wrench.fill": "build",
  "gear": "settings",
  "slider.horizontal.3": "tune",
  "target": "gps-fixed",
  // Growth
  "chart.xyaxis.line": "multiline-chart",
  "arrow.up.circle.fill": "arrow-circle-up",
  "dollarsign.circle.fill": "attach-money",
  "percent": "percent",
  // Content
  "doc.text.fill": "article",
  "video.fill": "videocam",
  "photo.fill": "photo",
  "link": "link",
  // Settings
  "bell.fill": "notifications",
  "lock.fill": "lock",
  "creditcard.fill": "credit-card",
  "person.2.fill": "group",
  "questionmark.circle.fill": "help",
  "star.fill": "star",
  "xmark": "close",
  "magnifyingglass": "search",
  "list.bullet": "list",
  "square.grid.2x2.fill": "grid-view",
  "trophy.fill": "emoji-events",
  "antenna.radiowaves.left.and.right": "wifi",
  "building.2.fill": "business",
  "globe": "language",
  "envelope.fill": "email",
  "phone.fill": "phone",
  "map.fill": "map",
  "location.fill": "location-on",
  "tag.fill": "local-offer",
  "bookmark.fill": "bookmark",
  "heart.fill": "favorite",
  "hand.thumbsup.fill": "thumb-up",
  "exclamationmark.triangle.fill": "warning",
  "info.circle.fill": "info",
  "checkmark": "check",
  "minus": "remove",
  "plus": "add",
  "trash.fill": "delete",
  "pencil": "edit",
  "square.and.arrow.up": "share",
  "arrow.down.circle.fill": "download",
  "arrow.up.circle": "upload",
  "repeat": "repeat",
  "shuffle": "shuffle",
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "stop.fill": "stop",
  "forward.fill": "fast-forward",
  "backward.fill": "fast-rewind",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
