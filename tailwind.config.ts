import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4fa",
          100: "#d8e5f2",
          200: "#b4cce5",
          300: "#87abd4",
          400: "#5788bf",
          500: "#366ca7",
          600: "#29558b",
          700: "#234570",
          800: "#1e3a5e",
          900: "#132a48",
          950: "#0c1c31",
        },
        accent: {
          50: "#eefaf7",
          100: "#d6f2ec",
          200: "#b0e4da",
          300: "#80d0c4",
          400: "#54b5a8",
          500: "#3b9a8d",
          600: "#2f7c73",
          700: "#29635d",
          800: "#254f4b",
          900: "#22433f",
        },
        ink: {
          DEFAULT: "#101828",
          soft: "#475467",
          mute: "#667085",
          line: "#e4e7ec",
        },
        paper: "#f7f8fa",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)",
        lift: "0 8px 24px rgba(16,24,40,.08)",
      },
    },
  },
  plugins: [],
};
export default config;
