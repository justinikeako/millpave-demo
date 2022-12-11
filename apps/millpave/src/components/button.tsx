import { forwardRef } from 'react';
import cx from 'classnames';
import { Slot } from '@radix-ui/react-slot';

type ButtonProps = {
	variant: 'primary' | 'secondary' | 'tertiary';
	asChild?: boolean;
} & React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const classes = {
	primary:
		'flex justify-center space-x-1.5 rounded-sm bg-gray-900 px-4 py-2 font-semibold shadow-button text-white hover:bg-gray-800 active:bg-gray-700',
	secondary:
		'flex justify-center space-x-1.5 rounded-sm border border-black/10 px-4 py-2 font-semibold hover:bg-black/10 active:bg-black/20',
	tertiary:
		'-m-3 flex justify-center space-x-2 rounded-full p-3 hover:bg-black/10 active:bg-black/20'
};

const Button = forwardRef<
	HTMLButtonElement,
	React.PropsWithChildren<ButtonProps>
>(function Button({ variant, className, asChild, children, ...props }, ref) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			{...props}
			ref={ref}
			className={cx('select-none', classes[variant], className)}
		>
			{children}
		</Comp>
	);
});

export { Button };
