import React, { useState } from 'react';
import Head from 'next/head';
import { Button } from '../components/button';
import { motion } from 'framer-motion';
import { RevealSection } from '../components/reveal-section';

type GalleryFilterProps = React.PropsWithChildren<
	{
		value: string;
	} & React.HTMLProps<HTMLInputElement>
>;

function GalleryFilter({ children, value, ...props }: GalleryFilterProps) {
	return (
		<li className="relative flex aspect-square w-[60vw] shrink-0 snap-center items-end p-4 md:w-[25vmax] md:p-8 lg:w-[30vmin]">
			<input
				{...props}
				type="radio"
				name="category"
				className="peer hidden"
				id={value}
			/>
			<label
				htmlFor={value}
				className="absolute inset-0 border border-gray-200 bg-gray-200 inner-border-4 inner-border-white peer-checked:border-2 peer-checked:border-black"
			/>
			<p className="pointer-events-none z-[1] font-display text-lg">
				{children}
			</p>
		</li>
	);
}

const categories = [
	{ id: 'walkway', displayName: { singular: 'Walkway', plural: 'Walkways' } },
	{ id: 'patio', displayName: { singular: 'Patio', plural: 'Patios' } },
	{ id: 'garden', displayName: { singular: 'Garden', plural: 'Gardens' } },
	{ id: 'plaza', displayName: { singular: 'Plaza', plural: 'Plazas' } },
	{
		id: 'driveway',
		displayName: { singular: 'Driveway', plural: 'Driveways' }
	},
	{
		id: 'pool_deck',
		displayName: { singular: 'Pool Deck', plural: 'Pool Decks' }
	}
];

const slowTransition = {
	type: 'spring',
	stiffness: 100,
	damping: 20
};

function Page() {
	const [categoryId, setCategoryId] = useState('walkway');

	return (
		<>
			<Head>
				<title>Inspiration Gallery — Millennium Paving Stones</title>
			</Head>

			<main className="space-y-32 px-8 md:px-24 lg:space-y-48 lg:px-32">
				<section className="space-y-24">
					<motion.h1
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.1, ...slowTransition }}
						className="mx-auto max-w-[20ch] text-center font-display text-3xl"
					>
						Which types of projects would you like to see?
					</motion.h1>

					<motion.ul
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, ...slowTransition }}
						className="no-scrollbar -mx-8 flex snap-x snap-mandatory gap-4 overflow-scroll px-8 md:-mx-32 md:px-32 lg:-mx-32 lg:px-32"
					>
						{categories.map(({ id, displayName }) => (
							<GalleryFilter
								key={id}
								value={id}
								checked={id === categoryId}
								onChange={() => setCategoryId(id)}
							>
								{displayName.plural}
							</GalleryFilter>
						))}
					</motion.ul>
				</section>

				<RevealSection className="space-y-4 md:space-y-8">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
						<div className="mb-8 flex items-center md:col-span-3 md:mb-0 lg:col-span-3 xl:col-span-2">
							<p className="text-center font-display text-2xl md:text-left">
								Get inspiration for your new driveway.
							</p>
						</div>

						<ul className="contents">
							<li className="h-[30vmax] bg-gray-200 md:col-span-3 lg:h-[50vmin] xl:col-span-2 xl:h-[25vmax]" />
							<li className="h-[30vmax] bg-gray-200 md:col-span-3 lg:h-[50vmin] xl:col-span-2 xl:h-[25vmax]" />
							<li className="h-[30vmax] bg-gray-200 md:col-span-3 lg:h-[50vmin] xl:col-span-2 xl:h-[25vmax]" />
							<li className="h-[30vmax] bg-gray-200 md:col-span-3 lg:h-[50vmin] xl:col-span-2 xl:h-[25vmax]" />
							<li className="h-[30vmax] bg-gray-200 md:col-span-3 lg:h-[50vmin] xl:col-span-2 xl:h-[25vmax]" />
							<li className="h-[30vmax] bg-gray-200 md:col-span-3 lg:h-[50vmin] xl:col-span-2 xl:h-[25vmax]" />
							<li className="h-[30vmax] bg-gray-200 md:col-span-3 lg:h-[50vmin] xl:col-span-2 xl:h-[25vmax]" />
							<li className="h-[30vmax] bg-gray-200 md:col-span-3 lg:h-[50vmin] xl:col-span-2 xl:h-[25vmax]" />
						</ul>
					</div>

					<Button variant="secondary" className="mx-auto">
						See More
					</Button>
				</RevealSection>

				{/* Process */}
				<RevealSection className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-32">
					<div className="flex-1 lg:order-2">
						<p className="font-display text-lg">Our Process</p>
						<h2 className="max-w-[20ch] font-display text-3xl">
							Starting from zero.
						</h2>

						<br />

						<p className="font-display text-lg">
							Integer a velit in sapien aliquam consectetur et vitae ligula.
							Integer ornare egestas enim a malesuada. Suspendisse arcu lectus,
							blandit nec gravida at, maximus ut lorem. Nulla malesuada vehicula
							neque at laoreet. Nullam efficitur mauris sit amet accumsan
							pulvinar.
						</p>

						<br />

						<Button variant="primary">Find an Installer</Button>
					</div>

					<div className="aspect-video w-full bg-gray-200 lg:w-[70vmin]"></div>
				</RevealSection>
			</main>
		</>
	);
}

export default Page;
