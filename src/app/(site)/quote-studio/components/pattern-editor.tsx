'use client';

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
	useController,
	useFieldArray,
	useForm,
	useFormContext
} from 'react-hook-form';
import { SkuPickerProvider, VariantPicker } from '~/components/sku-picker';
import { api } from '~/trpc/react';
import { useState } from 'react';
import { formatPrice } from '~/utils/format';
// import { ProductStock } from '~/components/product-stock';
import type { StoneProject, StoneMetadata, Unit, Pattern } from '~/types/quote';
import {
	cn,
	findSku,
	pluralize,
	stopPropagate,
	unitDisplayNameDictionary
} from '~/lib/utils';
import { useStageContext } from './stage-context';
import Balancer from 'react-wrap-balancer';
import {
	Popover,
	PopoverTrigger,
	PopoverContent
} from '~/components/ui/popover';
import { flushSync } from 'react-dom';
import { compact, isEqual } from 'lodash-es';
import { pattern1D, pattern2D } from './patterns';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

type PatternEditorProps = {
	name: 'infill.contents' | 'border.contents';
	dimension: '1D' | '2D';
	stageIndex: number;
};

export function PatternEditor(props: PatternEditorProps) {
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

	const [patternSheetOpen, setPatternSheetOpen] = useState(false);

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
			<div className="group flex flex-col items-center gap-2 data-[has-items]:flex-col md:flex-row md:data-[has-items]:h-64">
				<div className="relative h-24 w-64 md:h-64">
					<div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md border border-gray-400 after:absolute after:inset-0 after:rounded-md after:outline-2 after:outline-pink-700 hover:bg-black/5 active:bg-black/10 md:flex-col [&:has(:focus-visible)]:after:outline">
						<Image
							width={256}
							height={256}
							src={`/pattern-${props.dimension}.svg`}
							alt="Paving Stone Pattern"
							className="aspect-square h-full min-h-0 max-w-fit shrink object-cover gradient-mask-r-70 md:aspect-auto md:h-auto md:w-full md:max-w-full md:flex-1 md:gradient-mask-b-90"
						/>

						<div className="flex-1 space-y-0.5 p-4 text-left md:flex-none md:px-6 md:pt-0 md:text-center">
							<h3 className="font-semibold">
								<Sheet
									open={patternSheetOpen}
									onOpenChange={setPatternSheetOpen}
								>
									<SheetTrigger className="w-full outline-none after:absolute after:inset-0 after:z-10">
										Start with a pattern
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
						Beta
					</span>
				</div>
			</div>

			<ul className="contents">
				{contents.map((pattern, index) => (
					<PatternCard
						key={index}
						dimension={props.dimension}
						onSave={(newPattern) => editPattern(index, pattern, newPattern)}
						index={index}
						onDelete={(index) => removePattern(index, pattern)}
						pattern={pattern}
					/>
				))}
			</ul>
		</div>
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
			className="relative flex h-64 w-64 flex-col rounded-md border border-gray-400 outline-2 -outline-offset-2 outline-pink-700 hover:bg-black/5 active:bg-black/10 [&:has([data-main-button]:focus-visible)]:outline"
		>
			<Image
				width={256}
				height={256}
				src={`/pattern-${dimension}.svg`}
				alt="Colonial Classic Herringbone"
				className="min-h-0 min-w-0 flex-1 object-cover gradient-mask-b-90"
			/>
			<div className="flex items-start gap-4 px-4 pb-4">
				<div className="flex-1">
					<Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
						<SheetTrigger
							data-main-button
							className="w-full text-left font-semibold outline-none after:absolute after:inset-0"
						>
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
					size="small"
					className="z-10"
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
			pattern: initialValues ?? {
				type: 'pattern',
				id: '',
				displayName: patternData.displayName,
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
		{ refetchOnWindowFocus: false }
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
						details: sku.details.rawData!
					}
				: undefined
		);

		setValue('metadataArray', compact(skuIds));

		setPreviousSkuIds(currentSkuIds);
	}

	return (
		<>
			<AnimatePresence initial={false} mode="popLayout">
				{step === 0 && (
					<motion.form
						initial={{ x: '-25%' }}
						animate={{ x: '0%' }}
						exit={{ x: '-25%' }}
						transition={{ type: 'spring', duration: 1, bounce: 0 }}
						className="flex h-full w-full flex-col bg-gray-100"
						onSubmit={stopPropagate(handleSubmit(() => setStep(1)))}
					>
						<SheetHeader>
							<SheetTitle className="flex-1">Select a Pattern</SheetTitle>
							<SheetClose asChild>
								<Button type="button" intent="tertiary">
									<span className="sr-only">Close</span>
									<Icon name="close" />
								</Button>
							</SheetClose>
						</SheetHeader>

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

						<SheetFooter>
							<Button
								type="submit"
								intent="primary"
								className="w-full"
								disabled={!formState.isValid}
							>
								Customize Pattern
							</Button>
						</SheetFooter>
					</motion.form>
				)}
			</AnimatePresence>

			<AnimatePresence initial={false} mode="popLayout">
				{step === 1 && (
					<motion.form
						initial={{ x: '100%' }}
						animate={{ x: '0%' }}
						exit={{ x: '100%' }}
						transition={{ type: 'spring', duration: 1, bounce: 0 }}
						className="z-10 flex h-full w-full flex-col bg-gray-100"
						onSubmit={stopPropagate(handleSubmit(onSubmit))}
					>
						<SheetHeader className="px-4">
							<Button
								type="button"
								intent="tertiary"
								size="small"
								onClick={() => setStep(0)}
							>
								<Icon name="arrow_left" />
							</Button>
							<SheetTitle className="flex-1 text-center">
								Customize your Pattern
							</SheetTitle>
							<SheetClose asChild>
								<Button type="button" intent="tertiary" size="small">
									<span className="sr-only">Close</span>
									<Icon name="close" />
								</Button>
							</SheetClose>
						</SheetHeader>
						{paver && (
							<SheetBody className="flex flex-col gap-6 overflow-x-hidden overflow-y-scroll">
								<div className="-mx-6 aspect-video bg-gray-100">
									<svg
										viewBox="0 0 480 270"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="group h-full w-full"
										data-should-pulse={
											selectedFragmentIndex === null || undefined
										}
									>
										<g>
											{patternData.contents.map(({ path }, index) => (
												<path
													key={index}
													id={index.toString()}
													data-selected={selectedFragmentIndex === index}
													className="stroke-transparent stroke-2 text-pink-700 data-[selected=true]:animate-stroke-flash data-[selected=true]:stroke-[4] data-[selected=false]:hover:stroke-pink-300 group-data-[should-pulse]:animate-pulse"
													fill={
														paver.variantIdTemplate[0]?.type === 'color'
															? paver.variantIdTemplate[0]?.fragments.find(
																	({ id }) =>
																		id ===
																		contents.fields[index]?.skuId.split(':')[1]
																)?.css
															: undefined
													}
													onClick={(e) =>
														setSelectedFragmentIndex(
															parseInt(e.currentTarget.id)
														)
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

								<h3 className="font-display text-lg">
									{patternData.displayName}
								</h3>

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
																fragments:
																	variantFragmentTemplate.fragments.filter(
																		({ css }) =>
																			!css.startsWith('linear-gradient')
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
															<div className="grow">
																<div className="flex">
																	<h4 className="grow">
																		{sku.displayName} (
																		{patternData.contents[index]?.quantity})
																	</h4>
																</div>
																<p>
																	{formatPrice(sku.price)} per&nbsp;
																	{
																		unitDisplayNameDictionary[
																			sku.unit as Unit
																		][0]
																	}
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
										<p>Select a part of the pattern to change its color.</p>
									</div>
								)}

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
													Coverage refers to how much space this pattern should
													take up. You can measure it using fixed units
													like&nbsp;
													{dimension === '1D'
														? 'feet (ft) or meters (m)'
														: 'square feet (ft²) or square meters (m²)'}
													. If you have a specific ratio in mind, you can use
													the &quot;part&quot; unit to specify the portion or
													fraction of that ratio you want this pattern to cover.
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
															{unitDisplayNameDictionary.fr[0]}
														</SelectItem>
														<SelectItem value="sqft">
															{unitDisplayNameDictionary.sqft[0]}
														</SelectItem>
														<SelectItem value="sqin">
															{unitDisplayNameDictionary.sqin[0]}
														</SelectItem>
														<SelectItem value="sqm">
															{unitDisplayNameDictionary.sqm[0]}
														</SelectItem>
														<SelectItem value="sqcm">
															{unitDisplayNameDictionary.sqcm[0]}
														</SelectItem>
														<SelectItem value="unit">
															{unitDisplayNameDictionary.unit[0]}
														</SelectItem>
													</>
												)}
												{dimension === '1D' && (
													<>
														<SelectItem value="fr">
															{unitDisplayNameDictionary.fr[0]}
														</SelectItem>
														<SelectItem value="ft">
															{unitDisplayNameDictionary.ft[0]}
														</SelectItem>
														<SelectItem value="in">
															{unitDisplayNameDictionary.in[0]}
														</SelectItem>
														<SelectItem value="m">
															{unitDisplayNameDictionary.m[0]}
														</SelectItem>
														<SelectItem value="cm">
															{unitDisplayNameDictionary.cm[0]}
														</SelectItem>
														<SelectItem value="unit">
															{unitDisplayNameDictionary.unit[0]}
														</SelectItem>
													</>
												)}
											</SelectContent>
										</Select>
									</div>
								</Section>
							</SheetBody>
						)}

						{paverQuery.isLoading && (
							<SheetBody className="items-cener flex justify-center">
								Loading...
							</SheetBody>
						)}
						<SheetFooter>
							<Button
								type="submit"
								intent="primary"
								className="w-full"
								disabled={!formState.isValid}
							>
								{intent === 'add' &&
									'Add Pattern to ' +
										(dimension === '1D' ? 'Border' : 'Infill')}
								{intent === 'edit' && 'Save Changes'}
							</Button>
						</SheetFooter>
					</motion.form>
				)}
			</AnimatePresence>
		</>
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
