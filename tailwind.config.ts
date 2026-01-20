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
      keyframes: {
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-once': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.5s ease-out',
        'spin-slow': 'spin-slow 1s linear infinite',
        'pulse-once': 'pulse-once 0.5s ease-in-out',
      },
    },
  },
  plugins: []
} satisfies Config;
