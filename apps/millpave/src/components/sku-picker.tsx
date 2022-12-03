import { Product } from '../types/product';

type SkuPickerProps = {
	product: Pick<Product, 'skuIdFragments'>;
	header: React.FC<React.PropsWithChildren<{ title: string }>>;
	value: string;
	onChange: (fragmentedSkuId: string[]) => void;
};

function SkuPicker({ product, header, value, onChange }: SkuPickerProps) {
	const SectionHeader = header;

	const [productId, ...skuIdFragments] = value.split(':');

	const handleChange = (newFragment: string, changeIndex: number) => {
		const newSkuIdFragments = skuIdFragments.map((oldFragment, index) => {
			// Replaces changed index with the new fragment
			const indexDidChange = index === changeIndex;

			return indexDidChange ? newFragment : oldFragment;
		});

		const fragmentedSkuId = [productId, ...newSkuIdFragments] as string[];

		onChange(fragmentedSkuId);
	};

	return (
		<>
			{product.skuIdFragments.map(({ type, fragments, displayName }, index) => (
				<section key={index} className="space-y-4">
					<SectionHeader title={displayName}>
						{type === 'color' && (
							<p className="text-sm text-bubblegum-700">Color Guide</p>
						)}
					</SectionHeader>

					{type === 'variant' && (
						<VariantPicker
							variants={fragments}
							currentVariant={skuIdFragments[index] as string}
							onChange={(newVariant) => handleChange(newVariant, index)}
						/>
					)}
					{type === 'color' && (
						<ColorPicker
							colors={fragments}
							currentColor={skuIdFragments[index] as string}
							onChange={(newColor) => handleChange(newColor, index)}
						/>
					)}
				</section>
			))}
		</>
	);
}

type ProductPickerProps = {
	products: {
		id: string;
		displayName: string;
	}[];
	currentProduct: string;
	name?: string;
	onChange: (newProduct: string) => void;
};

function ProductPicker({
	products,
	currentProduct,
	onChange,
	...props
}: ProductPickerProps) {
	return (
		<ul className="no-scrollbar -mx-8 grid auto-cols-[100px] grid-flow-col gap-2 overflow-x-auto px-8">
			{products.map(({ id, displayName }) => {
				return (
					<li key={id}>
						<label htmlFor={id}>
							<input
								className="peer hidden"
								type="radio"
								name={props.name || 'product'}
								value={id}
								id={id}
								checked={currentProduct === id}
								onChange={(e) => {
									onChange(e.target.value);
								}}
							/>

							<div className="flex flex-col items-center justify-center rounded-md px-3 py-2 text-center text-sm inner-border inner-border-gray-200 peer-checked:bg-bubblegum-50 peer-checked:font-semibold peer-checked:text-bubblegum-700 peer-checked:inner-border-2 peer-checked:inner-border-bubblegum-700">
								<div className="aspect-w-1 aspect-h-1 w-full">
									{/* <ProductIcon name={id} style="outline" color="inherit" /> */}
								</div>
								<span>{displayName}</span>
							</div>
						</label>
					</li>
				);
			})}
		</ul>
	);
}

type VariantPickerProps = {
	variants: {
		id: string;
		displayName: string;
	}[];
	currentVariant: string;
	name?: string;
	onChange: (newVariant: string) => void;
};

function VariantPicker({
	variants,
	currentVariant,
	onChange,
	...props
}: VariantPickerProps) {
	return (
		<ul className="flex space-x-2">
			{variants.map(({ id, displayName }) => (
				<li key={id} className="flex-1">
					<label htmlFor={id}>
						<input
							className="peer hidden"
							type="radio"
							name={props.name || 'variant'}
							value={id}
							id={id}
							checked={currentVariant === id}
							onChange={(e) => onChange(e.target.value)}
						/>

						<div className="flex items-center justify-center rounded-md px-3 py-2 text-center inner-border inner-border-gray-200 peer-checked:bg-bubblegum-50 peer-checked:font-semibold  peer-checked:text-bubblegum-700 peer-checked:inner-border-2 peer-checked:inner-border-bubblegum-700">
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
	currentColor: string;
	onChange: (newColor: string) => void;
};

function ColorPicker({ colors, currentColor, onChange }: ColorPickerProps) {
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
							checked={currentColor === id}
							onChange={(e) => onChange(e.target.value)}
						/>
						<div className="h-8 w-8 rounded-full p-1 inner-border inner-border-gray-300 peer-checked:p-1 peer-checked:inner-border-2  peer-checked:inner-border-gray-900 md:h-12 md:w-12">
							<div
								className="h-full w-full rounded-full"
								style={{ background: css }}
							/>
						</div>
					</label>
				</li>
			))}
		</ul>
	);
}

export { SkuPicker as default, ProductPicker, VariantPicker, ColorPicker };
