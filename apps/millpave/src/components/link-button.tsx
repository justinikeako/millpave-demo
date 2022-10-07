import { forwardRef } from 'react';
import cx from 'classnames';

type LinkButtonProps = {
	variant: 'primary' | 'secondary' | 'tertiary';
} & React.DetailedHTMLProps<
	React.AnchorHTMLAttributes<HTMLAnchorElement>,
	HTMLAnchorElement
>;

const classes = {
	primary:
		'flex justify-center space-x-1.5 rounded-md bg-bubblegum-700 px-6 py-4 text-white',
	secondary:
		'flex justify-center space-x-1.5 rounded-md border border-neutral-300 px-6 py-4',
	tertiary: '-m-4 flex justify-center space-x-2 rounded-md p-4'
};

const LinkButton = forwardRef<
	HTMLAnchorElement,
	React.PropsWithChildren<LinkButtonProps>
>(function LinkButton({ variant, className, children, ...props }, ref) {
	return (
		<a
			{...props}
			ref={ref}
			className={cx('select-none', classes[variant], className)}
		>
			{children}
		</a>
	);
});

export { LinkButton };
