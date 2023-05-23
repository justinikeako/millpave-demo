/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Document } from 'langchain/document';
import { formatPrice } from './format';
import { Sku } from '@/types/product';
import { db } from '@/server/db';
import { ExtendedPaverDetails } from '@/types/product';

export async function getProductDocuments() {
	const products = await db.query.products.findMany({
		columns: {
			id: true,
			displayName: true,
			description: true,
			hasModels: true
		},
		with: {
			skus: true,
			recommendations: {
				orderBy: (productRecommendations, { desc }) =>
					desc(productRecommendations.relevance),
				with: {
					recommending: {
						columns: { displayName: true }
					}
				}
			},
			details: true,
			category: true
		}
	});

	const docs: Document[] = [];

	for (const product of products) {
		let content = '';

		function findDetails(skuId?: string, details?: ExtendedPaverDetails[]) {
			return details?.find((details) => skuId?.includes(details.matcher));
		}

		if (product) {
			content = '';
			const getDetailsByVariant = () => {
				return (
					product.details
						.map((details) => {
							const detailList = formatObjectList(
								details.formattedData,
								'displayName',
								{
									toStringFunc: (item) =>
										`${item.displayName} -- ${item.value}`,
									conjunction: ' '
								}
							);

							const variantName = details.matcher
								.replace(product.id, product.displayName)
								.replace(/[:_]/g, ' ')
								.split(' ')
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(' ');

							return `"${variantName}": ${detailList}`;
						})
						.join('. ') + '. '
				);
			};

			const getSimilar = () =>
				formatObjectList(product.recommendations, 'recommending.displayName');

			function getLowestAndHighestPrice(skus: Sku[]) {
				if (skus.length === 0) {
					throw new Error('The array cannot be empty');
				}

				let lowestPriceProduct = skus[0]!;
				let highestPriceProduct = skus[0]!;

				for (let i = 1; i < skus.length; i++) {
					if (skus[i]!.price < lowestPriceProduct!.price) {
						lowestPriceProduct = skus[i]!;
					}
					if (skus[i]!.price > highestPriceProduct!.price) {
						highestPriceProduct = skus[i]!;
					}
				}

				return {
					valueProduct: lowestPriceProduct,
					premiumProduct: highestPriceProduct
				};
			}

			const { valueProduct, premiumProduct } = getLowestAndHighestPrice(
				product.skus
			);

			// prettier-ignore
			content += `Product Name: ${product.displayName}. The price of ${product.displayName} ranges from $${valueProduct.price} to $${premiumProduct.price}. ${product.displayName} description: ${product.description} ${product.displayName} specifications by variant group: ${getDetailsByVariant()} ${product.displayName} is similar to ${getSimilar()}. ${product.hasModels? `3D virtual samples of ${product.displayName} are available` : `${product.displayName} does not have 3D virtual samples at the moment`}.`;

			content += ` The following are the prices for all variants of ${product.displayName}:`;
			for (const sku of product.skus) {
				const skuDetails = findDetails(sku.id, product.details);

				if (skuDetails) {
					const unitPrice = skuDetails.rawData?.pcs_per_sqft
						? ' and ' +
						  formatPrice(sku.price / skuDetails.rawData.pcs_per_sqft) +
						  ' per unit'
						: '';

					content += ` ${sku.displayName} costs $${sku.price} per ${sku.unit}${unitPrice}.`;
				}
			}
		}

		const cleanedContent = content.replace(/\s+/g, ' ').trim();

		const metadata = {
			title: product.displayName,
			source: `https://millpave.notprimitive.com/product/${product.id}`,
			contentLength: cleanedContent?.match(/\b\w+\b/g)?.length ?? 0
		};

		docs.push(new Document({ pageContent: cleanedContent, metadata }));
	}

	return docs;
}

export async function getCatalogueDocument() {
	const categories = await db.query.categories.findMany({
		columns: {
			id: true
		},
		with: {
			products: {
				columns: { displayName: true }
			}
		}
	});

	const categoryLongNames = {
		concrete_pavers: 'Concrete pavers',
		maintenance: 'Maintenance products for concrete',
		slabs_blocks: 'Slabs and Blocks'
	};

	let content = 'Millennium sells products in the following categories: ';

	content +=
		formatObjectList(categories, 'id', {
			separator: '.',
			conjunction: ' ',
			toStringFunc(category) {
				// prettier-ignore
				return `${categoryLongNames[category.id as keyof typeof categoryLongNames]} -- ${formatObjectList(category.products, 'displayName' )}`
			}
		}) + '.';

	const cleanedContent = content.replace(/\s+/g, ' ').trim();

	const metadata = {
		title: '',
		source: 'https://millpave.notprimitive.com/products/all',
		contentLength: cleanedContent?.match(/\b\w+\b/g)?.length ?? 0
	};

	return [new Document({ pageContent: cleanedContent, metadata })];
}

import { get } from 'lodash-es';

type Path<T, K extends keyof T> = K extends string
	? T[K] extends object
		? `${K}.${Path<T[K], keyof T[K]>}`
		: K
	: never;

interface FormatListConfig<T> {
	separator?: string;
	conjunction?: string;
	toStringFunc?: (item: T) => string;
}

function formatObjectList<T extends object, K extends keyof T>(
	list: T[],
	path: Path<T, K>,
	config?: FormatListConfig<T>
): string {
	const separator = config?.separator || ', ',
		conjunction = config?.conjunction || 'and',
		toStringFunc = config?.toStringFunc;

	const values = list.map((item) => get(item, path)) as T[K][];

	if (values.length === 0) {
		return '';
	} else if (values.length === 1) {
		return toStringFunc ? toStringFunc(list[0]!) : list[0]!.toString();
	} else if (values.length === 2) {
		const firstValue = toStringFunc
			? toStringFunc(list[0]!)
			: values[0]!.toString();

		const secondValue = toStringFunc
			? toStringFunc(list[1]!)
			: values[1]!.toString();

		return `${firstValue} ${conjunction} ${secondValue}`;
	} else {
		const lastValue = toStringFunc
			? toStringFunc(list[values.length - 1]!)
			: values[values.length - 1]!.toString();

		const restValues = values.slice(0, values.length - 1);
		const restString = restValues
			.map((value, index) =>
				toStringFunc ? toStringFunc(list[index]!) : value!.toString()
			)
			.join(separator);

		return `${restString}${separator}${conjunction} ${lastValue}`;
	}
}
