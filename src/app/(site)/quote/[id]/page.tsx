import { Footer } from '~/components/footer';
import { api } from '~/trpc/server';
import { Main } from '~/components/main';
import { Button } from '~/components/button';
import { formatNumber, formatPrice, formatRestockDate } from '~/utils/format';
import Link from 'next/link';
import { unitDisplayNameDictionary } from '~/lib/utils';
import React, { cache } from 'react';
import { addWeeks } from 'date-fns';
import { Balancer } from 'react-wrap-balancer';
import { Reveal, RevealContainer } from '~/components/reveal';
import { HorizontalScroller } from '~/components/horizontal-scroller';
import { ProductCard } from '~/components/product-card';
import { Icon } from '~/components/icon';
import { LearnSection } from '~/components/sections/learn';
import { LocationsSection } from '~/components/sections/locations';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const runtime = "edge";

const getQuote = cache(async function (id: string) {
	return await api.quote.getById({ quoteId: id });
});

type PageProps = {
	params: Promise<{
		id: string;
	}>;
};
export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const quote = await getQuote(params.id);

    return {
		title: `${quote!.title} — Millennium Paving Stones LTD.`
	} as Metadata;
}

export default async function Page(props: PageProps) {
    const params = await props.params;
    const quoteId = params.id;

    const quote = await getQuote(quoteId);
    if (!quote) return notFound();
    const itemsSkuIds = quote.items.map(({ skuId }) => skuId);

    const itemsFulfillment = await api.quote.getFulfillment({
		skuIds: itemsSkuIds
	});

    return (
		<>
			<Main className="space-y-16 py-8 lg:py-16">
				<RevealContainer>
					<Reveal asChild delay={0.1}>
						<h1 className="text-center font-display text-3xl sm:text-4xl md:text-5xl">
							Here is your final quote.
						</h1>
					</Reveal>
					<div className="flex flex-col gap-16 xl:flex-row">
						<Reveal asChild delay={0.2}>
							<div className="flex-1 space-y-4">
								<div className="flex items-center justify-between">
									<h2 className="font-display text-xl">
										Items ({quote.items.length})
									</h2>
									<Button
										intent="tertiary"
										size="small"
										className="hidden text-pink-500 underline"
									>
										Change Colors
									</Button>
								</div>

								<ul className=" space-y-8">
									{quote.items.map((item, itemIndex) => {
										const unitDisplayName =
											unitDisplayNameDictionary[
												item.unit as keyof typeof unitDisplayNameDictionary
											][item.quantity === 1 ? 0 : 1];
										const fulfillment = itemsFulfillment.find(
											({ id }) => id === item.skuId
										)!;

										const hasStock =
											fulfillment?.stock.find(
												({ locationId }) => locationId === item.pickupLocationId
											)?.quantity ?? 0 > 0;
										const restockDate =
											fulfillment?.restocks[0]?.locationId ===
											item.pickupLocationId
												? formatRestockDate(fulfillment?.restocks[0]?.date)
												: undefined;

										return (
											<React.Fragment key={itemIndex}>
												<li className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch">
													<Image
														width={128}
														height={128}
														src={`https://raw.githubusercontent.com/justinikeako/cornerstone-models/main/renders/${item.skuId.replaceAll(
															':',
															'-'
														)}.png`}
														alt={item.sku.displayName}
														className="h-32 w-32"
													/>

													<div className="w-full space-y-4 lg:w-auto lg:flex-1">
														<div className="flex flex-wrap">
															<h3 className="w-full font-display text-lg sm:w-1/2 sm:text-xl">
																<Link
																	target="_blank"
																	href={`/product/${item.skuId.split(':')[0]}`}
																>
																	{item.sku.displayName}
																</Link>
															</h3>
															<p
																className="flex-1 font-display text-lg sm:text-xl"
																title={
																	item.area
																		? `${formatNumber(item.area)} sqft`
																		: undefined
																}
															>
																{item.quantity} {unitDisplayName}
															</p>
															<p className="font-display text-lg sm:text-xl">
																{formatPrice(item.cost)}
															</p>
														</div>
														{item.area && item.area > 2000 && (
															<div className="flex flex-wrap justify-between gap-1">
																<p>Using our 50/50 payment plan:</p>
																<p>{formatPrice(item.cost / 2)} upfront</p>
															</div>
														)}

														<div className="flex flex-wrap items-center gap-y-4">
															<div className="w-full sm:w-1/2">
																<p className="mb-2 font-semibold">
																	Availability
																</p>
																<p>
																	Order {hasStock ? 'Now' : 'Today'}. Pick up
																	on-site:
																</p>
																<p>
																	Available&nbsp;
																	{hasStock
																		? 'Today'
																		: restockDate
																			? restockDate
																			: formatRestockDate(
																					addWeeks(new Date(), 4)
																				)}
																	&nbsp;at&nbsp;
																	<Link
																		target="_blank"
																		href="/contact"
																		className="text-pink-500 hover:text-pink-400 active:text-pink-700"
																	>
																		Our&nbsp;
																		{item.pickupLocationId === 'STT_FACTORY'
																			? 'St. Thomas Factory'
																			: 'Kingston Showroom'}
																	</Link>
																</p>
															</div>
															<div className="flex flex-1 flex-col items-end gap-2 justify-self-end">
																<button>Remove</button>
															</div>
														</div>
													</div>
												</li>
												<li className="h-px w-full bg-gray-200" />
											</React.Fragment>
										);
									})}
								</ul>

								<div className="space-y-4 lg:pl-40">
									<div className="flex justify-between">
										<span>Area</span>
										<span>{formatNumber(quote.totalArea)} sqft</span>
									</div>
									<div className="flex justify-between">
										<span>Approximate Weight</span>
										<span>{formatNumber(quote.totalWeight)} lbs</span>
									</div>
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>{formatPrice(quote.subtotal)}</span>
									</div>
									<div className="flex justify-between">
										<span>Tax</span>
										<span>{formatPrice(quote.tax)}</span>
									</div>
									<hr />
									<div className="flex justify-between font-display text-lg sm:text-xl">
										<span>Total</span>
										<span>{formatPrice(quote.total)}</span>
									</div>
								</div>
							</div>
						</Reveal>

						<Reveal asChild delay={0.3}>
							<aside className="space-y-4">
								<div className="space-y-4">
									<h2 className="font-display text-xl">Payment Options</h2>

									<ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:flex-col">
										<li className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-gray-400 bg-gray-200 p-4 text-center sm:w-72">
											<p className="font-display text-lg/snug">
												Pay in Full <br /> {formatPrice(quote.total)}
											</p>

											<Button intent="primary" className="w-full" asChild>
												<Link href="/how-to-pay">How to Pay</Link>
											</Button>
										</li>
										<li className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-gray-400 bg-gray-200 p-4 text-center sm:w-72">
											<p className="font-display text-lg/snug">
												<Balancer>
													Pay half up front with a payment plan
												</Balancer>
											</p>

											<Button intent="primary" className="w-full" asChild>
												<Link href="/how-to-pay">
													How to pay with Payment Plan
												</Link>
											</Button>
											<p className="text-sm">
												<Balancer>
													{formatPrice(quote.total / 2)} due today, which
													includes applicable full-price items, down payments,
													and taxes.
												</Balancer>
											</p>
										</li>
									</ul>
								</div>
							</aside>
						</Reveal>
					</div>

					<Reveal className="flex flex-col space-y-16 py-16">
						<h2 className="max-w-[28ch] self-center text-center font-display text-3xl lg:text-4xl xl:text-5xl">
							You may also like
						</h2>

						<div className="flex flex-col space-y-8">
							<HorizontalScroller className="gap-4 py-1" snap>
								<ProductCard
									name="Colonial Classic"
									startingSku={{ price: 203, unit: 'sqft' }}
									productId="colonial_classic"
									className="shrink-0 basis-80 snap-center lg:w-auto lg:flex-1"
								/>
								<ProductCard
									name="Banjo"
									startingSku={{ price: 219, unit: 'sqft' }}
									productId="banjo"
									className="shrink-0 basis-80 snap-center lg:w-auto lg:flex-1"
								/>
								<ProductCard
									name="Heritage Series"
									startingSku={{ price: 219, unit: 'sqft' }}
									productId="heritage"
									className="shrink-0 basis-80 snap-center lg:w-auto lg:flex-1"
								/>
								<li className="min-w-[16rem] shrink-0 basis-80 snap-center lg:w-auto lg:flex-1">
									<Button
										asChild
										intent="secondary"
										className="h-full flex-col !rounded-md font-display text-lg italic"
									>
										<Link href="/products">
											<span className="block w-[15ch]">
												Explore All Products
											</span>
											<Icon name="arrow_right_alt" size={24} />
										</Link>
									</Button>
								</li>
							</HorizontalScroller>
						</div>
					</Reveal>
				</RevealContainer>

				<LocationsSection />
				<LearnSection />
			</Main>

			<Footer />
		</>
	);
}
