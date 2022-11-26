import NextError from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { Icon } from '../components/icon';
import { formatRelativeUpdate } from '../utils/format';
import { trpc } from '../utils/trpc';
import * as Dropdown from '../components/dropdown';
import { Button } from '../components/button';

function Page() {
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

			<main className="space-y-4 px-8 pb-8">
				<nav className="flex justify-end pt-12 pb-8">
					<Button variant="tertiary" asChild>
						<Link href="/products">
							<Icon name="category" />
						</Link>
					</Button>
				</nav>

				<h1 className="font-display text-2xl font-semibold">Quotes</h1>

				<ul>
					{quotes.data.map((quote) => (
						<li
							key={quote.id}
							className="flex items-center justify-between py-2"
						>
							<Link href={`/quote/${quote.id}`} className="w-[calc(100%-48px)]">
								<div className="flex items-center justify-between">
									<h4>{quote.title}</h4>
									<time className="flex items-center text-sm">
										<Icon name="history" className="text-base" weight={400} />
										{formatRelativeUpdate(quote.updatedAt)}
									</time>
								</div>

								<p className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-500">
									{quote.items.length > 0
										? quote.items
												.map((item) => item.displayName)
												.toString()
												.replace(/,/, ', ')
										: 'No items yet.'}
								</p>
							</Link>

							<Dropdown.Menu>
								<Dropdown.MenuTrigger asChild>
									<Button variant="tertiary" aria-label="Customise options">
										<Icon name="more_horiz" />
									</Button>
								</Dropdown.MenuTrigger>

								<Dropdown.MenuContent
									sideOffset={-8}
									onClick={async () => {
										await deleteQuote.mutateAsync({ id: quote.id });

										await quotes.refetch();
									}}
								>
									<Dropdown.MenuItem className="text-red-600">
										Delete
									</Dropdown.MenuItem>
								</Dropdown.MenuContent>
							</Dropdown.Menu>
						</li>
					))}
				</ul>

				{quotes.data.length === 0 && (
					<p className="text-slate-500">No quotes found.</p>
				)}
			</main>
		</>
	);
}

export default Page;
