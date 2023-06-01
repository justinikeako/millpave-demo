import { createTRPCRouter, publicProcedure } from '../trpc';

export const categoryRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const categories = await ctx.db.query.categories.findMany({
			columns: { id: true, displayName: true }
		});

		return categories;
	})
});
