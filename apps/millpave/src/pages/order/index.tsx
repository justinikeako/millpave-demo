import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { FC, PropsWithChildren, useState } from 'react';
import Button from '../../components/button';
import Icon from '../../components/icon';
import { nanoid } from 'nanoid';
import { differenceInCalendarDays, format } from 'date-fns';
import { addDays } from 'date-fns';

type Shape = {
	id: string;
	name: string;
};

type Item = {
	sku_id: string;
	id: string;
	display_name: string;
	closest_restock_date: number;
	quantity: number;
	price: number;
};

type OrderDetails = {
	area: number;
	weight: number;
	subtotal: number;
	tax: number;
	total: number;
};

type Order = {
	id: string;
	title: string;
	shapes: Shape[];
	items: Item[];
	details: OrderDetails;
};

const order: Order = {
	id: nanoid(),
	title: 'New Order',
	shapes: [
		{ id: nanoid(), name: 'Walkway' },
		{ id: nanoid(), name: 'Driveway' },
		{ id: nanoid(), name: 'Garden Edging' }
	],
	items: [
		{
			id: nanoid(),
			sku_id: 'colonial_classic:grey',
			display_name: 'Colonial Classic Grey',
			closest_restock_date: addDays(new Date(), 2).getTime(),
			quantity: 0,
			price: 0
		}
	],
	details: {
		area: 20342.5,
		weight: 473980,
		subtotal: 4129527.5,
		tax: 619429.13,
		total: 4748956.63
	}
};

type RecommendedItem = {
	id: string;
	display_name: string;
	price: number;
};

const recommendations: RecommendedItem[] = [
	{
		id: 'eff_cleaner',
		display_name: 'DynaMatrix Efflorescence Cleaner ',
		price: 4000
	}
];

