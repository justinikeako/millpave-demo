function isNumeric(input: string): boolean {
	const regex = /^[+-]?\d+(\.\d+)?$/;
	// This regular expression matches a string that starts with an optional
	// plus or minus sign, followed by one or more digits, followed by an
	// optional decimal point and one or more digits.

	return regex.test(input);
	// The test() method returns true if the string matches the regular expression
}

function roundTo(
	value: number,
	nearest: number,
	method: 'round' | 'up' | 'down' = 'round'
) {
	switch (method) {
		case 'up':
			return Math.ceil(value / nearest) * nearest;
		case 'down':
			return Math.floor(value / nearest) * nearest;
		default:
			return Math.round(value / nearest) * nearest;
	}
}

export { isNumeric, roundTo };
