import * as DialogPrimitive from '@radix-ui/react-dialog';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './button';
import { X } from 'lucide-react';

type ContentProps = React.PropsWithChildren<{
	open: boolean;
	className?: string;
}>;

function Content({ open, children, ...props }: ContentProps) {
	const slowTransition = {
		type: 'spring',
		mass: 1,
		damping: 20,
		stiffness: 150
	};
	const fastTransition = {
		type: 'spring',
		mass: 1,
		damping: 30,
		stiffness: 300
	};

	return (
		<AnimatePresence>
			{open && (
				<DialogPrimitive.Portal forceMount>
					<DialogPrimitive.Overlay asChild forceMount>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.2, transition: slowTransition }}
							exit={{ opacity: 0, transition: fastTransition }}
							className="fixed inset-0 bg-black"
						/>
					</DialogPrimitive.Overlay>

					<div className="fixed inset-0 flex items-center justify-center">
						<DialogPrimitive.Content asChild forceMount>
							<motion.div
								className={classNames('rounded-lg bg-white', props.className)}
								initial={{ y: 100, opacity: 0 }}
								animate={{ y: 0, opacity: 1, transition: slowTransition }}
								exit={{ y: 100, opacity: 0, transition: fastTransition }}
							>
								{children}
							</motion.div>
						</DialogPrimitive.Content>
					</div>
				</DialogPrimitive.Portal>
			)}
		</AnimatePresence>
	);
}

type HeaderProps = {
	title: string;
};

function Header({ title }: HeaderProps) {
	return (
		<div className="flex items-center justify-between px-8 pb-4 pt-8">
			<DialogPrimitive.Title className="font-display text-lg">
				{title}
			</DialogPrimitive.Title>

			<DialogPrimitive.Close asChild>
				<Button variant="tertiary" className="text-gray-500">
					<X className="w-6" />
				</Button>
			</DialogPrimitive.Close>
		</div>
	);
}

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.Close;

export { Root, Trigger, Content, Header, Close };
