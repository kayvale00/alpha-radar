import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#050508",
          darker: "#0a0a12",
          dark: "#0f0f1a",
          card: "#12121f",
          border: "#1a1a2e",
        },
        neon: {
          green: "#00ff88",
          magenta: "#ff00aa",
          cyan: "#00f0ff",
          purple: "#a855f7",
        },
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "sans-serif"],
        body: ["var(--font-rajdhani)", "sans-serif"],
      },
      boxShadow: {
        "neon-green": "0 0 20px rgba(0, 255, 136, 0.4)",
        "neon-cyan": "0 0 20px rgba(0, 240, 255, 0.4)",
        "neon-magenta": "0 0 20px rgba(255, 0, 170, 0.4)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "scan": "scan 4s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
