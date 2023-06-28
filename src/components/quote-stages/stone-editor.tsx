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

type StoneEditorProps = {
	name: 'infill' | 'border.stones';
	dimension: '1D' | '2D';
	stageIndex: number;
};

export function StoneEditor(props: StoneEditorProps) {
	const { setStageValidity } = useStageContext();
	const { control } = useFormContext<StoneProject>();

	const { fields, append, update, remove } = useFieldArray({
		control,
		keyName: 'id',
		name: props.name
	});

	const currentStageValidity = fields.length > 0;
	const [currentStagePreviousValidity, setcurrentStagePreviousValidity] =
		useState(currentStageValidity);

	if (currentStagePreviousValidity !== currentStageValidity) {
		setStageValidity(props.stageIndex, fields.length > 0);

		setcurrentStagePreviousValidity(currentStageValidity);
	}

	const [editIndex, setEditIndex] = useState(0);
	const [sheetOpen, setSheetOpen] = useState(false);

	const defaultSkuQuery = api.product.getSkuById.useQuery(
		{ skuId: 'colonial_classic:grey' },
		{ refetchOnWindowFocus: false }
	);

	const defaultSku = defaultSkuQuery.data;

	const addStone = (stone: Stone) => append(stone);
	const editStone = (index: number, stone: Stone) => update(index, stone);

	function handleSubmit(stone: Stone) {
		if (editIndex === -1) addStone(stone);
		else editStone(editIndex, stone);

		setSheetOpen(false);
	}

	const smallActions = (
		<>
			<div className="flex flex-col items-center gap-4">
				<div
					data-sheet-open={undefined}
					className="relative flex w-64 flex-1 overflow-hidden rounded-lg border border-gray-400 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline"
				>
					<div className="aspect-[2/3] h-full bg-gray-200" />

					<div className="flex flex-col justify-center gap-1 p-4">
						<h3 className="font-semibold">
							<button
								type="button"
								className="w-full text-left after:absolute after:inset-0"
							>
								Add a pattern
							</button>
						</h3>
						<p className="text-sm text-gray-500">
							<Balancer>Customize the colors of pre-made patterns.</Balancer>
						</p>
					</div>
				</div>
				<div
					data-sheet-open={(sheetOpen && editIndex === -1) || undefined}
					className="relative flex w-64 flex-1 overflow-hidden rounded-lg border border-gray-400 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline"
				>
					<div className="aspect-[2/3] h-full bg-gray-200" />

					<div className="flex flex-col justify-center gap-1 p-4">
						<h3 className="font-semibold">
							<SheetTrigger
								className="w-full text-left after:absolute after:inset-0"
								onClick={() => {
									setEditIndex(-1);
								}}
							>
								Add a stone
							</SheetTrigger>
						</h3>
						<p className="text-sm text-gray-500">
							<Balancer>Create custom patterns from scratch.</Balancer>
						</p>
					</div>
				</div>
			</div>
		</>
	);

	const largeActions = (
		<>
			<div className="flex items-center gap-4">
				<div
					data-sheet-open={undefined}
					className="relative flex h-64 w-64 flex-col items-center justify-center gap-2 rounded-lg border border-gray-400 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline"
				>
					<div className="flex-1" />

					<div className="space-y-1 px-8 pb-6 pt-4 text-center">
						<h3 className="font-semibold">
							<button
								type="button"
								className="w-full after:absolute after:inset-0"
							>
								Start with a pattern
							</button>
						</h3>
						<p className="text-sm text-gray-500">
							<Balancer>Customize the colors of pre-made patterns.</Balancer>
						</p>
					</div>
				</div>
				<span className="font-display text-lg">or</span>
				<div
					data-sheet-open={(sheetOpen && editIndex === -1) || undefined}
					className="relative flex h-64 w-64 flex-col items-center justify-center gap-2 rounded-lg border border-gray-400 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline"
				>
					<div className="flex-1" />

					<div className="space-y-1 px-8 pb-6 pt-4 text-center">
						<h3 className="font-semibold">
							<SheetTrigger
								className="w-full after:absolute after:inset-0"
								onClick={() => {
									setEditIndex(-1);
								}}
							>
								Start with a stone
							</SheetTrigger>
						</h3>
						<p className="text-sm text-gray-500">
							<Balancer>Create custom patterns from scratch.</Balancer>
						</p>
					</div>
				</div>
			</div>
		</>
	);
	return (
		<div className="flex flex-wrap justify-center gap-4">
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				{defaultSku ? (
					fields.length > 0 ? (
						smallActions
					) : (
						largeActions
					)
				) : (
					<div className="flex h-64 w-64 items-center justify-center gap-4 ">
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

				<SheetContent position="right" size="sm">
					{defaultSku && (
						<StoneForm
							initialValues={
								fields[editIndex] || {
									skuId: defaultSku.id,
									metadata: {
										displayName: defaultSku.displayName,
										price: defaultSku.price,
										details: defaultSku.details.rawData as PaverDetails
									},
									coverage: { value: 1, unit: 'fr' }
								}
							}
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
			className="relative flex h-64 w-64 flex-col rounded-lg border border-gray-400 p-6 outline-2 -outline-offset-2 outline-gray-900 hover:bg-black/5 active:bg-black/10 data-[sheet-open]:bg-black/10 data-[sheet-open]:outline"
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
	onSubmit(stone: Stone): void;
};

function StoneForm({ dimension, initialValues, onSubmit }: StoneFormProps) {
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
				<Button
					intent="tertiary"
					type="submit"
					disabled={currentSku === undefined}
				>
					<Icon name="check" />
				</Button>
				<SheetClose asChild>
					<Button intent="tertiary" type="button">
						<Icon name="close" />
					</Button>
				</SheetClose>
			</SheetHeader>

			<SheetBody className="space-y-4">
				<div className="relative aspect-[3/4] w-full">
					{currentPaver && currentSku && currentPaver.hasModels ? (
						<div className="grid h-full w-full place-items-center">
							<p>Render Placeholder</p>
						</div>
					) : (
						<div className="grid h-full w-full place-items-center">
							<p>No model available for this product.</p>
						</div>
					)}
				</div>
				{currentSku && (
					<section>
						<SheetTitle>{currentSku.displayName}</SheetTitle>
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

				<Section heading="Coverage">
					<div className="flex w-full rounded-sm border border-gray-400 bg-gray-200 outline-2 -outline-offset-2 outline-pink-700 focus-within:outline">
						<input
							{...register('coverage.value', { min: 0.01 })}
							id="coverage.value"
							type="number"
							step="any"
							className="no-arrows w-full flex-1 bg-transparent p-4 outline-none"
							placeholder="Amount"
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
									<SelectTrigger unstyled className="h-full py-4 pr-4">
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
	heading: string;
}>;

function Section({ heading, children }: SectionProps) {
	return (
		<section className="space-y-4">
			<h3 className="text-md font-semibold">{heading}</h3>
			{children}
		</section>
	);
}
