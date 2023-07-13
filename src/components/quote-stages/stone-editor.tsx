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
import { StoneProject, Stone, StoneMetadata, Unit } from '~/types/quote';
import {
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

	const addStone = (values: StoneFormValues) => {
		append(values.stone);
		addStoneMetadata(values.metadata);

		flushSync(() => {
			setStoneSheetOpen(false);
		});
	};

	const editStone = (
		index: number,
		oldSkuId: string,
		values: StoneFormValues
	) => {
		update(index, values.stone);

		removeStoneMetadata(oldSkuId);
		addStoneMetadata(values.metadata);
	};
	const removeStone = (index: number, skuId: string) => {
		remove(index);
		removeStoneMetadata(skuId);
	};

	return (
		<div className="flex flex-col items-center justify-center gap-2 md:flex-row md:flex-wrap">
			<div
				data-has-items={contents.length > 0}
				className="group flex flex-col items-center gap-2 data-[has-items=true]:flex-col md:flex-row md:data-[has-items=true]:h-64"
			>
				<div
					data-sheet-open={undefined}
					className="relative flex h-24 w-64 items-center justify-center rounded-md border border-gray-400 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline group-data-[has-items=true]:flex-1 group-data-[has-items=true]:flex-row md:h-64 md:flex-col md:items-stretch md:group-data-[has-items=true]:h-auto md:group-data-[has-items=true]:items-center"
				>
					<div className="aspect-square h-full shrink-0 group-data-[has-items=true]:aspect-square group-data-[has-items=true]:h-24 group-data-[has-items=true]:flex-none md:aspect-auto md:h-auto md:flex-1" />

					<div className="flex-1 space-y-0.5 p-4 text-left group-data-[has-items=true]:flex-1 group-data-[has-items=true]:p-4 group-data-[has-items=true]:text-left md:flex-none md:px-6 md:text-center">
						<h3 className="font-semibold">
							<Sheet open={patternSheetOpen} onOpenChange={setPatternSheetOpen}>
								<SheetTrigger className="w-full [text-align:inherit] after:absolute after:inset-0">
									<span className="group-data-[has-items=false]:hidden">
										Add a pattern
									</span>
									<span className="group-data-[has-items=true]:hidden">
										Start with a pattern
									</span>
								</SheetTrigger>

								<SheetContent
									position="right"
									open={patternSheetOpen}
								></SheetContent>
							</Sheet>
						</h3>
						<p className="text-sm text-gray-500">
							<Balancer>Customize the colors of pre-made patterns.</Balancer>
						</p>
					</div>
					<span className="pointer-events-none absolute -top-2 left-2 block rounded-sm border border-gray-400 bg-gray-100 px-1 text-sm font-semibold">
						New
					</span>
				</div>
				<span className="font-display text-lg group-data-[has-items=true]:hidden">
					or
				</span>
				<div
					data-sheet-open={stoneSheetOpen || undefined}
					className="relative flex h-24 w-64 items-center justify-center rounded-md border border-gray-400 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline group-data-[has-items=true]:flex-1 group-data-[has-items=true]:flex-row md:h-64 md:flex-col md:items-stretch md:group-data-[has-items=true]:h-auto md:group-data-[has-items=true]:items-center"
				>
					<div className="aspect-square h-full shrink-0 group-data-[has-items=true]:aspect-square group-data-[has-items=true]:h-24 group-data-[has-items=true]:flex-none md:aspect-auto md:h-auto md:flex-1" />

					<div className="flex-1 space-y-0.5 p-4 text-left group-data-[has-items=true]:flex-1 group-data-[has-items=true]:p-4 group-data-[has-items=true]:text-left md:flex-none md:px-6 md:text-center">
						<h3 className="font-semibold">
							<Sheet open={stoneSheetOpen} onOpenChange={setStoneSheetOpen}>
								<SheetTrigger className="w-full [text-align:inherit] after:absolute after:inset-0">
									<span className="group-data-[has-items=false]:hidden">
										Add a stone
									</span>
									<span className="group-data-[has-items=true]:hidden">
										Start with a stone
									</span>
								</SheetTrigger>

								<SheetContent position="right" open={stoneSheetOpen}>
									<StoneForm
										initialValues={{
											skuId: 'colonial_classic:grey',
											coverage: { value: 1, unit: 'fr' }
										}}
										intent="add"
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

			<ul className="contents">
				{contents.map((stone, index) => (
					<StoneListItem
						key={index}
						index={index}
						stone={stone}
						dimension={props.dimension}
						onSave={(newStone) => editStone(index, stone.skuId, newStone)}
						onDelete={() => removeStone(index, stone.skuId)}
					/>
				))}
			</ul>
		</div>
	);
}

type StoneListItemProps = React.PropsWithChildren<{
	index: number;
	stone: Stone;
	dimension: '1D' | '2D';
	onSave(values: StoneFormValues): void;
	onDelete(index: number): void;
}>;

function StoneListItem({
	index,
	stone,
	dimension,
	onSave,
	onDelete
}: StoneListItemProps) {
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
			className="relative flex h-64 w-64 flex-col rounded-md border border-gray-400 p-4 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline"
		>
			<div className="flex-1" />
			<div className="flex items-start gap-4">
				<div className="flex-1">
					<Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
						<SheetTrigger className="w-full text-left font-semibold after:absolute after:inset-0">
							{metadata?.displayName}
						</SheetTrigger>

						<SheetContent position="right" open={editSheetOpen}>
							<StoneForm
								initialValues={stone}
								intent="edit"
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

type StoneFormProps = {
	dimension: '1D' | '2D';
	initialValues: Stone;
	intent: 'add' | 'edit';
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

	// function intercept(values: StoneFormValues) {
	// 	console.log(values);
	// }
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
						{intent === 'add' && 'Add'}
						{intent === 'edit' && 'Save'}
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
