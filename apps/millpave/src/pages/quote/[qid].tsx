import { NextPage } from 'next';
import NextError from 'next/error';
import Head from 'next/head';
import { FC, PropsWithChildren, useRef, useState } from 'react';
import { Button } from '../../components/button';
import { Icon } from '../../components/icon';
import { differenceInCalendarDays, format } from 'date-fns';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectScrollDownButton,
// 	SelectScrollUpButton,
// 	SelectTrigger,
// 	SelectViewport
// } from '../../components/select';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger
} from '../../components/dialog';
import Link from 'next/link';
import cx from 'classnames';
import SkuPicker, { ProductPicker } from '../../components/sku-picker';
import { SKU } from '../../types/product';
import { PickupLocation } from '@prisma/client';
import QuickCalc from '../../components/quick-calc';
import { FormProvider, useForm } from 'react-hook-form';
import { QuoteInputItem } from '../../types/quote';

function formatPrice(price: number) {
	const priceFormatter = new Intl.NumberFormat('en', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	return '$' + priceFormatter.format(price);
}

function formatNumber(number: number) {
	const numberFormatter = new Intl.NumberFormat('en', {
		maximumFractionDigits: 2
	});

	return numberFormatter.format(number);
}

function getDistanceFromToday(date: Date | number) {
	return differenceInCalendarDays(date, new Date());
}

function formatRestockDate(date: number) {
	const distanceFromToday = getDistanceFromToday(date);

	if (distanceFromToday === 0) return format(date, "'at' h:mm bbb");
	else if (distanceFromToday === 1) return 'Tomorrow';

	return format(date, 'EEE, LLL d');
}

type SectionHeaderProps = {
	title: string;
};

const SectionHeader: FC<PropsWithChildren<SectionHeaderProps>> = ({
	title,
	children
}) => {
	return (
		<div className="flex items-center justify-between">
			<h2 className="font-display text-xl font-semibold">{title}</h2>
			{children}
		</div>
	);
};

type EditableHeaderProps = {
	defaultValue: string;
	onSave: (newValue: string) => Promise<void>;
} & React.HTMLProps<HTMLInputElement>;

const EditableHeader = ({
	defaultValue,
	onSave,
	className,
	...props
}: EditableHeaderProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const [title, setTitle] = useState(defaultValue);
	const [isSaving, setIsSaving] = useState(false);

	async function handleSubmit(newTitle: string) {
		setIsSaving(true);

		await onSave(newTitle);

		setIsSaving(false);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();

				handleSubmit(title);
			}}
			className="contents"
		>
			<input
				{...props}
				ref={inputRef}
				className={cx(
					'w-full bg-transparent font-display text-2xl font-semibold text-black opacity-100 placeholder:text-gray-400 disabled:text-black',
					className
				)}
				value={title}
				disabled={isSaving}
				placeholder="Title"
				onChange={(e) => setTitle(e.target.value)}
				onBlur={() => handleSubmit(title)}
			/>
		</form>
	);
};

// type OverageSelectProps = {
// 	defaultValue: string;
// 	onChange: (newValue: Overage) => void | Promise<void>;
// };

// const OverageSelect = ({ defaultValue }: OverageSelectProps) => {
// 	const [overage, setOverage] = useState(defaultValue);

// 	return (
// 		<Select
// 			value={overage}
// 			onValueChange={(newOverage) => setOverage(newOverage)}
// 		>
// 			<SelectTrigger />
// 			<SelectContent>
// 				<SelectScrollUpButton />
// 				<SelectViewport>
// 					<SelectItem value="TEN">10%</SelectItem>
// 					<SelectItem value="FIVE">5%</SelectItem>
// 					<SelectItem value="THREE">3%</SelectItem>
// 					<SelectItem value="ZERO">None</SelectItem>
// 				</SelectViewport>
// 				<SelectScrollDownButton />
// 			</SelectContent>
// 		</Select>
// 	);
// };

