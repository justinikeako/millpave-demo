import * as Select from '@/components/select';
import { StageForm } from './form';
import { Controller, useFormContext } from 'react-hook-form';
import { StoneEditor } from './stone-editor';
import { Border, Stone1D, StoneProject } from '@/types/quote';
import { unitDisplayNameDictionary } from '@/lib/utils';
import { useStageContext } from './stage-context';

function getBorderItems(border: Border) {
	let runningFoot = border.runningFoot.value;
	const orientation = border.orientation;

	console.log('Running Foot:', runningFoot);
	console.log('Orientation:', orientation);
	const stones: {
		skuId: string;
		displayName: string;
		sqftCoverage: number;
		sqftPrice: number;
		signatures: string[];
	}[] = [];
	// Cut out fixed values first; divy up ratio values afterwards
	const fractionalStones: Stone1D[] = [];
	let fractionalTotal = 0;
	const fixedStones: Stone1D[] = [];

	for (const stone of border.stones) {
		if (stone.coverage.unit === 'fr') {
			fractionalTotal += stone.coverage.value;
			fractionalStones.push(stone);
		} else fixedStones.push(stone);
	}

	for (const stone of fixedStones) {
		const conversionFactorDictionary =
			stone.metadata.details.conversion_factors;
		if (!conversionFactorDictionary)
			throw new Error(`Stone ${stone.skuId} can not be used as a border`);

		runningFoot -= stone.coverage.value;
		const borderSegmentArea =
			stone.coverage.value * conversionFactorDictionary[orientation];

		stones.push({
			skuId: stone.skuId,
			displayName: stone.metadata.displayName,
			sqftCoverage: borderSegmentArea,
			sqftPrice: stone.metadata.price,
			signatures: ['border']
		});

		return [
			{
				displayName: 'Colonial Classic Grey',
				quantity: 6,
				unit: 'pal',
				price: 156817.5,
				priceWithPlan: 78408.75,
				hasPlan: true
			}
		];
	}

	for (const stone of fractionalStones) {
		const conversionFactorDictionary =
			stone.metadata.details.conversion_factors;
		if (!conversionFactorDictionary)
			throw new Error(`Stone ${stone.skuId} can not be used as a border`);

		const runningFootSegment =
			runningFoot * (stone.coverage.value / fractionalTotal);
		const borderSegmentArea =
			runningFootSegment * conversionFactorDictionary[orientation];

		stones.push({
			skuId: stone.skuId,
			displayName: stone.metadata.displayName,
			sqftCoverage: borderSegmentArea,
			sqftPrice: stone.metadata.price,
			signatures: ['border']
		});
	}

	return stones;
}

export function BorderStage() {
	const { setItems } = useStageContext();

	return (
		<StageForm
			className="space-y-16 px-32"
			onSubmit={(newValues) => {
				const items = getBorderItems(newValues.border);
				console.log(items);

				setItems([
					{
						displayName: 'Colonial Classic Grey',
						quantity: 6,
						unit: 'pal',
						price: 156817.5,
						priceWithPlan: 78408.75,
						hasPlan: true
					},
					{
						displayName: 'Colonial Classic Red',
						quantity: 3,
						unit: 'pal',
						price: 88065,
						priceWithPlan: 44032.5,
						hasPlan: true
					},
					{
						displayName: 'CasaScapes Polymeric Sand',
						quantity: 3,
						unit: 'unit',
						price: 88065,
						hasPlan: false
					},
					{
						displayName: 'DynaMatrix HB-1 Protective Sealant (1 gallon)',
						quantity: 3,
						unit: 'unit',
						price: 70956.48,
						hasPlan: false
					}
				]);
			}}
		>
			<h2 className="text-center text-2xl">Add a border.</h2>

			<BorderOptions />

			<StoneEditor name="border.stones" dimension="1D" />
		</StageForm>
	);
}

function BorderOptions() {
	const { register, control } = useFormContext<StoneProject>();

	return (
		<div className="flex flex-wrap justify-center gap-4">
			<div className="max-w-xs flex-1 space-y-4">
				<label htmlFor="border.runningFoot.value" className="font-semibold">
					Running Foot
				</label>
				<label
					htmlFor="border.runningFoot.value"
					className="flex w-full rounded-md bg-gray-200 p-4"
				>
					<input
						type="number"
						id="border.runningFoot.value"
						{...register('border.runningFoot.value')}
						className="no-arrows w-full flex-1 bg-transparent outline-none"
						placeholder="Amount"
					/>

					<Controller
						control={control}
						name="border.runningFoot.unit"
						render={(runningFootUnit) => (
							<Select.Root
								value={runningFootUnit.field.value}
								onValueChange={runningFootUnit.field.onChange}
							>
								<Select.Trigger basic />

								<Select.Content>
									<Select.ScrollUpButton />
									<Select.Viewport>
										<Select.Item value="ft">
											{unitDisplayNameDictionary['ft'][0]}
										</Select.Item>
										<Select.Item value="in">
											{unitDisplayNameDictionary['in'][0]}
										</Select.Item>
										<Select.Item value="m">
											{unitDisplayNameDictionary['m'][0]}
										</Select.Item>
										<Select.Item value="cm">
											{unitDisplayNameDictionary['cm'][0]}
										</Select.Item>
									</Select.Viewport>
									<Select.ScrollDownButton />
								</Select.Content>
							</Select.Root>
						)}
					/>
				</label>
			</div>

			<div className="max-w-xs flex-1 space-y-4">
				<label className="font-semibold">Stone Orientation</label>

				<Controller
					control={control}
					name="border.orientation"
					render={(borderOrientation) => (
						<Select.Root
							value={borderOrientation.field.value}
							onValueChange={borderOrientation.field.onChange}
						>
							<Select.Trigger className="w-full !rounded-md" />

							<Select.Content>
								<Select.ScrollUpButton />
								<Select.Viewport>
									<Select.Item value="SOLDIER_ROW">Soldier Row</Select.Item>
									<Select.Item value="TIP_TO_TIP">Tip to Tip</Select.Item>
								</Select.Viewport>
								<Select.ScrollDownButton />
							</Select.Content>
						</Select.Root>
					)}
				/>
			</div>
		</div>
	);
}
