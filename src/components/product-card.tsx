import { formatPrice } from '../utils/format';
import Link from 'next/link';
import { Icon } from './icon';
import { cn } from '~/lib/utils';

type ProductCardProps = {
	name: string;
	startingSku: { price: number; unit: string };
	link: string;
	containerClassName?: string;
} & React.LiHTMLAttributes<HTMLLIElement>;

function ProductCard({
	name,
	startingSku,
	link,
	containerClassName,
	...props
}: ProductCardProps) {
	return (
		<li className={cn('contents', containerClassName)}>
			<Link
				href={link}
				className={cn(
					'relative min-w-[16rem] space-y-4 @container',
					props.className
				)}
			>
				<div className="@lg:flex @lg:h-full @lg:items-end @lg:justify-start @lg:p-6">
					<div className="w-fill aspect-[4/3] bg-gray-200 @lg:absolute @lg:inset-0 @lg:aspect-[unset]" />

					<div className="relative space-y-2 px-2 pb-2 pt-3 @lg:p-0">
						<h3 className="font-display text-lg">{name}</h3>
						<p>
							Starting at {formatPrice(startingSku.price)} per{' '}
							{startingSku.unit}
						</p>
						<p className="flex items-center gap-1">
							<span className="font-semibold">Learn More</span>{' '}
							<Icon name="arrow_right_alt" />
						</p>
					</div>
				</div>
			</Link>
		</li>
	);
}

export { ProductCard };
