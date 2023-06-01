'use client';

import { motion, useInView, Transition, MotionProps } from 'framer-motion';
import { Slot, SlotProps } from '@radix-ui/react-slot';
import { RefAttributes } from 'react';
import { useRef } from 'react';

type MotionSlotProps<Props> = Omit<
	SlotProps & MotionProps & RefAttributes<HTMLElement>,
	'ref'
> &
	Props;

type ViewportRevealProps = MotionSlotProps<{
	asChild?: boolean;
}>;

const slowTransition: Transition = {
	type: 'spring',
	stiffness: 100,
	damping: 20
};

const MotionSlot = motion(Slot);

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
			transition={slowTransition}
		/>
	);
}

type OrchestratedRevealProps = MotionSlotProps<{
	asChild?: boolean;
	delay?: number;
}>;

function OrchestratedReveal({
	delay = 0,
	asChild,
	...props
}: OrchestratedRevealProps) {
	const Comp = asChild ? MotionSlot : motion.div;

	return (
		<Comp
			{...props}
			initial={{ y: -50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ ...slowTransition, delay }}
		>
			{props.children}
		</Comp>
	);
}

export { ViewportReveal, OrchestratedReveal };
