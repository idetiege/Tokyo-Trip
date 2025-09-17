
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      }
    },
  },
  plugins: [],
};
export default config;
