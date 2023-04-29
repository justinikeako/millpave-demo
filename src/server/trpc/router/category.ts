import { publicProcedure, router } from '../trpc';

export const categoryRouter = router({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const categories = await ctx.prisma.category.findMany({
			select: { id: true, displayName: true }
		});

		return categories;
	})
});
