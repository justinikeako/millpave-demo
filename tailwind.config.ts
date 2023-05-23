import { type Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			sans: ['var(--font-inter)', 'sans-serif']
		},

		fontSize: {
			sm: ['0.8em', { lineHeight: '1.5' }],
			base: ['1em', { lineHeight: '1.5' }],
			lg: [
				'clamp(1.2em, calc(1.2em + ((1vw - 0.4em) * 0.4)), 1.4em)',
				{ lineHeight: '1.5', fontWeight: '500' }
			],
			xl: [
				'clamp(1.6em, calc(1.6em + ((1vw - 0.4em) * 0.8)), 2em)',
				{ lineHeight: '1.15', fontWeight: '500', letterSpacing: '-0.02em' }
			],
			'2xl': [
				'clamp(1.8em, calc(1.8em + ((1vw - 0.4em) * 1.8)), 2.8em)',
				{ lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.025em' }
			],
			'3xl': [
				' clamp(2.4em, calc(2.4em + ((1vw - 0.4em) * 3.2)), 4em)',
				{ lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.03em' }
			],
			'4xl': [
				'clamp(3.2em, calc(3.2em + ((1vw - 0.4em) * 4.8)), 5.4em)',
				{ lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.035em' }
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

	plugins: []
} satisfies Config;
