import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { forwardRef, useState } from 'react';
import { Button } from '../../components/button';
import Icon from '../../components/icon';
import cx from 'classnames';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectViewport
} from '../../components/select';
import { w } from 'windstitch';

const stages = [0, 0, 0, 0, 0];

const Label = w.label(
	'flex space-x-2 rounded-md inner-border inner-border-gray-300 focus-within:inner-border-2 focus-within:inner-border-bubblegum-700',
	{
		variants: {
			size: {
				regular: 'p-4',
				large: 'p-6'
			}
		},
		defaultVariants: {
			size: 'regular'
		}
	}
);

const StageHeading = w.h1('text-center font-display text-xl font-semibold');
const StageFooter = w.footer('space-y-2 pb-8 pt-4 bg-white');

type StageProps = {
	onNext: () => void;
};

const ShapeStage = ({ onNext }: StageProps) => {
	const { register } = useFormContext();

	return (
		<>
			<div className="flex flex-1 flex-col">
				<StageHeading>Pick a shape to get started.</StageHeading>

				<ul className="flex flex-1 flex-col justify-center space-y-2">
					<Option
						{...register('shape')}
						value="rectangle"
						title="Rectangle"
						description="Requires length and width"
					/>
					<Option
						{...register('shape')}
						value="circle"
						title="Circle"
						description="Requires diameter or circumference"
					/>
					<Option
						{...register('shape')}
						value="arbitrary"
						title="Arbitrary"
						description="Requires area and/or running length"
					/>
				</ul>
			</div>

			<StageFooter>
				<Button
					variant="primary"
					type="submit"
					className="w-full"
					onClick={onNext}
				>
					Next
					<Icon name="arrow_forward" />
				</Button>
			</StageFooter>
		</>
	);
};

const MeasurementStage = ({ onNext }: StageProps) => {
	// const { register } = useFormContext();

	return (
		<>
			<StageHeading>Now, enter your measurements.</StageHeading>

			<div className="flex flex-1 flex-col justify-center space-y-4">
				<h2 className="font-semibold">Measurements</h2>
				<div className="flex items-center space-x-2">
					<Label htmlFor="quickcalc-value" size="large" className="flex-1 pr-3">
						<input
							type="number"
							id="quickcalc-value"
							autoComplete="off"
							placeholder="Length"
							className="w-[100%] font-semibold outline-none placeholder:font-normal placeholder:text-gray-500"
						/>

						<Select defaultValue="ft">
							<SelectTrigger basic />
							<SelectContent>
								<SelectViewport>
									<SelectItem value="ft">ft</SelectItem>
									<SelectItem value="m">m</SelectItem>
								</SelectViewport>
							</SelectContent>
						</Select>
					</Label>

					<div className="font-semibold text-gray-500">X</div>

					<Label htmlFor="quickcalc-value" size="large" className="flex-1 pr-3">
						<input
							type="number"
							id="quickcalc-value"
							autoComplete="off"
							placeholder="Width"
							className="w-[100%] font-semibold outline-none placeholder:font-normal placeholder:text-gray-500"
						/>

						<Select defaultValue="ft">
							<SelectTrigger basic />
							<SelectContent>
								<SelectViewport>
									<SelectItem value="ft">ft</SelectItem>
									<SelectItem value="m">m</SelectItem>
								</SelectViewport>
							</SelectContent>
						</Select>
					</Label>
				</div>
			</div>

			<StageFooter>
				<Button
					variant="primary"
					type="submit"
					className="w-full"
					onClick={onNext}
				>
					Next
					<Icon name="arrow_forward" />
				</Button>
			</StageFooter>
		</>
	);
};

const InfillStage = ({ onNext }: StageProps) => {
	// const { register } = useFormContext();

	return (
		<>
			<StageHeading>Add an Infill</StageHeading>

			<div className="flex flex-1 flex-col justify-center space-y-4">
				<div className="flex justify-between">
					<h2 className="font-semibold">Stones</h2>

					<Button variant="tertiary" className="text-gray-500">
						<Icon name="add" />
					</Button>
				</div>

				<ul className="space-y-2">
					<li className="align-center -mx-2 flex justify-between p-2">
						<div className="h-6 w-6 self-start bg-gray-100" />

						<div className="ml-2 flex-1">
							<p>Banjo Red</p>
							<p className="text-gray-500">2 parts</p>
						</div>

						<Button variant="tertiary" className="self-center text-gray-500">
							<Icon name="more_horiz" />
						</Button>
					</li>
					<li className="align-center -mx-2 flex justify-between p-2">
						<div className="h-6 w-6 self-start bg-gray-100" />

						<div className="ml-2 flex-1">
							<p>Banjo Red</p>
							<p className="text-gray-500">2 parts</p>
						</div>

						<Button variant="tertiary" className="self-center text-gray-500">
							<Icon name="more_horiz" />
						</Button>
					</li>
				</ul>
			</div>

			<StageFooter>
				<Button
					variant="primary"
					type="submit"
					className="w-full"
					onClick={onNext}
				>
					<span>Next</span>
					<Icon name="arrow_forward" />
				</Button>
				<Button
					variant="secondary"
					type="button"
					className="w-full text-gray-500"
					onClick={onNext}
				>
					<span>Skip this step</span>
				</Button>
			</StageFooter>
		</>
	);
};

