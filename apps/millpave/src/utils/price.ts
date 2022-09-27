export function roundPrice(inputPrice: number): number {
	const outputPrice = parseFloat(inputPrice.toFixed(2));

	return outputPrice;
}
