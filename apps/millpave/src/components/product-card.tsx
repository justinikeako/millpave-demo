import classNames from 'classnames';
import { Button } from './button';
import { formatPrice } from '../utils/format';
import Link from 'next/link';

type ProductCardProps = {
	name: string;
	startingSku: { price: number; unit: string };
	link?: string;
	variant?: 'display' | 'normal';
} & React.LiHTMLAttributes<HTMLLIElement>;

function ProductCard({
	name,
	startingSku,
	link = '/product/colonial_classic',
	variant = 'normal',
	...props
}: ProductCardProps) {
	return (
		<li
			className={classNames(
				'flex h-[40vmax] flex-col items-start justify-end bg-gray-200 p-8 md:h-[50vmin] xl:h-[25vmax]',
				props.className
			)}
		>
			{/*  eslint-disable-next-line @next/next/no-img-element */}
			<div className="space-y-2">
				{variant === 'display' ? (
					<h3 className="text-xl">{name}</h3>
				) : (
					<h3 className="text-lg">{name}</h3>
				)}
				<p>
					Starting at <del>{formatPrice(startingSku.price)}</del>&nbsp;
					{formatPrice(startingSku.price - 0.01)} per {startingSku.unit}
				</p>
				<Button variant="secondary" className="w-fit" asChild>
					<Link href={link}>Learn More</Link>
				</Button>
			</div>
		</li>
	);
}

export { ProductCard };
