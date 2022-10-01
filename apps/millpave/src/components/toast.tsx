import * as ToastPrimitive from '@radix-ui/react-toast';

type ToastProps = ToastPrimitive.ToastProps & {
	title: string;
	action?: React.ReactNode;
	actionAltText?: string;
};

export const Toast = ({
	title,
	action,
	actionAltText,
	...props
}: ToastProps) => {
	const hasAction = !!action;
	const hasActionAltText = !!actionAltText;

	return (
		<>
			<ToastPrimitive.Root
				{...props}
				className="fixed inset-x-4 bottom-4 z-40 flex justify-between rounded-lg bg-lime-600 p-4 text-white"
			>
				<ToastPrimitive.Title>{title}</ToastPrimitive.Title>

				{hasAction && hasActionAltText && (
					<ToastPrimitive.Action asChild altText={actionAltText}>
						{action}
					</ToastPrimitive.Action>
				)}
			</ToastPrimitive.Root>

			<ToastPrimitive.Viewport />
		</>
	);
};
