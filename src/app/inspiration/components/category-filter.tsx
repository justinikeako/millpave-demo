'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '~/lib/utils';

export function CategoryFilter({
	id,
	displayName,
	thumbnailImage
}: {
	id: string;
	displayName: string;
	thumbnailImage?: string;
}) {
	const searchParams = useSearchParams();

	const selectedCategoryId = searchParams.get('category');

	const isSelected = selectedCategoryId === id;
	console.log(selectedCategoryId === id);
	return (
		<Link
			href={{ pathname: '/inspiration', query: { category: id } }}
			replace
			className={cn(
				'flex shrink-0 items-center overflow-hidden rounded-md border border-gray-400 outline-2 -outline-offset-2 outline-pink-700 transition-colors hover:bg-gray-900/5 active:bg-gray-900/10 active:transition-none',
				isSelected &&
					'bg-pink-400/10 text-pink-700 outline transition-none hover:bg-pink-400/20 active:bg-pink-400/30'
			)}
		>
			{thumbnailImage && <div className="aspect-square w-12 bg-gray-200" />}
			<p className="select-none whitespace-nowrap px-4 align-middle font-semibold">
				{displayName}
			</p>
		</Link>
	);
}
