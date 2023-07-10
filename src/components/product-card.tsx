import { formatPrice } from '../utils/format';
import Link from 'next/link';
import { Icon } from './icon';
import { cn } from '~/lib/utils';

type ProductCardProps = {
	name: string;
	startingSku: { price: number; unit: string };
	link: string;
	className?: string;
};

function ProductCard({ name, startingSku, link, className }: ProductCardProps) {
	return (
		<li
			className={cn('relative min-w-[16rem] space-y-4 @container', className)}
		>
			<div className="min-h-[18rem] @lg:flex @lg:h-full @lg:items-end @lg:justify-start @lg:p-6">
				<div className="w-fill z-[-1] aspect-[4/3] bg-gray-200 @lg:absolute @lg:inset-0 @lg:aspect-[unset]" />

				<div className="group space-y-2 px-2 pb-2 pt-3 @lg:p-0">
					<Link href={link} className="before:absolute before:inset-0">
						<h3 className="font-display text-lg">{name}</h3>
					</Link>
					<p>
						Starting at {formatPrice(startingSku.price)} per {startingSku.unit}
					</p>
					<p className="flex items-center gap-1">
						<span className="font-semibold">Learn More</span>
						<Icon
							name="arrow_right_alt"
							className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-1"
						/>
					</p>
				</div>
			</div>
		</li>
	);
}

export { ProductCard };
