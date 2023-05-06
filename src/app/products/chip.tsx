'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type ChipProps = React.PropsWithChildren<{
	categoryId: string;
}>;

export function Chip(props: ChipProps) {
	const params = useParams() as { category: string };
	const isSelected = params.category === props.categoryId;

	return (
		<Link
			href={`/products/${props.categoryId}`}
			className={cn(
				'flex gap-1 whitespace-nowrap rounded-full bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300 active:bg-gray-400',
				isSelected &&
					'bg-gray-950 text-white hover:bg-gray-900 active:bg-gray-800'
			)}
		>
			<span className="pointer-events-none z-[1]">{props.children}</span>
			<Check className="pointer-events-none z-[1] hidden text-[1.5rem] text-white peer-checked:inline" />
		</Link>
	);
}
