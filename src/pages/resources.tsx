import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Balancer } from 'react-wrap-balancer';
import { Button } from '~/components/button';
import { Main } from '~/components/main';

export default function Page() {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Resources — Millennium Paving Stones</title>
			</Head>

			<style jsx global>{`
				body {
					height: 100%;
				}

				header {
					position: absoltue !important;
					left: 0;
					right: 0;
					pointer-events: auto !important;
				}
			`}</style>

			<Main className="flex h-full flex-col justify-center gap-8 pb-24 sm:items-center">
				<h1 className="max-w-[21ch] font-display text-3xl xs:text-4xl sm:text-center sm:text-5xl">
					<Balancer>
						This page hasn&apos;t been built, but it could be&hellip;
					</Balancer>
				</h1>
				<p className="max-w-prose sm:text-center">
					It&apos;s intended to be functionally equivalent to&nbsp;
					<Link
						href="https://www.belgard.com/professional-resources/"
						target="_blank"
						className="text-pink-500 underline"
					>
						Belgard&apos;s resources page
					</Link>
					. It would serve as an all in one location for all of
					Millennium&apos;s helpful information, guides and online tools. A
					repository of resources about your products, their installation, and
					their maintenance for customers and contractors alike.
				</p>
				<div className="flex flex-wrap gap-2">
					<Button intent="primary" asChild>
						<Link
							href="https://www.belgard.com/professional-resources/"
							target="_blank"
						>
							See Resources Page
						</Link>
					</Button>
					<Button intent="secondary" onClick={router.back}>
						Return to Previous Page
					</Button>
				</div>
			</Main>
		</>
	);
}
