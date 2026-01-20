import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      colors: {
        brand: {
          navy: "#0B1F2A",
          navy2: "#102B3A",
          gold: "#F5B400",
          gold2: "#D89B00",
          bg: "#F6F8FB",
          ink: "#0B1220",
          line: "#E5E7EB",
        },
      },
    },
  },
  plugins: []
} satisfies Config;
