import { useEffect } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';
import { Product } from '../types/product';
import { PickupLocation } from '../types/location';

type FormValues = {
	skuId: string;
	area: number;

	pickupLocation: PickupLocation;
};

type SkuPickerProps = {
	control: Control<FormValues>;
	product: Product;
	header: React.FC<React.PropsWithChildren<{ title: string }>>;
	value: string;
	onChange: (newSkuFragments: string[]) => void;
};

const SkuPicker = ({
	control,
	product,
	header,
	value,
	onChange
}: SkuPickerProps) => {
	const SectionHeader = header;

	const { setValue } = useFormContext<FormValues>();
	useEffect(() => {
		setValue('skuId', value);
	}, [value, setValue]);

	return (
		<Controller
			name="skuId"
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
											<p className="text-sm text-pink-700">Color Guide</p>
										)}
									</SectionHeader>

									{type === 'variant' && (
										<ul className="grid grid-cols-3 gap-2">
											{fragments.map(({ id, display_name }) => (
												<li key={id} className="contents">
													<label htmlFor={id} className="contents">
														<input
															className="peer hidden"
															type="radio"
															name={type}
															value={id}
															id={id}
															checked={skuFragments[index] === id}
															onChange={(e) =>
																handleChange(e.target.value, index)
															}
														/>
														<div className="flex items-center justify-center rounded-md border border-zinc-300 px-3 py-2 peer-checked:border-2 peer-checked:border-pink-700 peer-checked:bg-pink-50 peer-checked:text-pink-700">
															{display_name}
														</div>
													</label>
												</li>
											))}
										</ul>
									)}
									{type === 'color' && (
										<ul className="grid grid-cols-8 gap-2 [@media(max-width:320px)]:grid-cols-7">
											{fragments.map(({ id, css }) => (
												<li key={id} className="contents">
													<label htmlFor={id} className="aspect-w-1 aspect-h-1">
														<input
															className="peer hidden"
															type="radio"
															name={type}
															value={id}
															id={id}
															checked={skuFragments[index] === id}
															onChange={(e) =>
																handleChange(e.target.value, index)
															}
														/>
														<div
															className="rounded-full border border-zinc-300 shadow-[inset_0_0_0_2px_white] peer-checked:border-2 peer-checked:border-pink-700"
															style={{ background: css }}
														/>
													</label>
												</li>
											))}
										</ul>
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

export default SkuPicker;
