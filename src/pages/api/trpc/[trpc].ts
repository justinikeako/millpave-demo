import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/routers/root';
import { NextRequest } from 'next/server';

export const config = {
	runtime: 'edge',
	reigons: ['cle1', 'iad1']
};

export default async function handler(req: NextRequest) {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		router: appRouter,
		req,
		createContext: createTRPCContext
	});
}
