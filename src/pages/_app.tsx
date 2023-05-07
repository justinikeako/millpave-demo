import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import '../styles/globals.css';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import Head from 'next/head';
import { Chat } from '../components/chat';
import { AnimatePresence, motion } from 'framer-motion';

const MyApp: AppType = ({ Component, pageProps, router }) => {
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
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<AnimatePresence initial>
						<Header />
						<Component {...pageProps} />
					</AnimatePresence>
					<Footer />
				</motion.div>
			</AnimatePresence>

			<Chat />
		</>
	);
};

export default trpc.withTRPC(MyApp);
