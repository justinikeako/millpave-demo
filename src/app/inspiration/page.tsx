import React from 'react';
import { Footer } from '~/components/footer';
import { OrchestratedReveal, ViewportReveal } from '../../components/reveal';
import { Main } from '~/components/main';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { FullWidthSection } from '~/components/sections/full-width';
import { LearnSection } from '~/components/sections/learn';
import { Balancer } from 'react-wrap-balancer';
import { GetAQuoteSection } from '~/components/sections/get-a-quote';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '~/lib/utils';

const categories = [
	{ id: 'all', displayName: 'All Projects', image: false },
	{ id: 'patio', displayName: 'Patios', image: true },
	{ id: 'garden', displayName: 'Gardens', image: true },
	{ id: 'plaza', displayName: 'Plazas', image: true },
	{ id: 'driveway', displayName: 'Driveways', image: true },
	{ id: 'pool_deck', displayName: 'Pool Decks', image: true },
	{ id: 'walkway', displayName: 'Walkways', image: true },
	{ id: 'parking_lot', displayName: 'Parking Lots', image: true }
] as const;

export const metadata = {
	title: 'Paving Inspiration — Millennium Paving Stones',
	description: 'See how our products can transform your outdoor space.',
	openGraph: { title: 'Inspiration for Your Paving Project' }
};

export default function Page({
	searchParams
}: {
	searchParams: Record<string, string | string[] | undefined>;
}) {
	const selectedCategoryId = (
		typeof searchParams.category === 'string' ? searchParams.category : 'all'
	) as (typeof categories)[number]['id'];

	return (
		<>
			<Main className="space-y-32 !pt-16 sm:!pt-24">
				<section className="space-y-24">
					<OrchestratedReveal delay={0.1} asChild>
						<h1 className="mx-auto max-w-[21ch] text-center font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl">
							Which types of projects would you like to see?
						</h1>
					</OrchestratedReveal>

					<OrchestratedReveal asChild delay={0.2}>
						<ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
							{categories.map((category) => (
								<CategoryFilter
									key={category.id}
									isSelected={selectedCategoryId === category.id}
									thumbnailImage={`${category.image}`}
									{...category}
								/>
							))}
						</ul>
					</OrchestratedReveal>
				</section>

				<ViewportReveal asChild className="space-y-4 sm:space-y-8">
					<FullWidthSection className="px-1 sm:px-2 lg:px-3 xl:px-4 2xl:px-6">
						<div className="grid-cols-3 gap-4 overflow-hidden lg:grid lg:grid-cols-4">
							<div className="mb-8 flex items-center">
								<p className="mx-auto max-w-md text-center font-display text-xl sm:text-3xl">
									<Balancer>
										See how our products can transform your outdoor space.
									</Balancer>
								</p>
							</div>

							<ul className="grid grid-cols-3 gap-1 sm:gap-2 lg:contents lg:gap-3">
								{[...Array(4).keys()].map((index) => (
									<GalleryImage key={index} id={index} />
								))}
							</ul>
						</div>
					</FullWidthSection>
				</ViewportReveal>

				<GetAQuoteSection />
				<LearnSection />
				<AugmentedRealityGallerySection />
			</Main>

			<Footer />
		</>
	);
}

function CategoryFilter({
	id,
	displayName,
	isSelected,
	thumbnailImage
}: {
	isSelected: boolean;
	thumbnailImage?: string;
	id: string;
	displayName: string;
}) {
	return (
		<Link
			href={{ pathname: '/inspiration', query: { category: id } }}
			replace
			className={cn(
				'flex shrink-0 items-center overflow-hidden rounded-md border border-gray-400 outline-2 -outline-offset-2 outline-pink-700 transition-colors hover:bg-gray-900/5 active:bg-gray-900/10 active:transition-none',
				isSelected &&
					'peer-checked:bg-pink-400/10 peer-checked:text-pink-700 peer-checked:outline peer-checked:transition-none peer-checked:hover:bg-pink-400/20 peer-checked:active:bg-pink-400/30'
			)}
		>
			{thumbnailImage && <div className="aspect-square w-12 bg-gray-200" />}
			<p className="select-none whitespace-nowrap px-4 align-middle font-semibold">
				{displayName}
			</p>
		</Link>
	);
}

function GalleryImage({
	id,
	selected = false,
	...props
}: {
	id: number;
	selected?: boolean;
}) {
	return (
		<li
			{...props}
			data-selected={selected || undefined}
			className="group relative aspect-square overflow-hidden bg-gray-200 lg:[&:nth-child(11n+2)]:col-span-2 lg:[&:nth-child(11n+2)]:row-span-2 max-sm:[&:nth-child(12n+2)]:col-span-2 max-sm:[&:nth-child(12n+2)]:row-span-2 max-sm:[&:nth-child(12n+7)]:col-span-2 max-sm:[&:nth-child(12n+7)]:row-span-2"
		>
			<Image
				fill
				src={`/inspo-${id}.png`}
				sizes="(max-width: 768px) 33vw, (max-width: 1280px) 25vw (max-width: 1536px) 15vw"
				alt={'Post Title ' + id}
				className="object-cover"
			/>
			<Link href="/photo/2" className="absolute inset-0">
				<p className="bg-gradient-to-b from-gray-900/50 p-4 font-display text-lg text-white opacity-0 transition-opacity group-hover:opacity-100">
					Post Title
				</p>
			</Link>
		</li>
	);
}
