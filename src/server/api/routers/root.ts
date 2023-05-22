import { createTRPCRouter } from '@/server/api/trpc';
import { categoryRouter } from '@/server/api/routers/category';
import { productRouter } from '@/server/api/routers/product';

export const appRouter = createTRPCRouter({
	category: categoryRouter,
	product: productRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
