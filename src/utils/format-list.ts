/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { get } from 'lodash-es';

type Path<T, K extends keyof T> = K extends string
	? T[K] extends object
		? `${K}.${Path<T[K], keyof T[K]>}`
		: K
	: never;

interface FormatListConfig<T> {
	separator?: string;
	conjunction?: string;
	toStringFunc?: (item: T) => string;
}

// const defaultConfig = { separator: ', ', conjunction: 'and' };

export function formatObjectList<T extends object, K extends keyof T>(
	list: T[],
	path: Path<T, K>,
	config?: FormatListConfig<T>
): string {
	const separator = config?.separator || ', ',
		conjunction = config?.conjunction || 'and',
		toStringFunc = config?.toStringFunc;

	const values = list.map((item) => get(item, path)) as T[K][];

	if (values.length === 0) {
		return '';
	} else if (values.length === 1) {
		return toStringFunc ? toStringFunc(list[0]!) : list[0]!.toString();
	} else if (values.length === 2) {
		const firstValue = toStringFunc
			? toStringFunc(list[0]!)
			: values[0]!.toString();

		const secondValue = toStringFunc
			? toStringFunc(list[1]!)
			: values[1]!.toString();

		return `${firstValue} ${conjunction} ${secondValue}`;
	} else {
		const lastValue = toStringFunc
			? toStringFunc(list[values.length - 1]!)
			: values[values.length - 1]!.toString();

		const restValues = values.slice(0, values.length - 1);
		const restString = restValues
			.map((value, index) =>
				toStringFunc ? toStringFunc(list[index]!) : value!.toString()
			)
			.join(separator);

		return `${restString}${separator}${conjunction} ${lastValue}`;
	}
}

export function formatStringList(
	list: string[],
	config?: {
		separator?: string;
		conjunction?: string;
		toString?: (item: string) => string;
	}
): string {
	let separator = ', ';
	let conjunction = 'and';
	let toStringFunc: ((item: string) => string) | undefined;

	if (config) {
		if (config.separator) separator = config.separator;
		if (config.conjunction) conjunction = config.conjunction;
		if (config.toString) toStringFunc = config.toString;
	}

	if (list.length === 0) {
		return '';
	} else if (list.length === 1) {
		return toStringFunc ? toStringFunc(list[0]!) : list[0]!.toString();
	} else if (list.length === 2) {
		const firstValue = toStringFunc
			? toStringFunc(list[0]!)
			: list[0]!.toString();
		const secondValue = toStringFunc
			? toStringFunc(list[1]!)
			: list[1]!.toString();
		return `${firstValue} ${conjunction} ${secondValue}`;
	} else {
		const lastValue = toStringFunc
			? toStringFunc(list[list.length - 1]!)
			: list[list.length - 1]!.toString();
		const restValues = list.slice(0, list.length - 1);
		const restString = restValues
			.map((value) => (toStringFunc ? toStringFunc(value) : value.toString()))
			.join(separator);
		return `${restString}${separator}${conjunction} ${lastValue}`;
	}
}
