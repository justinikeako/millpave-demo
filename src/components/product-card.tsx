import { formatPrice } from '../utils/format';
import Link from 'next/link';
import { Icon } from './icon';
import { cn } from '~/lib/utils';

type ProductCardProps = {
	name: string;
	startingSku: { price: number; unit: string };
	link: string;
} & React.LiHTMLAttributes<HTMLLIElement>;

function ProductCard({ name, startingSku, link, ...props }: ProductCardProps) {
	return (
		<li className={cn('@container', props.className)}>
			<Link
				href={link}
				className="relative space-y-4 @lg:flex @lg:h-96 @lg:items-end @lg:justify-start @lg:p-6"
			>
				<div className="w-fill aspect-[4/3] bg-gray-200 @lg:absolute @lg:inset-0 @lg:aspect-[unset]" />

				<div className="relative space-y-2">
					<h3 className="font-display text-lg">{name}</h3>
					<p>
						Starting at {formatPrice(startingSku.price)} per {startingSku.unit}
					</p>
					<p className="flex items-center gap-1">
						<span className="font-semibold">Learn More</span>{' '}
						<Icon name="arrow_right_alt" />
					</p>
				</div>
			</Link>
		</li>
	);
}

export { ProductCard };