const BorderStage = ({ onNext }: StageProps) => {
	// const { register } = useFormContext();

	return (
		<div className="space-y-12">
			<StageHeading>Add a Border</StageHeading>

			<div className="flex flex-1 flex-col justify-center space-y-8">
				<div className="space-y-4">
					<h2 className="font-semibold">Running Length</h2>
					<div className="flex space-x-2">
						<Label htmlFor="nubi" size="regular" className="flex-1">
							<input
								type="number"
								name="nuber"
								id="nubi"
								placeholder="Length of border"
								autoComplete="off"
								className="w-[100%] font-semibold outline-none placeholder:font-normal placeholder:text-gray-500"
							/>
						</Label>

						<Select defaultValue="ft">
							<SelectTrigger />
							<SelectContent>
								<SelectViewport>
									<SelectItem value="ft">ft</SelectItem>
									<SelectItem value="m">m</SelectItem>
								</SelectViewport>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="font-semibold">Stone Orientation</h2>

					<Select defaultValue="SOLDIER_ROW">
						<SelectTrigger className="w-full" />
						<SelectContent>
							<SelectViewport>
								<SelectItem value="SOLDIER_ROW">Soldier Row</SelectItem>
								<SelectItem value="TIP_TO_TIP">Tip to Tip</SelectItem>
							</SelectViewport>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-4">
					<div className="flex justify-between">
						<h2 className="font-semibold">Stones</h2>

						<Button variant="tertiary" className="text-gray-500">
							<Icon name="add" />
						</Button>
					</div>

					<ul className="space-y-2">
						<li className="align-center -mx-2 flex justify-between p-2">
							<div className="h-6 w-6 self-start bg-gray-100" />

							<div className="ml-2 flex-1">
								<p>Banjo Red</p>
								<p className="text-gray-500">2 parts</p>
							</div>

							<Button variant="tertiary" className="self-center text-gray-500">
								<Icon name="more_horiz" />
							</Button>
						</li>

						<li className="align-center -mx-2 flex justify-between p-2">
							<div className="h-6 w-6 self-start bg-gray-100" />

							<div className="ml-2 flex-1">
								<p>Banjo Red</p>
								<p className="text-gray-500">2 parts</p>
							</div>

							<Button variant="tertiary" className="self-center text-gray-500">
								<Icon name="more_horiz" />
							</Button>
						</li>
					</ul>
				</div>
			</div>

			<StageFooter>
				<Button
					variant="primary"
					type="submit"
					className="w-full"
					onClick={onNext}
				>
					<span>Next</span>
					<Icon name="arrow_forward" />
				</Button>
				<Button
					variant="secondary"
					type="button"
					className="w-full text-gray-500"
					onClick={onNext}
				>
					<span>Skip this step</span>
				</Button>
			</StageFooter>
		</div>
	);
};

