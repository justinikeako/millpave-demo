import { useFormContext } from 'react-hook-form';

type OptionProps = React.PropsWithChildren<{
	value: string;
	title: string;
	subtitle: string;
}>;

function Option({ value: id, title, subtitle: description }: OptionProps) {
	const formContext = useFormContext();

	const { register } = formContext;

	return (
		<li>
			<label htmlFor={id} className="relative block h-full w-full p-6">
				<input
					{...register('shape')}
					id={id}
					value={id}
					type="radio"
					className="peer hidden"
				/>

				<div className="absolute inset-0 -z-10 rounded-lg border peer-checked:border-2 peer-checked:border-black peer-checked:bg-gray-100	" />
				<p className="font-semibold">{title}</p>
				<p className="text-sm">{description}</p>
			</label>
		</li>
	);
}

export function ShapeStage() {
	return (
		<section className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Pick a shape to get started.</h2>
			<div className="flex justify-center">
				<ul className="grid grid-flow-col grid-cols-[repeat(3,224px)] gap-4">
					<Option
						value="rectangle"
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
		</section>
	);
}
