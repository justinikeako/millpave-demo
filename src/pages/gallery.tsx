import React, { useState } from 'react';
import Head from 'next/head';
import { Footer } from '~/components/footer';
import { Button } from '../components/button';
import { OrchestratedReveal, ViewportReveal } from '../components/reveal';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { ProductCard } from '../components/product-card';
import { Main } from '~/components/main';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { LearnSection } from '~/components/sections/learn';
import { Balancer } from 'react-wrap-balancer';
import { Icon } from '~/components/icon';

type GalleryFilterProps = React.PropsWithChildren<
	{
		image: boolean;
		value: string;
	} & React.HTMLProps<HTMLInputElement>
>;

function GalleryFilter({ image, children, ...props }: GalleryFilterProps) {
	return (
		<li className="contents">
			<input
				{...props}
				type="radio"
				name="category"
				className="peer hidden"
				id={props.value}
			/>
			<label
				htmlFor={props.value}
				className="flex shrink-0 items-center overflow-hidden rounded-md border border-gray-400 outline-2 -outline-offset-2 outline-pink-700 transition-colors hover:bg-gray-900/5 active:bg-gray-900/10 active:transition-none peer-checked:bg-pink-400/10 peer-checked:text-pink-700 peer-checked:outline peer-checked:transition-none peer-checked:hover:bg-pink-400/20 peer-checked:active:bg-pink-400/30"
			>
				{image && <div className="aspect-square w-12 bg-gray-200" />}
				<p className="select-none whitespace-nowrap px-4 align-middle font-semibold">
					{children}
				</p>
			</label>
		</li>
	);
}

function GalleryImage() {
	return (
		<Dialog.Trigger asChild>
			<li className="group aspect-square bg-gray-200 [&:nth-child(11n+4)]:col-span-2 [&:nth-child(11n+4)]:row-span-2">
				<p className="p-4 font-display text-lg opacity-0 transition-opacity group-hover:opacity-100">
					Post Title
				</p>
			</li>
		</Dialog.Trigger>
	);
}

function Page() {
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

	const [categoryId, setCategoryId] =
		useState<(typeof categories)[number]['id']>('walkway');

	return (
		<>
			<Head>
				<title>Inspiration Gallery — Millennium Paving Stones</title>
			</Head>

			<Main className="space-y-32 !pt-16 md:!pt-24">
				<section className="space-y-24">
					<OrchestratedReveal delay={0.1} asChild>
						<h1 className="mx-auto max-w-[20ch] text-center font-display text-3xl">
							Which types of projects would you like to see?
						</h1>
					</OrchestratedReveal>

					<OrchestratedReveal asChild delay={0.2}>
						<ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
							{categories.map(({ id, displayName, image }) => (
								<GalleryFilter
									key={id}
									value={id}
									image={image}
									checked={id === categoryId}
									onChange={() => setCategoryId(id)}
								>
									{displayName}
								</GalleryFilter>
							))}
						</ul>
					</OrchestratedReveal>
				</section>

				<ViewportReveal className="space-y-4 md:space-y-8">
					<div className="grid grid-cols-4 gap-4">
						<div className="mb-8 flex items-center">
							<p className="mx-auto text-center font-display text-xl">
								<Balancer>
									See how our products can transform your outdoor space.
								</Balancer>
							</p>
						</div>

						<Dialog.Root>
							<Dialog.Portal>
								<Dialog.Overlay className="fixed inset-0 z-50 bg-gray-900/75" />

								<Dialog.Content>
									<div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center md:items-center">
										<div className="flex aspect-square shrink-0 items-center md:sticky md:top-0 md:flex-1">
											<div className=" pointer-events-auto aspect-video w-full bg-gray-200" />
										</div>

										<aside className="pointer-events-auto relative flex h-full max-w-sm flex-col overflow-y-auto bg-white">
											<div className="h-fit space-y-16 px-8 py-8">
												<section>
													<p className="font-semibold">
														By&nbsp;
														<Link
															target="_blank"
															href="https://www.instagram.com/najobriks"
															className="underline"
														>
															Najo Briks Construction
														</Link>
													</p>
													<h1 className="font-display text-xl">
														Residential Driveway
													</h1>
													<br />
													<p>
														Lorem ipsum, dolor sit amet consectetur adipisicing
														elit. Dolor, accusantium? Quasi assumenda voluptate
														error nesciunt placeat! Consequuntur incidunt,
														temporibus nesciunt pariatur harum quisquam
														voluptatum dicta facilis ut similique minus, soluta
														at consectetur ipsa corporis eos doloribus atque
														tempora molestias voluptatibus. Magni esse nihil
														debitis mollitia. Culpa nulla quisquam veritatis!
														Velit?
													</p>
												</section>
												<section>
													<h2 className="font-display text-lg">
														Products in this photo
													</h2>

													<ul className="mt-8 space-y-4">
														<ProductCard
															name="Colonial Classic"
															startingSku={{ price: 203, unit: 'sqft' }}
															link="/product/colonial_classic"
														/>
														<ProductCard
															name="Banjo"
															startingSku={{ price: 219, unit: 'sqft' }}
															link="/product/banjo"
														/>
													</ul>
												</section>
											</div>
										</aside>

										<Dialog.Close asChild>
											<Button
												intent="tertiary"
												backdrop="dark"
												className="pointer-events-auto absolute left-8 top-8 bg-gray-900/90 hover:bg-gray-700/90 active:bg-gray-500/75"
											>
												<Icon name="close" />
												Return To Gallery
											</Button>
										</Dialog.Close>
									</div>
								</Dialog.Content>
							</Dialog.Portal>

							<ul className="contents">
								{[...Array(21).keys()].map((index) => (
									<GalleryImage key={index} />
								))}
							</ul>
						</Dialog.Root>
					</div>

					<Button intent="secondary" className="mx-auto">
						See More
					</Button>
				</ViewportReveal>

				{/* Process */}
				<LearnSection />
				<AugmentedRealityGallerySection />
			</Main>

			
			<Footer />
		</>
	);
}

export default Page;
