import { cn } from '~/lib/utils';
import { Slot } from '@radix-ui/react-slot';

type HorizontalScrollerProps = {
	asChild?: boolean;
	snap?: boolean;
} & React.ComponentPropsWithoutRef<'ul'>;

export function HorizontalScroller({
	snap,
	asChild,
	children,
	className,
	...props
}: HorizontalScrollerProps) {
	const Comp = asChild ? Slot : 'ul';

	return (
		<Comp
			className={cn(
				'no-scrollbar -m-6 flex overflow-x-auto lg:-mx-16',
				snap && 'snap-x snap-mandatory md:snap-none',
				'before:sticky before:left-0 before:z-[1] before:-mr-4 before:w-6 before:shrink-0 before:bg-gradient-to-r before:from-gray-100 lg:before:w-16',
				'after:sticky after:right-0 after:z-[1] after:-ml-4 after:w-6 after:shrink-0 after:bg-gradient-to-l after:from-gray-100 lg:after:w-16',
				className
			)}
			{...props}
		>
			{children}
		</Comp>
	);
}
