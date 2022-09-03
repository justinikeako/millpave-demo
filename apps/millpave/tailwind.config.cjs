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
			sm: ['0.8rem', '1.5'],
			base: ['1rem', '1.5'],
			lg: ['1.25rem', '1.15'],
			xl: ['1.563rem', '1.15'],
			'2xl': ['1.953rem', '1.15'],
			'3xl': ['2.441rem', '1.15'],
			'4xl': ['3.052rem', '1.15']
		},

		extend: {
			lineHeight: {
				tight: '1.15'
			},

			borderRadius: {
				sm: '0.5rem',
				md: '0.75rem',
				lg: '1rem',
				xl: '1.5rem',
				'2xl': '2rem'
			}
		}
	},

	plugins: [require('@tailwindcss/aspect-ratio')]
};
