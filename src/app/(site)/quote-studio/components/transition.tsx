'use client';

// import { type Variants, AnimatePresence, motion } from 'framer-motion';
// import { useStageContext } from './stage-context';
// import { usePathname } from 'next/navigation';

// // Frozen Router is a hack to enables framer motion exit transitions in app dir
// import { FrozenRouter } from '~/components/frozen-router';

// const variants: Variants = {
// 	hidden: (direction: number) => ({
// 		x: direction > 0 ? 50 : -50,
// 		opacity: 0,
// 		transition: { type: 'spring', duration: 0.5, bounce: 0 }
// 	}),
// 	enter: {
// 		x: 0,
// 		opacity: 1,
// 		zIndex: 1,
// 		transition: { type: 'spring', duration: 0.5, bounce: 0 }
// 	},
// 	exit: (direction: number) => ({
// 		x: direction > 0 ? -50 : 50,
// 		opacity: 0,
// 		zIndex: 0,
// 		transition: { type: 'spring', duration: 0.5, bounce: 0 }
// 	})
// };

// export function Transition(props: React.PropsWithChildren) {
// 	const { direction } = useStageContext();
// 	const key = usePathname();

// 	return (
// 		<AnimatePresence initial={false} mode="wait" custom={direction}>
// 			<motion.div
// 				key={key}
// 				initial="hidden"
// 				animate="enter"
// 				exit="exit"
// 				custom={direction}
// 				variants={variants}
// 				transition={{ type: 'linear' }}
// 				className="overflow-hidden"
// 			>
// 				<FrozenRouter>{props.children}</FrozenRouter>
// 			</motion.div>
// 		</AnimatePresence>
// 	);
// }

export function Transition(props: React.PropsWithChildren) {
	return props.children;
}
