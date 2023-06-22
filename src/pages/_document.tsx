/* eslint-disable @next/next/google-font-display */
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en-US" className="text-gray-900">
			<Head>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..24,300..400,0..1,-50..200"
				/>
			</Head>
			<body className="bg-gray-100 text-gray-900">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
