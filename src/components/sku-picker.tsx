import { createContext, useContext } from 'react';
import { VariantIdTemplate } from '../types/product';

type SkuPickerContextValue = {
	skuIdFragments: string[];
	changeSkuId(newSkuId: string): void;
	changeFragment(changeIndex: number, newFragment: string): void;
};

const SkuPickerContext = createContext({} as SkuPickerContextValue);

type SkuPickerProviderProps = React.PropsWithChildren<{
	skuId: string;
	onChange(newSkuId: string): void;
}>;

function SkuPickerProvider(props: SkuPickerProviderProps) {
	const skuIdFragments = props.skuId.split(':');

	function changeFragment(changeIndex: number, newFragment: string) {
		const newSkuIdFragments = skuIdFragments.map((oldFragment, index) => {
			// Replaces changed index with the new fragment
			const indexDidChange = index === changeIndex;

			return indexDidChange ? newFragment : oldFragment;
		});

		const newSkuId = newSkuIdFragments.join(':');

		props.onChange(newSkuId);
	}

	return (
		<SkuPickerContext.Provider
			value={{
				skuIdFragments: props.skuId.split(':'),
				changeFragment,
				changeSkuId: props.onChange
			}}
		>
			{props.children}
		</SkuPickerContext.Provider>
	);
}

function useSkuPickerContext() {
	return useContext(SkuPickerContext);
}

type ProductPickerProps = {
	products: {
		id: string;
		displayName: string;
		defaultSkuId: string;
	}[];
};

function ProductPicker({ products }: ProductPickerProps) {
	const { skuIdFragments, changeSkuId } = useSkuPickerContext();

	const [productId] = skuIdFragments;

	return (
		<ul className="flex flex-wrap gap-2">
			{products.map(({ id, displayName }) => {
				return (
					<li key={id} className="relative flex-1">
						<label htmlFor={id}>
							<input
								className="peer sr-only"
								type="radio"
								value={id}
								id={id}
								checked={productId === id}
								onChange={(e) => {
									const newProductId = e.target.value;

									const sustainedColorId = structuredClone(
										skuIdFragments
									).pop() as string;

									const newDefaultSkuId = products.find(
										({ id }) => id === newProductId
									)?.defaultSkuId;

									// We want to keep the color and discard everything else
									const newSkuId = newDefaultSkuId?.replace(
										'grey',
										sustainedColorId
									);

									if (newSkuId) changeSkuId(newSkuId);
								}}
							/>

							<div className="flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-4 py-4 text-center ring-1 ring-inset ring-gray-300 peer-checked:bg-gray-100 peer-checked:text-gray-950 peer-checked:ring-2 peer-checked:ring-gray-950 peer-focus:bg-blue-50 peer-focus:text-blue-500 peer-focus:ring-blue-500">
								{displayName}
							</div>
						</label>
					</li>
				);
			})}
		</ul>
	);
}

type VariantPickerProps = {
	variantIdTemplate: VariantIdTemplate;
	section: React.FC<React.PropsWithChildren<{ heading: string }>>;
};

function VariantPicker({ variantIdTemplate, section }: VariantPickerProps) {
	const Section = section;

	const { skuIdFragments, changeFragment } = useSkuPickerContext();

	return (
		<>
			{variantIdTemplate.map(({ type, fragments, displayName }, index) => {
				// Index 0 is reserved for the product id
				const fragmentIndex = index + 1;

				const variantFragmentId = skuIdFragments[fragmentIndex] as string;
				const variantFragmentDisplayName = variantIdTemplate[
					index
				]?.fragments?.find(({ id }) => id === variantFragmentId)?.displayName;

				if (fragments.length > 1)
					return (
						<Section
							key={fragmentIndex}
							heading={`${displayName} — ${variantFragmentDisplayName}`}
						>
							{type === 'variant' && (
								<VariantFragmentPicker
									variants={fragments}
									name={displayName.toLowerCase().replace(' ', '_')}
									currentVariantId={variantFragmentId}
									onChange={(newVariant) =>
										changeFragment(fragmentIndex, newVariant)
									}
								/>
							)}
							{type === 'color' && (
								<ColorFragmentPicker
									colors={fragments}
									currentColorId={variantFragmentId}
									onChange={(newColor) =>
										changeFragment(fragmentIndex, newColor)
									}
								/>
							)}
						</Section>
					);
				else return null;
			})}
		</>
	);
}

type VariantFragmentPickerProps = {
	variants: {
		id: string;
		displayName: string;
	}[];
	currentVariantId: string;
	name?: string;
	onChange: (newVariant: string) => void;
};

function VariantFragmentPicker({
	variants,
	currentVariantId,
	onChange,
	...props
}: VariantFragmentPickerProps) {
	return (
		<ul className="flex flex-wrap gap-2">
			{variants.map(({ id, displayName }) => (
				<li key={id} className="relative flex-1">
					<label htmlFor={id}>
						<input
							className="peer sr-only"
							type="radio"
							name={props.name}
							value={id}
							id={id}
							checked={currentVariantId === id}
							onChange={(e) => onChange(e.target.value)}
						/>

						<div className="flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-4 py-4 text-center ring-1 ring-inset ring-gray-300 peer-checked:bg-gray-100 peer-checked:text-gray-700 peer-checked:ring-2 peer-checked:ring-gray-700 peer-focus:bg-blue-50 peer-focus:text-blue-500 peer-focus:ring-blue-500">
							{displayName}
						</div>
					</label>
				</li>
			))}
		</ul>
	);
}

type ColorFragmentPickerProps = {
	colors: {
		id: string;
		css: string;
	}[];
	currentColorId: string;
	onChange: (newColor: string) => void;
};

function ColorFragmentPicker({
	colors,
	currentColorId,
	onChange
}: ColorFragmentPickerProps) {
	return (
		<ul className="relative flex flex-wrap gap-2">
			{colors.map(({ id, css }) => (
				<li key={id} className="contents">
					<label htmlFor={id} className="contents">
						<input
							className="peer sr-only"
							type="radio"
							name="color"
							value={id}
							id={id}
							checked={currentColorId === id}
							onChange={(e) => onChange(e.target.value)}
						/>
						<div
							className="h-10 w-10 cursor-pointer rounded-full bg-clip-content p-[3px] ring-1 ring-inset ring-gray-300 peer-checked:p-1 peer-checked:ring-2 peer-checked:ring-gray-950 peer-focus:ring-blue-500"
							style={{ backgroundColor: css, backgroundImage: css }}
						/>
					</label>
				</li>
			))}
		</ul>
	);
}

export { SkuPickerProvider, ProductPicker, VariantPicker };
