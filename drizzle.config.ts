import { type Config } from 'drizzle-kit';
import { env } from '~/env';

export default {
	schema: './src/server/db/schema.ts',
	dialect: 'postgresql',
	driver: 'pglite',
	dbCredentials: { url: env.POSTGRES_URL },
	tablesFilter: ['millpave_*']
} satisfies Config;
