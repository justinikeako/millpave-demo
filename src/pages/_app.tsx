import { type AppType } from 'next/app';
import Head from 'next/head';

import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Chat } from '@/components/chat';

import { api } from '../utils/api';

import '@/styles/globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({
	display: 'swap',
	subsets: ['latin'],
	variable: '--font-inter'
});

const MyApp: AppType = ({ Component, pageProps, router }) => {
	const showLayout = router.route !== '/quote-builder';

	let key = router.asPath as string;

	if (router.route === '/') key = '/';
	if (router.route.startsWith('/contact')) key = '/contact';
	if (router.route.startsWith('/products/')) key = '/products';
	if (router.route.startsWith('/product/')) {
		key = router.query.id;
		// Super ugly hack, but gSP will throw wierd errors if I don't use it :(
		(pageProps as { id: string }).id = router.query.id;
	}

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

			<Header simple={!showLayout} />
			<AnimatePresence
				mode="wait"
				initial={false}
				onExitComplete={() => {
					window.scrollTo({ top: 0 });
				}}
			>
				<motion.div
					id="nav-transition"
					key={key}
					className="min-h-full"
					initial={{ y: 5, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 5, opacity: 0 }}
					transition={{
						type: 'spring',
						duration: 0.3
					}}
				>
					<AnimatePresence initial>
						<Component {...pageProps} />
					</AnimatePresence>

					{showLayout && <Footer />}
				</motion.div>
			</AnimatePresence>

			{showLayout && <Chat />}
		</>
	);
};

export default api.withTRPC(MyApp);
