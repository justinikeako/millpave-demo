import { NextPage } from 'next';
import Head from 'next/head';
import { FC, PropsWithChildren } from 'react';
import Button from '../../components/button';
import Icon from '../../components/icon';

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
	return (
		<>
			<Head>
				<title>New Order — Millennium Paving Stones</title>
			</Head>

			<main className="space-y-16 px-8 py-24">
				<h1 className="font-display text-2xl font-semibold">New Order</h1>

				{/* Shapes */}
				<section className="space-y-4">
					<SectionHeader title="Shapes" />

					<ul className="no-scrollbar -mx-8 flex items-center space-x-2 overflow-x-scroll">
						<li className="h-2 shrink-0 basis-4"></li>

						<li className="flex snap-center rounded-full bg-neutral-100 p-2.5">
							<Icon name="add" />
						</li>
						<li className="flex snap-center rounded-full bg-neutral-100 px-4 py-2">
							Walkway
						</li>
						<li className="flex snap-center rounded-full bg-neutral-100 px-4 py-2">
							Driveway
						</li>
						<li className="flex snap-center rounded-full bg-neutral-100 px-4 py-2">
							Garden
						</li>

						<li className="h-2 shrink-0 basis-4"></li>
					</ul>
				</section>

				{/* Items */}
				<section className="space-y-4">
					<SectionHeader title="Items (4)" />

					{/* Overage */}
					<div className="flex items-center justify-between">
						<p className="flex space-x-1">
							<span>Area Overage</span>

							<div>
								<Button variant="tertiary" iconLeft="info" weight="normal" />
							</div>
						</p>

						<label
							htmlFor="overage"
							className="flex space-x-2 rounded-md border border-neutral-300 p-4 focus-within:border-black"
						>
							<select
								name="overage"
								defaultValue="none"
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
					<div className="flex space-x-4 rounded-md bg-neutral-100 px-4 py-6">
						<Icon name="warning" />
						<div className="flex-1 space-y-2">
							<p className="font-semibold">Declining an overage?</p>
							<p>
								Your job could be put on hold or delayed. Likely higher
								contractor time and material costs. And the next batch of pavers
								may not be an exact color match.
							</p>
						</div>
					</div>

					{/* Item List */}
					<ul className="!mt-8">
						<li className="flex flex-col items-center space-y-4">
							<div className="h-32 w-32 bg-neutral-100" />
							<div className="space-y-2 self-stretch">
								<h3 className="font-display text-lg font-semibold">
									Colonial Classic Grey
								</h3>
								<div className="flex justify-between">
									<p className="font-semibold">27.5 pallets</p>
									<p className="font-semibold">$733,451.50</p>
								</div>
								<div className="flex items-center justify-between">
									<p className="text-neutral-500">
										Order Today. Pick up on-site:
										<br />
										Available <b>Fri, Aug 19</b> at{' '}
										<span className="inline-block text-black">
											Our St. Thomas Factory
										</span>
									</p>
									<Button variant="tertiary" iconLeft="edit" />
								</div>
							</div>
						</li>
					</ul>
				</section>

				{/* Order Details */}
				<section className="space-y-4">
					<SectionHeader title="Order Details" />

					<ul className="space-y-1">
						<li className="flex justify-between py-1">
							<p>Area Coverage</p>
							<p>30,000 sqft</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Estimated Weight</p>
							<p>10,730 lbs</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Defect Allowance</p>
							<p>-$14,060.00</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Subtotal</p>
							<p>$923,339.45</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Tax</p>
							<p>$138,500.90</p>
						</li>
						<li className="flex justify-between py-1 font-semibold">
							<p>Total</p>
							<p>$1,061,840.35</p>
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
						<Button variant="secondary" className="w-full">
							Send as Quote
						</Button>
					</div>
				</section>

				{/* Recommendations */}
				<section className="space-y-8">
					<SectionHeader title="You may like..." />

					<ul>
						<li className="flex flex-col items-center space-y-4">
							<div className="h-32 w-32 bg-neutral-100" />
							<div className="space-y-2 self-stretch">
								<h3 className="font-semibold">
									DynaMatrix Efflorescence Cleaner (1 gallon)
								</h3>

								<p>$211.00</p>
							</div>
							<Button variant="primary" className="w-full">
								Add to Order
							</Button>
						</li>
					</ul>
				</section>
			</main>
		</>
	);
};

export default Page;
