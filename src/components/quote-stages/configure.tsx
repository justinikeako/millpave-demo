import { formatNumber, formatPrice, formatRestockDate } from '~/utils/format';
import { FieldArrayPath, useFieldArray, useFormContext } from 'react-hook-form';
import { StageForm } from './form';
import { unitDisplayNameDictionary } from '~/lib/utils';
import { useStageContext } from './stage-context';
import { StoneProject } from '~/types/quote';
import { api } from '~/utils/api';
import { addWeeks } from 'date-fns';
import { Icon } from '../icon';
import { Checkbox } from '../checkbox';
import Link from 'next/link';
import React from 'react';
import { Balancer } from 'react-wrap-balancer';
import { Button } from '../button';
import Image from 'next/image';

export function ConfigureStage() {
	const { stoneMetadataArray, quote, setStageIndex } = useStageContext();

	const { control, register } = useFormContext<StoneProject>();
	const { fields: addons } = useFieldArray({
		control,
		keyName: 'key',
		name: 'addons'
	});

	const itemsSkuIds = stoneMetadataArray.map(({ skuId }) => skuId);

	const itemsFulfillmentQuery = api.quote.getFulfillment.useQuery(
		{ skuIds: itemsSkuIds },
		{ refetchOnWindowFocus: false }
	);

	const itemsFulfillment = itemsFulfillmentQuery.data;

	return (
		<StageForm className="space-y-16">
			<h2 className="text-center font-display text-4xl md:text-5xl">
				<Balancer>Configure your quote.</Balancer>
			</h2>
			<div className="flex flex-col gap-16 xl:flex-row">
				<aside className="space-y-4 xl:order-2">
					<div className="space-y-4">
						<h3 className="font-display text-xl">Options</h3>

						<ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:flex-col">
							{addons.map(({ key, ...addon }, index) => (
								<li key={key} className="contents">
									<label
										htmlFor={`addons.${index}.enabled:${addon.id}`}
										className="flex w-full items-center gap-2 rounded-md border border-gray-400 p-4 text-left hover:bg-black/5 active:bg-black/10 sm:w-72"
									>
										<span className="flex-1 space-y-0.5">
											<p className="font-semibold">{addon.displayName}</p>
											<p className="max-w-[16rem] text-sm text-gray-500">
												<Balancer>{addon.description}</Balancer>
											</p>
										</span>

										<Checkbox
											{...register(
												`addons.${index}.enabled` as FieldArrayPath<StoneProject>
											)}
											value={addon.id}
										/>
									</label>
								</li>
							))}
						</ul>
					</div>
				</aside>

				<div className="flex-1 space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="font-display text-xl">
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
								unitDisplayNameDictionary[item.unit][
									item.quantity === 1 ? 0 : 1
								];
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
										<Image
											width={128}
											height={128}
											src={`https://raw.githubusercontent.com/justinikeako/cornerstone-models/main/renders/${item.skuId.replaceAll(
												':',
												'-'
											)}.png`}
											alt={item.displayName}
											className="h-32 w-32"
										/>

										<div className="w-full space-y-4 lg:w-auto lg:flex-1 ">
											<div className="flex flex-wrap">
												<h3 className="w-full font-display text-lg hover:underline sm:w-1/2 sm:text-xl">
													<Link
														target="_blank"
														href={`/product/${item.skuId.split(':')[0]}`}
													>
														{item.displayName}
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
																	: formatRestockDate(addWeeks(new Date(), 4))}
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
												<div className="flex-1">
													{item.signatures.length > 0 && (
														<>
															<p className="mb-2 font-semibold">Used In</p>
															<ul className="flex gap-1">
																{item.signatures.map((signature) => (
																	<li
																		key={itemIndex + signature}
																		className="contents"
																	>
																		<button
																			className="flex h-6 items-center rounded-sm border border-gray-400 px-1 text-sm capitalize hover:bg-gray-900/5 active:bg-gray-900/10"
																			type="button"
																			onClick={() =>
																				setStageIndex(
																					signature === 'infill' ? 2 : 3
																				)
																			}
																		>
																			<span>{signature}</span>
																			<Icon
																				name="arrow_right-opsz_20-wght-300"
																				size={18}
																			/>
																		</button>
																	</li>
																))}
															</ul>
														</>
													)}
												</div>
												<div className="flex flex-1 flex-col items-end gap-2 justify-self-end">
													<label
														htmlFor="finish"
														className="block text-gray-500"
														onClick={(e) => {
															e.preventDefault();

															const finishButton =
																document.querySelector<HTMLButtonElement>(
																	'#finish'
																);

															finishButton?.focus();
														}}
													>
														Press &quot;Finish&quot; to edit
													</label>
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
							<span>{formatNumber(quote.details.totalArea)} sqft</span>
						</div>
						<div className="flex justify-between">
							<span>Approximate Weight</span>
							<span>{formatNumber(quote.details.totalWeight)} lbs</span>
						</div>
						<div className="flex justify-between">
							<span>Subtotal</span>
							<span>{formatPrice(quote.details.subtotal)}</span>
						</div>
						<div className="flex justify-between">
							<span>Tax</span>
							<span>{formatPrice(quote.details.tax)}</span>
						</div>
						<hr />
						<div className="flex justify-between font-display text-lg sm:text-xl">
							<span>Total</span>
							<span>{formatPrice(quote.details.total)}</span>
						</div>
					</div>
				</div>
			</div>
		</StageForm>
	);
}
