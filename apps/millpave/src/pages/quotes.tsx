import { NextPage } from 'next';
import NextError from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import Button from '../components/button';
import { trpc } from '../utils/trpc';

const Page: NextPage = () => {
	const quotes = trpc.useQuery(['quote.getAll']);
	const deleteQuote = trpc.useMutation(['quote.delete']);

	if (!quotes.data) {
		if (quotes.error?.data?.code === 'NOT_FOUND')
			return <NextError statusCode={404} />;

		return null;
	}

	return (
		<>
			<Head>
				<title>All Quotes — Millennium Paving Stones</title>
			</Head>

			<main>
				<ul>
					{quotes.data.map((quote) => (
						<li key={quote.id}>
							<Link href={`/quote/${quote.id}`}>
								<a>
									{quote.id} {quote.title}
								</a>
							</Link>
							<Button
								variant="primary"
								onClick={() => {
									deleteQuote.mutate(
										{ id: quote.id },
										{
											onSuccess: () => {
												console.log(`Successfully deleted quote #${quote.id}`);
											}
										}
									);
								}}
							>
								delete
							</Button>
						</li>
					))}
				</ul>
			</main>
		</>
	);
};

export default Page;
