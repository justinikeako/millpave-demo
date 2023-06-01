'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '~/lib/utils';

type TriggerProps = {
	basic?: boolean;
} & SelectPrimitive.SelectTriggerProps;

function Trigger({ basic, ...props }: TriggerProps) {
	return (
		<SelectPrimitive.Trigger
			{...props}
			className={cn(
				basic
					? 'flex items-center justify-between gap-1 outline-none'
					: 'flex items-center justify-between rounded-sm bg-gray-200 p-4 outline-none focus:ring-2 focus:ring-gray-900',
				props.className
			)}
		>
			<SelectPrimitive.Value />
			<SelectPrimitive.Icon>
				<ChevronDown className="h-4 w-4" />
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
			className="relative flex select-none items-center justify-between space-x-2 rounded-sm p-4 data-[highlighted]:bg-gray-200"
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
}

function ScrollUpButton() {
	return (
		<SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center bg-gray-100 py-4">
			<ChevronUp className="h-4 w-4" />
		</SelectPrimitive.ScrollUpButton>
	);
}

function ScrollDownButton() {
	return (
		<SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center bg-gray-100 py-4">
			<ChevronDown className="h-4 w-4" />
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
