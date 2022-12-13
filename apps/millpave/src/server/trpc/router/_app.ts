import { router } from '../trpc';
import { categoryRouter } from './category';
import { productRouter } from './product';

export const appRouter = router({
	category: categoryRouter,
	product: productRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
