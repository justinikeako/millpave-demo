import { type AppType } from 'next/app';
import Head from 'next/head';

import { Header } from '~/components/header';
import { Chat } from '~/components/chat';

import { api } from '~/utils/api';

import '~/styles/globals.css';

import { Inter, Source_Serif_4 } from 'next/font/google';

const sourceSerif4 = Source_Serif_4({
	display: 'block',
	subsets: ['latin'],
	axes: ['opsz'],
	variable: '--font-source-serif-4'
});

const inter = Inter({
	display: 'block',
	subsets: ['latin'],
	variable: '--font-inter'
});

const App: AppType = ({ Component, pageProps }) => {
	return (
		<>
			{/* give root access to the font variable */}
			<style jsx global>{`
				:root {
					--font-inter: ${inter.style.fontFamily};
					--font-source-serif-4: ${sourceSerif4.style.fontFamily};
				}
			`}</style>

			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
			</Head>

			<Header />
			<Component {...pageProps} />

			<Chat />
		</>
	);
};

export default api.withTRPC(App);
