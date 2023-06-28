'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '~/lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const portalVariants = cva('fixed inset-0 z-50 flex', {
	variants: {
		position: {
			top: 'items-start',
			bottom: 'items-end justify-center',
			left: 'justify-start',
			right: 'justify-end'
		}
	},
	defaultVariants: { position: 'right' }
});

interface SheetPortalProps
	extends SheetPrimitive.DialogPortalProps,
		VariantProps<typeof portalVariants> {
	position?: 'top' | 'bottom' | 'left' | 'right' | null;
}

const SheetPortal = ({
	position,
	className,
	children,
	...props
}: SheetPortalProps) => (
	<SheetPrimitive.Portal className={cn(className)} {...props}>
		<div className={portalVariants({ position })}>{children}</div>
	</SheetPrimitive.Portal>
);
SheetPortal.displayName = SheetPrimitive.Portal.displayName;

const SheetOverlay = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Overlay
		className={cn('fixed inset-0 z-50 bg-black/20', className)}
		{...props}
		ref={ref}
	/>
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
	'fixed z-50 bg-gray-100 flex flex-col border overflow-hidden',
	{
		variants: {
			position: {
				top: 'w-full duration-300',
				bottom:
					'w-full md:max-w-md rounded-t-2xl md:rounded-2xl md:bottom-8 duration-300',
				left: 'h-full duration-300',
				right: 'h-full duration-300'
			},
			size: {
				content: '',
				default: '',
				sm: '',
				lg: '',
				xl: '',
				full: ''
			}
		},
		compoundVariants: [
			{
				position: ['top', 'bottom'],
				size: 'content',
				class: 'max-h-screen'
			},
			{
				position: ['top', 'bottom'],
				size: 'default',
				class: 'h-1/3'
			},
			{
				position: ['top', 'bottom'],
				size: 'sm',
				class: 'h-1/4'
			},
			{
				position: ['top', 'bottom'],
				size: 'lg',
				class: 'h-1/2'
			},
			{
				position: ['top', 'bottom'],
				size: 'xl',
				class: 'h-5/6'
			},
			{
				position: ['top', 'bottom'],
				size: 'full',
				class: 'h-screen'
			},
			{
				position: ['right', 'left'],
				size: 'content',
				class: 'max-w-screen'
			},
			{
				position: ['right', 'left'],
				size: 'default',
				class: 'w-1/3'
			},
			{
				position: ['right', 'left'],
				size: 'sm',
				class: 'w-1/4'
			},
			{
				position: ['right', 'left'],
				size: 'lg',
				class: 'w-1/2'
			},
			{
				position: ['right', 'left'],
				size: 'xl',
				class: 'w-5/6'
			},
			{
				position: ['right', 'left'],
				size: 'full',
				class: 'w-screen'
			}
		],
		defaultVariants: {
			position: 'right',
			size: 'default'
		}
	}
);

export interface DialogContentProps
	extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
		VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Content>,
	DialogContentProps
>(({ position, size, className, children, ...props }, ref) => (
	<SheetPortal position={position}>
		<SheetOverlay />
		<SheetPrimitive.Content
			ref={ref}
			className={cn(sheetVariants({ position, size }), className)}
			{...props}
		>
			{children}
		</SheetPrimitive.Content>
	</SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex items-center justify-between px-8 pb-2 pt-4 md:px-6',
			className
		)}
		{...props}
	/>
);
SheetHeader.displayName = 'SheetHeader';

const SheetBody = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn('flex-1 overflow-y-auto px-8 pb-8 pt-2 md:px-6', className)}
		{...props}
	/>
);
SheetBody.displayName = 'SheetBody';

const SheetFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn('flex flex-col px-8 pb-2 pt-4 md:px-6', className)}
		{...props}
	/>
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title
		ref={ref}
		className={cn('text-foreground text-lg font-semibold', className)}
		{...props}
	/>
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Description
		ref={ref}
		className={cn('text-muted-foreground text-sm', className)}
		{...props}
	/>
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetBody,
	SheetClose,
	SheetFooter,
	SheetTitle,
	SheetDescription
};
