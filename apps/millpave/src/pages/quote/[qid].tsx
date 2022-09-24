import { NextPage } from 'next';
import NextError from 'next/error';
import Head from 'next/head';
import { FC, PropsWithChildren, useState } from 'react';
import Button from '../../components/button';
import Icon from '../../components/icon';
import { differenceInCalendarDays, format } from 'date-fns';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';

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

const Page: NextPage = () => {
	const router = useRouter();

	const orderId = router.query.qid as string;

	const [overage, setOverage] = useState('none');

	const order = trpc.useQuery(['quote.get', { id: orderId }], {
		refetchOnWindowFocus: false
	});

	if (!order.data) {
		if (order.error?.data?.code === 'NOT_FOUND')
			return <NextError statusCode={404} />;

		return null;
	}

	return (
		<>
			<Head>
				<title>{`${order.data.title} — Millennium Paving Stones`}</title>
			</Head>

			<main className="space-y-16 px-8 py-24">
				<h1 className="font-display text-2xl font-semibold">
					{order.data.title}
				</h1>

				{/* Shapes */}
				{order.data.shapes && order.data.shapes.length > 0 && (
					<section className="space-y-4">
						<SectionHeader title="Shapes" />

						<ul className="no-scrollbar -mx-8 flex items-center space-x-2 overflow-x-scroll">
							<li className="h-2 shrink-0 basis-4" />

							<li className="flex snap-center rounded-full bg-zinc-100 p-2.5">
								<Icon name="add" />
							</li>
							{order.data.shapes.map((shape) => (
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
				)}

				{/* Items */}
				<section className="space-y-4">
					<SectionHeader title={`Items (${order.data.items.length})`} />

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
							className="flex space-x-2 rounded-md border border-zinc-300 p-4 focus-within:outline focus-within:outline-2 focus-within:outline-pink-700"
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
						<div className="flex space-x-4 rounded-md bg-red-50 px-4 py-6 text-red-500">
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
						{order.data.items.map((item) => (
							<li
								key={item.id}
								className="flex flex-col items-center space-y-4"
							>
								<div className="h-32 w-32 bg-zinc-100" />
								<div className="space-y-2 self-stretch">
									<h3 className="font-display text-lg font-semibold">
										{item.displayName}
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
											<span className="inline-block text-pink-600">
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
								{formatNumber(order.data.area)} sqft
							</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Estimated Weight</p>
							<p className="tabular-nums">
								{formatNumber(order.data.weight)} lbs
							</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Subtotal</p>
							<p className="tabular-nums">{formatPrice(order.data.subtotal)}</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Tax</p>
							<p className="tabular-nums">{formatPrice(order.data.tax)}</p>
						</li>
						<li className="flex justify-between py-1 font-semibold text-pink-700">
							<p>Total</p>
							<p className="tabular-nums">{formatPrice(order.data.total)}</p>
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
						<Button variant="secondary" className="w-full text-pink-700">
							Send as Quote
						</Button>
					</div>
				</section>

				{/* Recommendations */}
				<section className="space-y-8">
					<SectionHeader title="You may like..." />

					<ul>
						{order.data.recommendations.map((item) => (
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

export default Page;
