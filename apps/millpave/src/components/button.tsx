import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';
import Icon from './icon';

type ButtonProps = {
	variant: 'primary' | 'secondary' | 'tertiary';
	weight?: 'normal' | 'bold';
	iconRight?: string;
	iconLeft?: string;
} & DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const classes = {
	primary:
		'flex justify-center space-x-2 rounded-md bg-pink-800 px-6 py-4 text-white',
	secondary:
		'flex justify-center space-x-2 rounded-md border border-neutral-300 px-6 py-4',
	tertiary: '-m-4 flex justify-center space-x-2 rounded-md p-4'
};

const Button = forwardRef<
	HTMLButtonElement,
	React.PropsWithChildren<ButtonProps>
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
		<button
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
		</button>
	);
});

export default Button;
