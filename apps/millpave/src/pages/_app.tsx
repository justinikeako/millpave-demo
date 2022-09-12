// src/pages/_app.tsx
import { withTRPC } from '@trpc/next';
import type { AppRouter } from '../server/router';
import type { AppType } from 'next/dist/shared/lib/utils';
import superjson from 'superjson';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

const getBaseUrl = () => {
	if (typeof window !== 'undefined') {
		return '';
	}
	if (process.browser) return ''; // Browser should use current path
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config() {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } }
		};
	},
	ssr: true,
	responseMeta: ({ clientErrors }) => {
		if (clientErrors[0]) {
			// propagate first http error from API calls
			return {
				status: clientErrors[0].data?.httpStatus ?? 500
			};
		}
		// cache full page for 1 day + revalidate once every second
		const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

		return {
			'Cache-Control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`
		};
	}
})(MyApp);
