import { createRouter } from './context';
import { z } from 'zod';
import {
	getProduct,
	getProductDetails,
	getProductRestockQueue,
	getProductSkus,
	getProductStock
} from '../mock-db';

export const productRouter = createRouter().query('get', {
	input: z.object({
		productId: z.string()
	}),
	resolve({ input }) {
		const product = getProduct(input.productId);
		const productDetails = getProductDetails(input.productId);
		const productSkuList = getProductSkus(input.productId);
		const productStock = getProductStock(input.productId);
		const productRestockQueue = getProductRestockQueue(input.productId);

		return {
			...product,
			skuList: productSkuList,
			stock: productStock,
			queue: productRestockQueue,
			details: productDetails
		};
	}
});
