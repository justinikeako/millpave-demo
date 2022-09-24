// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { productRouter } from './product';
import { quoteRouter } from './quote';

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('product.', productRouter)
	.merge('quote.', quoteRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
