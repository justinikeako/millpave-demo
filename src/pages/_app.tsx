import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import { Header } from '../components/header';
import { Footer } from '../components/footer';
import Head from 'next/head';
import { Chat } from '../components/chat';
import '../styles/globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({
	display: 'swap',
	subsets: ['latin'],
	variable: '--font-inter'
});

const MyApp: AppType = ({ Component, pageProps, router }) => {
	const showLayout = router.route !== '/quote-builder';

	return (
		<>
			{/* give root access to the font variable */}
			<style jsx global>{`
				:root {
					--font-inter: ${inter.style.fontFamily};
				}
			`}</style>

			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
			</Head>

			{/* This prevents the header's enter animation from offsetting scroll on reload */}
			<div id="top" aria-hidden>
				Top
			</div>

			{showLayout && <Header />}

			<Component {...pageProps} />

			{showLayout && <Footer />}

			{showLayout && <Chat />}
		</>
	);
};

export default trpc.withTRPC(MyApp);
