import { formatPrice } from '@/utils/format';
import { Plus, PlusSquare } from 'lucide-react';
import { Button } from '../button';

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

type ItemProps = {
	displayName: string;
	quantity: number;
	unit: string;
	price: number;
	priceWithPlan?: number;
	hasPlan?: boolean;
};

function Item(props: ItemProps) {
	return (
		<li className="-mx-8 flex gap-8 rounded-lg border border-transparent p-8 focus-within:bg-gray-100">
			<div className="h-32 w-32 bg-gray-300" />

			<div className="flex-1 space-y-4">
				<div className="flex gap-16">
					<h3 className="flex-1 text-lg">{props.displayName}</h3>
					<p className="flex-1 text-lg">
						{props.quantity} {props.unit}
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
	return (
		<section className="space-y-16 px-32">
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
				<Item
					displayName="Colonial Classic Grey"
					quantity={6}
					unit="pallets"
					price={156817.5}
					priceWithPlan={78408.75}
					hasPlan
				/>
				<Item
					displayName="Colonial Classic Red"
					quantity={3}
					unit="pallets"
					price={88065}
					priceWithPlan={44032.5}
					hasPlan
				/>
				<Item
					displayName="CasaScapes Polymeric Sand"
					quantity={3}
					unit="bags"
					price={88065}
				/>
				<Item
					displayName="DynaMatrix HB-1 Protective Sealant (1 gallon)"
					quantity={3}
					unit="units"
					price={70956.48}
				/>
			</ul>

			<div className="space-y-4 pl-40">
				<div className="flex justify-between">
					<span>Area</span>
					<span>1,158.75 sqft</span>
				</div>
				<div className="flex justify-between">
					<span>Approximate Weight</span>
					<span>27,000 lbs</span>
				</div>
				<div className="flex justify-between">
					<span>Subtotal</span>
					<span>$923,339.45</span>
				</div>
				<div className="flex justify-between">
					<span>Tax</span>
					<span>$138,500.90</span>
				</div>
				<hr />
				<div className="flex justify-between text-lg">
					<span>Total</span>
					<span>$1,061,840.35</span>
				</div>

				<div className="!mt-16 flex justify-end">
					<Button variant="primary">
						<span>Add 4 Items to Quote</span>
						<PlusSquare />
					</Button>
				</div>
			</div>
		</section>
	);
}
