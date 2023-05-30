import { formatNumber, formatPrice } from '@/utils/format';
import { Minus, Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { StageForm } from './form';
import { unitDisplayNameDictionary } from '@/lib/utils';
import { useStageContext } from './stage-context';
import { QuoteItem, StoneProject } from '@/types/quote';

export function ReviewStage() {
	const { quote } = useStageContext();

	return (
		<StageForm className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Review your items.</h2>

			<div className="flex justify-center">
				<Addons />
			</div>

			<ul>
				{quote.items.map((item, index) => (
					<Item key={index} {...item} />
				))}
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

type QuoteItemProps = QuoteItem;

function Item(props: QuoteItemProps) {
	const unit =
		unitDisplayNameDictionary[props.unit][props.quantity === 1 ? 0 : 1];

	return (
		<li className="-mx-8 flex gap-8 rounded-lg border border-transparent p-8 focus-within:bg-gray-100">
			<div className="h-32 w-32 bg-gray-300" />

			<div className="flex-1 space-y-4">
				<div className="flex gap-16">
					<h3 className="flex-[2] text-lg">{props.displayName}</h3>
					<p
						className="flex-1 text-lg"
						title={props.area ? `${formatNumber(props.area)} sqft` : undefined}
					>
						{props.quantity} {unit}
					</p>
					<p className="flex-1 text-right text-lg">{formatPrice(props.cost)}</p>
				</div>
				{props.area && props.area > 2000 && (
					<div className="flex justify-between">
						<p>Using our 50/50 payment plan:</p>
						<p>{formatPrice(props.cost / 2)} upfront</p>
					</div>
				)}

				<div className="flex items-center justify-between">
					<div>
						<p className="mb-2 font-semibold">Availability</p>
						<p>Order Today. Pick up on-site:</p>
						<p>Available Fri, May 7 at Our St. Thomas Factory</p>
					</div>

					<div className="flex flex-col items-end gap-2">
						<button className="block">Remove</button>
						<button className="block">Edit</button>
					</div>
				</div>
			</div>
		</li>
	);
}
