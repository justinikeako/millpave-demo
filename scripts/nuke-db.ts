import {
	categories,
	products,
	productRecommendations,
	skuDetails,
	skuStock,
	skuRestocks,
	pickupLocations,
	skus
} from '~/server/db/schema';

import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { Client } from '@planetscale/database';

const db = drizzle(new Client({
	url: process.env.DATABASE_URL
}).connection());

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