const ReviewStage = ({ onNext }: StageProps) => {
	// const { register } = useFormContext();

	return (
		<>
			<StageHeading>Review Items</StageHeading>
			<div className="flex flex-1 flex-col justify-center space-y-8">
				<div className="space-y-4">
					<h2 className="font-semibold">Options</h2>

					<ul className="no-scrollbar -mx-8 flex items-center space-x-2 overflow-x-scroll">
						<li className="h-2 shrink-0 basis-4" />

						<li className="flex snap-center rounded-full bg-gray-100 p-2.5">
							<Icon name="tune" />
						</li>

						<li className="flex snap-center whitespace-nowrap rounded-full bg-gray-100 px-4 py-2">
							Exact Quantities
						</li>
						<li className="flex snap-center whitespace-nowrap rounded-full bg-gray-100 px-4 py-2">
							Add Sealer
						</li>
						<li className="flex snap-center whitespace-nowrap rounded-full bg-gray-100 px-4 py-2">
							Add Sand
						</li>

						<li className="h-2 shrink-0 basis-4" />
					</ul>
				</div>

				<div className="space-y-4">
					<div className="flex justify-between">
						<h2 className="font-semibold">Items</h2>

						<Button variant="tertiary" className="text-gray-500">
							<Icon name="add" />
						</Button>
					</div>

					<ul className="space-y-2">
						<li className="align-center -mx-2 flex justify-between p-2">
							<div className="h-6 w-6 self-start bg-gray-100" />

							<div className="ml-2 flex-1">
								<p>Banjo Red</p>
								<div className="flex space-x-1 text-gray-500">
									<Icon name="storefront" opticalSize={20} weight={300} />

									<p>319.38 sqft / 2.5 pallets</p>
								</div>
							</div>

							<Button variant="tertiary" className="self-center text-gray-500">
								<Icon name="more_horiz" opticalSize={20} weight={300} />
							</Button>
						</li>

						<li className="align-center -mx-2 flex justify-between p-2">
							<div className="h-6 w-6 self-start bg-gray-100" />

							<div className="ml-2 flex-1">
								<p>Banjo Red</p>
								<div className="flex space-x-1 text-gray-500">
									<Icon name="factory" opticalSize={20} />

									<p className="text-gray-500">193.13 sqft / 1.5 pallets</p>
								</div>
							</div>

							<Button variant="tertiary" className="self-center text-gray-500">
								<Icon name="more_horiz" />
							</Button>
						</li>
					</ul>
				</div>
			</div>

			<StageFooter>
				<Button
					variant="primary"
					type="submit"
					className="w-full"
					onClick={onNext}
				>
					<Icon name="request_quote" />
					<span>Add to Quote</span>
				</Button>
			</StageFooter>
		</>
	);
};

const Form = ({ children }: React.PropsWithChildren) => {
	const formMethods = useForm({
		defaultValues: {
			shape: 'rectangle'
		}
	});

	return (
		<FormProvider {...formMethods}>
			<form
				className="flex h-full flex-col px-8"
				onSubmit={formMethods.handleSubmit(console.log)}
			>
				{children}
			</form>
		</FormProvider>
	);
};

const Page: NextPage = () => {
	const router = useRouter();

	const [currentStage, setStage] = useState(0);

	function handleNext() {
		setStage((currentStage) => Math.min(currentStage + 1, stages.length - 1));
	}

	return (
		<>
			<Head>
				<title>Create your Quote — Millennium Paving Stones</title>
			</Head>

			<main className="absolute inset-0 flex flex-col space-y-4">
				<nav className="flex items-center space-x-6 bg-white px-8 pt-12 pb-8">
					<Button variant="tertiary" onClick={() => router.back()}>
						<Icon name="arrow_back" />
					</Button>

					<ul className="flex flex-1 space-x-2">
						{stages.map((_, index) => (
							<li
								key={index}
								className={cx(
									'h-2 flex-1 rounded-full',
									index < currentStage && 'bg-bubblegum-300',
									index === currentStage && 'bg-bubblegum-700',
									index > currentStage && 'bg-gray-100'
								)}
								onClick={() => setStage(index)}
							/>
						))}
					</ul>
				</nav>

				<Form>
					{currentStage === 0 && <ShapeStage onNext={handleNext} />}
					{currentStage === 1 && <MeasurementStage onNext={handleNext} />}
					{currentStage === 2 && <InfillStage onNext={handleNext} />}
					{currentStage === 3 && <BorderStage onNext={handleNext} />}
					{currentStage === 4 && <ReviewStage onNext={handleNext} />}
				</Form>
			</main>
		</>
	);
};

type OptionProps = {
	title: string;
	description: string;
	value: string;
} & React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

const Option = forwardRef<HTMLInputElement, OptionProps>(function Option(
	{ title, description, value, ...props },
	ref
) {
	// Do some value matching here and adjust the styles accordingly
	return (
		<li className="relative flex items-center p-6 pr-4">
			<input
				ref={ref}
				type="radio"
				name="shape"
				className="peer hidden"
				id={value}
				value={value}
				{...props}
			/>

			<label
				htmlFor={value}
				className="absolute inset-0 rounded-md p-6 pr-4 inner-border inner-border-gray-300 peer-checked:inner-border-2 peer-checked:inner-border-bubblegum-700"
			/>

			<div className="flex-1 [.peer:checked~div&>p]:text-bubblegum-700">
				<p className="font-semibold">{title}</p>
				<p className="text-sm text-gray-500">{description}</p>
			</div>

			<div className="h-6 w-6 rounded-full p-1 inner-border inner-border-gray-300 peer-checked:inner-border-2 peer-checked:inner-border-bubblegum-700" />

			<div className="absolute right-5 h-4 w-4 rounded-full bg-transparent peer-checked:bg-bubblegum-700" />
		</li>
	);
});

export default Page;
