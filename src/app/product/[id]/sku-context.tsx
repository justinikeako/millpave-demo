'use client';

import { Prisma, Sku } from '@prisma/client';
import { FullPaver, ExtendedPaverDetails, PaverDetails } from '@/types/product';
import React, { createContext, useState } from 'react';

type SkuContextValue = {
	currentSku: Sku;
	productDetails: Prisma.JsonValue & PaverDetails;
	productId: string;
	skuId: string;
	setSkuId: React.Dispatch<React.SetStateAction<string>>;
};

const SkuContext = createContext<SkuContextValue>({} as SkuContextValue);

function findDetails(
	skuId?: string | string[],
	details?: ExtendedPaverDetails[]
) {
	return details?.find((details) => skuId?.includes(details.matcher))!.data!;
}

function findSku(searchId?: string | string[], skus?: Sku[]) {
	return skus?.find((currentSku) => currentSku.id === searchId)!;
}

type SkuProviderProps = React.PropsWithChildren<{
	defaultSkuId: string;
	product: FullPaver;
}>;

function SkuProvider({ defaultSkuId, product, children }: SkuProviderProps) {
	const [skuId, setSkuId] = useState(defaultSkuId);
	const currentSku = findSku(skuId, product?.skus);
	const productDetails = findDetails(skuId, product?.details);

	return (
		<SkuContext.Provider value={{ currentSku, productDetails, productId: product.id, skuId, setSkuId }}>
			{children}
		</SkuContext.Provider>
	);
}

export { SkuContext, SkuProvider };
