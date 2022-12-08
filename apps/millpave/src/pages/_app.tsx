import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import '../styles/globals.css';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<Header />
			<Component {...pageProps} />
			<Footer />
		</>
	);
};

export default trpc.withTRPC(MyApp);
