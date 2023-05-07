'use client';

import { Slot, SlotProps } from '@radix-ui/react-slot';
import { motion, Transition, MotionProps } from 'framer-motion';
import { RefAttributes } from 'react';

type OrchestratedRevealProps = Omit<
	SlotProps & MotionProps & RefAttributes<HTMLElement>,
	'ref'
> & {
	asChild?: boolean;
	delay?: number;
};

const MotionSlot = motion(Slot);

function OrchestratedReveal({
	delay = 0,
	asChild,
	...props
}: OrchestratedRevealProps) {
	const Comp = asChild ? MotionSlot : motion.div;

	const slowTransition: Transition = {
		type: 'spring',
		stiffness: 100,
		damping: 20,
		delay: delay
	};

	return (
		<Comp
			{...props}
			initial={{ y: 100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={slowTransition}
		>
			{props.children}
		</Comp>
	);
}

export { OrchestratedReveal };
