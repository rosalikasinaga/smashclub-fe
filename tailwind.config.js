/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0d1b1e", // Dark greenish black
                primary: "#00d6b5", // Teal/Cyan
                secondary: "#d2ff00", // Tennis ball yellow
                card: "#16282a", // Slightly lighter dark for cards
                "card-hover": "#1c3235",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}
