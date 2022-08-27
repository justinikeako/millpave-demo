/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			display: ['Inter Display', 'sans-serif'],
			body: ['Inter', 'sans-serif'],
			sans: ['Inter', 'sans-serif']
		},

		fontSize: {
			sm: '0.8rem',
			lg: '1.25rem',
			xl: '1.563rem',
			'2xl': '1.953rem',
			'3xl': '2.441rem',
			'4xl': '3.052rem'
		},

		extend: {
			lineHeight: {
				tight: '1.15'
			}
		}
	},

	plugins: []
};
