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

export const productRouter = createRouter()
	.query('getPageData', {
		input: z.object({
			productId: z.string()
		}),
		async resolve({ input }) {
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
