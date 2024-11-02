'use client';
import { use } from 'react';

import * as Dialog from '@radix-ui/react-dialog';

import { Icon } from '~/components/icon';

import { ProductCard } from '~/components/product-card';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '~/components/button';

type Props = { params: Promise<{ id: string }> };

export default function PhotoModal(props: Props) {
	const params = use(props.params);
	const photoId = params.id;

	const router = useRouter();
	function handleDismiss() {
		router.back();
	}

	return (
		<Dialog.Root defaultOpen>
			<Dialog.Portal>
				<Dialog.Overlay id="photo-overlay" />
				<Dialog.Content
					className="fixed inset-0 z-50 overflow-hidden overflow-y-auto sm:flex sm:overflow-hidden"
					id="photo-container"
					forceMount
				>
					<Dialog.Close
						tabIndex={-1}
						id="photo-overlay"
						asChild
						onClick={handleDismiss}
					>
						<div className="fixed inset-0 bg-gray-900/90" />
					</Dialog.Close>
					{/* Image */}
					<div className="pointer-events-none relative flex h-[calc(100%-5rem)] flex-1 items-center sm:h-full">
						<div className="pointer-events-auto relative flex aspect-video max-h-full w-full items-center justify-center overflow-hidden bg-gray-200">
							<Image
								fill
								src={`/inspo-${photoId}.png`}
								sizes="(max-width: 640px) 100vw, (max-width: 1280px) 75vw (max-width: 1536px) 85vw"
								alt={'Post Title ' + photoId}
								className="object-cover"
							/>
						</div>
					</div>

					<p className="absolute bottom-24 w-full text-center text-sm text-white sm:!hidden">
						Scroll to see more details...
					</p>
					{/* Info panel */}

					<aside className="relative flex flex-col overflow-hidden rounded-t-lg bg-gray-100 xs:container sm:mx-0 sm:h-full sm:w-96 sm:rounded-none">
						<div className="flex h-20 flex-col justify-center bg-gray-100 px-6">
							<Dialog.Title className="font-display text-xl">
								Residential Driveway
							</Dialog.Title>
							<p>
								By&nbsp;
								<Link
									target="_blank"
									href="https://www.instagram.com/najobriks"
									className="text-pink-600"
								>
									Najo Briks Construction
								</Link>
							</p>
						</div>

						<div className="flex-1 space-y-16 px-6 py-6 sm:overflow-y-auto">
							<section>
								<p>
									Lorem ipsum, dolor sit amet consectetur adipisicing elit.
									Dolor, accusantium? Quasi assumenda voluptate error nesciunt
									placeat! Consequuntur incidunt, temporibus nesciunt pariatur
									harum quisquam voluptatum dicta facilis ut similique minus,
									soluta at consectetur ipsa corporis eos doloribus atque
									tempora molestias voluptatibus. Magni esse nihil debitis
									mollitia. Culpa nulla quisquam veritatis! Velit?
								</p>
							</section>

							<section>
								<h2 className="font-display text-lg">Products in this photo</h2>

								<ul className="mt-8 space-y-4">
									<ProductCard
										name="Colonial Classic"
										startingSku={{
											price: 203,
											unit: 'sqft'
										}}
										productId="colonial_classic"
										className="h-96"
									/>
									<ProductCard
										name="Banjo"
										startingSku={{
											price: 219,
											unit: 'sqft'
										}}
										productId="banjo"
										className="h-96"
									/>
								</ul>
							</section>
						</div>
					</aside>

					{/* Close Button */}
					<Dialog.Close asChild onClick={handleDismiss}>
						<Button
							intent="tertiary"
							backdrop="dark"
							className="pointer-events-auto fixed left-8 top-8 bg-gray-900/90 font-semibold"
						>
							<Icon name="arrow_left" />
							Return To Gallery
						</Button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