function formatPrice(price: number) {
	const priceFormatter = new Intl.NumberFormat('en', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	return '$' + priceFormatter.format(price);
}

function formatNumber(number: number) {
	const numberFormatter = new Intl.NumberFormat('en', {
		maximumFractionDigits: 2
	});

	return numberFormatter.format(number);
}

function getDistanceFromToday(date: Date | number) {
	return differenceInCalendarDays(date, new Date());
}

function formatRestockDate(date: number) {
	const distanceFromToday = getDistanceFromToday(date);

	if (distanceFromToday === 0) return format(date, "'at' h:mm bbb");
	else if (distanceFromToday === 1) return 'Tomorrow';

	return format(date, 'EEE, LLL d');
}

type SectionHeaderProps = {
	title: string;
};

const SectionHeader: FC<PropsWithChildren<SectionHeaderProps>> = ({
	title,
	children
}) => {
	return (
		<div className="flex items-center justify-between">
			<h2 className="font-display text-xl font-semibold">{title}</h2>
			{children}
		</div>
	);
};

type PageProps = {
	order: Order;
	recommendations: RecommendedItem[];
};

const Page: NextPage<PageProps> = ({ order, recommendations }) => {
	const [overage, setOverage] = useState('none');

	return (
		<>
			<Head>
				<title>{order.title} — Millennium Paving Stones</title>
			</Head>

			<main className="space-y-16 px-8 py-24">
				<h1 className="font-display text-2xl font-semibold">{order.title}</h1>
				{/* Shapes */}
				<section className="space-y-4">
					<SectionHeader title="Shapes" />

					<ul className="no-scrollbar -mx-8 flex items-center space-x-2 overflow-x-scroll">
						<li className="h-2 shrink-0 basis-4" />

						<li className="flex snap-center rounded-full bg-zinc-100 p-2.5">
							<Icon name="add" />
						</li>
						{order.shapes.map((shape) => (
							<li
								key={shape.id}
								className="flex snap-center whitespace-nowrap rounded-full bg-zinc-100 px-4 py-2"
							>
								{shape.name}
							</li>
						))}

						<li className="h-2 shrink-0 basis-4" />
					</ul>
				</section>

				{/* Items */}
				<section className="space-y-4">
					<SectionHeader title="Items (4)" />

					{/* Overage */}
					<div className="flex items-center justify-between">
						<p className="flex space-x-1">
							<span>Area Overage</span>

							<span>
								<Button variant="tertiary" iconLeft="info" weight="normal" />
							</span>
						</p>

						<label
							htmlFor="overage"
							className="flex space-x-2 rounded-md border border-zinc-300 p-4 focus-within:border-rose-900"
						>
							<select
								name="overage"
								value={overage}
								onChange={(e) => setOverage(e.currentTarget.value)}
								className="bg-transparent outline-none"
							>
								<option value="10">10%</option>
								<option value="5">5%</option>
								<option value="3">3%</option>
								<option value="none">None</option>
							</select>
						</label>
					</div>

					{/* Overage Warning */}
					{overage === 'none' && (
						<div className="flex space-x-4 rounded-md bg-yellow-50 px-4 py-6 text-yellow-600">
							<Icon name="warning" />
							<div className="flex-1 space-y-2">
								<p className="font-semibold">Declining an overage?</p>
								<p>
									Your job could be put on hold or delayed. Likely higher
									contractor time and material costs. And the next batch of
									pavers may not be an exact color match.
								</p>
							</div>
						</div>
					)}

					{/* Item List */}
					<ul className="!mt-8">
						{order.items.map((item) => (
							<li
								key={item.id}
								className="flex flex-col items-center space-y-4"
							>
								<div className="h-32 w-32 bg-zinc-100" />
								<div className="space-y-2 self-stretch">
									<h3 className="font-display text-lg font-semibold">
										{item.display_name}
									</h3>
									<div className="flex justify-between">
										<p className="font-semibold">
											{formatNumber(item.quantity)} pallets
										</p>
										<p className="font-semibold">{formatPrice(item.price)}</p>
									</div>
									<div className="flex items-center justify-between">
										<p className="text-zinc-500">
											Order Today. Pick up on-site:
											<br />
											{getDistanceFromToday(item.closest_restock_date) > 1 &&
												'Available'}
											&nbsp;
											<b>{formatRestockDate(item.closest_restock_date)}</b>
											&nbsp;at&nbsp;
											<span className="inline-block text-rose-600">
												Our St. Thomas Factory
											</span>
										</p>
										<Button variant="tertiary" iconLeft="edit" />
									</div>
								</div>
							</li>
						))}
					</ul>
				</section>

				{/* Order Details */}
				<section className="space-y-4">
					<SectionHeader title="Order Details" />

					<ul className="space-y-1">
						<li className="flex justify-between py-1">
							<p>Area Coverage</p>
							<p className="tabular-nums">
								{formatNumber(order.details.area)} sqft
							</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Estimated Weight</p>
							<p className="tabular-nums">
								{formatNumber(order.details.weight)} lbs
							</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Subtotal</p>
							<p className="tabular-nums">
								{formatPrice(order.details.subtotal)}
							</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Tax</p>
							<p className="tabular-nums">{formatPrice(order.details.tax)}</p>
						</li>
						<li className="flex justify-between py-1 font-semibold text-rose-900">
							<p>Total</p>
							<p className="tabular-nums">{formatPrice(order.details.total)}</p>
						</li>
					</ul>

					<div className="space-y-2">
						<Button
							variant="primary"
							iconLeft="point_of_sale"
							className="w-full"
						>
							Check Out
						</Button>
						<Button variant="secondary" className="w-full text-rose-900">
							Send as Quote
						</Button>
					</div>
				</section>

				{/* Recommendations */}
				<section className="space-y-8">
					<SectionHeader title="You may like..." />

					<ul>
						{recommendations.map((item) => (
							<li
								key={item.id}
								className="flex flex-col items-center space-y-4"
							>
								<div className="h-32 w-32 bg-zinc-100" />
								<div className="space-y-2 self-stretch">
									<h3 className="font-semibold">{item.display_name}</h3>

									<p>{formatPrice(item.price)}</p>
								</div>
								<Button variant="primary" className="w-full">
									Add to Order
								</Button>
							</li>
						))}
					</ul>
				</section>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
	return {
		props: {
			order,
			recommendations
		}
	};
};

export default Page;
