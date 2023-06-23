const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		container: {
			center: true
		},

		fontFamily: {
			display: ['var(--font-source-serif-4)', 'serif'],
			sans: ['var(--font-inter)', 'sans-serif']
		},

		fontSize: {
			sm: ['12px', { lineHeight: '18px' }],
			base: ['13px', { lineHeight: '20px' }],
			lg: ['20px', { lineHeight: '24px', fontWeight: '500' }],
			xl: [
				'28px',
				{ lineHeight: '32px', fontWeight: '500', letterSpacing: '-0.01em' }
			],
			'2xl': [
				'40px',
				{ lineHeight: '48px', fontWeight: '500', letterSpacing: '-0.01em' }
			],
			'3xl': [
				'64px',
				{ lineHeight: '72px', fontWeight: '500', letterSpacing: '-0.02em' }
			],
			'4xl': [
				'80px',
				{ lineHeight: '96px', fontWeight: '600', letterSpacing: '-0.02em' }
			],
			'5xl': [
				'96px',
				{ lineHeight: '112px', fontWeight: '600', letterSpacing: '-0.02em' }
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
