import { formatNumber, formatPrice } from '@/utils/format';
import { Plus, PlusSquare } from 'lucide-react';
import { Button } from '../button';
import { StageForm } from './form';
import { Unit } from '@/types/quote';
import { unitDisplayNameDictionary } from '@/lib/utils';
import { useStageContext } from './stage-context';

type AddonsProps = React.PropsWithChildren<{
	title: string;
	description: string;
}>;

function Addons({ title, description }: AddonsProps) {
	return (
		<li>
			<button className="flex h-full w-full items-center gap-2 rounded-lg border p-6 text-left hover:bg-gray-100">
				<span className="flex-1">
					<p className="font-semibold">{title}</p>
					<p className="text-sm">{description}</p>
				</span>

				<Plus />
			</button>
		</li>
	);
}

type Item = {
	displayName: string;
	quantity: number;
	unit: Unit;
	price: number;
	hasPlan: boolean;
	priceWithPlan?: number;
};

function Item(props: Item) {
	const unit =
		unitDisplayNameDictionary[props.unit][props.quantity === 1 ? 0 : 1];

	return (
		<li className="-mx-8 flex gap-8 rounded-lg border border-transparent p-8 focus-within:bg-gray-100">
			<div className="h-32 w-32 bg-gray-300" />

			<div className="flex-1 space-y-4">
				<div className="flex gap-16">
					<h3 className="flex-1 text-lg">{props.displayName}</h3>
					<p className="flex-1 text-lg">
						{props.quantity} {unit}
					</p>
					<p className="text-lg">{formatPrice(props.price)}</p>
				</div>
				{props.hasPlan && props.priceWithPlan && (
					<div className="flex justify-between">
						<p>Using our 50/50 payment plan:</p>
						<p>{formatPrice(props.priceWithPlan)} upfront</p>
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

export function ReviewStage() {
	const { items } = useStageContext();

	return (
		<StageForm className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Review your items.</h2>

			<div className="flex justify-center">
				<ul className="grid grid-flow-col grid-cols-[repeat(3,256px)] gap-4">
					<Addons
						title="Sealant"
						description="Enhance the color of your stones. Protect them from the elements."
					/>
					<Addons
						title="Polymeric Sand"
						description="Prevent your pavers from shifting. Reduce weed growth between them."
					/>
					<Addons
						title="5% Area Overage"
						description="For repairs and adjustments; Future batches may not match exactly."
					/>
				</ul>
			</div>

			<ul>
				{items.map((item, index) => (
					<Item key={index} {...item} />
				))}
			</ul>

			<div className="space-y-4 pl-40">
				<div className="flex justify-between">
					<span>Area</span>
					<span>{formatNumber(1158.75)} sqft</span>
				</div>
				<div className="flex justify-between">
					<span>Approximate Weight</span>
					<span>{formatNumber(27000)} lbs</span>
				</div>
				<div className="flex justify-between">
					<span>Subtotal</span>
					<span>{formatPrice(923339.45)}</span>
				</div>
				<div className="flex justify-between">
					<span>Tax</span>
					<span>{formatPrice(138500.9)}</span>
				</div>
				<hr />
				<div className="flex justify-between text-lg">
					<span>Total</span>
					<span>{formatPrice(1061840.35)}</span>
				</div>

				<div className="!mt-16 flex justify-end">
					<Button variant="primary">
						<span>Add 4 Items to Quote</span>
						<PlusSquare />
					</Button>
				</div>
			</div>
		</StageForm>
	);
}