function SectionHeader2({
	title,
	children
}: React.PropsWithChildren<SectionHeaderProps>) {
	return (
		<div className="flex items-center justify-between">
			<h3 className="font-display font-semibold">{title}</h3>
			{children}
		</div>
	);
}

type ItemEditorProps = {
	onSave: () => Promise<void>;
	onDelete: () => Promise<void>;
};

const ItemEditor = ({ onSave, onDelete }: ItemEditorProps) => {
	const [skuId, setSkuId] = useState('colonial_classic:grey');

	const [productId] = skuId.split(':');

	const productList = trpc.useQuery(['product.getList'], {
		refetchOnWindowFocus: false
	});
	const product = trpc.useQuery(
		['product.get', { productId: productId as string }],
		{ refetchOnWindowFocus: false, keepPreviousData: true }
	);

	const formMethods = useForm<QuoteInputItem>({
		defaultValues: {
			area: 0,
			input: {
				value: '',
				unit: 'sqft'
			},
			pickupLocation: 'FACTORY',
			quantity: 9,
			skuId: skuId
		}
	});

	function findSKU(searchId: string, skuList?: SKU[]) {
		if (!skuList) return;

		const sku = skuList.find((currentSKU) => currentSKU.id === searchId);

		return sku;
	}

	const { pickupLocation } = formMethods.watch();
	const sku = findSKU(skuId, product.data?.skuList);

	const findDetails = (skuId: string) => {
		return product.data?.details.find((details) => {
			return skuId.includes(details.matcher);
		});
	};

	const productDetails = findDetails(skuId);

	function handleProductChange(newProductId: string) {
		setSkuId((currentSkuId) => {
			const colorId = currentSkuId.split(':').at(-1) as string;

			const incomingProduct = productList.data?.find(
				(candidate) => candidate.id === newProductId
			);

			const newSkuIdFragment = incomingProduct?.defaultSkuIdTemplate.replace(
				'[color]',
				colorId
			) as string;

			return `${newProductId}:${newSkuIdFragment}`;
		});
	}

	return (
		<>
			<DialogHeader title="Edit Item" />
			{(productList.isLoading || product.isLoading) && <p>Loading...</p>}
			{productList.data && (
				<FormProvider {...formMethods}>
					<form
						className="h-[50vh] space-y-8 overflow-y-auto px-8 pt-4 pb-8"
						onSubmit={formMethods.handleSubmit((values) => {
							console.log(values);
						})}
					>
						<section className="space-y-4">
							<SectionHeader2 title="Model" />
							<ProductPicker
								products={productList.data}
								currentProduct={productId as string}
								onChange={handleProductChange}
							/>
						</section>
						{product.data && sku && productDetails && (
							<>
								<SkuPicker
									product={product.data}
									header={SectionHeader2}
									value={skuId}
									onChange={(fragmentedSkuId) => {
										const skuId = fragmentedSkuId.join(':');

										setSkuId(skuId);
									}}
								/>

								<QuickCalc
									control={formMethods.control}
									convertConfig={{
										skuPrice:
											sku.price + (pickupLocation === 'FACTORY' ? 0 : 20),
										pickupLocation: pickupLocation,
										productDetails: productDetails
									}}
									header={SectionHeader2}
								/>
							</>
						)}

						<div className="space-y-2">
							<Button
								variant="primary"
								type="submit"
								onClick={onSave}
								className="w-full"
							>
								<Icon name="save" />
								Save Changes
							</Button>
							<Button
								variant="secondary"
								type="button"
								className="w-full text-red-600"
								onClick={onDelete}
							>
								<Icon name="delete" />
								Remove from Quote
							</Button>
						</div>
					</form>
				</FormProvider>
			)}
		</>
	);
};

const deriveRouteFromSkuId = (skuId: string) => {
	const [productId, ...skuIdFragments] = skuId.split(':');

	const skuQuery = skuIdFragments.join().replace(/,/g, '+');

	return `/product/${productId}?sku=${skuQuery}`;
};

