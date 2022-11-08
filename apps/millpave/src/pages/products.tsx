import { NextPage } from 'next';
// import NextError from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '../components/button';
import { Icon } from '../components/icon';
import { formatPrice } from '../utils/format';

type SectionHeaderProps = React.PropsWithChildren<{
	title: string;
}>;

function SectionHeader({ title, children }: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<h2 className="font-display text-lg font-semibold">{title}</h2>
			{children}
		</div>
	);
}

type ProductLinkProps = {
	href: string;
	name: string;
	startingPrice: number;
};

function ProductLink({ href, name, startingPrice }: ProductLinkProps) {
	return (
		<li>
			<Link href={href}>
				<div className="aspect-w-3 aspect-h-2 rounded-lg bg-gray-100" />
				<div className="mt-2">
					<h3 className="font-semibold">{name}</h3>
					<p className="text-gray-500">from {formatPrice(startingPrice)}</p>
				</div>
			</Link>
		</li>
	);
}

const Page: NextPage = () => {
	return (
		<>
			<Head>
				<title>Product Catalog</title>
			</Head>

			<main className="space-y-8 px-8 pb-8">
				<div className="space-y-4">
					<nav className="flex justify-between pt-12 pb-8">
						<Button variant="tertiary">
							<Icon name="search" />
						</Button>
						<Button variant="tertiary" asChild>
							<Link href="/quotes">
								<Icon name="request_quote" />
							</Link>
						</Button>
					</nav>

					<h1 className="font-display text-2xl font-semibold">Products</h1>
					<ul className="no-scrollbar -mx-8 flex items-center space-x-2 overflow-x-scroll">
						<li className="h-2 shrink-0 basis-4" />

						<li className="flex snap-center rounded-full bg-gray-100 p-2.5">
							<Icon name="tune" />
						</li>

						<li className="flex snap-center whitespace-nowrap rounded-full bg-gray-100 px-4 py-2">
							Paving Stones
						</li>
						<li className="flex snap-center whitespace-nowrap rounded-full bg-gray-100 px-4 py-2">
							Available in Red
						</li>
						<li className="flex snap-center whitespace-nowrap rounded-full bg-gray-100 px-4 py-2">
							Available in Grey
						</li>

						<li className="h-2 shrink-0 basis-4" />
					</ul>
				</div>

				<section className="space-y-8">
					<SectionHeader title="Pavers" />

					<ul className="space-y-4">
						<ProductLink
							name="Colonial Classic"
							startingPrice={203}
							href="/product/colonial_classic?sku=grey"
						/>
						<ProductLink
							name="Thin Classic"
							startingPrice={188}
							href="/product/thin_classic?sku=grey"
						/>
						<ProductLink
							name="Banjo"
							startingPrice={219}
							href="/product/banjo?sku=grey"
						/>
						<ProductLink
							name="Old World Cobble"
							startingPrice={203}
							href="/product/owc?sku=grey"
						/>
						<ProductLink
							name="Heritage Series"
							startingPrice={219}
							href="/product/heritage?sku=regular+grey"
						/>
						<ProductLink
							name="Cobble Mix"
							startingPrice={219}
							href="/product/cobble_mix?sku=oblong+grey"
						/>
						<ProductLink
							name="Tropical Wave"
							startingPrice={228.5}
							href="/product/tropical_wave?sku=grey"
						/>
					</ul>
				</section>
			</main>
		</>
	);
};

export default Page;
