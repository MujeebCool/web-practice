/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        arabic: ["Amiri", "serif"],
      },
      colors: {
        /* ── Core palette ── */
        navy: {
          DEFAULT: "#0A0F1C",
          light: "#1A2340",
          mid: "#0F1629",
          dark: "#060A14",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#D4BA6A",
          dim: "rgba(201,168,76,0.2)",
          muted: "rgba(201,168,76,0.08)",
        },
        ivory: "#FAF7F2",
        ink: "#1A1A1A",
        muted: "#6B7280",
        /* ── Legacy compat (can remove later) ── */
        cream: "#FAF7F2",
      },
      /* ── Custom keyframe animations ── */
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201,168,76,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(201,168,76,0.3)" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "draw-line": "draw-line 2s ease-out forwards",
        "fade-up": "fade-up 0.8s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "rotate-slow": "rotate-slow 120s linear infinite",
        "scale-in": "scale-in 0.5s ease-out forwards",
      },
      /* ── Extended utilities ── */
      backdropBlur: {
        xs: "2px",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
    },
  },
  plugins: [],
};
