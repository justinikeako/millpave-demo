// import withBundleAnalyzer from '@next/bundle-analyzer';

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
// function defineNextConfig(config) {
// 	return withBundleAnalyzer({
// 		enabled: process.env.ANALYZE === 'true'
// 	})(config);
// }

export default {
	reactStrictMode: true,

	// typescript: {
	// 	ignoreBuildErrors: true
	// },
	// eslint: {
	// 	ignoreDuringBuilds: true
	// },

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
				pathname: '/justinikeako/cornerstone-models/main/renders/**'
			}
		]
	},

	headers: async () => [
		{
			source: '/:all*(woff2|png|bin|gltf)',
			locale: false,
			headers: [
				{
					key: 'Cache-Control',
					value: 'public, max-age=31536000, stale-while-revalidate'
				}
			]
		}
	]
};
