import { addDays, differenceInDays, format } from 'date-fns';

export function formatPrice(price: number) {
	const priceFormatter = new Intl.NumberFormat('en', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	return '$' + priceFormatter.format(price);
}

export function formatNumber(number: number) {
	const numberFormatter = new Intl.NumberFormat('en', {
		maximumFractionDigits: 2
	});

	return numberFormatter.format(number);
}

export function formatRelativeUpdate(date: Date) {
	const difference = differenceInDays(date, new Date());

	if (difference === 0) return format(date, 'h:mm aaa');
	else if (difference === -1) return format(date, "'Yesterday at' h:mm aaa");

	return format(date, 'EEE, LLL d');
}
