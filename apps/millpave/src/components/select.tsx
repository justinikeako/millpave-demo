import * as SelectPrimitive from '@radix-ui/react-select';
import Icon from './icon';

const Select = SelectPrimitive.Root;

type SelectTriggerProps = {
	basic?: boolean;
};

const SelectTrigger = ({ basic }: SelectTriggerProps) => {
	return (
		<SelectPrimitive.Trigger
			className={
				basic
					? 'flex outline-none'
					: 'flex rounded-md p-4 shadow-[inset_0_0_0_1px_#d4d4d8] outline-none focus:shadow-[inset_0_0_0_2px_#be185d]'
			}
		>
			<SelectPrimitive.Value />
			<SelectPrimitive.Icon asChild>
				<Icon name="arrow_drop_down" className="text-zinc-500" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
};

const SelectContent = ({ children }: SelectPrimitive.SelectContentProps) => {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content className="overflow-hidden rounded-md bg-zinc-100">
				{children}
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
};

const SelectViewport = ({ children }: SelectPrimitive.SelectViewportProps) => {
	return (
		<SelectPrimitive.Viewport className="p-1">
			{children}
		</SelectPrimitive.Viewport>
	);
};

const SelectItem = ({ value, children }: SelectPrimitive.SelectItemProps) => {
	return (
		<SelectPrimitive.Item
			value={value}
			className="relative flex select-none items-center space-x-2 rounded-sm p-4 radix-highlighted:bg-zinc-200"
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator>
				<Icon name="check" />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
};

const SelectScrollUpButton = () => {
	return (
		<SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center bg-zinc-100 py-4">
			<Icon name="keyboard_arrow_up" />
		</SelectPrimitive.ScrollUpButton>
	);
};

const SelectScrollDownButton = () => {
	return (
		<SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center bg-zinc-100 py-4">
			<Icon name="keyboard_arrow_down" />
		</SelectPrimitive.ScrollDownButton>
	);
};

export {
	Select,
	SelectTrigger,
	SelectViewport,
	SelectContent,
	SelectItem,
	SelectScrollUpButton,
	SelectScrollDownButton
};
