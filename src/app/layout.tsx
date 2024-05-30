import './globals.css';

import { Inter, Source_Serif_4 } from 'next/font/google';
import { cn } from '~/lib/utils';

import { TRPCReactProvider } from '~/trpc/react';
import { Chat } from '~/components/chat';
import { Header } from '~/components/header';

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

export const metadata = {
	title: 'Millennium Paving Stones LTD.',
	description:
		'The largest paving stone manufacturer in Jamaica. Transform your outdoor walkway, deck, patio, or plaza into a functional work of art.',
	metadataBase: new URL('https://millpave.notprimitive.com')
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={cn(
					'bg-gray-100 font-sans text-gray-900',
					inter.variable,
					sourceSerif4.variable
				)}
			>
				<Header />
				<Chat />

				<TRPCReactProvider>{children}</TRPCReactProvider>
			</body>
		</html>
	);
}
