'use client';

import { Suspense, useState, useContext } from 'react';
import { OrchestratedReveal } from '@/components/orchestrated-reveal';
import { SkuPicker } from '@/components/sku-picker';
import { FullPaver } from '@/types/product';
import { formatPrice } from '@/utils/format';
import { extractDetail } from '@/utils/product';
import { Section } from './section';
import { SkuContext } from './sku-context';
import dynamic from 'next/dynamic';
import { trpc } from '@/utils/trpc';
import { formatNumber, formatRestockDate } from '@/utils/format';

const ProductViewer3D = dynamic(
	() => import('@/components/product-viewer-3d'),
	{ suspense: true }
);

type GalleryProps = {
	showModelViewer: boolean;
};

function Gallery({ showModelViewer }: GalleryProps) {
	const images = [0, 0, 0, 0];

	const { currentSku } = useContext(SkuContext);
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<OrchestratedReveal
			delay={0.1}
			className="flex flex-col items-center gap-2 md:sticky md:top-8 md:flex-[2] lg:flex-[3]"
		>
			<div className="relative aspect-square w-full bg-gray-200">
				{showModelViewer && selectedIndex === 3 && (
					<Suspense
						fallback={
							<div className="grid h-full w-full place-items-center">
								<p>Loading 3D Model</p>
							</div>
						}
					>
						<ProductViewer3D
							skuId={currentSku.id}
							displayName={currentSku.displayName}
						/>
					</Suspense>
				)}
			</div>
			<div className="flex w-full justify-center gap-2">
				{images.map((_, index) => {
					const id = 'image-' + index;

					return (
						<div key={id} className="contents">
							<input
								type="radio"
								name="currentImage"
								id={id}
								className="peer hidden"
								checked={index === selectedIndex}
								onChange={() => setSelectedIndex(index)}
							/>

							<label
								htmlFor={id}
								className="flex aspect-square max-w-[80px] flex-1 shrink-0 items-center justify-center border border-gray-200 bg-gray-200 text-lg text-gray-400 inner-border-2 inner-border-white peer-checked:border-2 peer-checked:border-black"
							>
								{showModelViewer && index === 3 && '3D'}
							</label>
						</div>
					);
				})}
			</div>
		</OrchestratedReveal>
	);
}

type ProductStockProps = {
	outOfStockMessage?: string;
};

function ProductStock({ outOfStockMessage }: ProductStockProps) {
	const { productId, skuId } = useContext(SkuContext);

	const fulfillmentQuery = trpc.product.getFulfillmentData.useQuery(
		{ productId },
		{ refetchOnWindowFocus: false }
	);

	const fulfillment = fulfillmentQuery.data;

	if (!fulfillment) {
		return <p>Loading Stock Info...</p>;
	}

	const currentStock = fulfillment.stock.reduce((totalQuantity, item) => {
		if (item.skuId !== skuId) return totalQuantity;

		return totalQuantity + item.quantity;
	}, 0);

	const closestRestock = fulfillment.restock
		.filter((restock) => restock.skuId === skuId)
		.reduce<Date | undefined>((closestDate, curr) => {
			// If closestDate isn't defined or the current item's date is closer, return the current date.
			if (!closestDate || curr.date < closestDate) {
				return curr.date;
			}

			// Otherwise the
			return closestDate;
		}, undefined);

	const formatedStock = formatNumber(currentStock);
	const formattedRestockDate = formatRestockDate(closestRestock);

	if (currentStock > 0) {
		return <p>{formatedStock} units available</p>;
	} else {
		return (
			<p>
				{formattedRestockDate
					? formattedRestockDate
					: outOfStockMessage || 'Out of stock'}
			</p>
		);
	}
}

const _ProductStock = trpc.withTRPC(ProductStock) as typeof ProductStock;

type SkuPickerProps = {
	skuIdTemplateFragments: FullPaver['skuIdFragments'];
};

function _SkuPicker(props: SkuPickerProps) {
	const { skuId, setSkuId } = useContext(SkuContext);

	return (
		<SkuPicker
			{...props}
			value={skuId}
			section={Section}
			onChange={(newSkuId) => {
				console.log(newSkuId);

				setSkuId(newSkuId);
			}}
		/>
	);
}

function ProductPricing() {
	const { currentSku, productDetails } = useContext(SkuContext);

	return (
		<div className="flex items-center gap-4">
			<p>
				<del>{formatPrice(currentSku.price)}</del>&nbsp;
				{formatPrice(currentSku.price - 0.01)} per {currentSku.unit}
			</p>
			{currentSku.unit === 'sqft' && (
				<>
					<div className="h-8 w-[2px] bg-current" />
					<p>
						{formatPrice(
							currentSku.price / extractDetail(productDetails, 'pcs_per_sqft')
						)}
						&nbsp;per unit
					</p>
				</>
			)}
		</div>
	);
}

function ProductSpecs() {
	const { productDetails } = useContext(SkuContext);

	return (
		<Section heading="Specifications">
			<ul>
				{productDetails.map((detail) => (
					<li
						key={detail.id}
						className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100"
					>
						<p>{detail.displayName}</p>
						<p>{detail.value}</p>
					</li>
				))}
			</ul>
		</Section>
	);
}

export {
	Gallery,
	ProductPricing,
	_ProductStock as ProductStock,
	_SkuPicker as SkuPicker,
	ProductSpecs
};
