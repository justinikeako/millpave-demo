import { NextPage } from 'next';
import Head from 'next/head';

const Page: NextPage = () => {
	return (
		<>
			<Head>
				<title>Create your Quote — Millennium Paving Stones</title>
			</Head>

			<main className="space-y-4 px-8 pt-16">
				<h1 className="font-display text-2xl font-semibold">
					Choose a shape to get started.
				</h1>
			</main>
		</>
	);
};

export default Page;
