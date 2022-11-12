import { createRouter } from './context';
import { z } from 'zod';
import {
	getProduct,
	getProducts,
	getProductDetails,
	getProductSkus,
	getProductStock,
	getProductRestockQueue
} from '../mock-db';
import { SkuFragment } from '../../types/product';
import { TRPCError } from '@trpc/server';

export const productRouter = createRouter()
	.query('getPageData', {
		input: z.object({
			productId: z.string()
		}),
		async resolve({ input, ctx }) {
			const product = getProduct(input.productId);
			const productDetails = getProductDetails(input.productId);
			const productSkuList = getProductSkus(input.productId);
			const productStock = getProductStock(input.productId);
			const productRestockQueue = getProductRestockQueue(input.productId);

			return {
				...product,
				skuList: productSkuList,
				stock: productStock,
				restockQueue: productRestockQueue,
				details: productDetails,
				similarProducts: product.similarProducts.map((similarProductId) => {
					const similarProduct = getProduct(similarProductId);

					return similarProduct;
				})
			};
		}
	})
	.query('get', {
		input: z.object({
			productId: z.string()
		}),
		resolve({ input }) {
			const product = getProduct(input.productId);
			const productDetails = getProductDetails(input.productId);
			const productSkuList = getProductSkus(input.productId);

			return {
				...product,
				skuList: productSkuList,
				details: productDetails
			};
		}
	})
	.query('getList', {
		resolve() {
			const products = getProducts();

			return products;
		}
	});
