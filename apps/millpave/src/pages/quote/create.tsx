import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { forwardRef, useState } from 'react';
import { Button } from '../../components/button';
import { Icon } from '../../components/icon';
import cx from 'classnames';
import {
	Control,
	Controller,
	FieldPath,
	FormProvider,
	useForm,
	useFormContext
} from 'react-hook-form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectViewport
} from '../../components/select';
import { w } from 'windstitch';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger
} from '../../components/dialog';

const stages = [0, 0, 0, 0, 0];

type Shape = 'RECTANGLE' | 'CIRCLE' | 'ARBITRARY';
type Orientation = 'SOLDIER_ROW' | 'TIP_TO_TIP';
type Unit1D = 'ft' | 'yd' | 'in' | 'm' | 'cm';
type Unit2D = 'sqft' | 'sqin' | 'sqm' | 'sqcm';

type Measurement1D = {
	value: number;
	unit: Unit1D;
};

type Measurement2D = {
	value: number;
	unit: Unit2D;
};

type FormValues = {
	shape: Shape;
	dimensions: {
		length: Measurement1D;
		width: Measurement1D;
	};
	infill: {
		stones: never[];
	};
	border: {
		orientation: Orientation;
		runningFoot: Measurement1D;
		stones: never[];
	};
};

const defaultValues: FormValues = {
	shape: 'RECTANGLE',

	dimensions: {
		length: {
			value: 0,
			unit: 'ft'
		},
		width: {
			value: 0,
			unit: 'ft'
		}
	},

	infill: {
		stones: []
	},

	border: {
		orientation: 'SOLDIER_ROW',
		runningFoot: {
			value: 0,
			unit: 'ft'
		},
		stones: []
	}
};

const Label = w.label(
	'flex space-x-2 rounded-md inner-border inner-border-gray-300 focus-within:inner-border-2 focus-within:inner-border-bubblegum-',
	{
		variants: {
			size: {
				medium: 'p-4',
				large: 'p-6'
			}
		},
		defaultVariants: {
			size: 'medium'
		}
	}
);

const StageHeading = w.h1('text-center font-display text-xl font-semibold');
const StageFooter = w.footer('space-y-2 pb-8 pt-4 bg-white');

