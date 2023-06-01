import { formatNumber, formatPrice, formatRestockDate } from '~/utils/format';
import { Minus, Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { StageForm } from './form';
import { unitDisplayNameDictionary } from '~/lib/utils';
import { useStageContext } from './stage-context';
import { StoneProject } from '~/types/quote';
import { api } from '~/utils/api';
import { addWeeks } from 'date-fns';

export function ReviewStage() {
	const { quote } = useStageContext();

	const itemsSkuIds = quote.items.map(({ skuId }) => skuId);

	const itemsFulfillmentQuery = api.quote.getFulfillment.useQuery(
		{ skuIds: itemsSkuIds },
		{ refetchOnWindowFocus: false }
	);

	const itemsFulfillment = itemsFulfillmentQuery.data;

	return (
		<StageForm className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Review your items.</h2>

			<div className="flex justify-center">
				<Addons />
			</div>

			<ul>
				{quote.items.map((item, index) => {
					const unitDisplayName =
						unitDisplayNameDictionary[item.unit][item.quantity === 1 ? 0 : 1];
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
						<li
							key={index}
							className="-mx-8 flex gap-8 rounded-lg border border-transparent p-8 focus-within:bg-gray-100"
						>
							<div className="h-32 w-32 bg-gray-300" />

							<div className="flex-1 space-y-4">
								<div className="flex gap-16">
									<h3 className="flex-[2] text-lg">{item.displayName}</h3>
									<p
										className="flex-1 text-lg"
										title={
											item.area ? `${formatNumber(item.area)} sqft` : undefined
										}
									>
										{item.quantity} {unitDisplayName}
									</p>
									<p className="flex-1 text-right text-lg">
										{formatPrice(item.cost)}
									</p>
								</div>
								{item.area && item.area > 2000 && (
									<div className="flex justify-between">
										<p>Using our 50/50 payment plan:</p>
										<p>{formatPrice(item.cost / 2)} upfront</p>
									</div>
								)}

								<div className="flex items-center justify-between">
									<div>
										<p className="mb-2 font-semibold">Availability</p>
										{itemsFulfillmentQuery.isLoading ? (
											<p>Loading stock info...</p>
										) : (
											<>
												<p>Order Today. Pick up on-site:</p>
												<p>
													Available{' '}
													{hasStock
														? 'Today'
														: restockDate
														? restockDate
														: formatRestockDate(addWeeks(new Date(), 4))}{' '}
													at Our{' '}
													{item.pickupLocationId === 'STT_FACTORY'
														? 'St. Thomas Factory'
														: 'Kingston Showroom'}
												</p>
											</>
										)}
									</div>

									<div className="flex flex-col items-end gap-2">
										<button className="block">Remove</button>
										<button className="block">Edit</button>
									</div>
								</div>
							</div>
						</li>
					);
				})}
			</ul>

			<div className="space-y-4 pl-40">
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
				<div className="flex justify-between text-lg">
					<span>Total</span>
					<span>{formatPrice(quote.details.total)}</span>
				</div>
			</div>
		</StageForm>
	);
}

function Addons() {
	const { control } = useFormContext<StoneProject>();
	const { fields, update } = useFieldArray({
		control,
		keyName: 'key',
		name: 'addons'
	});

	return (
		<ul className="grid grid-flow-col grid-cols-[repeat(3,256px)] gap-4">
			{fields.map(({ key, ...addon }, index) => (
				<li key={key}>
					<button
						className="flex h-full w-full items-center gap-2 rounded-lg border px-6 py-4 text-left hover:bg-gray-100 active:bg-gray-200"
						onClick={() => update(index, { ...addon, enabled: !addon.enabled })}
					>
						<span className="flex-1 space-y-0.5">
							<p className="font-medium">{addon.displayName}</p>
							<p className="text-sm">{addon.description}</p>
						</span>

						{addon.enabled ? (
							<Minus className="h-5 w-5 " />
						) : (
							<Plus className="h-5 w-5 " />
						)}
					</button>
				</li>
			))}
		</ul>
	);
}
