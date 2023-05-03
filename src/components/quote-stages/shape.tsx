type OptionProps = React.PropsWithChildren<{
	id: string;
	fieldName: string;
	title: string;
	description: string;
}>;

function Option({ id, fieldName, title, description }: OptionProps) {
	return (
		<li>
			<label htmlFor={id} className="relative block h-full w-full p-6">
				<input name={fieldName} id={id} type="radio" className="peer hidden" />

				<div className="absolute inset-0 -z-10 rounded-lg border peer-checked:border-2 peer-checked:border-black peer-checked:bg-gray-100	" />
				<p className="font-semibold">{title}</p>
				<p>{description}</p>
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
						fieldName="shape"
						id="rectangle"
						title="Rectangle"
						description="Requires length and width."
					/>
					<Option
						fieldName="shape"
						id="circle"
						title="Circle"
						description="Requires diameter or circumference"
					/>
					<Option
						fieldName="shape"
						id="arbitrary"
						title="Arbitrary"
						description="Requires area and/or running length"
					/>
				</ul>
			</div>
		</section>
	);
}
