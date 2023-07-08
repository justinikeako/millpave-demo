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
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '~/components/ui/sheet';
import { Icon } from '~/components/icon';
import {
	Controller,
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
	Coverage,
	StoneMetadata,
	Unit
} from '~/types/quote';
import {
	findSku,
	pluralize,
	stopPropagate,
	unitDisplayNameDictionary
} from '~/lib/utils';
import { PaverDetails } from '~/types/product';
import { isEqual } from 'lodash-es';
import { useStageContext } from './stage-context';
import Balancer from 'react-wrap-balancer';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';

type StoneEditorProps = {
	name: 'infill' | 'border.stones';
	dimension: '1D' | '2D';
	stageIndex: number;
};

export function StoneEditor(props: StoneEditorProps) {
	const { setValidity } = useStageContext();
	const { control } = useFormContext<StoneProject>();

	const { fields, append, update, remove } = useFieldArray({
		control,
		keyName: 'id',
		name: props.name
	});

	const currentStageValidity = fields.length > 0;
	const [currentStagePreviousValidity, setCurrentStagePreviousValidity] =
		useState(currentStageValidity);

	if (currentStagePreviousValidity !== currentStageValidity) {
		setValidity(props.stageIndex, fields.length > 0);

		setCurrentStagePreviousValidity(currentStageValidity);
	}

	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);

	const defaultSkuQuery = api.product.getSkuById.useQuery(
		{ skuId: 'colonial_classic:grey' },
		{ refetchOnWindowFocus: false }
	);

	const defaultSku = defaultSkuQuery.data;

	const addStone = (stone: Stone) => append(stone);
	const editStone = (index: number, stone: Stone) => update(index, stone);

	function handleSubmit(stone: Stone) {
		if (editIndex === null) addStone(stone);
		else editStone(editIndex, stone);

		setSheetOpen(false);
	}

	return (
		<div className="flex flex-col items-center justify-center gap-2 md:flex-row md:flex-wrap">
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				{defaultSku ? (
					<div
						data-has-items={fields.length > 0}
						className="group flex flex-col items-center gap-2 data-[has-items=true]:flex-col md:flex-row md:data-[has-items=true]:h-64"
					>
						<div
							data-sheet-open={undefined}
							className="relative flex h-24 w-64 items-center justify-center rounded-md border border-gray-400 bg-gray-200 text-gray-500 outline-2 -outline-offset-2 outline-gray-900 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline group-data-[has-items=true]:flex-1 group-data-[has-items=true]:flex-row md:h-64 md:flex-col md:items-stretch md:group-data-[has-items=true]:h-auto md:group-data-[has-items=true]:items-center"
						>
							<div className="aspect-square h-full shrink-0 group-data-[has-items=true]:aspect-square group-data-[has-items=true]:h-24 group-data-[has-items=true]:flex-none md:aspect-auto md:h-auto md:flex-1" />

							<div className="flex-1 space-y-0.5 p-4 text-left group-data-[has-items=true]:flex-1 group-data-[has-items=true]:p-4 group-data-[has-items=true]:text-left md:flex-none md:px-6 md:text-center">
								<h3 className="font-semibold">
									<button
										type="button"
										className="w-full [text-align:inherit] after:absolute after:inset-0 after:cursor-not-allowed"
									>
										<span className="group-data-[has-items=false]:hidden">
											Add a pattern
										</span>
										<span className="group-data-[has-items=true]:hidden">
											Start with a pattern
										</span>
									</button>
								</h3>
								<p className="text-sm text-gray-500">
									<Balancer>
										Customize the colors of pre-made patterns.
									</Balancer>
								</p>
							</div>
							<span className="pointer-events-none absolute -top-2 left-2 block rounded-sm border border-gray-400 bg-inherit px-1 text-sm">
								Coming Soon
							</span>
						</div>
						<span className="font-display text-lg group-data-[has-items=true]:hidden">
							or
						</span>
						<div
							data-sheet-open={(sheetOpen && editIndex === null) || undefined}
							className="relative flex h-24 w-64 items-center justify-center rounded-md border border-gray-400 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline group-data-[has-items=true]:flex-1 group-data-[has-items=true]:flex-row md:h-64 md:flex-col md:items-stretch md:group-data-[has-items=true]:h-auto md:group-data-[has-items=true]:items-center"
						>
							<div className="aspect-square h-full shrink-0 group-data-[has-items=true]:aspect-square group-data-[has-items=true]:h-24 group-data-[has-items=true]:flex-none md:aspect-auto md:h-auto md:flex-1" />

							<div className="flex-1 space-y-0.5 p-4 text-left group-data-[has-items=true]:flex-1 group-data-[has-items=true]:p-4 group-data-[has-items=true]:text-left md:flex-none md:px-6 md:text-center">
								<h3 className="font-semibold">
									<SheetTrigger
										className="w-full [text-align:inherit] after:absolute after:inset-0"
										onClick={() => {
											setEditIndex(null);
										}}
									>
										<span className="group-data-[has-items=false]:hidden">
											Add a stone
										</span>
										<span className="group-data-[has-items=true]:hidden">
											Start with a stone
										</span>
									</SheetTrigger>
								</h3>
								<p className=" text-sm  text-gray-500 ">
									<Balancer>Create complex custom patterns.</Balancer>
								</p>
							</div>
						</div>
					</div>
				) : (
					<div className="flex h-64 w-64 items-center justify-center">
						Loading...
					</div>
				)}

				<ul className="contents">
					{fields.map((stone, index) => (
						<StoneListItem
							key={stone.id}
							index={index}
							selected={sheetOpen && editIndex === index}
							displayName={stone.metadata.displayName}
							coverage={stone.coverage}
							onSelect={() => setEditIndex(index)}
							onDelete={() => remove(index)}
						/>
					))}
				</ul>

				<SheetContent position="right">
					{defaultSku && (
						<StoneForm
							initialValues={
								fields[editIndex ?? -1] || {
									skuId: defaultSku.id,
									metadata: {
										displayName: defaultSku.displayName,
										price: defaultSku.price,
										details: defaultSku.details.rawData as PaverDetails
									},
									coverage: { value: 1, unit: 'fr' }
								}
							}
							intent={editIndex === null ? 'add' : 'save'}
							onSubmit={handleSubmit}
							dimension={props.dimension}
						/>
					)}
				</SheetContent>
			</Sheet>
		</div>
	);
}

