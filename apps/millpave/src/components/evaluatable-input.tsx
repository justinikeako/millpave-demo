import { evaluate, number, round } from 'mathjs';

function isNumeric(value: string | number) {
	try {
		number(value);

		if (isNaN(parseFloat(value as string))) return false;

		return true;
	} catch {
		return false;
	}
}

function noEmptyStrings(str: string) {
	return str === '' ? '0' : str;
}

function evaluateInputValue(inputValue: string): number {
	// Replace invalid math symbols with valid ones
	const parsedInputValue = inputValue.replace(/(×|x)/g, '*').replace(/÷/g, '/');

	// Evaluate parsed input value
	const transpiledInputValue = evaluate(parsedInputValue);

	// Throw if `evaluate` returns an object
	if (isNaN(transpiledInputValue)) {
		throw new Error('Got an object. Restoring last valid qcValue');
	}

	// Return transpiled value otherwise
	return transpiledInputValue;
}

type EvaluatableInputProps = {
	inputValue: string;
	placeholder: string;
	onChange: (newValue: number) => void;
	onInputChange: (newValue: string) => void;
	onBlur: () => void;
	onRestoreLastValidValue: () => number;
};

function EvaluatableInput({
	inputValue,
	placeholder,
	onChange,
	onInputChange,
	onBlur,
	onRestoreLastValidValue
}: EvaluatableInputProps) {
	const hijackInputValue = onInputChange;

	function commitChange(value: number) {
		let valueToCommit = value;

		// Committed value is always rounded to nearest hundredth
		valueToCommit = round(valueToCommit, 2);

		hijackInputValue(valueToCommit.toString());

		if (valueToCommit > 0) onChange(valueToCommit);
		else onChange(0);
	}

	function restoreLastValid() {
		const lastValidValue = onRestoreLastValidValue();

		hijackInputValue(lastValidValue.toString());
	}

	return (
		<input
			id="quickcalc-value"
			type="text"
			autoComplete="off"
			placeholder={placeholder}
			className="w-[100%] placeholder-gray-500 outline-none"
			value={inputValue}
			onChange={(e) => {
				const inputValue = e.currentTarget.value;
				const inputValueIsNumeric = isNumeric(inputValue);

				// Don't change default behavior
				onInputChange(e.currentTarget.value);

				if (inputValueIsNumeric === true) {
					// Turn inputValue into a number
					const inputValueAsNumber = parseFloat(inputValue);

					// Commit that number as qcValue
					onChange(inputValueAsNumber);
				} else if (inputValue === '') {
					// If the input is empty, set qcValue to 0
					onChange(0);
				} else {
					try {
						// Otherwise, try to evaluate the inputValue as an expression
						const evaluatedValue = evaluateInputValue(inputValue);

						// Set calculated value as qcValue
						onChange(round(evaluatedValue, 2));
					} catch {}
				}
			}}
			onBlur={(e) => {
				onBlur(); // Let the form know when this input was touched

				const inputValue = e.currentTarget.value;
				const inputValueIsNumeric = isNumeric(inputValue);

				// Numbers don't need to be evaluated
				if (inputValueIsNumeric === false) {
					// If the input is empty, avoid NaN by setting value to 0
					if (inputValue === '') onChange(0);
					else {
						try {
							// Otherwise evalutate input as an expression
							const evaluatedValue = evaluateInputValue(inputValue);

							// Set calculated value as qcValue
							commitChange(round(evaluatedValue, 2));
						} catch {
							// Evaluation failed, restore the last valid value
							restoreLastValid();
						}
					}
				}
			}}
			onKeyDown={(e) => {
				const inputValue = e.currentTarget.value;
				const inputValueIsNumeric = isNumeric(inputValue);

				// Allow nudge only if the input value is a number
				if (
					(inputValueIsNumeric || inputValue === '') &&
					(e.key === 'ArrowUp' || e.key === 'ArrowDown')
				) {
					e.preventDefault();

					const parsedInputValue = parseFloat(
						noEmptyStrings(e.currentTarget.value)
					);

					if (e.key === 'ArrowUp') {
						// Nudge up 1 step
						commitChange(parsedInputValue + 1);
					} else if (e.key === 'ArrowDown' && parsedInputValue >= 1) {
						// Nudge down 1 step if current value is greater than 1
						commitChange(parsedInputValue - 1);
					}
				} else if (!inputValueIsNumeric && e.key === 'Enter') {
					e.preventDefault();

					// If input is empty, avoid NaN by setting qcValue to 0
					if (inputValue === '') onChange(0);
					else {
						try {
							// Otherwise evalutate input as an expression
							const evaluatedValue = evaluateInputValue(inputValue);

							// Set calculated value as qcValue
							commitChange(round(evaluatedValue, 2));
						} catch {
							// Evaluation failed, restore the last valid qcValue
							restoreLastValid();
						}
					}
				}
			}}
		/>
	);
}

export { EvaluatableInput };
