const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		container: {
			center: true
		},

		fontFamily: {
			display: ['var(--font-display)', 'serif'],
			sans: ['var(--font-sans)', 'sans-serif']
		},

		fontSize: {
			sm: ['12px', { lineHeight: '18px' }],
			base: ['13px', { lineHeight: '20px' }],
			lg: [
				'clamp(16px, calc(1rem + ((1vw - 4.2px) * 0.4651)), 20px)',
				{ lineHeight: '1.5', fontWeight: '500' }
			],
			xl: [
				'clamp(24px, calc(1.5rem + ((1vw - 4.2px) * 0.4651)), 28px)',
				{ lineHeight: '1.15', fontWeight: '500', letterSpacing: '-0.01em' }
			],
			'2xl': [
				'clamp(32px, calc(2rem + ((1vw - 4.2px) * 0.9302)), 40px)',
				{ lineHeight: '1.15', fontWeight: '500', letterSpacing: '-0.01em' }
			],
			'3xl': [
				'clamp(40px, calc(2.5rem + ((1vw - 4.2px) * 2.7907)), 64px)',
				{ lineHeight: '1.15', fontWeight: '500', letterSpacing: '-0.02em' }
			],
			'4xl': [
				'clamp(44px, calc(2.75rem + ((1vw - 4.2px) * 4.186)), 80px)',
				{ lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.02em' }
			],
			'5xl': [
				'clamp(48px, calc(3rem + ((1vw - 4.2px) * 5.5814)), 96px)',
				{ lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.02em' }
			]
		},

		extend: {
			screens: {
				xs: '480px',
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
				gray: colors.stone
			},

			boxShadow: {
				button: '0px 1px 2px 1px rgb(28 25 23 / 0.5)'
			}
		}
	},

	future: {
		hoverOnlyWhenSupported: true
	},

	plugins: [
		require('@tailwindcss/container-queries'),
		require('tailwind-gradient-mask-image')
	]
};
