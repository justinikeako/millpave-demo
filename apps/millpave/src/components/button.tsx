import { forwardRef } from 'react';
import cx from 'classnames';

type ButtonProps = {
	variant: 'primary' | 'secondary' | 'tertiary';
} & React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const classes = {
	primary:
		'flex justify-center space-x-1.5 rounded-md bg-bubblegum-700 px-6 py-4 text-white',
	secondary:
		'flex justify-center space-x-1.5 rounded-md border border-neutral-300 px-6 py-4',
	tertiary: '-m-4 flex justify-center space-x-2 rounded-md p-4'
};

const Button = forwardRef<
	HTMLButtonElement,
	React.PropsWithChildren<ButtonProps>
>(function Button({ variant, className, children, ...props }, ref) {
	return (
		<button
			{...props}
			ref={ref}
			className={cx('select-none', classes[variant], className)}
		>
			{children}
		</button>
	);
});

export { Button };
