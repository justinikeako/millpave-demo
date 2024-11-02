'use client';

import { Icon } from '~/components/icon';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useCallback } from 'react';
import type { Sku } from '~/types/product';
import { cn } from '~/lib/utils';

const ProductModelViewer = dynamic(
	() => import('~/components/product-model-viewer'),
	{ suspense: true, ssr: false }
);

type GalleryProps = {
	sku: Sku;
	showModelViewer: boolean;
};

export function Gallery({ sku, showModelViewer }: GalleryProps) {
	const images = [0, 0, 0, 0];

	const pathname = usePathname();
	const searchParams = useSearchParams();

	const image = searchParams.get('image');
	const selectedIndex = typeof image === 'string' ? parseInt(image) : 0;

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	return (
		<div className="sticky top-24 mx-auto flex w-full max-w-sm flex-col-reverse items-center gap-2 sm:max-w-none lg:flex-row">
			<div className="flex items-center justify-center gap-2 lg:flex-col">
				{images.map((_, index) => {
					const id = 'image-' + index;

					return (
						<Link
							href={
								pathname + '?' + createQueryString('image', index.toString())
							}
							replace
							scroll={false}
							key={id}
							className={cn(
								'relative h-16 w-16 shrink-0 bg-gray-200 bg-clip-content p-1 ring-1 ring-inset ring-gray-400 lg:h-20 lg:w-20',
								selectedIndex === index && 'ring-2 ring-pink-700'
							)}
						>
							{index === 3 ? (
								showModelViewer && (
									<div className="absolute inset-0 flex items-center justify-center text-gray-500">
										<Icon name="3d_rotation-opsz_40" size={40} />
									</div>
								)
							) : (
								<Image
									src={`/gallery/${index}.png`}
									alt={sku.displayName}
									width={80}
									priority
									fetchPriority="high"
									height={80}
									className="h-full min-h-0 w-full min-w-0 object-cover"
								/>
							)}
						</Link>
					);
				})}
			</div>

			<div className="relative aspect-square w-full bg-gray-200 ring-1 ring-gray-900/10">
				{selectedIndex === 3 ? (
					showModelViewer && (
						<Suspense
							fallback={
								<div className="grid h-full w-full place-items-center">
									<p>Loading 3D Model...</p>
								</div>
							}
						>
							<ProductModelViewer
								skuId={sku.id}
								displayName={sku.displayName}
							/>
						</Suspense>
					)
				) : (
					<Image
						fill
						src={`/gallery/${selectedIndex}.png`}
						alt={sku.displayName}
						className="object-cover"
						sizes="(min-width: 480px) 95vw, (min-width: 768px) 60vw, (min-width: 1536px) 33vw"
					/>
				)}
			</div>
		</div>
	);
}
