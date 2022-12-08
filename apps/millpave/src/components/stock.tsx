import { Restock, Stock } from '@prisma/client';
import { formatNumber, formatRestockDate } from '../utils/format';

type StockProps = {
	fulfillment: { stock: Stock[]; restock: Restock[] };
	skuId: string;
};

function Stock({ fulfillment, skuId }: StockProps) {
	const currentStock = fulfillment.stock.reduce((totalQuantity, item) => {
		if (item.skuId !== skuId) return totalQuantity;

		return totalQuantity + item.quantity;
	}, 0);

	const closestRestock = fulfillment.restock
		.filter((restock) => restock.skuId === skuId)
		.reduce<Date | undefined>((closestDate, curr) => {
			// If closestDate isn't defined or the current item's date is closer, return the current date.
			if (!closestDate || curr.date < closestDate) {
				return curr.date;
			}

			// Otherwise the
			return closestDate;
		}, undefined);

	return currentStock > 0 ? (
		<p>{formatNumber(currentStock)} units available</p>
	) : (
		<p>{formatRestockDate(closestRestock)}</p>
	);
}

export { Stock };
