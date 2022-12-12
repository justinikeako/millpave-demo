import { PaverDetails } from '../types/product';

export function extractDetail(details: PaverDetails, id: string) {
	return details.find((detail) => detail.id === id)?.value as number;
}
