import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';

type ContentProps = React.PropsWithChildren<{
	open: boolean;
}>;

const Content = ({ children, open }: ContentProps) => {
	return (
		<AnimatePresence>
			{open && (
				<DialogPrimitive.Portal forceMount>
					<DialogPrimitive.Overlay asChild forceMount>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.2 }}
							exit={{ opacity: 0 }}
							transition={{ type: 'spring', damping: 25, stiffness: 200 }}
							className="fixed inset-0 z-20  bg-black"
						/>
					</DialogPrimitive.Overlay>

					<DialogPrimitive.Content asChild forceMount>
						<motion.div
							className="fixed inset-x-0 bottom-0 z-30 rounded-t-2xl bg-white px-8 pb-8"
							initial={{ y: '100%' }}
							animate={{ y: 0 }}
							exit={{ y: '100%' }}
							transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						>
							{children}
						</motion.div>
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			)}
		</AnimatePresence>
	);
};

type DialogHeader = {
	title: string;
};

const DialogHeader = ({ title }: DialogHeader) => {
	return (
		<div className="pt-8 pb-4">
			<DialogPrimitive.Title className="font-display text-lg">
				{title}
			</DialogPrimitive.Title>
		</div>
	);
};

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = Content;
const DialogClose = DialogPrimitive.Close;

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogClose };
