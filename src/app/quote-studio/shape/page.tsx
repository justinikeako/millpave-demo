'use client';

import { useFormContext } from 'react-hook-form';
import { useStageContext } from '../_components/stage-context';
import { StageForm } from '../_components/form';
import type { StoneProject } from '~/types/quote';
import { Balancer } from 'react-wrap-balancer';

export default function Page() {
	return (
		<StageForm className="flex min-h-[100svh] flex-col items-center justify-center gap-12">
			<h2 className="max-w-xs shrink-0 text-center font-display text-3xl md:text-4xl">
				<Balancer>What is the shape of your project?</Balancer>
			</h2>
			<ul className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
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

type OptionProps = React.PropsWithChildren<{
	value: 'rect' | 'circle' | 'other';
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
				className="group relative flex aspect-square w-64 cursor-pointer select-none flex-col rounded-md border border-gray-400 outline-2 -outline-offset-2 outline-pink-700 hover:bg-gray-900/5 active:bg-gray-900/10 peer-checked:bg-gray-100 peer-checked:bg-pink-400/10 peer-checked:outline"
			>
				<div className="absolute right-2 top-2 h-6 w-6 rounded-full border border-gray-400 bg-clip-content p-1 outline-2 -outline-offset-2 outline-pink-700 peer-checked:group-[]:bg-pink-700 peer-checked:group-[]:outline" />
				<svg
					width={256}
					height={200}
					viewBox="0 0 256 256"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="min-h-0 min-w-0 flex-1 fill-gray-200 stroke-gray-400 stroke-2 peer-checked:group-[]:fill-pink-700 peer-checked:group-[]:stroke-none"
				>
					{id === 'rect' && (
						<rect x="87" y="63" width="82" height="130" rx="4" />
					)}
					{id === 'circle' && <ellipse cx="128.5" cy="128" rx="72.5" ry="70" />}
					{id === 'other' && (
						<path d="M142.025 94.2642C114.719 89.5634 113.365 69.9769 87.4122 72.1707C43.6231 75.8723 47.3944 179.347 72.8174 183.578C98.2404 187.808 110.686 158.656 134.492 166.655C147.229 170.935 162.74 196.74 183.455 166.655C204.171 136.571 203.88 105.307 196.167 94.2641C179.579 70.5149 169.331 98.9649 142.025 94.2642Z" />
					)}
				</svg>
				<div className="px-4 pb-4">
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
