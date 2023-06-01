import { createTRPCRouter } from '~/server/api/trpc';
import { categoryRouter } from './category';
import { productRouter } from './product';
import { quoteRouter } from './quote';

export const appRouter = createTRPCRouter({
	category: categoryRouter,
	product: productRouter,
	quote: quoteRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
