import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Automotive Luxury Accent (Titanium Bronze & Champagne Gold)
        bronze: {
          50: "#FAF7F2",
          100: "#F4EEE3",
          200: "#E7DCBF",
          300: "#D9C69A",
          400: "#C9AE73",
          500: "#B8964F", // Signature Titanium Bronze
          600: "#9E7B3B",
          700: "#7E5E2B",
          800: "#5E441D",
          900: "#412E11",
        },
        // Engineering Metallic Charcoal / Graphite Surface (Dark Theme)
        dark: {
          bg: "#0B0F15", // Deep Studio Carbon
          surface: "#111722",
          card: "#171F2C",
          border: "#232F42",
          text: "#F1F5F9",
          muted: "#94A3B8",
        },
        // Pure Engineering Ceramic / Aluminum Surface (Light Theme)
        light: {
          bg: "#F8FAFC", // Ceramic White
          surface: "#FFFFFF",
          card: "#FFFFFF",
          border: "#E2E8F0",
          text: "#0F172A",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-vazir)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lux: "0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        luxDark: "0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(201, 174, 115, 0.07)",
        glow: "0 0 25px rgba(201, 174, 115, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
