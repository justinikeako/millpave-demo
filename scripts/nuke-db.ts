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

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql, createClient } from '@vercel/postgres';

export const db = drizzle(sql);

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