type StageProps = {
	onNext: () => void;
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

const ShapeStage = ({ onNext }: StageProps) => {
	const { register } = useFormContext<FormValues>();

	return (
		<>
			<div className="flex flex-1 flex-col">
				<StageHeading>Pick a shape to get started.</StageHeading>

				<ul className="flex flex-1 flex-col justify-center space-y-2">
					<Option
						{...register('shape')}
						value="RECTANGLE"
						title="Rectangle"
						description="Requires length and width"
					/>
					<Option
						{...register('shape')}
						value="CIRCLE"
						title="Circle"
						description="Requires diameter or circumference"
					/>
					<Option
						{...register('shape')}
						value="ARBITRARY"
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
					<span>Next</span>
					<Icon name="arrow_forward" />
				</Button>
			</StageFooter>
		</>
	);
};

function convert(num: number) {
	const convertToFtFrom: Record<Unit1D, (num: number) => number> = {
		ft: (feet) => feet,
		yd: (yards) => yards * 3,
		in: (inches) => inches / 12,
		m: (meters) => meters * 3.281,
		cm: (centimeters) => centimeters / 30.48
	};

	return {
		toFtFrom(unit: Unit1D) {
			return convertToFtFrom[unit](num);
		}
	};
}

type MeasurementInputProps = {
	placeholder: string;
	name: FieldPath<FormValues>;
	size: 'medium' | 'large';
	control: Control<FormValues>;
	className?: string;
};

const MeasurementInput = ({
	name,
	placeholder,
	size,
	control,
	className
}: MeasurementInputProps) => {
	const { register } = useFormContext();

	return (
		<Label htmlFor={name} size={size} className={cx('pr-3', className)}>
			<input
				{...register(`${name}.value`)}
				type="number"
				id={name}
				autoComplete="off"
				placeholder={placeholder}
				className="w-[100%] font-semibold outline-none placeholder:font-normal placeholder:text-gray-500"
			/>

			<Controller
				control={control}
				name={`${name}.unit` as FieldPath<FormValues>}
				render={({ field }) => (
					<Select value={field.value as Unit1D} onValueChange={field.onChange}>
						<SelectTrigger basic />

						<SelectContent>
							<SelectViewport>
								<SelectItem value="in">in</SelectItem>
								<SelectItem value="ft">ft</SelectItem>
								<SelectItem value="cm">cm</SelectItem>
								<SelectItem value="m">m</SelectItem>
							</SelectViewport>
						</SelectContent>
					</Select>
				)}
			/>
		</Label>
	);
};

const MeasurementStage = ({ onNext }: StageProps) => {
	const { control } = useFormContext<FormValues>();

	return (
		<>
			<StageHeading>Now, enter your measurements.</StageHeading>

			<div className="flex flex-1 flex-col justify-center space-y-4">
				<h2 className="font-semibold">Measurements</h2>
				<div className="flex items-center space-x-2">
					<MeasurementInput
						size="large"
						name="dimensions.length"
						placeholder="Length"
						control={control}
						className="flex-1"
					/>

					<div className="font-semibold text-gray-500">X</div>

					<MeasurementInput
						size="large"
						name="dimensions.width"
						placeholder="Width"
						control={control}
						className="flex-1"
					/>
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
			</StageFooter>
		</>
	);
};

const InfillStage = ({ onNext }: StageProps) => {
	const [dialogOpen, setDialogOpen] = useState(false);

	const [dialogState, setDialogState] = useState({
		// type of dialog
		// information about its contents (index of stone or field name)
	});

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

				<Dialog onOpenChange={setDialogOpen}>
					<DialogContent open={dialogOpen}>
						<DialogHeader title="Add item to quote" />
					</DialogContent>

					<ul className="space-y-2">
						<li
							className="align-center -mx-2 flex justify-between p-2 active:bg-gray-100 "
							onClick={() => setDialogOpen(!dialogOpen)}
						>
							<DialogTrigger className="contents text-left">
								<div className="h-6 w-6 self-start bg-gray-100" />

								<div className="ml-2 flex-1">
									<p>Banjo Grey</p>
									<p className="text-gray-500">5 parts</p>
								</div>
								<Icon name="edit" className="self-center text-gray-500" />
							</DialogTrigger>
						</li>

						<li
							className="align-center -mx-2 flex justify-between p-2 active:bg-gray-100 "
							onClick={() => setDialogOpen(!dialogOpen)}
						>
							<DialogTrigger className="contents text-left">
								<div className="h-6 w-6 self-start bg-gray-100" />

								<div className="ml-2 flex-1">
									<p>Banjo Red</p>
									<p className="text-gray-500">1 part</p>
								</div>
								<Icon name="edit" className="self-center text-gray-500" />
							</DialogTrigger>
						</li>
					</ul>
				</Dialog>
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
	const { register, control } = useFormContext<FormValues>();

	const [unit, setUnit] = useState<Unit1D>('ft');

	return (
		<div className="space-y-12">
			<StageHeading>Add a Border</StageHeading>

			<div className="flex flex-1 flex-col justify-center space-y-8">
				<div className="space-y-4">
					<h2 className="font-semibold">Running Length</h2>
					<div className="flex space-x-2">
						<Label htmlFor="border.runningFoot" className="flex-1">
							<input
								{...register('border.runningFoot.value')}
								type="number"
								placeholder="Length of border"
								autoComplete="off"
								id="border.runningFoot"
								className="w-[100%] font-semibold outline-none placeholder:font-normal placeholder:text-gray-500"
							/>
						</Label>

						<Controller
							control={control}
							name="border.runningFoot.unit"
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger />

									<SelectContent>
										<SelectViewport>
											<SelectItem value="in">in</SelectItem>
											<SelectItem value="ft">ft</SelectItem>
											<SelectItem value="cm">cm</SelectItem>
											<SelectItem value="m">m</SelectItem>
										</SelectViewport>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="font-semibold">Stone Orientation</h2>

					<Controller
						control={control}
						name="border.orientation"
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={(newOrientation) =>
									field.onChange(newOrientation)
								}
							>
								<SelectTrigger className="w-full" />
								<SelectContent>
									<SelectViewport>
										<SelectItem value="SOLDIER_ROW">Soldier Row</SelectItem>
										<SelectItem value="TIP_TO_TIP">Tip to Tip</SelectItem>
									</SelectViewport>
								</SelectContent>
							</Select>
						)}
					/>
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
	// const { register } = useFormContext<FormValues>();

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
									<Icon name="factory" opticalSize={20} weight={300} />

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
		defaultValues
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

			<main className="flex h-full flex-col space-y-4">
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

export default Page;
