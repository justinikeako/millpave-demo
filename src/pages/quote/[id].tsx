import Head from 'next/head';
import { Footer } from '~/components/footer';
import NextError from 'next/error';
import { api } from '~/utils/api';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { createInnerTRPCContext } from '~/server/api/trpc';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { appRouter } from '~/server/api/root';
import { Main } from '~/components/main';
import { Button } from '~/components/button';
import { formatNumber, formatPrice, formatRestockDate } from '~/utils/format';
import Link from 'next/link';
import { unitDisplayNameDictionary } from '~/lib/utils';
import React from 'react';
import { addWeeks } from 'date-fns';
import { Balancer } from 'react-wrap-balancer';

function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const quoteId = props.id;

	const quoteQuery = api.quote.getById.useQuery(
		{ quoteId },
		{ refetchOnWindowFocus: false }
	);

	const quote = quoteQuery.data;
	const itemsSkuIds = quote?.items.map(({ skuId }) => skuId) || [];

	const itemsFulfillmentQuery = api.quote.getFulfillment.useQuery(
		{ skuIds: itemsSkuIds },
		{ refetchOnWindowFocus: false }
	);

	const itemsFulfillment = itemsFulfillmentQuery.data;

	if (!quote) {
		const quoteNotFound = quoteQuery.error?.data?.code === 'NOT_FOUND';

		if (quoteNotFound) return <NextError statusCode={404} />;

		return <NextError statusCode={500} />;
	}

	return (
		<>
			<Head>
				<title>{`${quote.title} — Millennium Paving Stones`}</title>
			</Head>

			<Main className="space-y-16 py-8 lg:py-16">
				<h2 className="text-center font-display text-2xl">
					Here's your final quote.
				</h2>
				<div className="flex flex-col gap-16 xl:flex-row">
					<div className="flex-1 space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-display text-lg">
								Items ({quote.items.length})
							</h3>
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
								const fulfillment = itemsFulfillment?.find(
									({ id }) => id === item.skuId
								);

								const hasStock =
									fulfillment?.stock.find(
										({ locationId }) => locationId === item.pickupLocationId
									)?.quantity || 0 > 0;
								const restockDate =
									fulfillment?.restocks[0]?.locationId === item.pickupLocationId
										? formatRestockDate(fulfillment?.restocks[0]?.date)
										: undefined;

								return (
									<React.Fragment key={itemIndex}>
										<li className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch">
											<div className="h-32 w-32 bg-gray-300" />

											<div className="w-full space-y-4 lg:w-auto lg:flex-1 ">
												<div className="flex flex-wrap">
													<h3 className="w-full font-display text-lg md:w-80">
														<Link
															target="_blank"
															href={`/product/${item.skuId.split(':')[0]}`}
														>
															{item.sku.displayName}
														</Link>
													</h3>
													<p
														className="flex-1 font-display text-lg"
														title={
															item.area
																? `${formatNumber(item.area)} sqft`
																: undefined
														}
													>
														{item.quantity} {unitDisplayName}
													</p>
													<p className="font-display text-lg">
														{formatPrice(item.cost)}
													</p>
												</div>
												{item.area && item.area > 2000 && (
													<div className="flex justify-between">
														<p>Using our 50/50 payment plan:</p>
														<p>{formatPrice(item.cost / 2)} upfront</p>
													</div>
												)}

												<div className="flex flex-wrap items-center gap-y-4">
													<div className="w-full md:w-80">
														<p className="mb-2 font-semibold">Availability</p>
														{itemsFulfillmentQuery.isLoading ? (
															<p>Loading stock info...</p>
														) : (
															<>
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
															</>
														)}
													</div>
													<div className="flex flex-1 flex-col items-end gap-2 justify-self-end">
														<button
															onClick={() => {
																// Remove Item
															}}
														>
															Remove
														</button>
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
							<div className="flex justify-between font-display text-lg">
								<span>Total</span>
								<span>{formatPrice(quote.total)}</span>
							</div>
						</div>
					</div>

					<aside className="space-y-4">
						<div className="space-y-4">
							<h3 className="font-display text-lg">Payment Options</h3>

							<ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:flex-col">
								<li className="w-full items-center space-y-4 rounded-md border border-gray-400 bg-gray-200 p-4 text-center sm:w-72">
									<p className="font-display text-[15px]">
										Pay in Full <br /> {formatPrice(quote.total)}
									</p>

									<Button intent="primary" className="w-full">
										How to Pay
									</Button>
								</li>
								<li className="w-full items-center space-y-4 rounded-md border border-gray-400 bg-gray-200 p-4 text-center sm:w-72">
									<p className="font-display text-[15px]">
										<Balancer>Pay half up front with a payment plan</Balancer>
									</p>

									<Button intent="primary" className="w-full">
										How to pay with Payment Plan
									</Button>
									<p className="text-sm">
										<Balancer>
											{formatPrice(quote.total / 2)} due today, which includes
											applicable full-price items, down payments, and taxes.
										</Balancer>
									</p>
								</li>
							</ul>
						</div>
					</aside>
				</div>
			</Main>

			<Footer />
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssrContext = await createInnerTRPCContext({});

	const ssr = await createServerSideHelpers({
		router: appRouter,
		ctx: ssrContext,
		transformer: superjson
	});

	const quoteId = context.params?.id as string;
	// prefetch `quote.getById`
	await ssr.quote.getById.prefetch({ quoteId });

	return {
		props: {
			trpcState: ssr.dehydrate(),
			id: quoteId
		}
	};
};

export default Page;
