'use client';

import { motion, useInView, type Transition } from 'framer-motion';
import { Slot, type SlotProps } from '@radix-ui/react-slot';
import { forwardRef, useRef } from 'react';

const MotionSlot = motion(
	Slot as React.ForwardRefExoticComponent<
		Omit<SlotProps, 'style'> & React.RefAttributes<HTMLElement>
	>
);

type MotionSlotProps<ExtendProps> = React.ComponentPropsWithoutRef<
	typeof MotionSlot
> &
	ExtendProps;

const transition: Transition = {
	type: 'spring',
	duration: 1,
	bounce: 0
};

type ViewportRevealProps = MotionSlotProps<{
	asChild?: boolean;
}>;

function ViewportReveal({ asChild, ...props }: ViewportRevealProps) {
	const Comp = asChild ? MotionSlot : motion.div;

	const elementRef = useRef<HTMLDivElement>(null);
	const elementIsInView = useInView(elementRef, {
		once: true,
		margin: '0px 150px -150px 0px'
	});

	return (
		<Comp
			{...props}
			ref={elementRef}
			initial={{ opacity: 0 }}
			animate={elementIsInView && { opacity: 1 }}
			transition={transition}
		/>
	);
}

type OrchestratedRevealProps = MotionSlotProps<{
	asChild?: boolean;
	delay?: number;
}>;

const OrchestratedReveal = forwardRef<
	React.ElementRef<'div'>,
	OrchestratedRevealProps
>(({ delay = 0, asChild, ...props }, ref) => {
	const Comp = asChild ? MotionSlot : motion.div;

	return (
		<Comp
			{...props}
			ref={ref}
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ ...transition, delay }}
		>
			{props.children}
		</Comp>
	);
});

OrchestratedReveal.displayName = 'OrchestratedReveal';

export { ViewportReveal, OrchestratedReveal };
