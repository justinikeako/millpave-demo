'use client';

import { motion, HTMLMotionProps, useInView } from 'framer-motion';
import { useRef } from 'react';

type RevealSectionProps = HTMLMotionProps<'section'>;

function RevealSection(props: RevealSectionProps) {
	const slowTransition = {
		type: 'spring',
		stiffness: 100,
		damping: 20
	};

	const sectionRef = useRef<HTMLElement>(null);
	const sectionIsInView = useInView(sectionRef, {
		once: true,
		margin: '0px 150px -150px 0px'
	});

	return (
		<motion.section
			{...props}
			ref={sectionRef}
			initial={{ y: 100, opacity: 0 }}
			animate={sectionIsInView && { y: 0, opacity: 1 }}
			transition={slowTransition}
		></motion.section>
	);
}

export { RevealSection };