const Page: NextPage = () => {
	const router = useRouter();

	const quoteId = router.query.qid as string;

	const [editDialogState, setEditDialogState] = useState({
		open: false,
		skuId: '',
		pickupLocation: 'FACTORY' as PickupLocation
	});

	const [sendDialogOpen, setSendDialogOpen] = useState(false);
	// const [showOverageWarning, setShowOverageWarning] = useState(false);

	const quote = trpc.useQuery(['quote.get', { id: quoteId }]);
	const renameQuote = trpc.useMutation(['quote.rename']);
	const removeItem = trpc.useMutation(['quote.removeItem']);

	if (!quote.data) {
		if (quote.error?.data?.code === 'NOT_FOUND')
			return <NextError statusCode={404} />;

		return null;
	}

	return (
		<>
			<Head>
				<title>{`${quote.data.title} — Millennium Paving Stones`}</title>
			</Head>

			<main className="space-y-16 px-8 pb-16">
				<nav className="flex justify-between pt-12 pb-8">
					<Button variant="tertiary" asChild>
						<Link href="/products">
							<Icon name="category" />
						</Link>
					</Button>
					<Button variant="tertiary" asChild>
						<Link href="/quotes">
							<Icon name="list" />
						</Link>
					</Button>
				</nav>

				<EditableHeader
					defaultValue={quote.data.title}
					onSave={async (newTitle) => {
						await renameQuote.mutateAsync({ quoteId, newTitle });
					}}
				/>

				{/* Shapes */}
				{/* {quote.data.shapes && quote.data.shapes.length > 0 && (
					<section className="space-y-4">
						<SectionHeader title="Shapes" />

						<ul className="no-scrollbar -mx-8 flex items-center space-x-2 overflow-x-scroll">
							<li className="h-2 shrink-0 basis-4" />

							<li className="flex snap-center rounded-full bg-gray-100 p-2.5">
								<Icon name="add" />
							</li>
							{quote.data.shapes.map((shape) => (
								<li
									key={shape.id}
									className="flex snap-center whitespace-nowrap rounded-full bg-gray-100 px-4 py-2"
								>
									{shape.name}
								</li>
							))}

							<li className="h-2 shrink-0 basis-4" />
						</ul>
					</section>
				)} */}

				{/* Items */}
				<section className="space-y-4">
					<SectionHeader title={`Items (${quote.data.items.length})`} />

					{/* Overage */}

					{/* <div className="flex items-center justify-between">
						<p className="flex space-x-1">
							<span>Area Overage</span>

							<span>
								<Button variant="tertiary">
									<Icon name="info" weight={300} />
								</Button>
							</span>
						</p>

						<OverageSelect
							defaultValue={quote.data.overage}
							onChange={(newOverage) => {
								setShowOverageWarning(newOverage === 'ZERO');
							}}
						/>
					</div>*/}

					{/* Overage Warning */}
					{/* {(showOverageWarning || quote.data.overage === 'ZERO') && (
						<div className="flex space-x-4 rounded-md bg-red-50 px-4 py-6 text-red-500">
							<Icon name="warning" />
							<div className="flex-1 space-y-2">
								<p className="font-semibold">Declining an overage?</p>
								<p>
									Your job could be put on hold or delayed. Likely higher
									contractor time and material costs. And the next batch of
									pavers may not be an exact color match.
								</p>
							</div>
						</div>
					)} */}

					{/* Item List */}
					<Dialog
						open={editDialogState.open}
						onOpenChange={(newOpen) =>
							setEditDialogState((oldState) => ({ ...oldState, open: newOpen }))
						}
					>
						<DialogContent open={editDialogState.open}>
							<ItemEditor
								onSave={async () => {
									setEditDialogState((oldState) => ({
										...oldState,
										open: false
									}));
								}}
								onDelete={async () => {
									await removeItem.mutateAsync({
										quoteId: quoteId,
										pickupLocation: editDialogState.pickupLocation,
										skuId: editDialogState.skuId
									});

									await quote.refetch();

									setEditDialogState((oldState) => ({
										...oldState,
										open: false
									}));
								}}
							/>
						</DialogContent>

						<ul className="!mt-8 space-y-12">
							{quote.data.items.map((item) => (
								<li
									key={`${item.skuId}_${item.pickupLocation}`}
									className="flex flex-col items-center space-y-4"
								>
									<Link
										href={deriveRouteFromSkuId(item.skuId)}
										className="contents"
									>
										<div className="mb-4 h-32 w-32 bg-gray-100" />
										<div className="space-y-2 self-stretch">
											<h3 className="font-display text-lg font-semibold">
												{item.displayName}
											</h3>
											<div className="flex justify-between">
												<p className="font-semibold">
													{formatNumber(item.quantity)} pieces
												</p>
												<p className="font-semibold">
													{formatPrice(item.price)}
												</p>
											</div>
										</div>
									</Link>
									<div className="space-y-2 self-stretch">
										<div className="flex items-center justify-between">
											<p className="text-gray-500">
												Order Today. Pick up on-site:
												<br />
												{getDistanceFromToday(item.closest_restock_date) > 1 &&
													'Available'}
												&nbsp;
												<b>{formatRestockDate(item.closest_restock_date)}</b>
												&nbsp;at&nbsp;
												<span className="inline-block text-bubblegum-600">
													Our St. Thomas Factory
												</span>
											</p>

											<DialogTrigger asChild>
												<Button
													variant="tertiary"
													onClick={() => {
														setEditDialogState((oldState) => ({
															...oldState,
															pickupLocation: item.pickupLocation,
															skuId: item.skuId
														}));
													}}
												>
													<Icon name="edit" />
												</Button>
											</DialogTrigger>
										</div>
									</div>
								</li>
							))}
						</ul>
					</Dialog>
				</section>

				{/* Order Details */}
				<section className="space-y-4">
					<SectionHeader title="Order Details" />

					<ul className="space-y-1">
						<li className="flex justify-between py-1">
							<p>Area Coverage</p>
							<p className="tabular-nums">
								{formatNumber(quote.data.area)} sqft
							</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Estimated Weight</p>
							<p className="tabular-nums">
								{formatNumber(quote.data.weight)} lbs
							</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Subtotal</p>
							<p className="tabular-nums">{formatPrice(quote.data.subtotal)}</p>
						</li>
						<li className="flex justify-between py-1">
							<p>Tax</p>
							<p className="tabular-nums">{formatPrice(quote.data.tax)}</p>
						</li>
						<li className="flex justify-between py-1 font-semibold text-bubblegum-700">
							<p>Total</p>
							<p className="tabular-nums">{formatPrice(quote.data.total)}</p>
						</li>
					</ul>

					<div className="space-y-2">
						<Button variant="primary" className="w-full">
							<Icon name="point_of_sale" />
							<span className="font-semibold">Check Out</span>
						</Button>
						<Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
							<DialogContent open={sendDialogOpen}>
								<DialogHeader title="Send to Customer" />
							</DialogContent>

							<DialogTrigger asChild>
								<Button
									variant="secondary"
									className="w-full text-bubblegum-700"
								>
									<span className="font-semibold">Send as Quote</span>
								</Button>
							</DialogTrigger>
						</Dialog>
					</div>
				</section>

				{/* Recommendations */}
				<section className="space-y-8">
					<SectionHeader title="You may like..." />

					<ul>
						{quote.data.recommendations.map((item) => (
							<li
								key={item.id}
								className="flex flex-col items-center space-y-4"
							>
								<div className="h-32 w-32 bg-gray-100" />
								<div className="space-y-2 self-stretch">
									<h3 className="font-semibold">{item.displayName}</h3>

									<p>{formatPrice(item.price)}</p>
								</div>
								<Button variant="primary" className="w-full">
									<span className="font-semibold">Add to Order</span>
								</Button>
							</li>
						))}
					</ul>
				</section>
			</main>
		</>
	);
};

export default Page;
