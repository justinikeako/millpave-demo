import { createContext } from 'react';
import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import { Header } from '../components/header';
import { Footer } from '../components/footer';
import Head from 'next/head';
import { Chat } from '../components/chat';
import { AnimatePresence, motion } from 'framer-motion';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps, router }) => {
	const showLayout = router.route !== '/quote-builder';

	return (
		<>
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
