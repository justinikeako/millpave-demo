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
		'flex justify-center space-x-1.5 rounded-sm bg-gray-900 px-4 py-2 font-semibold text-white disabled:opacity-50',
	secondary:
		'flex justify-center space-x-1.5 rounded-sm border border-gray-900 px-4 py-2 font-semibold',
	tertiary:
		'-m-4 flex justify-center space-x-2 rounded-md p-4 active:bg-gray-100'
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