type StoneListItemProps = React.PropsWithChildren<{
	index: number;
	displayName: string;
	coverage: Coverage;
	selected: boolean;
	onSelect(): void;
	onDelete(index: number): void;
}>;

function StoneListItem({
	index,
	displayName,
	coverage,
	selected,
	onSelect,
	onDelete
}: StoneListItemProps) {
	const coverageUnitDisplayName = unitDisplayNameDictionary[coverage.unit];

	return (
		<li
			data-sheet-open={selected || undefined}
			className="relative flex h-64 w-64 flex-col rounded-md border border-gray-400 p-4 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline"
		>
			<div className="flex-1" />
			<div className="flex items-start gap-4">
				<div className="flex-1">
					<p className="font-semibold">
						<SheetTrigger
							className="w-full text-left after:absolute after:inset-0"
							onClick={onSelect}
						>
							{displayName}
						</SheetTrigger>
					</p>
					<p className="text-sm">
						{pluralize(coverage.value, coverageUnitDisplayName)}
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

type StoneFormProps = {
	dimension: '1D' | '2D';
	initialValues: Stone;
	intent: 'add' | 'save';
	onSubmit(stone: Stone): void;
};

function StoneForm({
	dimension,
	initialValues,
	intent,
	onSubmit
}: StoneFormProps) {
	const formMethods = useForm<Stone>({
		defaultValues: initialValues
	});
	const { register, setValue, watch, handleSubmit } = formMethods;

	const currentSkuId = watch('skuId');
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

	const currentMetadata: StoneMetadata = currentSku
		? {
				displayName: currentSku.displayName,
				price: currentSku.price,
				details: currentSku.details.rawData as PaverDetails
		  }
		: initialValues.metadata;

	const [previousMetadata, setPreviousMetadata] = useState(
		initialValues.metadata
	);

	// Update metadata once it changes
	if (currentMetadata && !isEqual(previousMetadata, currentMetadata)) {
		setValue('metadata', currentMetadata);
		setPreviousMetadata(currentMetadata);
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
						<Button type="button" intent="secondary" size="small">
							Close
						</Button>
					</SheetClose>
					<Button
						type="submit"
						intent="primary"
						size="small"
						disabled={currentSku === undefined}
					>
						<span className="capitalize">{intent}</span>
					</Button>
				</div>
			</SheetHeader>

			<SheetBody className="space-y-4">
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
							{...register('coverage.value', { min: 0.01 })}
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
							name="coverage.unit"
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
					name="skuId"
					render={(skuId) => (
						<SkuPickerProvider
							skuId={skuId.field.value}
							onChange={(newSkuId) => {
								skuId.field.onChange(newSkuId);
							}}
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
		</form>
	);
}

type SectionProps = React.PropsWithChildren<{
	heading: React.ReactNode;
}>;

function Section({ heading, children }: SectionProps) {
	return (
		<section className="space-y-4">
			<h3 className="text-md flex gap-1 font-semibold">{heading}</h3>
			{children}
		</section>
	);
}
