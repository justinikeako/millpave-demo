import Head from 'next/head';
import { useRouter } from 'next/router';
import { Balancer } from 'react-wrap-balancer';
import { Button } from '~/components/button';
import { Main } from '~/components/main';

export default function Page() {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>How to Pay — Millennium Paving Stones</title>
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
					This page would be a step by step guide on how to perform a bank
					transfer into one of Millennium&apos;s accounts. That guide would be
					followed by a form which would let customers input their transfer
					reference number. All collected reference numbers would be
					automatically emailed to the relevant Millennium staff, to be
					verified.
				</p>
				<div className="flex flex-wrap gap-2">
					<Button intent="primary" onClick={router.back}>
						Return to Previous Page
					</Button>
				</div>
			</Main>
		</>
	);
}
