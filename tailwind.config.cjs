/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			display: ["Inter Display", "sans-serif"],
			body: ["Inter", "sans-serif"],
			sans: ["Inter", "sans-serif"],
		},
		fontSize: {
			sm: "0.75rem",
			lg: "1.333rem",
			xl: "1.777rem",
			"2xl": "2.369rem",
			"3xl": "3.157rem",
			"4xl": "4.209rem",
		},
	},
	plugins: [],
};
