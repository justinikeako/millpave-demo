import { Button } from '@/components/button';
import * as Select from '@/components/select';
import {
	Sheet,
	SheetBody,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/sheet';
import { LayoutTemplate, RectangleHorizontal, X } from 'lucide-react';
import {
	Controller,
	FieldArrayPath,
	useFieldArray,
	useForm,
	useFormContext
} from 'react-hook-form';
import { SkuPickerProvider, ProductPicker, VariantPicker } from '../sku-picker';
import { api } from '@/utils/api';
import { useState } from 'react';
import { formatPrice } from '@/utils/format';
import { ProductStock } from '../product-stock';
import { Check } from 'lucide-react';
import { StoneProject, Stone, Coverage, StoneMetadata } from '@/types/quote';
import {
	cn,
	findSku,
	stopPropagate,
	unitDisplayNameDictionary
} from '@/lib/utils';
import { PaverDetails } from '@/types/product';
import { isEqual } from 'lodash-es';
import { Trash } from 'lucide-react';

type StoneProps = React.PropsWithChildren<{
	index: number;
	displayName: string;
	coverage: Coverage;
	selected: boolean;
	onSelect(): void;
	onDelete(index: number): void;
}>;

export function StoneListItem({
	index,
	displayName,
	coverage,
	selected,
	onSelect,
	onDelete
}: StoneProps) {
	const coverageUnitDisplayName =
		unitDisplayNameDictionary[coverage.unit][coverage.value == 1 ? 0 : 1];

	return (
		<li className="relative flex h-64 w-64 flex-col p-6">
			<div className="flex-1" />
			<SheetTrigger asChild>
				<button
					type="button"
					className={cn(
						'absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-400 hover:bg-gray-100',
						selected && 'bg-gray-100 ring-2 ring-black'
					)}
					onClick={onSelect}
				/>
			</SheetTrigger>
			<div className="pointer-events-none z-10 flex items-start gap-4">
				<div className="flex-1">
					<p className="font-semibold">{displayName}</p>
					<p className="text-sm">
						{coverage.value} {coverageUnitDisplayName}
					</p>
				</div>

				<Button
					variant="tertiary"
					type="button"
					className="pointer-events-auto z-10"
					onClick={() => onDelete(index)}
				>
					<Trash className="h-5 w-5" />
				</Button>
			</div>
		</li>
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

type StoneEditorProps = {
	name: FieldArrayPath<StoneProject>;
	dimension: '1D' | '2D';
};

export function StoneEditor(props: StoneEditorProps) {
	const { control } = useFormContext<StoneProject>();

	const { fields, append, update, remove } = useFieldArray({
		control,
		keyName: 'id',
		name: props.name
	});

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

	return (
		<div className="flex flex-wrap justify-center gap-4">
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				{defaultSku ? (
					<div className="flex h-64 w-64 flex-col gap-4">
						<SheetTrigger asChild>
							<button
								type="button"
								className={cn(
									'flex w-full flex-1 items-center justify-center gap-2 rounded-lg p-6 ring-1 ring-inset ring-gray-400 hover:bg-gray-100 disabled:pointer-events-none disabled:text-gray-400 disabled:ring-gray-200',
									sheetOpen &&
										editIndex === -1 &&
										'bg-gray-100 ring-2 ring-black'
								)}
								onClick={() => {
									setEditIndex(-1);
								}}
							>
								<span className="font-semibold">Add Stone</span>
								<RectangleHorizontal className="h-5 w-5" />
							</button>
						</SheetTrigger>
						<button
							type="button"
							disabled
							className="flex w-full flex-1 items-center justify-center gap-2 rounded-lg p-6 ring-1 ring-inset ring-gray-400 hover:bg-gray-100 disabled:pointer-events-none disabled:text-gray-400 disabled:ring-gray-200"
						>
							<span className="font-semibold">Add Pattern</span>
							<LayoutTemplate className="h-5 w-5" />
							<span className="inline-block rounded-sm bg-gray-200 px-1 py-0.5 text-sm">
								Coming Soon
							</span>
						</button>
					</div>
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
							selected={sheetOpen && index === editIndex}
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
					variant="tertiary"
					type="submit"
					disabled={currentSku === undefined}
				>
					<Check />
				</Button>
				<SheetClose asChild>
					<Button variant="tertiary" type="button">
						<X />
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
					<label
						htmlFor="coverage.value"
						className="flex w-full rounded-md bg-gray-200 p-4 pr-2"
					>
						<input
							{...register('coverage.value')}
							id="coverage.value"
							type="number"
							className="no-arrows w-full flex-1 bg-transparent outline-none"
							placeholder="Amount"
						/>

						<Controller
							control={formMethods.control}
							name="coverage.unit"
							render={(coverageUnit) => (
								<Select.Root
									value={coverageUnit.field.value}
									onValueChange={coverageUnit.field.onChange}
								>
									<Select.Trigger basic />

									<Select.Content>
										<Select.ScrollUpButton />
										<Select.Viewport>
											{dimension === '2D' && (
												<>
													<Select.Item value="fr">
														{unitDisplayNameDictionary['fr'][0]}
													</Select.Item>
													<Select.Item value="sqft">
														{unitDisplayNameDictionary['sqft'][0]}
													</Select.Item>
													<Select.Item value="sqin">
														{unitDisplayNameDictionary['sqin'][0]}
													</Select.Item>
													<Select.Item value="sqm">
														{unitDisplayNameDictionary['sqm'][0]}
													</Select.Item>
													<Select.Item value="sqcm">
														{unitDisplayNameDictionary['sqcm'][0]}
													</Select.Item>
													<Select.Item value="unit">
														{unitDisplayNameDictionary['unit'][0]}
													</Select.Item>
												</>
											)}
											{dimension === '1D' && (
												<>
													<Select.Item value="fr">
														{unitDisplayNameDictionary['fr'][0]}
													</Select.Item>
													<Select.Item value="ft">
														{unitDisplayNameDictionary['ft'][0]}
													</Select.Item>
													<Select.Item value="in">
														{unitDisplayNameDictionary['in'][0]}
													</Select.Item>
													<Select.Item value="m">
														{unitDisplayNameDictionary['m'][0]}
													</Select.Item>
													<Select.Item value="cm">
														{unitDisplayNameDictionary['cm'][0]}
													</Select.Item>
													<Select.Item value="unit">
														{unitDisplayNameDictionary['unit'][0]}
													</Select.Item>
												</>
											)}
										</Select.Viewport>
										<Select.ScrollDownButton />
									</Select.Content>
								</Select.Root>
							)}
						/>
					</label>
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
