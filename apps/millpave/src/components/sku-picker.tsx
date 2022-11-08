import { useEffect } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';
import { Product } from '../types/product';

type SkuPickerProps = {
	name: string;
	control: Control<any>;
	product: Product;
	header: React.FC<React.PropsWithChildren<{ title: string }>>;
	value: string;
	onChange: (newSkuFragments: string[]) => void;
};

const SkuPicker = ({
	name,
	control,
	product,
	header,
	value,
	onChange
}: SkuPickerProps) => {
	const SectionHeader = header;

	const { setValue } = useFormContext();

	useEffect(() => {
		setValue(name, value);
	}, [value, setValue]);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				const [, ...skuFragments] = value.split(':');

				const handleChange = (newFragment: string, changeIndex: number) => {
					const newSkuFragments = skuFragments.map((oldFragment, index) => {
						return index === changeIndex ? newFragment : oldFragment;
					});

					const newSku = newSkuFragments.join(':');

					field.onChange(newSku);
					onChange(newSkuFragments);
				};

				return (
					<>
						{product.sku_id_fragments.map(
							({ type, fragments, display_name, index }) => (
								<section key={index} className="space-y-4">
									<SectionHeader title={display_name}>
										{type === 'color' && (
											<p className="text-sm text-bubblegum-700">Color Guide</p>
										)}
									</SectionHeader>

									{type === 'variant' && (
										<VariantPicker
											variants={fragments}
											currentVariant={skuFragments[index] as string}
											onChange={(e) => handleChange(e.target.value, index)}
										/>
									)}
									{type === 'color' && (
										<ColorPicker
											colors={fragments}
											currentColor={skuFragments[index] as string}
											onChange={(e) => handleChange(e.target.value, index)}
										/>
									)}
								</section>
							)
						)}
					</>
				);
			}}
		/>
	);
};

type ProductPickerProps = {
	products: {
		id: string;
		display_name: string;
	}[];
	currentProduct: string;
	name?: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
};

function ProductPicker({
	products,
	currentProduct,
	onChange,
	...props
}: ProductPickerProps) {
	return (
		<ul className="flex space-x-2">
			{products.map(({ id, display_name }) => (
				<li key={id}>
					<label htmlFor={id}>
						<input
							className="peer hidden"
							type="radio"
							name={props.name || 'variant'}
							value={id}
							id={id}
							checked={currentProduct === id}
							onChange={onChange}
						/>

						<div className="flex w-[100px] flex-col items-center justify-center rounded-md px-3 py-2 text-center text-sm inner-border inner-border-gray-200 peer-checked:bg-bubblegum-50 peer-checked:font-semibold peer-checked:text-bubblegum-700 peer-checked:inner-border-2 peer-checked:inner-border-bubblegum-700">
							<div className="aspect-w-1 aspect-h-1 w-full">
								{/* <ProductIcon name={id} style="outline" color="inherit" /> */}
							</div>
							<span>{display_name}</span>
						</div>
					</label>
				</li>
			))}
		</ul>
	);
}

type VariantPickerProps = {
	variants: {
		id: string;
		display_name: string;
	}[];
	currentVariant: string;
	name?: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
};

function VariantPicker({
	variants,
	currentVariant,
	onChange,
	...props
}: VariantPickerProps) {
	return (
		<ul className="flex space-x-2">
			{variants.map(({ id, display_name }) => (
				<li key={id}>
					<label htmlFor={id}>
						<input
							className="peer hidden"
							type="radio"
							name={props.name || 'variant'}
							value={id}
							id={id}
							checked={currentVariant === id}
							onChange={onChange}
						/>

						<div className="flex items-center justify-center rounded-md px-3 py-2 text-center inner-border inner-border-gray-200 peer-checked:bg-bubblegum-50 peer-checked:font-semibold  peer-checked:text-bubblegum-700 peer-checked:inner-border-2 peer-checked:inner-border-bubblegum-700">
							{display_name}
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
	onChange: React.ChangeEventHandler<HTMLInputElement>;
};

function ColorPicker({ colors, currentColor, onChange }: ColorPickerProps) {
	return (
		<ul className="grid grid-cols-8 gap-2 [@media(max-width:320px)]:grid-cols-7">
			{colors.map(({ id, css }) => (
				<li key={id} className="contents">
					<label htmlFor={id} className="aspect-w-1 aspect-h-1">
						<input
							className="peer hidden"
							type="radio"
							name="color"
							value={id}
							id={id}
							checked={currentColor === id}
							onChange={onChange}
						/>
						<div className="rounded-full p-1 inner-border inner-border-gray-300  peer-checked:p-1 peer-checked:inner-border-2 peer-checked:inner-border-bubblegum-700">
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
