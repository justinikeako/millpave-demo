import { Button } from '@/components/button';
import * as Select from '@/components/select';
import { StageForm } from './form';
import { Controller, useFormContext } from 'react-hook-form';
import { StoneEditor } from './stone-editor';
import { FormValues } from '../stage-context';

function BorderOptions() {
	const { register, control } = useFormContext<FormValues>();

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
										<Select.Item value="ft">ft</Select.Item>
										<Select.Item value="in">in</Select.Item>
										<Select.Item value="m">m</Select.Item>
										<Select.Item value="cm">cm</Select.Item>
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
				{/* <div className="flex w-full rounded-md bg-gray-200 p-6 pr-4"> */}
				<Select.Root defaultValue="SOLDIER_ROW">
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
				{/* </div> */}
			</div>
		</div>
	);
}

export function BorderStage() {
	return (
		<StageForm className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Add a border.</h2>

			<BorderOptions />

			<StoneEditor name="border.stones" dimension="2D" />

			<Button variant="primary" type="submit">
				Next
			</Button>
		</StageForm>
	);
}
