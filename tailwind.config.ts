import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';

export default {
	content: ['./src/**/*.tsx'],
	theme: {
		container: {
			center: true
		},

		fontFamily: {
			display: ['var(--font-display)', 'serif'],
			sans: ['var(--font-sans)', 'sans-serif']
		},

		extend: {
			fontSize: {
				sm: ['12px', { lineHeight: '18px' }],
				base: ['13px', { lineHeight: '20px' }]
			},

			screens: {
				xs: '480px'
			},

			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' }
				},
				strokeFlash: {
					'0%': { stroke: 'currentColor' },
					'100%': { stroke: 'transparent' }
				}
			},

			animation: {
				marquee: 'marquee 120s linear infinite',
				'stroke-flash': 'strokeFlash 750ms ease-out'
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
		require('tailwind-gradient-mask-image'),
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.bg-radial-gradient': {
					'--tw-bg-radial-gradient-size-and-position':
						'var(--tw-bg-radial-gradient-size) at var(--tw-bg-radial-gradient-position)',
					'background-image':
						'radial-gradient(var(--tw-bg-radial-gradient-size-and-position), var(--tw-gradient-stops))'
				},
				'.bg-circular-gradient': {
					'--tw-bg-radial-gradient-size-and-position':
						'circle var(--tw-bg-radial-gradient-size) at var(--tw-bg-radial-gradient-position)',
					'background-image':
						'radial-gradient(var(--tw-bg-radial-gradient-size-and-position), var(--tw-gradient-stops))'
				},

				'.radial-closest-side': {
					'--tw-bg-radial-gradient-size': 'closest-side'
				},
				'.radial-farthest-side': {
					'--tw-bg-radial-gradient-size': 'farthest-side'
				},
				'.radial-closest-corner': {
					'--tw-bg-radial-gradient-size': 'closest-corner'
				},
				'.radial-farthest-corner': {
					'--tw-bg-radial-gradient-size': 'farthest-corner'
				},

				'.radial-bottom': {
					'--tw-bg-radial-gradient-position': 'center bottom'
				},
				'.radial-bottom-left': {
					'--tw-bg-radial-gradient-position': 'left bottom'
				},
				'.radial-top': {
					'--tw-bg-radial-gradient-position': 'center top'
				}
			});
		})
	]
} satisfies Config;
