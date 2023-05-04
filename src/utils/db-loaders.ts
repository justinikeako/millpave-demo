/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Document } from 'langchain/document';
import { formatPrice } from './format';
import { extractDetail } from './product';
import { ExtendedPaverDetails, PaverDetails } from '../types/product';
import { PrismaClient, Sku } from '@prisma/client';
import { formatObjectList } from './format-list';

const prisma = new PrismaClient();

export async function getProductDocuments() {
	const products = await prisma.product.findMany({
		select: {
			id: true,
			displayName: true,
			description: true,
			hasModels: true,
			pickupLocations: true,
			category: true,
			details: true,
			skus: true,
			similar: {
				orderBy: { relevance: 'desc' },
				include: {
					similar: {
						select: {
							displayName: true
						}
					}
				}
			}
		}
	});

	const docs: Document[] = [];

	for (const product of products) {
		let content = '';

		function findDetails(skuId?: string, details?: ExtendedPaverDetails[]) {
			return details?.find((details) => skuId?.includes(details.matcher))?.data;
		}

		if (product) {
			content = '';
			const getDetailsByVariant = () => {
				return (
					product.details
						.map((details) => {
							const data = details.data as PaverDetails;

							const detailList = formatObjectList(data, 'displayName', {
								toStringFunc: (item) => `${item.displayName} -- ${item.value}`,
								conjunction: ' '
							});

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
				formatObjectList(product.similar, 'similar.displayName');

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
				const skuDetails = findDetails(
					sku.id,
					product.details as ExtendedPaverDetails[]
				);

				if (skuDetails) {
					const pcs_per_sqft = extractDetail(skuDetails, 'pcs_per_sqft');

					const unitPrice = pcs_per_sqft
						? ' and ' + formatPrice(sku.price / pcs_per_sqft) + ' per unit'
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
	const categories = await prisma.category.findMany({
		select: {
			id: true,
			products: {
				select: {
					displayName: true
				}
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
