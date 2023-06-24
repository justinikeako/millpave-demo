import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '~/lib/utils';

type ButtonProps = {
	intent: 'primary' | 'secondary' | 'tertiary';
	backdrop?: 'dark' | 'light';
	asChild?: boolean;
} & React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const buttonVariants = cva(
	'flex items-center justify-center gap-1 font-semibold text-center select-none focus:outline-pink-700 focus:outline-offset-2 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed [&>span]:z-[1] [&>svg]:z-[1]',
	{
		variants: {
			intent: {
				primary:
					'relative px-3 py-2 border rounded-sm overflow-hidden before:absolute before:block before:inset-0 before:rounded-[3px] after:absolute after:block after:inset-0 after:rounded-[3px] shadow-button',
				secondary:
					'rounded-sm px-3 py-2 border font-semibold transition-colors active:transition-none',
				tertiary:
					'-m-3 rounded-full p-3 transition-colors active:transition-none'
			},
			backdrop: {
				light: '',
				dark: ''
			}
		},
		compoundVariants: [
			{
				intent: 'primary',
				backdrop: 'light',
				className: [
					'bg-gradient-to-b bg-gray-900 text-gray-100',
					'border-gray-950 before:bg-gray-100/50 before:gradient-mask-b-0 before:opacity-50 before:transition-opacity hover:before:opacity-60 active:before:opacity-50 active:before:transition-none active:before:gradient-mask-t-0',
					'after:border after:border-gray-100/50 after:gradient-mask-b-0 after:opacity-50 after:transition-opacity hover:after:opacity-60 active:after:opacity-50'
				]
			},
			{
				intent: 'primary',
				backdrop: 'dark',
				className: [
					'bg-gradient-to-b bg-gray-300 text-gray-600 border-gray-400',
					'before:bg-white/90 before:gradient-mask-b-0 before:opacity-75 before:transition-opacity hover:before:opacity-100 active:before:opacity-50 active:before:transition-none active:before:gradient-mask-t-0',
					'after:border after:border-white/50 after:gradient-mask-b-0 after:opacity-75 after:transition-opacity hover:after:opacity-100 active:after:opacity-60'
				]
			},
			{
				intent: 'secondary',
				backdrop: 'light',
				className:
					'border-gray-900/25 hover:bg-gray-900/5 active:bg-gray-900/10'
			},
			{
				intent: 'secondary',
				backdrop: 'dark',
				className:
					'border-gray-100/25 hover:bg-gray-100/5 active:bg-gray-100/10 text-gray-100'
			},
			{
				intent: 'tertiary',
				backdrop: 'light',
				className:
					'text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 disabled:text-gray-600'
			},
			{
				intent: 'tertiary',
				backdrop: 'dark',
				className:
					'text-gray-100 hover:bg-gray-100/10 active:bg-gray-100/20 disabled:text-gray-400'
			}
		]
	}
);

const Button = forwardRef<
	HTMLButtonElement,
	React.PropsWithChildren<ButtonProps>
>(function Button({ intent, backdrop = 'light', asChild, ...props }, ref) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			{...props}
			ref={ref}
			className={cn(buttonVariants({ intent, backdrop }), props.className)}
		/>
	);
});

export { Button };
