import * as ToastPrimitive from '@radix-ui/react-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

type ToastProps = ToastPrimitive.ToastProps & {
	onOpenChange: (open: boolean) => void;
};

const Toast = ({ children, ...props }: ToastProps) => {
	const nubz = useRef<HTMLLIElement>(null);

	return (
		<AnimatePresence>
			{props.open && (
				<ToastPrimitive.Root ref={nubz} {...props} asChild forceMount>
					<motion.div
						drag="x"
						dragConstraints={nubz}
						onDragEnd={(_, e) => {
							if (e.offset.x > 50 && props.onOpenChange)
								props.onOpenChange(false);
						}}
						className="fixed inset-x-4 bottom-4 z-40 flex justify-between rounded-lg bg-lime-600 p-4 text-white"
						initial={{ y: 32, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{children}
					</motion.div>
				</ToastPrimitive.Root>
			)}
		</AnimatePresence>
	);
};

const ToastTitle = ToastPrimitive.Title;
const ToastAction = ToastPrimitive.Action;
const ToastViewport = ToastPrimitive.Viewport;
export { Toast, ToastTitle, ToastAction, ToastViewport };
