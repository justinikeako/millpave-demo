import { evaluate } from 'mathjs';
import { isNumeric, roundTo } from '../utils/number';

type MathInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	value: string;
	result: number;
	onChange: (newValue: string) => void;
	onResultChange: (newResult: number) => void;
	canIncrement?: boolean;
	canDecrement?: boolean;
};

function MathInput({
	value,
	result,
	onChange,
	onResultChange,
	canIncrement = true,
	canDecrement = true,
	...props
}: MathInputProps) {
	function handleEvaluate(value: string) {
		try {
			const _result = evaluate(value);

			if (typeof _result === 'number') {
				return _result;
			} else {
				// If the result is not a number, return the last valid result
				const lastValidResult = result;

				return lastValidResult;
			}
		} catch {
			// If an error occurs while evaluating the value, return the last valid result
			const lastValidResult = result;

			return lastValidResult;
		}
	}

	function handleChange(newValue: string) {
		// Call the onChange prop function with the new value
		onChange(newValue);

		const newResult = handleEvaluate(newValue);
		onResultChange(newResult);
	}

	function handleBlur() {
		const finalResult = handleEvaluate(value);

		// If the final result is not a number, restore the last valid result
		if (typeof finalResult !== 'number') {
			restoreLastValidResult();
		}
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		// Parse the value prop to a number
		const nonEmptyValue = value || '0';
		const parsedValue = parseFloat(nonEmptyValue);

		if (event.key === 'ArrowUp') {
			// Increment the value on up arrow key if the parsed value is numeric
			// or if the value prop is an empty string, and if canIncrement is true
			if (isNumeric(nonEmptyValue) && canIncrement) {
				handleChange(String(parsedValue + 1));
			}
		} else if (event.key === 'ArrowDown') {
			// Decrement the value on down arrow key if the parsed value is numeric
			// or if the value prop is an empty string, and if canDecrement is true
			if (isNumeric(nonEmptyValue) && canDecrement) {
				handleChange(String(parsedValue - 1));
			}
		} else if (event.key === 'Enter') {
			// If the parsed value isn't numeric, prevent default form
			// submission behavior and evaluate the input
			if (!isNumeric(nonEmptyValue)) {
				event.preventDefault();
				const finalResult = handleEvaluate(value);

				if (finalResult) {
					restoreLastValidResult();
				}
			}
		}
	}

	function restoreLastValidResult() {
		const lastValidResult = roundTo(result, 0.01);

		onChange(String(lastValidResult));
	}

	return (
		<input
			{...props}
			type="text"
			value={value}
			onChange={(e) => handleChange(e.target.value)}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
		/>
	);
}

export { MathInput };
