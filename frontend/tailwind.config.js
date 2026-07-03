/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        accent: "#ec4899",
        glass: "rgba(255,255,255,0.6)",
        "bg-primary-opacity": "rgba(99,102,241,0.12)",
        "bg-secondary-opacity": "rgba(168,85,247,0.12)",
      },

      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },

      animation: {
        'scroll-infinite': 'scroll-infinite 40s linear infinite',
        'marquee-gradient': 'marquee-gradient 30s linear infinite',
        blob: "blob 7s infinite",
        float: "float 6s ease-in-out infinite",
      },

      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
          "100%": { transform: "translateY(0px)" },
        },
        'scroll-infinite': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-gradient': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },

      boxShadow: {
        glass: "0 10px 40px rgba(0,0,0,0.08)",
        glow: "0 0 30px rgba(99,102,241,0.35)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },

  plugins: [],
};