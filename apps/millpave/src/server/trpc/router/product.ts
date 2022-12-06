import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import {
	getProduct,
	getProducts,
	getProductDetails,
	getProductSkus,
	getProductStock,
	getProductRestockQueue
} from '../../mock-db';

export const productRouter = router({
	getById: publicProcedure
		.input(
			z.object({
				productId: z.string()
			})
		)
		.query(({ input }) => {
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
		}),

	getList: publicProcedure.query(() => {
		const products = getProducts();

		return products;
	})
});
