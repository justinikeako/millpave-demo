const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			display: ['InterVar', 'sans-serif'],
			body: ['InterVar', 'sans-serif'],
			sans: ['InterVar', 'sans-serif']
		},

		fontSize: {
			sm: [
				'clamp(0.707em, calc(0.8em + ((1vw - 0.4em) * -0.186)), 0.8em)',
				{ lineHeight: '1.5' }
			],
			base: ['1em', { lineHeight: '1.5' }],
			lg: [
				'clamp(1.25em, calc(1.25em + ((1vw - 0.4em) * 0.328)), 1.414em)',
				{ lineHeight: '1.5', fontWeight: '600' }
			],
			xl: [
				'clamp(1.563em, calc(1.563em + ((1vw - 0.4em) * 0.872)), 1.999em)',
				{ lineHeight: '1.15', fontWeight: '600' }
			],
			'2xl': [
				'clamp(1.953em, calc(1.953em + ((1vw - 0.4em) * 1.748)), 2.827em)',
				{ lineHeight: '1.15', fontWeight: '600' }
			],
			'3xl': [
				' clamp(2.441em, calc(2.441em + ((1vw - 0.4em) * 3.114)), 3.998em)',
				{ lineHeight: '1.15', fontWeight: '600' }
			],
			'4xl': [
				'clamp(3.052em, calc(3.052em + ((1vw - 0.4em) * 5.202)), 5.653em);',
				{ lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.02em' }
			]
		},

		extend: {
			screens: {
				md: '640px'
			},

			lineHeight: {
				tight: '1.15'
			},

			borderRadius: {
				sm: '0.25rem',
				md: '0.5rem',
				lg: '0.75rem',
				xl: '1rem',
				'2xl': '1.5rem'
			},

			colors: {
				bubblegum: colors.pink,
				gray: colors.zinc
			},

			boxShadow: {
				button: '0 0 4px 1px rgb(0 0 0 / 0.2), 0 4px 4px 1px rgb(0 0 0 / .1)'
			}
		}
	},

	future: {
		hoverOnlyWhenSupported: true
	},

	plugins: [
		require('tailwindcss-inner-border'),
		require('tailwindcss-radix')('')
	]
};
