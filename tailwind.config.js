const { themeColors } = require("./theme.config");
const plugin = require("tailwindcss/plugin");

const tailwindColors = Object.fromEntries(
  Object.entries(themeColors).map(([name, swatch]) => [
    name,
    {
      DEFAULT: `var(--color-${name})`,
      light: swatch.light,
      dark: swatch.dark,
    },
  ]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "./lib/**/*.{js,ts,tsx}",
    "./hooks/**/*.{js,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],
  theme: {
    // Responsive breakpoints matching the spec:
    // Mobile: 320–767px, Tablet: 768–1023px, Desktop: 1024px+, Large: 1440px+
    screens: {
      sm: "480px",   // large phones / small tablets
      md: "768px",   // tablets
      lg: "1024px",  // laptops / desktop
      xl: "1280px",  // large desktop
      "2xl": "1440px", // ultrawide
    },
    extend: {
      colors: tailwindColors,
      // Responsive font sizes using clamp-like scale
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs:    ["12px", { lineHeight: "16px" }],
        sm:    ["13px", { lineHeight: "18px" }],
        base:  ["14px", { lineHeight: "20px" }],
        md:    ["15px", { lineHeight: "22px" }],
        lg:    ["16px", { lineHeight: "24px" }],
        xl:    ["18px", { lineHeight: "26px" }],
        "2xl": ["20px", { lineHeight: "28px" }],
        "3xl": ["24px", { lineHeight: "32px" }],
        "4xl": ["28px", { lineHeight: "36px" }],
        "5xl": ["32px", { lineHeight: "40px" }],
      },
      // Touch-friendly minimum sizes (44x44px per HIG)
      minHeight: {
        touch: "44px",
        "touch-lg": "52px",
      },
      minWidth: {
        touch: "44px",
      },
      // Max content widths for responsive containers
      maxWidth: {
        content: "860px",
        card: "480px",
        form: "560px",
        wide: "1200px",
      },
      // Responsive spacing
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
        "safe-top": "env(safe-area-inset-top, 0px)",
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        chip: "8px",
        pill: "999px",
      },
    },
  },
  plugins: [
    plugin(({ addVariant, addUtilities }) => {
      addVariant("light", ':root:not([data-theme="dark"]) &');
      addVariant("dark", ':root[data-theme="dark"] &');
      // Responsive container utility
      addUtilities({
        ".container-responsive": {
          width: "100%",
          maxWidth: "860px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "16px",
          paddingRight: "16px",
        },
        ".touch-target": {
          minHeight: "44px",
          minWidth: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".no-overflow": {
          overflow: "hidden",
          maxWidth: "100%",
        },
        ".text-responsive": {
          fontSize: "clamp(13px, 3.5vw, 16px)",
          lineHeight: "1.5",
        },
        ".heading-responsive": {
          fontSize: "clamp(18px, 5vw, 28px)",
          lineHeight: "1.3",
          fontWeight: "700",
        },
      });
    }),
  ],
};
