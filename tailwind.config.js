/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          deep: "var(--primary-deep)",
          soft: "var(--primary-soft)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          secondary: "var(--ink-secondary)",
          mute: "var(--ink-mute)",
          "mute-2": "var(--ink-mute-2)",
          faint: "var(--ink-faint)",
        },
        canvas: {
          DEFAULT: "var(--canvas)",
          soft: "var(--canvas-soft)",
          night: "var(--canvas-night)",
          "night-soft": "var(--canvas-night-soft)",
        },
        hairline: {
          DEFAULT: "var(--hairline)",
          strong: "var(--hairline-strong)",
          cool: "var(--hairline-cool)",
          "cool-2": "var(--hairline-cool-2)",
          "cool-3": "var(--hairline-cool-3)",
        },
        "on-dark": "var(--on-dark)",
        "on-primary": "var(--on-primary)",
        accent: {
          purple: "#6b01c2",
          violet: "#644fc1",
          yellow: "#ffdb13",
          tomato: "#ff2201",
          pink: "#c7007e",
          indigo: "#054cff",
          crimson: "#e2005a",
        }
      },
      borderRadius: {
        xs: "4px",
        sm: "6px", // button signature
        md: "8px",
        lg: "12px", // card/mockup
        xl: "16px",
      },
      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        xxl: "32px",
        huge: "64px",
      },
      fontFamily: {
        sans: ["Inter", "Circular", "'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
        mono: ["ui-monospace", "Menlo", "Monaco", "Consolas", "'Liberation Mono'", "monospace"],
      }
    },
  },
  plugins: [],
}

