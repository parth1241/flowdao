import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#00080f",
        surface: "#000d1a",
        elevated: "#001224",
        high: "#001a33",
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9", // Primary
        },
        indigo: { 500: "#6366f1", 600: "#4f46e5" },
        violet: { 500: "#8b5cf6" },
        fuchsia: { 500: "#d946ef" },
        cyan: { 500: "#06b6d4" },
        amber: { 500: "#f59e0b" },
        rose: { 500: "#f43f5e", 600: "#e11d48" },
        slate: { 500: "#64748b" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        safari: ["Inter", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        shake: "shake 0.5s",
        voteFor: "voteFor 0.4s ease-out",
        voteAgainst: "voteAgainst 0.4s ease-out",
        proposalPass: "proposalPass 1s ease-out forwards",
        timelockSpin: "timelockSpin 3s linear infinite",
        progressFill: "progressFill 1s ease-out forwards",
        rotateBorder: "rotateBorder 4s linear infinite",
        bob1: "bob1 6s infinite ease-in-out",
        bob2: "bob2 8s infinite ease-in-out",
        bob3: "bob3 7s infinite ease-in-out",
        marquee: "marquee 20s linear infinite",
        spinRing: "spinRing 2s linear infinite",
        countPulse: "countPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        voteFor: {
          "0%": { backgroundColor: "rgba(14,165,233,0.8)", transform: "scale(1.05)" },
          "100%": { backgroundColor: "transparent", transform: "scale(1)" },
        },
        voteAgainst: {
          "0%": { backgroundColor: "rgba(244,63,94,0.8)", transform: "scale(1.05)" },
          "100%": { backgroundColor: "transparent", transform: "scale(1)" },
        },
        proposalPass: {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(14,165,233,0.7)" },
          "50%": { transform: "scale(1.02)", boxShadow: "0 0 20px 10px rgba(14,165,233,0)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(14,165,233,0)" },
        },
        timelockSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        progressFill: {
          "0%": { width: "0%" },
        },
        rotateBorder: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        bob1: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-20px) scale(1.05)" },
        },
        bob2: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-15px) scale(1.02)" },
        },
        bob3: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-25px) scale(1.08)" },
        },
        marquee: {
          "0%": { transform: "translateX(100vw)" },
          "100%": { transform: "translateX(-100%)" },
        },
        spinRing: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        countPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
     require("tailwindcss-animate"),
     require("@tailwindcss/typography"),
  ],
};

export default config;
