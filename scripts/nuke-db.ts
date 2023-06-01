import {
	categories,
	products,
	productRecommendations,
	skuDetails,
	skuStock,
	skuRestocks,
	pickupLocations,
	skus
} from '@/drizzle/schema';

import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';

const connection = connect({
	host: process.env['PROD_DATABASE_HOST'],
	username: process.env['PROD_DATABASE_USERNAME'],
	password: process.env['PROD_DATABASE_PASSWORD']
});

// import { drizzle } from 'drizzle-orm/mysql2';
// import mysql from 'mysql2/promise';

// const connection = await mysql.createConnection({
// 	database: process.env.LOCAL_DB_NAME,
// 	host: process.env.LOCAL_DB_HOST,
// 	user: process.env.LOCAL_DB_USER,
// 	password: process.env.LOCAL_DB_PASS
// });

const db = drizzle(connection);

function main() {
	console.log('💣 Dropping db nuke');

	return db.transaction(async (tdb) => {
		await tdb.delete(pickupLocations).then(() => console.log('↓'));
		await tdb.delete(categories).then(() => console.log('↓'));
		await tdb.delete(products).then(() => console.log('↓'));
		await tdb.delete(productRecommendations).then(() => console.log('↓'));
		await tdb.delete(skuDetails).then(() => console.log('↓'));
		await tdb.delete(skuRestocks).then(() => console.log('↓'));
		await tdb.delete(pickupLocations).then(() => console.log('↓'));
		await tdb.delete(skuStock).then(() => console.log('↓'));
		await tdb.delete(skus).then(() => console.log('↓'));
	});
}

await main().then(() => console.log('💥💥💥'));
