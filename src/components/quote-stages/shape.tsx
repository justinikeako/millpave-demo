import { useFormContext } from 'react-hook-form';
import { useStageContext } from './stage-context';
import { StageForm } from './form';
import { StoneProject } from '~/types/quote';

type OptionProps = React.PropsWithChildren<{
	value: string;
	title: string;
	subtitle: string;
}>;

function Option({ value: id, title, subtitle: description }: OptionProps) {
	const { setStageValidity } = useStageContext();
	const formMethods = useFormContext<StoneProject>();

	const { register, resetField } = formMethods;

	return (
		<li>
			<label
				htmlFor={id}
				className="relative flex aspect-square w-full cursor-pointer flex-col rounded-md p-6 hover:bg-gray-100"
			>
				<input
					{...register('shape', {
						required: true,
						onChange: () => {
							resetField('measurements');
							setStageValidity(1, false);
						}
					})}
					id={id}
					value={id}
					type="radio"
					className="peer sr-only"
				/>

				<div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gray-200 peer-checked:bg-gray-100 peer-checked:ring-2 peer-checked:ring-black peer-focus:ring-black" />

				<div className="flex-1" />
				<div className="z-10">
					<p className="font-semibold">{title}</p>
					<p className="text-sm">{description}</p>
				</div>
			</label>
		</li>
	);
}

export function ShapeStage() {
	return (
		<StageForm className="flex items-center gap-12">
			<h2 className="max-w-xs shrink-0 font-display text-2xl">
				What is the shape of your project?
			</h2>
			<div className="flex justify-center">
				<ul className="grid grid-flow-col grid-cols-[repeat(3,224px)] gap-4">
					<Option
						value="rect"
						title="Rectangle"
						subtitle="Requires length and width."
					/>
					<Option
						value="circle"
						title="Circle"
						subtitle="Requires diameter or circumference"
					/>
					<Option
						value="arbitrary"
						title="Arbitrary"
						subtitle="Requires area and/or running length"
					/>
				</ul>
			</div>
		</StageForm>
	);
}
