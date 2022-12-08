import classNames from 'classnames';
import { Button } from './button';
import { formatPrice } from '../utils/format';
import Link from 'next/link';

type ProductCardProps = {
	name: string;
	startingPrice: number;
	link?: string;
	variant?: 'display' | 'normal';
} & React.LiHTMLAttributes<HTMLLIElement>;

function ProductCard({
	name,
	startingPrice,
	link = '/product/colonial_classic?sku=grey',
	variant = 'normal',
	...props
}: ProductCardProps) {
	return (
		<li
			className={classNames(
				'col-span-1 flex h-[40vh] flex-col items-start justify-end bg-gray-200 p-8 md:h-[50vmin]',
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
					Starting at {formatPrice(startingPrice)} per ft<sup>2</sup>
				</p>
				<Button variant="secondary" className="w-fit" asChild>
					<Link href={link}>Learn More</Link>
				</Button>
			</div>
		</li>
	);
}

export { ProductCard };
