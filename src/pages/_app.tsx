import { createContext } from 'react';
import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import { Header } from '../components/header';
import { Footer } from '../components/footer';
import Head from 'next/head';
import { Chat } from '../components/chat';
import { AnimatePresence, motion } from 'framer-motion';
import '../styles/globals.css';

import localFont from 'next/font/local';
import { cn } from '@/lib/utils';

const Inter = localFont({
	src: './fonts/inter.var.woff2',
	display: 'swap',
	variable: '--font-inter'
});

const MyApp: AppType = ({ Component, pageProps, router }) => {
	const showLayout = router.route !== '/quote-builder';

	return (
		<>
			{/* give access to the font */}
			<style jsx global>{`
				:root {
					--font-inter: ${Inter.style.fontFamily};
				}
			`}</style>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
			</Head>

			<AnimatePresence
				mode="wait"
				initial={false}
				onExitComplete={() => {
					window.scrollTo({ top: 0 });
				}}
			>
				<motion.div
					key={router.asPath}
					initial={{ y: 5, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 5, opacity: 0 }}
					className={cn(Inter.variable, 'font-sans text-gray-900')}
					transition={{
						type: 'spring',
						duration: 0.3
					}}
				>
					<AnimatePresence initial>
						<>
							{showLayout && <Header />}
							<Component {...pageProps} />
						</>
					</AnimatePresence>
					{showLayout && <Footer />}
				</motion.div>
			</AnimatePresence>

			<Chat />
		</>
	);
};

export default trpc.withTRPC(MyApp);
