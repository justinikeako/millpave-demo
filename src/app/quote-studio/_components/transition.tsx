'use client';

import { AnimatePresence } from 'framer-motion';
import { useStageContext } from './stage-context';

export function Transition(props: React.PropsWithChildren) {
	const { direction } = useStageContext();

	return (
		<AnimatePresence initial={false} mode="wait" custom={direction}>
			{props.children}
		</AnimatePresence>
	);
}
