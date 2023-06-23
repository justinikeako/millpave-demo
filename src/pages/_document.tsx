/* eslint-disable @next/next/google-font-display */
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en-US" className="text-gray-900">
			<Head>
				<link rel="preload" as="image/svg+xml" href="sprite.svg" />
			</Head>
			<body className="bg-gray-100 text-gray-900">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
