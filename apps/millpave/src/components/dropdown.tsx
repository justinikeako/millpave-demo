import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import cx from 'classnames';

function Content({
	children,
	...props
}: DropdownMenuPrimitive.MenuContentProps) {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				{...props}
				className="overflow-hidden rounded-md bg-zinc-100"
			>
				{children}
			</DropdownMenuPrimitive.Content>
		</DropdownMenuPrimitive.Portal>
	);
}

function SubContent(props: DropdownMenuPrimitive.MenuSubContentProps) {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.SubContent {...props} />
		</DropdownMenuPrimitive.Portal>
	);
}

function Item({ children, ...props }: DropdownMenuPrimitive.MenuItemProps) {
	return (
		<DropdownMenuPrimitive.Item
			{...props}
			className={cx(
				'relative flex select-none items-center space-x-2 rounded-sm p-4 radix-highlighted:bg-zinc-200',
				props.className
			)}
		>
			{children}
		</DropdownMenuPrimitive.Item>
	);
}

export const Separator = () => {
	return (
		<DropdownMenuPrimitive.Separator className="h-[1px] w-full bg-zinc-500" />
	);
};

export const Menu = DropdownMenuPrimitive.Root;
export const MenuTrigger = DropdownMenuPrimitive.Trigger;
export const MenuContent = Content;
export const MenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const MenuSub = DropdownMenuPrimitive.Sub;
export const MenuSubContent = SubContent;
export const MenuItem = Item;
export const CheckboxItem = DropdownMenuPrimitive.CheckboxItem;
export const RadioItem = DropdownMenuPrimitive.RadioItem;
export const SubTrigger = DropdownMenuPrimitive.SubTrigger;
