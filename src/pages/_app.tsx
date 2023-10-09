import { type AppType } from 'next/app';
import Head from 'next/head';

import { Header } from '~/components/header';
import { Chat } from '~/components/chat';

import { api } from '~/utils/api';

import '~/styles/globals.css';

import { Inter, Source_Serif_4 } from 'next/font/google';

const sourceSerif4 = Source_Serif_4({
	display: 'swap',
	subsets: ['latin'],
	axes: ['opsz'],
	variable: '--font-display'
});

const inter = Inter({
	display: 'swap',
	subsets: ['latin'],
	variable: '--font-sans'
});

const App: AppType = ({ Component, pageProps, router }) => {
	return (
		<>
			{/* give root access to the font variable */}
			<style jsx global>{`
				:root {
					--font-display: ${sourceSerif4.style.fontFamily};
					--font-sans: ${inter.style.fontFamily};
				}
			`}</style>

			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>

				<meta
					key="description"
					name="description"
					content="The largest paving stone manufacturer in Jamaica. Transform your outdoor walkway, deck, patio, or plaza into a functional work of art."
				/>
				<meta
					key="og:title"
					property="og:title"
					content="Millennium Paving Stones LTD."
				/>
				<meta
					key="og:description"
					property="og:description"
					content="The largest paving stone manufacturer in Jamaica. Transform your outdoor walkway, deck, patio, or plaza into a functional work of art."
				/>
				<meta
					key="og:image"
					property="og:image"
					content="https://millpave.notprimitive.com/og-image.jpg"
				/>
			</Head>

			<Header minimal={router.pathname === '/quote-studio'} />
			<Chat hide={router.pathname === '/quote-studio'} />

			<Component {...pageProps} />
		</>
	);
};

export default api.withTRPC(App);
