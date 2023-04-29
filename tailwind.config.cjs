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
				'clamp(0.707rem, calc(0.8rem + ((1vw - 0.4rem) * -0.186)), 0.8rem)',
				{ lineHeight: '1.5' }
			],
			base: ['1rem', { lineHeight: '1.5' }],
			lg: [
				'clamp(1.25rem, calc(1.25rem + ((1vw - 0.4rem) * 0.328)), 1.414rem)',
				{ lineHeight: '1.5', fontWeight: '600' }
			],
			xl: [
				'clamp(1.563rem, calc(1.563rem + ((1vw - 0.4rem) * 0.872)), 1.999rem)',
				{ lineHeight: '1.15', fontWeight: '600' }
			],
			'2xl': [
				'clamp(1.953rem, calc(1.953rem + ((1vw - 0.4rem) * 1.748)), 2.827rem)',
				{ lineHeight: '1.15', fontWeight: '600' }
			],
			'3xl': [
				' clamp(2.441rem, calc(2.441rem + ((1vw - 0.4rem) * 3.114)), 3.998rem)',
				{ lineHeight: '1.15', fontWeight: '600' }
			],
			'4xl': [
				'clamp(3.052rem, calc(3.052rem + ((1vw - 0.4rem) * 5.202)), 5.653rem);',
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
