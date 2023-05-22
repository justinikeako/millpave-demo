import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
	schema: './drizzle/schema.ts',
	out: './drizzle',
	connectionString: process.env.DATABASE_URL
} satisfies Config;
