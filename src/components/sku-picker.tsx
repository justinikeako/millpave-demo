import { createContext, useContext } from 'react';
import type { VariantIdTemplate } from '../types/product';

type SkuPickerContextValue = {
	skuIdFragments: string[];
	changeSkuId(newSkuId: string): void;
	changeFragment(changeIndex: number, newFragment: string): void;
};

const SkuPickerContext = createContext({} as SkuPickerContextValue);

type SkuPickerProviderProps = React.PropsWithChildren<{
	skuId: string;
	onChange(news: { newSkuId: string; newVariantId: string }): void;
}>;

function SkuPickerProvider(props: SkuPickerProviderProps) {
	const skuIdFragments = props.skuId.split(':');

	function changeSkuId(newSkuId: string) {
		const [, ...newVariantIdFragments] = newSkuId.split(':');
		const newVariantId = newVariantIdFragments.join(':');

		props.onChange({ newSkuId, newVariantId });
	}

	function changeFragment(changeIndex: number, newFragment: string) {
		const newSkuIdFragments = skuIdFragments.map((oldFragment, index) => {
			// Replaces changed index with the new fragment
			const fragmentDidChange = index === changeIndex;

			return fragmentDidChange ? newFragment : oldFragment;
		});

		const newSkuId = newSkuIdFragments.join(':');

		changeSkuId(newSkuId);
	}

	return (
		<SkuPickerContext.Provider
			value={{
				skuIdFragments: props.skuId.split(':'),
				changeFragment,
				changeSkuId
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
									).pop()!;

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

							<div className="peer-checked:bg-gray-pink-400/10 flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-gray-400 px-4 py-4 text-center outline-2 -outline-offset-2 outline-pink-700 peer-checked:bg-pink-400/10 peer-checked:text-pink-700 peer-checked:outline peer-focus:outline">
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

				const variantFragmentId = skuIdFragments[fragmentIndex]!;
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
							aria-label={displayName}
						/>

						<div className="flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-gray-400 px-4 py-4 text-center outline-2 -outline-offset-2 outline-pink-700 peer-checked:bg-pink-400/10 peer-checked:text-pink-700 peer-checked:outline peer-focus:outline">
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
		displayName: string;
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
			{colors.map(({ id, displayName, css }) => (
				<li key={id} className="contents">
					<label htmlFor={id} className="contents">
						<input
							className="peer sr-only"
							type="radio"
							name="color"
							value={id}
							id={id}
							checked={currentColorId === id}
							aria-label={displayName}
							onChange={(e) => onChange(e.target.value)}
						/>
						<div
							className="h-10 w-10 cursor-pointer rounded-full border border-gray-400 bg-clip-content p-0.5 outline-2 -outline-offset-2 outline-pink-700 peer-checked:p-[3px] peer-checked:outline peer-focus:p-[3px] peer-focus:outline"
							style={{ backgroundColor: css, backgroundImage: css }}
						/>
					</label>
				</li>
			))}
			<li className="flex cursor-not-allowed items-center gap-1 rounded-full border border-gray-300 bg-gray-200 pr-3 font-semibold text-gray-500">
				<div
					className="h-10 w-10 rounded-full bg-clip-content p-0.5"
					style={{
						backgroundImage:
							'conic-gradient(from 180deg at 50% 50.00%, #EF847A 0deg, #E7DD69 72.0000010728836deg, #A9D786 144.0000021457672deg, #959ECB 216.00000858306885deg, #EF7AA4 288.0000042915344deg, #EF847A 360deg)'
					}}
				/>
				<span>Custom Blend</span>
				<span className="inline-block rounded-sm bg-gray-300 px-1 text-sm">
					Coming Soon
				</span>
			</li>
		</ul>
	);
}

export { SkuPickerProvider, ProductPicker, VariantPicker };
