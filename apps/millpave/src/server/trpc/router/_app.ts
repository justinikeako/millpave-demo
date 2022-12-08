import { router } from '../trpc';
import { categoryRouter } from './category';
import { productRouter } from './product';
import { quoteRouter } from './quote';

export const appRouter = router({
	category: categoryRouter,
	product: productRouter,
	quote: quoteRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
