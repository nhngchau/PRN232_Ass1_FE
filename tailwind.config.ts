import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          hover: "oklch(var(--primary-hover) / <alpha-value>)",
          soft: "oklch(var(--primary-soft) / <alpha-value>)"
        },
        accent: "oklch(var(--accent) / <alpha-value>)",
        background: "oklch(var(--background) / <alpha-value>)",
        surface: "oklch(var(--surface) / <alpha-value>)",
        theme: {
          text: "oklch(var(--text) / <alpha-value>)",
          muted: "oklch(var(--text-muted) / <alpha-value>)",
          border: "oklch(var(--border) / <alpha-value>)"
        },
        coral: "#be123c",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
