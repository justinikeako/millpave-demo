import { evaluate, round } from 'mathjs';
import { isNumeric } from '../utils/number';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type CustomProps = {
	value: string;
	result: number;
	onChange: (newValue: string) => void;
	onResultChange: (newResult: number) => void;
	canIncrement?: boolean;
	canDecrement?: boolean;
};

type MathInputProps = CustomProps & Omit<InputProps, keyof CustomProps>;

function MathInput({
	value,
	result,
	onChange,
	onResultChange,
	canIncrement = true,
	canDecrement = true,
	...props
}: MathInputProps) {
	function handleEvaluate(input: string) {
		try {
			// Replace characters associated with multiplication and division the * and / characters
			const parsedInput = input.replace(/[×x]/g, '*').replace(/÷/g, '/');

			const finalResult = evaluate(parsedInput);

			if (typeof finalResult === 'number') {
				return finalResult;
			} else {
				// If the result is not a number, return the last valid result
				const lastValidResult = result;

				return lastValidResult;
			}
		} catch {
			// If an error occurs while evaluating the input, return the last valid result
			const lastValidResult = result;

			return lastValidResult;
		}
	}

	function handleChange(newValue: string) {
		// Trigger onChange preserving expected input behavior
		onChange(newValue);

		// Prevent parsing to NaN
		const nonEmptyValue = newValue.trim() || '0';

		// If the value is numeric, parse it and trigger the onResultChange
		if (isNumeric(value)) {
			const newResult = parseFloat(nonEmptyValue);

			onResultChange(newResult);
		} else {
			// If the value isn't numeric, evaluate it it and trigger the onResultChange
			const newResult = handleEvaluate(nonEmptyValue);

			onResultChange(newResult);
		}
	}

	function handleBlur() {
		if (!isNumeric(value)) {
			const finalResult = handleEvaluate(value);

			onChange(String(finalResult));
			onResultChange(finalResult);
		}
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		// Prevent parsing to NaN
		const nonEmptyValue = event.currentTarget.value.trim() || '0';
		// Turn the the input value to a number
		const parsedValue = parseFloat(nonEmptyValue);

		if (event.key === 'ArrowUp') {
			// Increment the value on up arrow key if the parsed value is numeric
			// or if the value prop is an empty string, and if canIncrement is true
			if (isNumeric(nonEmptyValue) && canIncrement) {
				handleChange(String(round(parsedValue + 1, 2)));
			}
		} else if (event.key === 'ArrowDown') {
			// Decrement the value on down arrow key if the parsed value is numeric
			// or if the value prop is an empty string, and if canDecrement is true
			if (isNumeric(nonEmptyValue) && canDecrement) {
				handleChange(String(round(parsedValue - 1, 2)));
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
		const lastValidResult = result;

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
