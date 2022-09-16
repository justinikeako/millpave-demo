import { DetailedHTMLProps, forwardRef, AnchorHTMLAttributes } from 'react';
import Icon from './icon';

type LinkButton = {
	variant: 'primary' | 'secondary' | 'tertiary';
	weight?: 'normal' | 'bold';
	iconRight?: string;
	iconLeft?: string;
} & DetailedHTMLProps<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	HTMLAnchorElement
>;

const classes = {
	primary:
		'flex justify-center space-x-2 rounded-md bg-pink-900 px-6 py-4 text-white',
	secondary:
		'flex justify-center space-x-2 rounded-md border border-neutral-300 px-6 py-4',
	tertiary: '-m-4 flex justify-center space-x-2 rounded-md p-4'
};

const LinkButton = forwardRef<
	HTMLAnchorElement,
	React.PropsWithChildren<LinkButton>
>(function Button(
	{
		variant,
		weight = 'bold',
		iconLeft,
		iconRight,
		className,
		children,
		...props
	},
	ref
) {
	const iconWeight = weight === 'normal' ? 'normal' : 'bold';
	const textWeight = weight === 'normal' ? 'font-normal' : 'font-semibold';

	return (
		<a
			{...props}
			ref={ref}
			className={`select-none ${classes[variant]} ${className}`}
		>
			{/* Icon Left */}
			{iconLeft && <Icon name={iconLeft} weight={iconWeight} />}

			{/* Button Text */}
			{children && <span className={textWeight}>{children}</span>}

			{/* Icon Right */}
			{iconRight && <Icon name={iconRight} weight={iconWeight} />}
		</a>
	);
});

export default LinkButton;
