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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)"],
      },
      fontSize: {
        xs: ['13px', '18px'],
        sm: ['15px', '22px'],
        base: ['17px', '26px'],
        lg: ['19px', '28px'],
        xl: ['22px', '30px'],
      },
      keyframes: {
        "gradient-flow": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "shine": {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        "caret": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        }
      },
      animation: {
        "gradient-flow": "gradient-flow 1.5s ease infinite",
        "shine": "shine 3s ease-in-out infinite",
        "caret": "caret 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
export default config;
