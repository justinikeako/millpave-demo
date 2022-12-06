import { router } from '../trpc';
import { productRouter } from './product';
import { quoteRouter } from './quote';

export const appRouter = router({
	product: productRouter,
	quote: quoteRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
