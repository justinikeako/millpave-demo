import { trpc } from '@/utils/trpc';
import { formatNumber, formatRestockDate } from '@/utils/format';

type ProductStockProps = {
	productId: string;
	skuId: string;
	outOfStockMessage?: string;
};
export function ProductStock({
	productId,
	skuId,
	outOfStockMessage
}: ProductStockProps) {
	const fulfillmentQuery = trpc.product.getFulfillmentData.useQuery(
		{ productId },
		{ refetchOnWindowFocus: false }
	);

	const fulfillment = fulfillmentQuery.data;

	if (!fulfillment) {
		return <p>Loading Stock Info...</p>;
	}

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

	const formatedStock = formatNumber(currentStock);
	const formattedRestockDate = formatRestockDate(closestRestock);

	if (currentStock > 0) {
		return <p>{formatedStock} units available</p>;
	} else {
		return (
			<p>
				{formattedRestockDate
					? formattedRestockDate
					: outOfStockMessage || 'Out of stock'}
			</p>
		);
	}
}
