export function roundPrice(inputPrice: number): number {
	return Math.round(inputPrice * 100) / 100;
}
