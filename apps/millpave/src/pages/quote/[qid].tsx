import NextError from 'next/error';
import Head from 'next/head';
import { useRef, useState } from 'react';
import { Button } from '../../components/button';
import { Icon } from '../../components/icon';
import { differenceInCalendarDays, format } from 'date-fns';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTrigger
// } from '../../components/dialog';
import Link from 'next/link';
import cx from 'classnames';

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

function formatRestockDate(date: Date | number) {
	const distanceFromToday = getDistanceFromToday(date);

	if (distanceFromToday === 0) return format(date, "'at' h:mm bbb");
	else if (distanceFromToday === 1) return 'Tomorrow';

	return format(date, 'EEE, LLL d');
}

type SectionHeaderProps = React.PropsWithChildren<{
	title: string;
}>;

function SectionHeader({ title, children }: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<h2 className="font-display text-xl font-semibold">{title}</h2>
			{children}
		</div>
	);
}

type EditableHeaderProps = {
	defaultValue: string;
	onSave: (newValue: string) => Promise<void>;
} & React.HTMLProps<HTMLInputElement>;

function EditableHeader({
	defaultValue,
	onSave,
	className,
	...props
}: EditableHeaderProps) {
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
}

// type ItemEditorProps = {
// 	onSave: () => Promise<void>;
// 	onDelete: () => Promise<void>;
// };

// function ItemEditor({ onSave, onDelete }: ItemEditorProps) {
// 	return (
// 		<>
// 			{/* <DialogHeader title="Edit Item" /> */}

// 			<div className="max-h-[50vh] space-y-8 overflow-y-auto px-8 pt-4 pb-8">
// 				<div className="space-y-2">
// 					<Button
// 						variant="primary"
// 						type="submit"
// 						onClick={onSave}
// 						className="w-full"
// 					>
// 						<Icon name="save" />
// 						Save Changes
// 					</Button>
// 					<Button
// 						variant="secondary"
// 						type="button"
// 						className="w-full text-red-600"
// 						onClick={onDelete}
// 					>
// 						<Icon name="delete" />
// 						Remove from Quote
// 					</Button>
// 				</div>
// 			</div>
// 		</>
// 	);
// }

const deriveRouteFromSkuId = (skuId: string) => {
	const [productId] = skuId.split(':');

	return `/product/${productId}`;
};

function Page() {
	const router = useRouter();

	const quoteId = router.query.qid as string;

	// const [editDialogState, setEditDialogState] = useState({
	// 	open: false,
	// 	skuId: '',
	// 	pickupLocationId: 'STT_FACTORY'
	// });

	// const [sendDialogOpen, setSendDialogOpen] = useState(false);
	// const [showOverageWarning, setShowOverageWarning] = useState(false);

	const quote = trpc.quote.getById.useQuery({ quoteId });
	const renameQuote = trpc.quote.rename.useMutation();
	// const removeItem = trpc.quote.removeItem.useMutation();

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
						<Link href="/products/all">
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

				{/* Items */}
				<section className="space-y-4">
					<SectionHeader title={`Items (${quote.data.items.length})`} />

					{/* Item List */}
					{/* <Dialog
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
										pickupLocationId: editDialogState.pickupLocationId,
										skuId: editDialogState.skuId
									});

									await quote.refetch();

									setEditDialogState((oldState) => ({
										...oldState,
										open: false
									}));
								}}
							/>
						</DialogContent> */}

					<ul className="!mt-8 space-y-12">
						{quote.data.items.map((item) => (
							<li
								key={`${item.skuId}_${item.pickupLocationId}`}
								className="flex flex-col items-center space-y-4"
							>
								<Link
									href={deriveRouteFromSkuId(item.skuId)}
									className="contents"
								>
									<div className="mb-4 h-32 w-32 bg-gray-100" />
									<div className="space-y-2 self-stretch">
										<h3 className="font-display text-lg font-semibold">
											{item.sku.displayName}
										</h3>
										<div className="flex justify-between">
											<p className="font-semibold">
												{formatNumber(item.quantity)} pieces
											</p>
											<p className="font-semibold">{formatPrice(item.price)}</p>
										</div>
									</div>
								</Link>
								<div className="space-y-2 self-stretch">
									<div className="flex items-center justify-between">
										<p className="text-gray-500">
											Order Today. Pick up on-site:
											<br />
											{getDistanceFromToday(item.closest_restock_date) > 1 &&
												'Available '}
											<b>{formatRestockDate(item.closest_restock_date)}</b>
											&nbsp;at&nbsp;
											<span className="inline-block text-bubblegum-600">
												Our {item.pickupLocation.displayName}
											</span>
										</p>

										{/* <DialogTrigger asChild> */}
										<Button
											variant="tertiary"
											onClick={() => {
												// setEditDialogState((oldState) => ({
												// 	...oldState,
												// 	pickupLocationId: item.pickupLocationId,
												// 	skuId: item.skuId
												// }));
											}}
										>
											<Icon name="edit" />
										</Button>
										{/* </DialogTrigger> */}
									</div>
								</div>
							</li>
						))}
					</ul>
					{/* </Dialog> */}
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
						{/* <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
							<DialogContent open={sendDialogOpen}>
								<DialogHeader title="Send to Customer" />
							</DialogContent>

							<DialogTrigger asChild> */}
						<Button variant="secondary" className="w-full text-bubblegum-700">
							<span className="font-semibold">Send as Quote</span>
						</Button>
						{/* </DialogTrigger>
						</Dialog> */}
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
}

export default Page;
