import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bokani Theme Colors
        primary: '#111827', // Dark Gray/Black for text and nav
        accent: '#0b74de',  // The Bokani Blue
        secondary: '#f7f9fc', // Light background
        muted: '#5b6368',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'], // Kept specifically for academic headers if needed
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;