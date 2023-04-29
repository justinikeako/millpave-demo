import { env } from './src/env/server.mjs';

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
	return config;
}

export default defineNextConfig({
	reactStrictMode: true,
	experimental: {
		appDir: true
	},
	webpack: (config) => {
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
			topLevelAwait: true
		};

		return config;
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
});
