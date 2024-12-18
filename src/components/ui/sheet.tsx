'use client';

import React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '~/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const portalVariants = cva('fixed inset-0 z-50 flex', {
	variants: {
		position: {
			top: 'items-start',
			bottom: 'items-end justify-center',
			left: 'justify-start items-end',
			right: 'justify-end items-end'
		}
	},
	defaultVariants: { position: 'right' }
});

interface SheetPortalProps
	extends SheetPrimitive.DialogPortalProps,
		VariantProps<typeof portalVariants> {
	position?: 'top' | 'bottom' | 'left' | 'right' | null;
}

const SheetPortal = ({ position, children, ...props }: SheetPortalProps) => (
	<SheetPrimitive.Portal {...props}>
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
	'fixed z-50 bg-gray-100 flex flex-col overflow-hidden',
	{
		variants: {
			position: {
				top: 'w-full md:[--x-hidden:0] md:[--y-hidden:-100%]',
				bottom:
					'w-full md:max-w-md rounded-t-2xl md:rounded-2xl md:bottom-8 md:[--x-hidden:0] md:[--y-hidden:100%]',
				left: 'md:[--x-hidden:-100%] md:[--y-hidden:0]',
				right: 'md:[--x-hidden:100%] md:[--y-hidden:0]'
			}
		},
		compoundVariants: [
			{
				position: ['top', 'bottom'],
				class: 'h-5/6'
			},
			{
				position: ['right', 'left'],
				class: 'h-5/6 w-full rounded-t-lg xs:h-full xs:w-80 xs:rounded-none'
			}
		],
		defaultVariants: {
			position: 'right'
		}
	}
);

export interface DialogContentProps
	extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
		VariantProps<typeof sheetVariants> {
	open: boolean;
}

const SheetContent = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Content>,
	DialogContentProps
>(({ position, className, open, children, ...props }, ref) => {
	return (
		<AnimatePresence>
			{open && (
				<SheetPortal position={position} forceMount>
					<SheetOverlay forceMount asChild>
						<motion.div
							className="fixed inset-0 z-50 bg-gray-900/50"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						/>
					</SheetOverlay>
					<SheetPrimitive.Content
						forceMount
						asChild
						ref={ref}
						className={cn(
							'[--x-hidden:0] [--x-shown:0] [--y-hidden:100%] [--y-shown:0] md:[--x-shown:0] md:[--y-shown:0]',
							sheetVariants({ position }),
							className
						)}
						{...props}
					>
						<motion.div
							initial={{ x: 'var(--x-hidden)', y: 'var(--y-hidden)' }}
							animate={{
								x: 'var(--x-shown)',
								y: 'var(--y-shown)',
								transition: {
									type: 'spring',
									duration: 0.5,
									bounce: 0
								}
							}}
							exit={{
								x: 'var(--x-hidden)',
								y: 'var(--y-hidden)',
								transition: {
									type: 'spring',
									duration: 0.35,
									bounce: 0
								}
							}}
						>
							{children}
						</motion.div>
					</SheetPrimitive.Content>
				</SheetPortal>
			)}
		</AnimatePresence>
	);
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn('flex h-12 items-center gap-3 px-6', className)}
		{...props}
	/>
);
SheetHeader.displayName = 'SheetHeader';

const SheetBody = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn('flex-1 overflow-y-auto px-6 pb-6 pt-2', className)}
		{...props}
	/>
);
SheetBody.displayName = 'SheetBody';

const SheetFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex h-16 items-center px-6', className)} {...props} />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title
		ref={ref}
		className={cn('font-semibold', className)}
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
