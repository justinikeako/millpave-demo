import { useFormContext } from 'react-hook-form';
import { useStageContext } from './stage-context';
import { StageForm } from './form';
import { StoneProject } from '~/types/quote';
import { Balancer } from 'react-wrap-balancer';

type OptionProps = React.PropsWithChildren<{
	value: string;
	title: string;
	subtitle: string;
}>;

function Option({ value: id, title, subtitle: description }: OptionProps) {
	const { setValidity } = useStageContext();
	const formMethods = useFormContext<StoneProject>();

	const { register, resetField } = formMethods;

	return (
		<li className="contents">
			<input
				{...register('shape', {
					required: true,
					onChange: () => {
						resetField('measurements');
						setValidity(1, false);
					}
				})}
				id={id}
				value={id}
				type="radio"
				className="peer sr-only"
			/>
			<label
				htmlFor={id}
				className="group relative flex aspect-square w-full cursor-pointer select-none flex-col rounded-md border border-gray-400 p-4 outline-2 -outline-offset-2 outline-pink-700 hover:bg-gray-900/5 active:bg-gray-900/10 peer-checked:bg-gray-100 peer-checked:bg-pink-400/10 peer-checked:outline"
			>
				<div className="absolute right-2 top-2 h-6 w-6 rounded-full border border-gray-400 bg-clip-content p-1 outline-2 -outline-offset-2 outline-pink-700 peer-checked:group-[]:bg-pink-700 peer-checked:group-[]:outline" />
				<div className="flex-1" />
				<div className="z-10">
					<p className="font-semibold peer-checked:group-[]:text-pink-700">
						{title}
					</p>
					<p className="text-sm text-gray-500 peer-checked:group-[]:text-pink-700">
						{description}
					</p>
				</div>
			</label>
		</li>
	);
}

export function ShapeStage() {
	return (
		<StageForm className="flex flex-col items-center gap-12 xl:flex-row xl:justify-center">
			<h2 className="max-w-xs shrink-0 text-center font-display text-2xl xl:text-left">
				<Balancer>What is the shape of your project?</Balancer>
			</h2>
			<ul className="flex flex-col gap-4 md:flex-row">
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
					value="other"
					title="Other"
					subtitle="Requires area and/or running length"
				/>
			</ul>
		</StageForm>
	);
}
