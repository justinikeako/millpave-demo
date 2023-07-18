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
				<title>Augmented Reality Gallery — Millennium Paving Stones</title>
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
						href="https://rooms.belgard.com/"
						target="_blank"
						className="text-pink-500 underline"
					>
						Belgard Rooms
					</Link>
					. It would let customers view 3D models of entire sections of a space,
					(e.g. paved outdoor dining rooms, kitchens, gardens, and much more),
					as if it were surrounding them. This enables customers to see what
					Millennium&apos;s products would look like if installed in their
					space. If such a thing would interest you, do let me know.
				</p>
				<div className="flex flex-wrap gap-2">
					<Button intent="primary" asChild>
						<Link href="https://rooms.belgard.com/" target="_blank">
							Check out Belgard Rooms
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
