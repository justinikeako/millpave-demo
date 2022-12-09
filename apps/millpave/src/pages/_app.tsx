import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import '../styles/globals.css';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import Head from 'next/head';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
			</Head>

			<Header />
			<Component {...pageProps} />
			<Footer />
		</>
	);
};

export default trpc.withTRPC(MyApp);
