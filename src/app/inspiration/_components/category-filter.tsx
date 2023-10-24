import Link from 'next/link';
import { cn } from '~/lib/utils';

export function CategoryFilter({
	id,
	displayName,
	isSelected,
	thumbnailImage
}: {
	isSelected: boolean;
	thumbnailImage?: string;
	id: string;
	displayName: string;
}) {
	return (
		<Link
			href={{ pathname: '/gallery', query: { category: id } }}
			className={cn(
				'flex shrink-0 items-center overflow-hidden rounded-md border border-gray-400 outline-2 -outline-offset-2 outline-pink-700 transition-colors hover:bg-gray-900/5 active:bg-gray-900/10 active:transition-none',
				isSelected &&
					'peer-checked:bg-pink-400/10 peer-checked:text-pink-700 peer-checked:outline peer-checked:transition-none peer-checked:hover:bg-pink-400/20 peer-checked:active:bg-pink-400/30'
			)}
		>
			{thumbnailImage && <div className="aspect-square w-12 bg-gray-200" />}
			<p className="select-none whitespace-nowrap px-4 align-middle font-semibold">
				{displayName}
			</p>
		</Link>
	);
}
