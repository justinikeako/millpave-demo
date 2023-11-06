'use client';

import { cn } from '~/lib/utils';
import { motion, type Variants } from 'framer-motion';
import { useStageContext } from './stage-context';

type StageFormProps = React.ComponentPropsWithoutRef<'form'>;

const variants: Variants = {
	enter: {
		opacity: 0,
		transition: { duration: 0.5 }
	},
	center: {
		x: 0,
		opacity: 1,
		transition: { duration: 0.5 }
	},
	exit: {
		opacity: 0,
		transition: { duration: 0.5 }
	}
};

export function StageForm(props: StageFormProps) {
	const { direction } = useStageContext();

	return (
		<motion.form
			custom={direction}
			variants={variants}
			initial="enter"
			animate="center"
			exit="exit"
			id="stage-form"
			className={cn(
				'min-h-[100svh] px-6 py-24 md:py-32 lg:px-16',
				props.className
			)}
		>
			{props.children}
		</motion.form>
	);
}
