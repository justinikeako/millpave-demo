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
import {
	SkuPickerProvider,
	ProductPicker,
	SkuFragmentPicker
} from '../sku-picker';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { Sku } from '@prisma/client';
import { formatPrice } from '@/utils/format';
import { ProductStock } from '../product-stock';
import { extractDetail } from '@/utils/product';
import { ExtendedPaverDetails } from '@/types/product';
import { Check } from 'lucide-react';
import { Stone, FormValues } from '../stage-context';
import { StoneListItem } from './stone-list-item';
import { stopPropagate } from '@/lib/utils';

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
function findSku(searchId?: string, skus?: Sku[]) {
	return skus?.find((currentSku) => currentSku.id === searchId);
}
function findDetails(skuId?: string, details?: ExtendedPaverDetails[]) {
	return details?.find((details) => skuId?.includes(details.matcher))?.data;
}

type StoneEditorProps = {
	name: FieldArrayPath<FormValues>;
	dimension: '2D' | '3D';
};
export function StoneEditor(props: StoneEditorProps) {
	const { control } = useFormContext<FormValues>();
	const { fields, append, update } = useFieldArray({
		control,
		keyName: 'id',
		name: props.name
	});

	const [editIndex, setEditIndex] = useState(0);
	const [sheetOpen, setSheetOpen] = useState(true);

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
				<div className="flex h-64 w-64 flex-col gap-4">
					<SheetTrigger asChild>
						<button
							type="button"
							className="flex w-full flex-1 items-center justify-center gap-2 rounded-lg border border-gray-400 p-6"
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
						className="flex w-full flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 p-6 disabled:text-gray-400"
					>
						<span className="font-semibold">Add Pattern</span>
						<LayoutTemplate className="h-5 w-5" />
						<span className="inline-block rounded-sm bg-gray-200 px-1 py-0.5 text-sm">
							Coming Soon
						</span>
					</button>
				</div>

				<ul className="contents">
					{fields.map((stone, index) => (
						<StoneListItem
							key={stone.id}
							displayName={stone.displayName}
							coverage={stone.coverage}
							onClick={() => setEditIndex(index)}
						/>
					))}
				</ul>

				<SheetContent position="right" size="sm">
					<StoneForm
						initialValues={fields[editIndex] as Stone}
						onSubmit={handleSubmit}
						dimension={props.dimension}
					/>
				</SheetContent>
			</Sheet>
		</div>
	);
}

type StoneFormProps = {
	dimension: '2D' | '3D';
	initialValues?: Stone;
	onSubmit(stone: Stone): void;
};

const defaultStone: Stone = {
	skuId: 'banjo:grey',
	displayName: 'Banjo Grey',
	coverage: { value: 1, unit: 'fr' }
};

function StoneForm({
	dimension,
	initialValues = defaultStone,
	onSubmit
}: StoneFormProps) {
	const formMethods = useForm<Stone>({ defaultValues: initialValues });
	const { register, setValue, watch, handleSubmit } = formMethods;

	const currentSkuId = watch('skuId');
	const currentPaverId = currentSkuId.split(':')[0] as string;

	const paversQuery = trpc.product.getPavers.useQuery(
		{},
		{ refetchOnWindowFocus: false }
	);

	const currentPaverQuery = trpc.product.getById.useQuery(
		{ productId: currentPaverId },
		{ refetchOnWindowFocus: false, keepPreviousData: true }
	);
	const pavers = paversQuery.data;
	const currentPaver = currentPaverQuery.data;
	const currentSku = findSku(currentSkuId, currentPaver?.skus);
	const currentSkuDetails = findDetails(currentSkuId, currentPaver?.details);
	const currentDisplayName = currentSku?.displayName;

	// Update displayname once it changes
	const [previousDisplayName, setPreviousDisplayName] =
		useState(currentDisplayName);

	if (previousDisplayName !== currentDisplayName) {
		if (currentDisplayName) setValue('displayName', currentDisplayName);

		setPreviousDisplayName(currentDisplayName);
	}

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
									{currentSku.unit}
									{currentSkuDetails && currentSku.unit === 'sqft' && (
										<>
											<span>
												<span>&nbsp;|&nbsp;</span>
												{formatPrice(
													currentSku.price /
														extractDetail(currentSkuDetails, 'pcs_per_sqft')
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
											{dimension === '3D' && (
												<>
													<Select.Item value="fr">parts</Select.Item>
													<Select.Item value="sqft">sqft</Select.Item>
													<Select.Item value="sqin">sqin</Select.Item>
													<Select.Item value="sqm">sqm</Select.Item>
													<Select.Item value="sqcm">sqcm</Select.Item>
													<Select.Item value="unit">units</Select.Item>
												</>
											)}
											{dimension === '2D' && (
												<>
													<Select.Item value="fr">parts</Select.Item>
													<Select.Item value="ft">ft</Select.Item>
													<Select.Item value="in">in</Select.Item>
													<Select.Item value="m">m</Select.Item>
													<Select.Item value="cm">cm</Select.Item>
													<Select.Item value="unit">units</Select.Item>
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
							{pavers && (
								<Section
									heading={`Product — ${
										currentPaver?.displayName || 'Loading...'
									}`}
								>
									<ProductPicker products={pavers} />
								</Section>
							)}

							{currentPaver && (
								<SkuFragmentPicker
									section={Section}
									skuIdTemplateFragments={currentPaver.skuIdFragments}
								/>
							)}
						</SkuPickerProvider>
					)}
				/>
			</SheetBody>
		</form>
	);
}
