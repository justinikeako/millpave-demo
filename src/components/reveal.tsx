'use client';

import { motion, useInView, type Transition } from 'framer-motion';
import { Slot, type SlotProps } from '@radix-ui/react-slot';
import { useContext, useRef, createContext } from 'react';

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
	const elementRef = useRef<HTMLDivElement>(null);
	const elementIsInView = useInView(elementRef, {
		once: true,
		margin: '0px 150px -150px 0px'
	});

	const Comp = asChild ? MotionSlot : motion.div;

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

type RevealProps = MotionSlotProps<{
	asChild?: boolean;
	delay?: number;
	standalone?: boolean;
}>;

export function Reveal({
	delay = 0,
	asChild,
	standalone,
	...props
}: RevealProps) {
	const Comp = asChild ? MotionSlot : motion.div;

	const container = useRevealContainer();

	const componentRef = useRef<HTMLDivElement>(null);
	const componentInView = useInView(componentRef, {
		once: true,
		margin: '0px 160px -160px 0px'
	});

	const show = standalone ? componentInView : container.inView;
	return (
		<Comp
			{...props}
			ref={componentRef}
			initial={{ y: 50, opacity: 0 }}
			animate={show && { y: 0, opacity: 1 }}
			transition={{ ...transition, delay }}
		>
			{props.children}
		</Comp>
	);
}

const RevealContainerContext = createContext<{ inView?: boolean }>({
	inView: undefined
});

function useRevealContainer() {
	return useContext(RevealContainerContext);
}

export function RevealContainer({
	asChild,
	children,
	...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const containerInView = useInView(containerRef, {
		once: true,
		margin: '0px 160px -160px 0px'
	});

	const Comp = asChild ? Slot : 'div';

	return (
		<RevealContainerContext.Provider value={{ inView: containerInView }}>
			<Comp {...props} ref={containerRef}>
				{children}
			</Comp>
		</RevealContainerContext.Provider>
	);
}

export { ViewportReveal };
