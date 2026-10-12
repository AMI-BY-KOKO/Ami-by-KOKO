import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* Colour tokens now defined in globals.css @theme — no duplicates here */
      fontFamily: {
        display: ["var(--font-display, system-ui)", "sans-serif"],
        body: ["var(--font-body, system-ui)", "sans-serif"],
      },
      animation: {
        "koko-bounce": "bounce 0.6s ease-in-out infinite",
        "shard-glow": "pulse 1.5s ease-in-out infinite",
      },
      minHeight: {
        tap: "48px", // minimum touch target
      },
      minWidth: {
        tap: "48px",
      },
    },
  },
  plugins: [],
};

export default config;
