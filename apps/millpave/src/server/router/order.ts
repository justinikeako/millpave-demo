import { nanoid } from 'nanoid';
import { addDays } from 'date-fns';
import { createRouter } from './context';
import { z } from 'zod';

type Shape = {
	id: string;
	name: string;
};

type Item = {
	sku_id: string;
	id: string;
	display_name: string;
	closest_restock_date: number;
	quantity: number;
	price: number;
};

type OrderDetails = {
	area: number;
	weight: number;
	subtotal: number;
	tax: number;
	total: number;
};

type Order = {
	id: string;
	title: string;
	shapes: Shape[];
	items: Item[];
	details: OrderDetails;
};

const order: Order = {
	id: nanoid(),
	title: 'New Order',
	shapes: [
		{ id: nanoid(), name: 'Walkway' },
		{ id: nanoid(), name: 'Driveway' },
		{ id: nanoid(), name: 'Garden Edging' }
	],
	items: [
		{
			id: nanoid(),
			sku_id: 'colonial_classic:grey',
			display_name: 'Colonial Classic Grey',
			closest_restock_date: addDays(new Date(), 2).getTime(),
			quantity: 0,
			price: 0
		}
	],
	details: {
		area: 20342.5,
		weight: 473980,
		subtotal: 4129527.5,
		tax: 619429.13,
		total: 4748956.63
	}
};

type RecommendedItem = {
	id: string;
	display_name: string;
	price: number;
};

const recommendations: RecommendedItem[] = [
	{
		id: 'eff_cleaner',
		display_name: 'DynaMatrix Efflorescence Cleaner ',
		price: 4000
	}
];

export const orderRouter = createRouter().query('get', {
	input: z.object({
		id: z.string()
	}),
	resolve() {
		return {
			...order,
			recommendations
		};
	}
});
