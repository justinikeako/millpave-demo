import * as SelectPrimitive from '@radix-ui/react-select';
import cx from 'classnames';
import Icon from './icon';

const Select = SelectPrimitive.Root;

type SelectTriggerProps = {
	basic?: boolean;
} & SelectPrimitive.SelectTriggerProps;

const SelectTrigger = ({ basic, ...props }: SelectTriggerProps) => {
	return (
		<SelectPrimitive.Trigger
			{...props}
			className={cx(
				basic
					? 'flex outline-none'
					: 'flex justify-between rounded-md p-4 outline-none inner-border inner-border-gray-300  focus:inner-border-2 focus:inner-border-bubblegum-700',
				props.className
			)}
		>
			<SelectPrimitive.Value />
			<SelectPrimitive.Icon asChild>
				<Icon name="arrow_drop_down" className="text-gray-500" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
};

const SelectContent = ({ children }: SelectPrimitive.SelectContentProps) => {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content className="overflow-hidden rounded-md bg-gray-100">
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
			className="relative flex select-none items-center justify-between space-x-2 rounded-sm p-4 radix-highlighted:bg-gray-200"
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
		<SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center bg-gray-100 py-4">
			<Icon name="keyboard_arrow_up" />
		</SelectPrimitive.ScrollUpButton>
	);
};

const SelectScrollDownButton = () => {
	return (
		<SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center bg-gray-100 py-4">
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
