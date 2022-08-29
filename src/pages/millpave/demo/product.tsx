import type { NextPage } from 'next';
import Head from 'next/head';
import ProductGallery from '../../../components/demo/product-page-gallery';
import Button from '../../../components/demo/button';
import Icon from '../../../components/icon';
import { FC, PropsWithChildren } from 'react';

const colors = [
	'D9D9D9',
	'B1B1B1',
	'696969',
	'95816D',
	'C9B098',
	'DDCCBB',
	'907A7A',
	'E7A597',
	'EF847A',
	'EFA17A',
	'EBB075',
	'E7C769',
	'E7DD69',
	'A9D786'
];

type SectionHeaderProps = {
	title: string;
};

const SectionHeader: FC<PropsWithChildren<SectionHeaderProps>> = ({
	title,
	children
}) => {
	return (
		<div className="flex items-center justify-between">
			<h2 className="font-display text-lg font-semibold">{title}</h2>
			{children}
		</div>
	);
};

const Page: NextPage = () => {
	return (
		<>
			<Head>
				<title>Colonial Classic Terracotta — Millennium Paving Stones</title>
			</Head>

			{/* Canvas */}
			<main className="flex h-[75vh] flex-col bg-neutral-100 pb-16">
				<div className="flex-1">
					<ProductGallery />
				</div>

				<div className="flex flex-col items-center">
					<Button variant="secondary" iconLeft="view_in_ar_new">
						View in Your Space
					</Button>
				</div>
			</main>

			{/* Bottom Sheet */}
			<aside className="relative z-10 -mt-8 space-y-12 rounded-2xl bg-white px-8 py-16">
				{/* Header */}
				<section className="space-y-2">
					<p>Concrete Paver</p>
					<h1 className="font-display text-xl font-semibold leading-tight">
						Colonial Classic Terracotta
					</h1>
					<div className="flex justify-between">
						<p>$228/sqft</p>

						<div className="flex space-x-1">
							<p>Restocks in 2 days</p>
							<div>
								<Button variant="tertiary" iconLeft="info" weight="normal" />
							</div>
						</div>
					</div>
				</section>

				<form className="space-y-12">
					{/* Color Picker */}
					<section className="space-y-4">
						<SectionHeader title="Colors">
							<p className="text-sm">Color Guide</p>
						</SectionHeader>

						<ul className="grid grid-cols-8 gap-2">
							{colors.map((color) => (
								<li key={color} className="contents">
									<label htmlFor={color} className="aspect-w-1 aspect-h-1">
										<input
											className="peer hidden"
											type="radio"
											name="color"
											id={color}
										/>
										<div
											className=" rounded-full border border-neutral-300 shadow-[inset_0_0_0_2px_white] peer-checked:border-black"
											style={{ background: `#${color}` }}
										/>
									</label>
								</li>
							))}
						</ul>
					</section>

					{/* QuickCalc */}
					<section className="space-y-4">
						<SectionHeader title="Quick Calculator" />

						{/* Input */}
						<div className="flex space-x-2">
							<label
								htmlFor="quickcalc-value"
								className="flex flex-1 space-x-2 rounded-md border border-neutral-300 p-4 focus-within:border-black"
							>
								<input
									id="quickcalc-value"
									type="number"
									placeholder="Quantity"
									className="w-[100%] placeholder-neutral-500 outline-none"
								/>
							</label>

							<label
								htmlFor="quickcalc-unit"
								className="flex space-x-2 rounded-md border border-neutral-300 p-4 focus-within:border-black"
							>
								<select
									name="quickcalc-unit"
									className="bg-transparent outline-none"
								>
									<option value="sqft">sqft</option>
									<option value="sqm">sqin</option>
									<option value="sqm">sqm</option>
									<option value="sqm">sqcm</option>
									<option value="pcs">pcs</option>
									<option value="pal">pal</option>
									<option value="jmd">$</option>
								</select>
							</label>
						</div>

						{/* Preview */}
						<div className="flex justify-between">
							<select className="bg-transparent">
								<option value="factory">Factory Pickup</option>
								<option value="showroom">Showroom Pickup</option>
							</select>
							<p>Total: $39,939.00</p>
						</div>

						<div className="flex flex-col space-y-2">
							<Button type="submit" variant="primary">
								Add to...
							</Button>
						</div>
					</section>
				</form>

				{/* Product Details */}
				<section className="space-y-4">
					<SectionHeader title="Product Detials" />

					<ul className="-mx-4">
						<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-neutral-100">
							<p>Dimensions</p>
							<p>4 in x 8 in x 2.375 in</p>
						</li>
						<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-neutral-100">
							<p>Weight per unit</p>
							<p>5 lbs</p>
						</li>
						<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-neutral-100">
							<p>Area per pallet</p>
							<p>128.57 sqft</p>
						</li>
						<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-neutral-100">
							<p>Units per pallet</p>
							<p>600</p>
						</li>
					</ul>
				</section>

				{/* Product Gallery */}
				<section className="space-y-4">
					<SectionHeader title="Product Gallery" />

					<ul className="no-scrollbar -mx-8 flex snap-x snap-mandatory space-x-2 overflow-x-scroll px-4">
						<li className="shrink-0 basis-2"></li>
						<li className="relative h-64 shrink-0 basis-full snap-center rounded-lg bg-neutral-100">
							<Button
								variant="tertiary"
								iconLeft="info"
								className="absolute left-4 bottom-4"
							/>
						</li>
						<li className="relative h-64 shrink-0 basis-full snap-center rounded-lg bg-neutral-100">
							<Button
								variant="tertiary"
								iconLeft="info"
								className="absolute left-4 bottom-4"
							/>
						</li>
						<li className="relative h-64 shrink-0 basis-full snap-center rounded-lg bg-neutral-100">
							<Button
								variant="tertiary"
								iconLeft="info"
								className="absolute left-4 bottom-4"
							/>
						</li>
						<li className="shrink-0 basis-2"></li>
					</ul>
				</section>

				{/* Recommendations */}
				<section className="space-y-4">
					<SectionHeader title="Similar to Colonial Classic" />

					<div className="-mx-4 flex flex-col items-center space-y-8">
						<ul className="grid w-full grid-cols-2 gap-2">
							<li className="items-center space-y-2">
								<div className="aspect-w-1 aspect-h-1 w-full rounded-lg bg-neutral-100" />

								<div>
									<h3 className="text-center font-semibold">Banjo</h3>
									<p className="text-center">from $211</p>
								</div>
							</li>
							<li className="items-center space-y-2">
								<div className="aspect-w-1 aspect-h-1 w-full rounded-lg bg-neutral-100" />

								<div>
									<h3 className="text-center font-semibold">
										Heritage Regular
									</h3>
									<p className="text-center">from $211</p>
								</div>
							</li>
						</ul>

						<Button variant="tertiary" iconRight="expand_more">
							Show more products
						</Button>
					</div>
				</section>
			</aside>
		</>
	);
};

export default Page;
