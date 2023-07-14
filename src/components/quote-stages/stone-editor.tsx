import { Button } from '~/components/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select';
import {
	Sheet,
	SheetBody,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '~/components/ui/sheet';
import { Icon } from '~/components/icon';
import {
	Controller,
	useController,
	useFieldArray,
	useForm,
	useFormContext
} from 'react-hook-form';
import { SkuPickerProvider, ProductPicker, VariantPicker } from '../sku-picker';
import { api } from '~/utils/api';
import { useState } from 'react';
import { formatPrice } from '~/utils/format';
import { ProductStock } from '../product-stock';
import {
	StoneProject,
	Stone,
	StoneMetadata,
	Unit,
	Pattern
} from '~/types/quote';
import {
	cn,
	findSku,
	pluralize,
	stopPropagate,
	unitDisplayNameDictionary
} from '~/lib/utils';
import { PaverDetails } from '~/types/product';
import { useStageContext } from './stage-context';
import Balancer from 'react-wrap-balancer';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { flushSync } from 'react-dom';
import { compact, isEqual } from 'lodash-es';
import { pattern1D, pattern2D } from './patterns';

type StoneEditorProps = {
	name: 'infill.contents' | 'border.contents';
	dimension: '1D' | '2D';
	stageIndex: number;
};

export function StoneEditor(props: StoneEditorProps) {
	const { setValidity, addStoneMetadata, removeStoneMetadata } =
		useStageContext();
	const { control } = useFormContext<StoneProject>();

	const {
		fields: contents,
		append,
		update,
		remove
	} = useFieldArray({
		control,
		keyName: 'id',
		name: props.name
	});

	const currentStageValidity = contents.length > 0;
	const [currentStagePreviousValidity, setCurrentStagePreviousValidity] =
		useState(currentStageValidity);

	if (currentStagePreviousValidity !== currentStageValidity) {
		setValidity(props.stageIndex, contents.length > 0);

		setCurrentStagePreviousValidity(currentStageValidity);
	}

	const [stoneSheetOpen, setStoneSheetOpen] = useState(false);
	const [patternSheetOpen, setPatternSheetOpen] = useState(false);

	function addStone(values: StoneFormValues) {
		append(values.stone);
		addStoneMetadata(values.metadata);

		flushSync(() => {
			setStoneSheetOpen(false);
		});
	}

	function editStone(index: number, oldSkuId: string, values: StoneFormValues) {
		update(index, values.stone);

		if (oldSkuId !== values.metadata.skuId) {
			removeStoneMetadata(oldSkuId);
			addStoneMetadata(values.metadata);
		}
	}

	function removeStone(index: number, skuId: string) {
		remove(index);
		removeStoneMetadata(skuId);
	}

	function addPattern(values: PatternFormValues) {
		append(values.pattern);

		for (const metadata of values.metadataArray) {
			addStoneMetadata(metadata);
		}

		flushSync(() => {
			setPatternSheetOpen(false);
		});
	}
	function editPattern(
		index: number,
		oldPattern: Pattern,
		values: PatternFormValues
	) {
		const newPattern = values.pattern;
		update(index, newPattern);

		// Diff the old pattern and new pattern to find which metadata objects should be added vs removed.
		const previousSet = new Set<string>(
			oldPattern.contents.map((content) => content.skuId)
		);
		const currentSet = new Set<string>(
			newPattern.contents.map((content) => content.skuId)
		);

		const skuIdsToBeAdded: string[] = Array.from(currentSet).filter(
			(skuId) => !previousSet.has(skuId)
		);
		const skuIdsToBeRemoved: string[] = Array.from(previousSet).filter(
			(skuId) => !currentSet.has(skuId)
		);

		for (const skuId of skuIdsToBeRemoved) {
			removeStoneMetadata(skuId);
		}

		for (const skuId of skuIdsToBeAdded) {
			const metadata = values.metadataArray.find(
				(metadata) => metadata.skuId === skuId
			);
			if (metadata) addStoneMetadata(metadata);
		}

		flushSync(() => {
			setPatternSheetOpen(false);
		});
	}

	function removePattern(index: number, patternToBeRemoved: Pattern) {
		remove(index);

		for (const stone of patternToBeRemoved.contents) {
			removeStoneMetadata(stone.skuId);
		}
	}

	return (
		<div className="flex flex-col items-center justify-center gap-2 md:flex-row md:flex-wrap">
			<div
				data-has-items={contents.length > 0 || undefined}
				data-empty={contents.length === 0 || undefined}
				className="group flex flex-col items-center gap-2 data-[has-items]:flex-col md:flex-row md:data-[has-items]:h-64"
			>
				<div className="relative h-24 w-64 md:h-64 md:group-data-[has-items]:h-auto md:group-data-[has-items]:flex-1">
					<div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md border border-gray-400 after:absolute after:inset-0 after:rounded-md after:outline-2 after:outline-pink-700 focus-within:after:outline hover:bg-black/5 active:bg-black/10 group-data-[has-items]:flex-row md:flex-col md:items-stretch md:group-data-[has-items]:items-center">
						<div className="aspect-square h-full shrink-0 bg-gray-200 gradient-mask-r-80 group-data-[has-items]:aspect-square group-data-[has-items]:flex-none md:flex-1 md:group-data-[empty]:gradient-mask-b-80" />

						<div className="flex-1 space-y-0.5 p-4 text-left group-data-[has-items]:flex-1 group-data-[has-items]:pl-0 group-data-[has-items]:pt-4 group-data-[has-items]:text-left md:flex-none md:pt-0 md:text-center md:group-data-[empty]:px-6">
							<h3 className="font-semibold">
								<Sheet
									open={patternSheetOpen}
									onOpenChange={setPatternSheetOpen}
								>
									<SheetTrigger className="w-full outline-none [text-align:inherit] after:absolute after:inset-0 after:z-10">
										<span className="hidden group-data-[has-items]:block">
											Add a pattern
										</span>
										<span className="group-data-[has-items]:hidden">
											Start with a pattern
										</span>
									</SheetTrigger>

									<SheetContent position="right" open={patternSheetOpen}>
										<PatternForm
											dimension={props.dimension}
											intent="add"
											onSubmit={addPattern}
										/>
									</SheetContent>
								</Sheet>
							</h3>
							<p className="text-sm text-gray-500">
								<Balancer>Customize the colors of pre-made patterns.</Balancer>
							</p>
						</div>
					</div>

					<span className="pointer-events-none absolute -top-2 left-2 block rounded-sm border border-pink-600 bg-pink-600 bg-gradient-to-b from-white/50 px-1 text-sm font-semibold text-white">
						New
					</span>
				</div>
				<span className="font-display text-lg group-data-[has-items]:hidden">
					or
				</span>
				<div className="relative h-24 w-64 md:h-64 md:group-data-[has-items]:h-auto md:group-data-[has-items]:flex-1">
					<div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md border border-gray-400 after:absolute after:inset-0 after:rounded-md after:outline-2 after:outline-pink-700 focus-within:after:outline hover:bg-black/5 active:bg-black/10 group-data-[has-items]:flex-row md:flex-col md:items-stretch md:group-data-[has-items]:items-center">
						<div className="aspect-square h-full shrink-0 bg-gray-200 gradient-mask-r-80 group-data-[has-items]:aspect-square group-data-[has-items]:flex-none md:flex-1 md:group-data-[empty]:gradient-mask-b-80" />

						<div className="flex-1 space-y-0.5 p-4 text-left group-data-[has-items]:flex-1 group-data-[has-items]:pl-0 group-data-[has-items]:pt-4 group-data-[has-items]:text-left md:flex-none md:pt-0 md:text-center md:group-data-[empty]:px-6">
							<h3 className="font-semibold">
								<Sheet open={stoneSheetOpen} onOpenChange={setStoneSheetOpen}>
									<SheetTrigger className="w-full outline-none [text-align:inherit] after:absolute after:inset-0 after:z-10">
										<span className="hidden group-data-[has-items]:block">
											Add a stone
										</span>
										<span className="group-data-[has-items]:hidden">
											Start with a stone
										</span>
									</SheetTrigger>

									<SheetContent position="right" open={stoneSheetOpen}>
										<StoneForm
											initialValues={{
												type: 'stone',
												skuId: 'colonial_classic:grey',
												coverage: { value: 1, unit: 'fr' }
											}}
											intent={
												'Add to ' +
												(props.name === 'infill.contents' ? 'Infill' : 'Border')
											}
											onSubmit={addStone}
											dimension={props.dimension}
										/>
									</SheetContent>
								</Sheet>
							</h3>
							<p className=" text-sm  text-gray-500 ">
								<Balancer>Create custom patterns from scratch.</Balancer>
							</p>
						</div>
					</div>
				</div>
			</div>

			<ul className="contents">
				{contents.map((stoneOrPattern, index) => {
					if (stoneOrPattern.type === 'stone') {
						const stone = stoneOrPattern;
						return (
							<StoneCard
								key={index}
								index={index}
								stone={stone}
								dimension={props.dimension}
								onSave={(newStone) => editStone(index, stone.skuId, newStone)}
								onDelete={() => removeStone(index, stone.skuId)}
							/>
						);
					}

					if (stoneOrPattern.type === 'pattern') {
						const pattern = stoneOrPattern;

						return (
							<PatternCard
								key={index}
								dimension={props.dimension}
								onSave={(newPattern) => editPattern(index, pattern, newPattern)}
								index={index}
								onDelete={(index) => removePattern(index, pattern)}
								pattern={pattern}
							/>
						);
					}
				})}
			</ul>
		</div>
	);
}

type StoneCardProps = React.PropsWithChildren<{
	index: number;
	stone: Stone;
	dimension: '1D' | '2D';
	onSave(values: StoneFormValues): void;
	onDelete(index: number): void;
}>;

function StoneCard({
	index,
	stone,
	dimension,
	onSave,
	onDelete
}: StoneCardProps) {
	const coverageUnitDisplayName =
		unitDisplayNameDictionary[stone.coverage.unit];

	const [editSheetOpen, setEditSheetOpen] = useState(false);

	function handleSave(values: StoneFormValues) {
		onSave(values);

		flushSync(() => {
			setEditSheetOpen(false);
		});
	}

	const { getStoneMetadata } = useStageContext();
	const metadata = getStoneMetadata(stone.skuId);

	return (
		<li
			data-sheet-open={editSheetOpen || undefined}
			className="relative flex h-64 w-64 flex-col rounded-md border border-gray-400 p-4 outline-2 -outline-offset-2 outline-pink-700 focus-within:outline hover:bg-black/5 active:bg-black/10"
		>
			<div className="flex-1" />
			<div className="flex items-start gap-4">
				<div className="flex-1">
					<Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
						<SheetTrigger className="w-full text-left font-semibold outline-none after:absolute after:inset-0">
							{metadata?.displayName}
						</SheetTrigger>

						<SheetContent position="right" open={editSheetOpen}>
							<StoneForm
								initialValues={stone}
								intent="Save Changes"
								onSubmit={handleSave}
								dimension={dimension}
							/>
						</SheetContent>
					</Sheet>
					<p className="text-sm">
						{pluralize(stone.coverage.value, coverageUnitDisplayName)}
					</p>
				</div>

				<Button
					intent="tertiary"
					type="button"
					className="pointer-events-auto z-10"
					onClick={() => onDelete(index)}
				>
					<Icon name="trash" />
				</Button>
			</div>
		</li>
	);
}

type PatternCardProps = React.PropsWithChildren<{
	index: number;
	pattern: Pattern;
	dimension: '1D' | '2D';
	onSave(values: PatternFormValues): void;
	onDelete(index: number): void;
}>;

function PatternCard({
	index,
	pattern,
	dimension,
	onSave,
	onDelete
}: PatternCardProps) {
	const coverageUnitDisplayName =
		unitDisplayNameDictionary[pattern.coverage.unit];

	const [editSheetOpen, setEditSheetOpen] = useState(false);

	function handleSave(values: PatternFormValues) {
		onSave(values);

		flushSync(() => {
			setEditSheetOpen(false);
		});
	}

	return (
		<li
			data-sheet-open={editSheetOpen || undefined}
			className="relative flex h-64 w-64 flex-col rounded-md border border-gray-400 p-4 outline-2 -outline-offset-2 outline-pink-700 focus-within:outline hover:bg-black/5 active:bg-black/10"
		>
			<div className="flex-1" />
			<div className="flex items-start gap-4">
				<div className="flex-1">
					<Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
						<SheetTrigger className="w-full text-left font-semibold outline-none after:absolute after:inset-0">
							{pattern.displayName}
						</SheetTrigger>

						<SheetContent position="right" open={editSheetOpen}>
							<PatternForm
								initialValues={pattern}
								intent="edit"
								onSubmit={handleSave}
								dimension={dimension}
							/>
						</SheetContent>
					</Sheet>
					<p className="text-sm">
						{pluralize(pattern.coverage.value, coverageUnitDisplayName)}
						&nbsp;&middot;&nbsp;
						{pluralize(pattern.contents.length, ['color', 'colors'])}
					</p>
				</div>

				<Button
					intent="tertiary"
					type="button"
					className="pointer-events-auto z-10"
					onClick={() => onDelete(index)}
				>
					<Icon name="trash" />
				</Button>
			</div>
		</li>
	);
}

type PatternFormValues = {
	pattern: Pattern;
	metadataArray: StoneMetadata[];
};

type PatternFormProps = {
	initialValues?: Pattern;
	dimension: '1D' | '2D';
	intent: 'add' | 'edit';
	onSubmit(values: PatternFormValues): void;
};

function PatternForm({
	initialValues,
	intent,
	dimension,
	onSubmit
}: PatternFormProps) {
	const patternData = dimension === '1D' ? pattern1D : pattern2D;
	const formMethods = useForm<PatternFormValues>({
		defaultValues: {
			pattern: initialValues || {
				type: 'pattern',
				id: '',
				displayName: 'Colonial Classic Herringbone',
				coverage: { value: 1, unit: 'fr' },
				contents: patternData.contents.map(({ quantity }) => ({
					quantity,
					skuId: 'colonial_classic:grey'
				}))
			},
			metadataArray: []
		}
	});

	const { formState, control, register, setValue, handleSubmit } = formMethods;

	const paverQuery = api.product.getById.useQuery(
		{ productId: 'colonial_classic' },
		{ refetchOnWindowFocus: false, keepPreviousData: true }
	);
	const paver = paverQuery.data;

	const patternId = useController({
		control,
		name: 'pattern.id',
		rules: { required: true }
	});

	const coverageUnit = useController({
		control,
		name: 'pattern.coverage.unit',
		rules: { required: true }
	});

	const contents = useFieldArray({
		control,
		name: 'pattern.contents',
		rules: { required: true }
	});

	const [step, setStep] = useState<0 | 1>(intent === 'edit' ? 1 : 0);
	const [selectedFragmentIndex, setSelectedFragmentIndex] = useState<
		number | null
	>(null);

	const fragmentBeingEdited =
		selectedFragmentIndex === null
			? undefined
			: contents.fields[selectedFragmentIndex];

	const skus = contents.fields.map(({ skuId }) =>
		findSku(skuId, paver?.skus, paver?.details)
	);

	const currentSkuIds = contents.fields.map(({ skuId }) => skuId);
	const [previousSkuIds, setPreviousSkuIds] = useState<string[]>([]);

	// Update metadata once it changes
	if (!isEqual(previousSkuIds, currentSkuIds)) {
		const skuIds = skus.map((sku) =>
			sku !== undefined
				? {
						skuId: sku.id,
						displayName: sku.displayName,
						price: sku.price,
						details: sku.details.rawData as PaverDetails
				  }
				: undefined
		);

		setValue('metadataArray', compact(skuIds));

		setPreviousSkuIds(currentSkuIds);
	}

	return (
		<form
			onSubmit={stopPropagate(
				handleSubmit((values) => {
					if (step === 0) setStep(1);
					if (step === 1) onSubmit(values);
				})
			)}
			className="contents"
		>
			<SheetHeader>
				<SheetTitle className="flex-1">
					{step === 0 && 'Select a Pattern'}
					{step === 1 && 'Customize your Pattern'}
				</SheetTitle>
				<SheetClose asChild>
					<Button type="button" intent="tertiary">
						<span className="sr-only">Close</span>
						<Icon name="close" />
					</Button>
				</SheetClose>
			</SheetHeader>

			{step === 0 && (
				<SheetBody className="space-y-6">
					<Section heading="Colonial Classic" className="space-y-3">
						<div className="-mx-1 grid grid-cols-3 gap-1">
							{[...Array(6).keys()].map((index) => (
								<label
									key={index}
									className="outline-3 relative aspect-square bg-gray-200 after:absolute after:inset-0 after:z-10 after:outline-offset-2 after:outline-pink-700 [&:has(:checked)]:after:outline [&:nth-child(12n+2)]:col-span-2 [&:nth-child(12n+2)]:row-span-2"
								>
									<input
										{...patternId.field}
										type="radio"
										value={`pattern:colonial_classic:${index}`}
										className="sr-only"
									/>
									<span className="sr-only">
										Colonial Classic Pattern {index + 1}
									</span>
								</label>
							))}
						</div>
					</Section>

					<Section heading="Banjo" className="space-y-3">
						<div className="-mx-1 grid grid-cols-3 gap-1">
							{[...Array(3).keys()].map((index) => (
								<label
									key={index}
									className="outline-3 relative aspect-square bg-gray-200 after:absolute after:inset-0 after:z-10 after:outline-offset-2 after:outline-pink-700 [&:has(:checked)]:after:outline [&:nth-child(12n+2)]:col-span-2 [&:nth-child(12n+2)]:row-span-2"
								>
									<input
										{...patternId.field}
										type="radio"
										value={`pattern:banjo:${index}`}
										className="sr-only"
									/>
									<span className="sr-only">Banjo Pattern {index + 1}</span>
								</label>
							))}
						</div>
					</Section>
				</SheetBody>
			)}

			{paver && step === 1 && (
				<SheetBody className="flex flex-col gap-6 overflow-x-hidden">
					<div className="-mx-6 aspect-video bg-gray-100">
						<svg
							viewBox="0 0 480 270"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="group h-full w-full"
							data-should-pulse={selectedFragmentIndex === null || undefined}
						>
							<g>
								{patternData.contents.map(({ path }, index) => (
									<path
										key={index}
										id={index.toString()}
										data-selected={selectedFragmentIndex === index}
										className="stroke-transparent stroke-2 text-pink-700 active:stroke-pink-400 data-[selected=true]:animate-stroke-flash data-[selected=true]:stroke-[4] data-[selected=false]:hover:stroke-pink-300 group-data-[should-pulse]:animate-pulse"
										fill={
											paver.variantIdTemplate[0]?.type === 'color'
												? paver.variantIdTemplate[0]?.fragments.find(
														({ id }) =>
															id === contents.fields[index]?.skuId.split(':')[1]
												  )?.css
												: undefined
										}
										onClick={(e) =>
											setSelectedFragmentIndex(parseInt(e.currentTarget.id))
										}
										fillRule="evenodd"
										clipRule="evenodd"
										d={path}
									/>
								))}
							</g>

							<path
								className="stroke-gray-300"
								fillRule="evenodd"
								clipRule="evenodd"
								d={patternData.outOfBounds}
							/>
						</svg>
					</div>

					<h3 className="font-display text-lg">Colonial Classic Herringbone</h3>

					<Section
						heading={
							<>
								<span>Pattern Coverage</span>

								<Popover>
									<PopoverTrigger asChild>
										<Button
											type="button"
											intent="tertiary"
											className="-m-1 p-1"
										>
											<span className="sr-only">Help</span>
											<Icon name="help" />
										</Button>
									</PopoverTrigger>

									<PopoverContent>
										Coverage refers to how much space this pattern should take
										up. You can measure it using fixed units like&nbsp;
										{dimension === '1D'
											? 'feet (ft) or meters (m)'
											: 'square feet (ft²) or square meters (m²)'}
										. If you have a specific ratio in mind, you can use the
										&quot;part&quot; unit to specify the portion or fraction of
										that ratio you want this pattern to cover.
									</PopoverContent>
								</Popover>
							</>
						}
					>
						<div className="flex h-12 w-full rounded-sm border border-gray-400 bg-gray-50 outline-2 -outline-offset-2 outline-pink-700 focus-within:outline">
							<input
								{...register('pattern.coverage.value', { min: 0.01 })}
								id="coverage.value"
								type="number"
								inputMode="decimal"
								step="any"
								className="no-arrows h-full w-full flex-1 bg-transparent pl-3 outline-none placeholder:text-gray-500"
								placeholder="Amount"
								onClick={(e) => e.currentTarget.select()}
							/>

							<Select
								value={coverageUnit.field.value}
								onValueChange={(newUnit: Unit) =>
									coverageUnit.field.onChange(newUnit)
								}
							>
								<SelectTrigger unstyled className="h-full pr-2">
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									{dimension === '2D' && (
										<>
											<SelectItem value="fr">
												{unitDisplayNameDictionary['fr'][0]}
											</SelectItem>
											<SelectItem value="sqft">
												{unitDisplayNameDictionary['sqft'][0]}
											</SelectItem>
											<SelectItem value="sqin">
												{unitDisplayNameDictionary['sqin'][0]}
											</SelectItem>
											<SelectItem value="sqm">
												{unitDisplayNameDictionary['sqm'][0]}
											</SelectItem>
											<SelectItem value="sqcm">
												{unitDisplayNameDictionary['sqcm'][0]}
											</SelectItem>
											<SelectItem value="unit">
												{unitDisplayNameDictionary['unit'][0]}
											</SelectItem>
										</>
									)}
									{dimension === '1D' && (
										<>
											<SelectItem value="fr">
												{unitDisplayNameDictionary['fr'][0]}
											</SelectItem>
											<SelectItem value="ft">
												{unitDisplayNameDictionary['ft'][0]}
											</SelectItem>
											<SelectItem value="in">
												{unitDisplayNameDictionary['in'][0]}
											</SelectItem>
											<SelectItem value="m">
												{unitDisplayNameDictionary['m'][0]}
											</SelectItem>
											<SelectItem value="cm">
												{unitDisplayNameDictionary['cm'][0]}
											</SelectItem>
											<SelectItem value="unit">
												{unitDisplayNameDictionary['unit'][0]}
											</SelectItem>
										</>
									)}
								</SelectContent>
							</Select>
						</div>
					</Section>

					{selectedFragmentIndex !== null && fragmentBeingEdited ? (
						<>
							<SkuPickerProvider
								skuId={fragmentBeingEdited.skuId}
								onChange={({ newSkuId }) =>
									contents.update(selectedFragmentIndex, {
										...fragmentBeingEdited,
										skuId: newSkuId
									})
								}
							>
								<VariantPicker
									section={Section}
									variantIdTemplate={paver.variantIdTemplate.map(
										(variantFragmentTemplate) => {
											if (variantFragmentTemplate.type === 'color')
												return {
													...variantFragmentTemplate,
													fragments: variantFragmentTemplate.fragments.filter(
														({ css }) => !css.startsWith('linear-gradient')
													)
												};
											return variantFragmentTemplate;
										}
									)}
								/>
							</SkuPickerProvider>

							<Section heading="Products in your pattern">
								<ul>
									{skus.map((sku, index) =>
										sku ? (
											<li
												key={index}
												className="flex h-16 items-center gap-2 border-b border-gray-300 py-2 last:border-none"
											>
												<div className="aspect-square h-full bg-gray-200" />
												<div className="">
													<h4>{sku.displayName}</h4>
													<p>
														{formatPrice(sku.price)} per{' '}
														{unitDisplayNameDictionary[sku.unit as Unit][0]}
													</p>
												</div>
											</li>
										) : null
									)}
								</ul>
							</Section>
						</>
					) : (
						<div className="flex flex-1 items-center justify-center">
							<p>Select a stone to change its color.</p>
						</div>
					)}
				</SheetBody>
			)}
			<SheetFooter>
				{step === 0 && (
					<Button
						type="submit"
						intent="primary"
						className="w-full"
						disabled={!formState.isValid}
					>
						Customize Pattern
					</Button>
				)}
				{step === 1 && (
					<Button
						type="submit"
						intent="primary"
						className="w-full"
						disabled={!formState.isValid}
					>
						{intent === 'add' &&
							'Add Pattern to ' + (dimension === '1D' ? 'Border' : 'Infill')}
						{intent === 'edit' && 'Save Changes'}
					</Button>
				)}
			</SheetFooter>
		</form>
	);
}

type StoneFormProps = {
	dimension: '1D' | '2D';
	initialValues: Stone;
	intent: string;
	onSubmit(stone: { stone: Stone; metadata: StoneMetadata }): void;
};

type StoneFormValues = { stone: Stone; metadata: StoneMetadata };

function StoneForm({
	dimension,
	initialValues,
	intent,
	onSubmit
}: StoneFormProps) {
	const formMethods = useForm<StoneFormValues>({
		defaultValues: { stone: initialValues, metadata: undefined }
	});

	const { register, setValue, watch, handleSubmit } = formMethods;

	const currentSkuId = watch('stone.skuId');
	const currentPaverId = currentSkuId.split(':')[0] as string;

	const paversQuery = api.product.getPavers.useQuery(
		{ dimension },
		{ refetchOnWindowFocus: false }
	);

	const currentPaverQuery = api.product.getById.useQuery(
		{ productId: currentPaverId },
		{ refetchOnWindowFocus: false, keepPreviousData: true }
	);
	const pavers = paversQuery.data;
	const currentPaver = currentPaverQuery.data;
	const currentSku = findSku(
		currentSkuId,
		currentPaver?.skus,
		currentPaver?.details
	);

	const [previousSkuId, setPreviousSkuId] = useState<string | undefined>(
		undefined
	);

	// Update metadata once it changes
	if (previousSkuId !== currentSku?.id) {
		if (currentSku) {
			setValue('metadata', {
				skuId: currentSku.id,
				displayName: currentSku.displayName,
				price: currentSku.price,
				details: currentSku.details.rawData as PaverDetails
			});

			setPreviousSkuId(currentSku.id);
		}
	}

	if (!pavers)
		return (
			<div className="flex flex-1 items-center justify-center">
				<p>Loading...</p>
			</div>
		);

	return (
		<form onSubmit={stopPropagate(handleSubmit(onSubmit))} className="contents">
			<SheetHeader>
				<SheetTitle className="flex-1">Select a stone</SheetTitle>
				<div className="flex items-center gap-2">
					<SheetClose asChild>
						<Button type="button" intent="tertiary">
							<span className="sr-only">Close</span>
							<Icon name="close" />
						</Button>
					</SheetClose>
				</div>
			</SheetHeader>

			<SheetBody className="space-y-6">
				<div className="relative aspect-video w-full">
					{currentPaver && currentSku && currentPaver.hasModels ? (
						<div className="grid h-full w-full place-items-center">
							<p>Product gallery will go here.</p>
						</div>
					) : (
						<div className="grid h-full w-full place-items-center">
							<p>No model available for this product.</p>
						</div>
					)}
				</div>
				{currentSku && (
					<section>
						<h3 className="font-display text-lg">{currentSku.displayName}</h3>
						<div className="flex flex-wrap justify-between gap-x-4">
							<div className="flex items-center gap-2">
								<p>
									{formatPrice(currentSku.price)} per&nbsp;
									{currentSku.unit === 'sqft'
										? unitDisplayNameDictionary['sqft'][0]
										: currentSku.unit}
									{currentSku.details.rawData?.pcs_per_sqft && (
										<>
											<span>
												<span>&nbsp;|&nbsp;</span>
												{formatPrice(
													currentSku.price /
														currentSku.details.rawData.pcs_per_sqft
												)}
												&nbsp;per unit
											</span>
										</>
									)}
								</p>
							</div>
							<ProductStock
								productId={currentPaverId}
								skuId={currentSkuId}
								outOfStockMessage="Done to order"
							/>
						</div>
					</section>
				)}

				<Section
					heading={
						<>
							<span>Coverage</span>

							<Popover>
								<PopoverTrigger asChild>
									<Button type="button" intent="tertiary" className="-m-1 p-1">
										<span className="sr-only">Help</span>
										<Icon name="help" />
									</Button>
								</PopoverTrigger>

								<PopoverContent>
									Coverage refers to how much space this paver should take up.
									You can measure it using fixed units like&nbsp;
									{dimension === '1D'
										? 'feet (ft) or meters (m)'
										: 'square feet (ft²) or square meters (m²)'}
									. If you have a specific ratio in mind, you can use the
									&quot;part&quot; unit to specify the portion or fraction of
									that ratio you want this paver to cover.
								</PopoverContent>
							</Popover>
						</>
					}
				>
					<div className="flex h-12 w-full rounded-sm border border-gray-400 bg-gray-50 outline-2 -outline-offset-2 outline-pink-700 focus-within:outline">
						<input
							{...register('stone.coverage.value', { min: 0.01 })}
							id="coverage.value"
							type="number"
							inputMode="decimal"
							step="any"
							className="no-arrows h-full w-full flex-1 bg-transparent pl-3 outline-none placeholder:text-gray-500"
							placeholder="Amount"
							onClick={(e) => e.currentTarget.select()}
						/>

						<Controller
							control={formMethods.control}
							name="stone.coverage.unit"
							render={(coverageUnit) => (
								<Select
									value={coverageUnit.field.value}
									onValueChange={(newUnit: Unit) =>
										coverageUnit.field.onChange(newUnit)
									}
								>
									<SelectTrigger unstyled className="h-full pr-2">
										<SelectValue />
									</SelectTrigger>

									<SelectContent>
										{dimension === '2D' && (
											<>
												<SelectItem value="fr">
													{unitDisplayNameDictionary['fr'][0]}
												</SelectItem>
												<SelectItem value="sqft">
													{unitDisplayNameDictionary['sqft'][0]}
												</SelectItem>
												<SelectItem value="sqin">
													{unitDisplayNameDictionary['sqin'][0]}
												</SelectItem>
												<SelectItem value="sqm">
													{unitDisplayNameDictionary['sqm'][0]}
												</SelectItem>
												<SelectItem value="sqcm">
													{unitDisplayNameDictionary['sqcm'][0]}
												</SelectItem>
												<SelectItem value="unit">
													{unitDisplayNameDictionary['unit'][0]}
												</SelectItem>
											</>
										)}
										{dimension === '1D' && (
											<>
												<SelectItem value="fr">
													{unitDisplayNameDictionary['fr'][0]}
												</SelectItem>
												<SelectItem value="ft">
													{unitDisplayNameDictionary['ft'][0]}
												</SelectItem>
												<SelectItem value="in">
													{unitDisplayNameDictionary['in'][0]}
												</SelectItem>
												<SelectItem value="m">
													{unitDisplayNameDictionary['m'][0]}
												</SelectItem>
												<SelectItem value="cm">
													{unitDisplayNameDictionary['cm'][0]}
												</SelectItem>
												<SelectItem value="unit">
													{unitDisplayNameDictionary['unit'][0]}
												</SelectItem>
											</>
										)}
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				</Section>
				<Controller
					control={formMethods.control}
					name="stone.skuId"
					render={(skuId) => (
						<SkuPickerProvider
							skuId={skuId.field.value}
							onChange={({ newSkuId }) => skuId.field.onChange(newSkuId)}
						>
							<Section
								heading={`Product — ${
									currentPaver?.displayName || 'Loading...'
								}`}
							>
								<ProductPicker products={pavers} />
							</Section>

							{currentPaver && (
								<VariantPicker
									section={Section}
									variantIdTemplate={currentPaver.variantIdTemplate}
								/>
							)}
						</SkuPickerProvider>
					)}
				/>
			</SheetBody>

			<SheetFooter>
				<Button
					type="submit"
					intent="primary"
					disabled={currentSku === undefined}
					className="w-full"
				>
					{intent}
				</Button>
			</SheetFooter>
		</form>
	);
}

type SectionProps = React.PropsWithChildren<{
	heading: React.ReactNode;
	className?: string;
}>;

function Section({ heading, className, children }: SectionProps) {
	return (
		<section className={cn('space-y-4', className)}>
			<h3 className="text-md flex gap-1 font-semibold">{heading}</h3>
			{children}
		</section>
	);
}
