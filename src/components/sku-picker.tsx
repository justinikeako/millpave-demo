import { createContext, useContext } from 'react';
import { FullPaver } from '../types/product';

type SkuPickerContextValue = {
	skuIdFragments: string[];
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
			value={{ skuIdFragments: props.skuId.split(':'), changeFragment }}
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
	}[];
};

function ProductPicker({ products }: ProductPickerProps) {
	const { skuIdFragments, changeFragment } = useSkuPickerContext();

	const [productId] = skuIdFragments;

	return (
		<ul className="flex flex-wrap gap-2">
			{products.map(({ id, displayName }) => {
				return (
					<li key={id} className="flex-1">
						<label htmlFor={id}>
							<input
								className="peer hidden"
								type="radio"
								value={id}
								id={id}
								checked={productId === id}
								onChange={(e) => changeFragment(0, e.target.value)}
							/>

							<div className="flex items-center justify-center whitespace-nowrap rounded-md px-4 py-4 text-center ring-1 ring-inset ring-gray-200 peer-checked:bg-gray-100 peer-checked:text-gray-950 peer-checked:ring-2 peer-checked:ring-gray-950">
								{displayName}
							</div>
						</label>
					</li>
				);
			})}
		</ul>
	);
}

type SkuFragmentPickerProps = {
	skuIdTemplateFragments: FullPaver['skuIdFragments'];
	section: React.FC<React.PropsWithChildren<{ heading: string }>>;
};

function SkuFragmentPicker({
	skuIdTemplateFragments,
	section
}: SkuFragmentPickerProps) {
	const Section = section;

	const { skuIdFragments, changeFragment } = useSkuPickerContext();

	return (
		<>
			{skuIdTemplateFragments.map(({ type, fragments, displayName }, index) => {
				// Index 0 is reserved for the product id
				const fragmentIndex = index + 1;

				const selectedFragmentId = skuIdFragments[fragmentIndex] as string;
				const selectedFragmentDisplayName = skuIdTemplateFragments[
					index
				]?.fragments?.find(({ id }) => id === selectedFragmentId)?.displayName;

				if (fragments.length > 1)
					return (
						<Section
							key={fragmentIndex}
							heading={`${displayName} — ${selectedFragmentDisplayName}`}
						>
							{type === 'variant' && (
								<VariantPicker
									variants={fragments}
									currentVariantId={selectedFragmentId}
									onChange={(newVariant) =>
										changeFragment(fragmentIndex, newVariant)
									}
								/>
							)}
							{type === 'color' && (
								<ColorPicker
									colors={fragments}
									currentColorId={selectedFragmentId}
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

type VariantPickerProps = {
	variants: {
		id: string;
		displayName: string;
	}[];
	currentVariantId: string;
	name?: string;
	onChange: (newVariant: string) => void;
};

function VariantPicker({
	variants,
	currentVariantId,
	onChange,
	...props
}: VariantPickerProps) {
	return (
		<ul className="flex flex-wrap gap-2">
			{variants.map(({ id, displayName }) => (
				<li key={id} className="flex-1">
					<label htmlFor={id}>
						<input
							className="peer hidden"
							type="radio"
							name={props.name || `variant-${displayName}`}
							value={id}
							id={id}
							checked={currentVariantId === id}
							onChange={(e) => onChange(e.target.value)}
						/>

						<div className="flex items-center justify-center whitespace-nowrap rounded-md px-4 py-4 text-center ring-1 ring-inset ring-gray-200 peer-checked:bg-gray-100  peer-checked:font-semibold peer-checked:text-gray-700 peer-checked:ring-2 peer-checked:ring-gray-700">
							{displayName}
						</div>
					</label>
				</li>
			))}
		</ul>
	);
}

type ColorPickerProps = {
	colors: {
		id: string;
		css: string;
	}[];
	currentColorId: string;
	onChange: (newColor: string) => void;
};

function ColorPicker({ colors, currentColorId, onChange }: ColorPickerProps) {
	return (
		<ul className="flex flex-wrap gap-2">
			{colors.map(({ id, css }) => (
				<li key={id} className="contents">
					<label htmlFor={id} className="contents">
						<input
							className="peer hidden"
							type="radio"
							name="color"
							value={id}
							id={id}
							checked={currentColorId === id}
							onChange={(e) => onChange(e.target.value)}
						/>
						<div
							className="h-10 w-10 rounded-full bg-clip-content p-[3px] ring-1 ring-inset ring-gray-300 peer-checked:p-1 peer-checked:ring-2 peer-checked:ring-gray-950"
							style={{ backgroundColor: css, backgroundImage: css }}
						/>
					</label>
				</li>
			))}
		</ul>
	);
}

export { SkuPickerProvider, ProductPicker, SkuFragmentPicker };
