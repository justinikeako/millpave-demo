import * as SelectPrimitive from '@radix-ui/react-select';
import cx from 'classnames';
import {
	MdArrowDropDown,
	MdCheck,
	MdKeyboardArrowDown,
	MdKeyboardArrowUp
} from 'react-icons/md';

type TriggerProps = {
	basic?: boolean;
} & SelectPrimitive.SelectTriggerProps;

function Trigger({ basic, ...props }: TriggerProps) {
	return (
		<SelectPrimitive.Trigger
			{...props}
			className={cx(
				basic
					? 'flex outline-none'
					: 'flex justify-between rounded-sm bg-gray-200 p-4 outline-none focus:inner-border-2 focus:inner-border-gray-900',
				props.className
			)}
		>
			<SelectPrimitive.Value />
			<SelectPrimitive.Icon asChild>
				<MdArrowDropDown
					name="arrow_drop_down"
					className="text-[1.5em] text-gray-500"
				/>
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function Content({ children }: SelectPrimitive.SelectContentProps) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content className="overflow-hidden rounded-md bg-gray-100">
				{children}
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}

function Viewport({ children }: SelectPrimitive.SelectViewportProps) {
	return (
		<SelectPrimitive.Viewport className="p-1">
			{children}
		</SelectPrimitive.Viewport>
	);
}

function Item({ value, children }: SelectPrimitive.SelectItemProps) {
	return (
		<SelectPrimitive.Item
			value={value}
			className="relative flex select-none items-center justify-between space-x-2 rounded-sm p-4 radix-highlighted:bg-gray-200"
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator>
				<MdCheck className="text-[1.5em]" />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
}

function ScrollUpButton() {
	return (
		<SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center bg-gray-100 py-4">
			<MdKeyboardArrowUp className="text-[1.5em]" />
		</SelectPrimitive.ScrollUpButton>
	);
}

function ScrollDownButton() {
	return (
		<SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center bg-gray-100 py-4">
			<MdKeyboardArrowDown />
		</SelectPrimitive.ScrollDownButton>
	);
}

const Root = SelectPrimitive.Root;

export {
	Root,
	Trigger,
	Viewport,
	Content,
	Item,
	ScrollUpButton,
	ScrollDownButton
};
