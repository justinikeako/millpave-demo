import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from '~/drizzle/schema';

// Create the connection
const connection = connect({
	host: process.env['PROD_DATABASE_HOST'],
	username: process.env['PROD_DATABASE_USERNAME'],
	password: process.env['PROD_DATABASE_PASSWORD']
});

export const db = drizzle(connection, { schema });
