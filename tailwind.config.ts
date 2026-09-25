import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        mist: "#eef3f8",
        ocean: "#0f766e",
        coral: "#be123c"
      }
    }
  },
  plugins: []
};

export default config;
