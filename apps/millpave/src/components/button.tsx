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
		'flex justify-center space-x-1.5 rounded-md bg-bubblegum-700 px-6 py-4 text-white disabled:opacity-50',
	secondary:
		'flex justify-center space-x-1.5 rounded-md border border-neutral-300 px-6 py-4',
	tertiary: '-m-4 flex justify-center space-x-2 rounded-md p-4'
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
