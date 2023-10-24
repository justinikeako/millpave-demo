import React from 'react';
import { Footer } from '~/components/footer';
import { Button } from '../../components/button';
import { OrchestratedReveal, ViewportReveal } from '../../components/reveal';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { ProductCard } from '../../components/product-card';
import { Main } from '~/components/main';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { FullWidthSection } from '~/components/sections/full-width';
import { LearnSection } from '~/components/sections/learn';
import { Balancer } from 'react-wrap-balancer';
import { Icon } from '~/components/icon';
import { AnimatePresence, motion } from 'framer-motion';
import { GetAQuoteSection } from '~/components/sections/get-a-quote';
import Image from 'next/image';
import { CategoryFilter } from './_components/category-filter';

const MotionButton = motion(Button);

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

							<Dialog.Root
								open={isFullscreen}
								onOpenChange={(isFullscreen) => setFullscreen(isFullscreen)}
							>
								<ul className="grid grid-cols-3 gap-1 sm:gap-2 lg:contents lg:gap-3">
									{[...Array(imageCount).keys()].map((index) => (
										<GalleryImage
											key={index}
											id={index}
											selected={index === selectedId}
											onClick={() => setSelectedId(index)}
										/>
									))}
								</ul>
								<AnimatePresence>
									{isFullscreen && (
										<Dialog.Portal forceMount>
											<Dialog.Overlay id="photo-overlay" />
											<Dialog.Content
												className="fixed inset-0 z-50 overflow-hidden overflow-y-auto sm:flex sm:overflow-hidden"
												id="photo-container"
												forceMount
											>
												<Dialog.Close tabIndex={-1} id="photo-overlay" asChild>
													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														className="fixed inset-0 bg-gray-900/90"
													/>
												</Dialog.Close>

												{/* Image */}
												<div className="pointer-events-none relative flex h-[calc(100%-5rem)] flex-1 items-center sm:h-full">
													<motion.div
														initial={{ opacity: 0, scale: 0.9 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.9 }}
														transition={{
															type: 'spring',
															duration: 0.5,
															bounce: 0.1
														}}
														className="pointer-events-auto relative flex aspect-video max-h-full w-full items-center justify-center overflow-hidden bg-gray-200"
													>
														<Image
															fill
															src={`/inspo-${selectedId}.png`}
															sizes="(max-width: 640px) 100vw, (max-width: 1280px) 75vw (max-width: 1536px) 85vw"
															alt={'Post Title ' + selectedId}
															className="object-cover"
														/>
													</motion.div>
												</div>

												<motion.p
													initial={{
														y: '6rem',
														opacity: 0
													}}
													animate={{
														y: 0,
														opacity: 1,
														transition: {
															type: 'spring',
															duration: 0.5,
															bounce: 0,
															delay: 0.1
														}
													}}
													exit={{
														y: '6rem',
														opacity: 0,
														transition: { duration: 0.3, delay: 0 }
													}}
													className="absolute bottom-24 w-full text-center text-sm text-white sm:!hidden"
												>
													Scroll to see more details...
												</motion.p>
												{/* Info panel */}

												<motion.aside
													initial={{
														...(screenLg ? { x: '100%' } : { y: '6rem' })
													}}
													animate={
														screenLg
															? {
																	x: 0,
																	transition: {
																		type: 'spring',
																		duration: 0.5,
																		bounce: 0
																	}
															  }
															: {
																	y: 0,
																	transition: {
																		type: 'spring',
																		duration: 0.5,
																		bounce: 0,
																		delay: 0.1
																	}
															  }
													}
													exit={{
														...(screenLg
															? { x: '100%' }
															: { y: '6rem', opacity: 0 }),
														transition: {
															type: 'spring',
															duration: 0.3,
															bounce: 0
														}
													}}
													className="relative flex flex-col overflow-hidden rounded-t-lg bg-gray-100 xs:container sm:mx-0 sm:h-full sm:w-96 sm:rounded-none"
												>
													<div className="flex h-20 flex-col justify-center bg-gray-100 px-6">
														<Dialog.Title className="font-display text-xl">
															Residential Driveway
														</Dialog.Title>
														<p>
															By&nbsp;
															<Link
																target="_blank"
																href="https://www.instagram.com/najobriks"
																className="text-pink-600"
															>
																Najo Briks Construction
															</Link>
														</p>
													</div>

													<div className="flex-1 space-y-16 px-6 py-6 sm:overflow-y-auto">
														<section>
															<p>
																Lorem ipsum, dolor sit amet consectetur
																adipisicing elit. Dolor, accusantium? Quasi
																assumenda voluptate error nesciunt placeat!
																Consequuntur incidunt, temporibus nesciunt
																pariatur harum quisquam voluptatum dicta facilis
																ut similique minus, soluta at consectetur ipsa
																corporis eos doloribus atque tempora molestias
																voluptatibus. Magni esse nihil debitis mollitia.
																Culpa nulla quisquam veritatis! Velit?
															</p>
														</section>

														<section>
															<h2 className="font-display text-lg">
																Products in this photo
															</h2>

															<ul className="mt-8 space-y-4">
																<ProductCard
																	name="Colonial Classic"
																	startingSku={{
																		price: 203,
																		unit: 'sqft'
																	}}
																	productId="colonial_classic"
																	className="h-96"
																/>
																<ProductCard
																	name="Banjo"
																	startingSku={{
																		price: 219,
																		unit: 'sqft'
																	}}
																	productId="banjo"
																	className="h-96"
																/>
															</ul>
														</section>
													</div>
												</motion.aside>

												{/* Close Button */}
												<Dialog.Close asChild>
													<MotionButton
														initial={{
															opacity: 0
														}}
														animate={{
															opacity: 1,
															transition: {
																type: 'spring',
																duration: 0.5,
																bounce: 0
															}
														}}
														exit={{
															opacity: 0,
															transition: { duration: 0.3, delay: 0 }
														}}
														intent="tertiary"
														backdrop="dark"
														className="pointer-events-auto fixed left-8 top-8 bg-gray-900/90 font-semibold"
													>
														<Icon name="arrow_left" />
														Return To Gallery
													</MotionButton>
												</Dialog.Close>
											</Dialog.Content>
										</Dialog.Portal>
									)}
								</AnimatePresence>
							</Dialog.Root>
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

function GalleryImage({
	id,
	selected,
	...props
}: {
	id: number;
	selected: boolean;
	onClick(): void;
}) {
	return (
		<Dialog.Trigger asChild>
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
				<p className="relative bg-gradient-to-b from-gray-900/50 p-4 font-display text-lg text-white opacity-0 transition-opacity group-hover:opacity-100">
					Post Title
				</p>
			</li>
		</Dialog.Trigger>
	);
}
