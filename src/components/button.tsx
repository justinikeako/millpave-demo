import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '~/lib/utils';

const buttonVariants = cva(
	'relative flex items-center justify-center gap-1 text-center select-none focus:outline-pink-700 focus:outline-offset-2 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed [&>span]:z-[1] [&>svg]:z-[1]',
	{
		variants: {
			intent: {
				primary:
					'px-3 border font-semibold rounded-sm overflow-hidden shadow-button before:gradient-mask-b-0 before:transition-opacity before:absolute before:block before:inset-0 before:rounded-[3px] after:absolute after:block after:inset-0 after:border after:rounded-[3px] after:transition-opacity active:before:transition-none active:after:transition-none',
				secondary:
					'rounded-sm px-3 border font-semibold transition-colors active:transition-none',
				tertiary: 'rounded-full transition-colors active:transition-none'
			},
			size: {
				regular: '',
				small: ''
			},
			backdrop: {
				light: '',
				dark: ''
			}
		},
		compoundVariants: [
			{
				intent: ['primary', 'secondary'],
				backdrop: ['light', 'dark'],
				size: 'regular',
				className: 'h-10'
			},
			{
				intent: ['primary', 'secondary'],
				backdrop: ['light', 'dark'],
				size: 'small',
				className: 'h-8'
			},
			{
				intent: 'tertiary',
				backdrop: ['light', 'dark'],
				size: 'regular',
				className: '-m-3 p-3'
			},
			{
				intent: 'tertiary',
				backdrop: ['light', 'dark'],
				size: 'small',
				className: '-m-2 p-2'
			},
			{
				intent: 'primary',
				backdrop: 'light',
				className: [
					// Main styles
					'bg-gray-900 text-gray-100 border-gray-950 before:bg-gray-100/50 before:opacity-50 after:border-gray-100/50 after:gradient-mask-b-0 after:opacity-50',
					// Hover
					'hover:before:opacity-60 hover:after:opacity-60',
					// Active
					'active:before:gradient-mask-t-0 active:before:opacity-50 active:after:opacity-50'
				]
			},
			{
				intent: 'primary',
				backdrop: 'dark',
				className: [
					// Main styles
					'bg-gray-300 text-gray-600 border-gray-400 before:bg-white/90 before:opacity-75 after:border after:border-white/50 after:gradient-mask-b-0 after:opacity-75',
					// Hover
					'hover:before:opacity-100 hover:after:opacity-100',
					// Active
					'active:before:gradient-mask-t-0 active:before:opacity-50 active:after:opacity-60'
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
					'text-gray-100 border-gray-100/25 hover:bg-gray-100/5 active:bg-gray-100/10'
			},
			{
				intent: 'tertiary',
				backdrop: 'light',
				className:
					'text-gray-900 hover:bg-gray-300/75 active:bg-gray-500/50 disabled:text-gray-600'
			},
			{
				intent: 'tertiary',
				backdrop: 'dark',
				className:
					'text-gray-100 hover:bg-gray-700/90 active:bg-gray-500/75 disabled:text-gray-400'
			}
		],
		defaultVariants: {
			backdrop: 'light',
			size: 'regular'
		}
	}
);

type ButtonProps = {
	asChild?: boolean;
} & VariantProps<typeof buttonVariants> &
	React.ComponentProps<'button'>;

const Button = forwardRef<React.ElementRef<'button'>, ButtonProps>(
	function Button({ intent, size, backdrop, asChild, ...props }, ref) {
		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				{...props}
				ref={ref}
				className={cn(
					buttonVariants({ intent, size, backdrop }),
					props.className
				)}
			/>
		);
	}
);

export { Button };
