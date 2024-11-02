'use client';

import { Icon } from '~/components/icon';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Checkbox, type CheckboxProps } from '~/components/checkbox';
import {
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	Sheet,
	SheetBody,
	SheetTrigger
} from '~/components/ui/sheet';
import { Button } from '~/components/button';
import { useState } from 'react';

type FilterProps = Omit<CheckboxProps, 'slot'> & {
	slot?: React.ReactNode;
};

function Filter({ name, value, children, slot, ...props }: FilterProps) {
	return (
		<li className="flex h-6 gap-2 md:h-5">
			<Checkbox {...props} name={name} value={value} />
			<label
				htmlFor={name + ':' + value}
				className="flex flex-1 select-none justify-between gap-2"
			>
				{children}
				{slot}
			</label>
		</li>
	);
}

type ColorFilterProps = FilterProps & {
	swatch: string;
};

function ColorFilter({ swatch: color, ...props }: ColorFilterProps) {
	return (
		<Filter
			{...props}
			slot={
				<div
					aria-hidden
					className="h-4 w-4 rounded-full shadow-sm shadow-gray-900/25 ring-1 ring-gray-900/20"
					style={{ background: color }}
				/>
			}
		/>
	);
}

type FilterGroupProps = React.PropsWithChildren<{
	displayName: string;
	collapsible?: boolean;
}>;

function FilterGroup({
	collapsible,
	displayName: name,
	children
}: FilterGroupProps) {
	return (
		<Collapsible.Root
			className="group space-y-3 data-[state=open]:pb-4"
			defaultOpen
			disabled={collapsible === undefined}
		>
			<Collapsible.Trigger className="sm:active:bg-gray pointer-events-none -mx-4 -my-2 flex w-[calc(100%+32px)] items-end justify-between rounded-md px-4 py-2 hover:bg-gray-300/50 active:bg-gray-500/25 disabled:!bg-transparent lg:pointer-events-auto">
				<span className="font-semibold">{name}</span>

				<div className="hidden lg:block">
					<Icon
						name="chevron_down"
						className="hidden group-data-[state=closed]:block group-data-[disabled]:!hidden"
					/>
					<Icon
						name="chevron_up"
						className="hidden group-data-[state=open]:block group-data-[disabled]:!hidden"
					/>
				</div>
			</Collapsible.Trigger>
			<Collapsible.Content>{children}</Collapsible.Content>
		</Collapsible.Root>
	);
}

export function Filters() {
	return (
		<>
			{/* Categories */}
			<FilterGroup displayName="Categories" collapsible>
				<ul className="space-y-2">
					<Filter name="categories" value="all" defaultChecked>
						All
					</Filter>
					<Filter name="categories" value="pavers" defaultChecked>
						Paving Stones
					</Filter>
					<Filter name="categories" value="slabs" defaultChecked>
						Slabs
					</Filter>
					<Filter name="categories" value="blocks" defaultChecked>
						Blocks
					</Filter>
					<Filter name="categories" value="maintenance" defaultChecked>
						Maintenance
					</Filter>
					<Filter name="categories" value="cleaning" defaultChecked>
						Cleaning
					</Filter>
				</ul>
			</FilterGroup>

			{/* Price per ft² */}
			<FilterGroup displayName="Price per ft²" collapsible>
				<div className="flex max-w-md gap-2">
					<div className="flex flex-1 items-center gap-2">
						<label htmlFor="min-price">Min:</label>
						<label
							htmlFor="min-price"
							className="flex h-10 flex-1 items-center gap-0.5 rounded-sm border border-gray-400 bg-gray-100 px-2 pr-1 placeholder:text-gray-500 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-pink-700"
						>
							<span className="inline-block text-gray-500">$</span>
							<input
								id="min-price"
								type="number"
								placeholder="0"
								className="no-arrows w-full flex-1 bg-transparent outline-none placeholder:text-gray-500"
							/>
						</label>
					</div>
					<div className="flex flex-1 items-center gap-2">
						<label htmlFor="max-price">Max:</label>
						<label
							htmlFor="max-price"
							className="flex h-10 flex-1 items-center gap-0.5 rounded-sm border border-gray-400 bg-gray-100 px-2 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-pink-700"
						>
							<span className="inline-block text-gray-500">$</span>

							<input
								id="max-price"
								type="number"
								placeholder="Infinity"
								className="no-arrows w-full flex-1 bg-transparent outline-none placeholder:text-gray-500"
							/>
						</label>
					</div>
				</div>
			</FilterGroup>

			{/* Strength */}
			<FilterGroup displayName="Rated Strength" collapsible>
				<ul className="space-y-2">
					<Filter name="weight_rating" value="any" defaultChecked>
						Any
					</Filter>
					<Filter name="weight_rating" value="commercial" defaultChecked>
						Commercial Grade
					</Filter>
					<Filter name="weight_rating" value="residential" defaultChecked>
						Residential Grade
					</Filter>
					<Filter name="weight_rating" value="lightweight" defaultChecked>
						Lightweight
					</Filter>
				</ul>
			</FilterGroup>

			{/* Colors 🌈 */}
			<FilterGroup displayName="Colors" collapsible>
				<ul className="space-y-2">
					<Filter name="colors" value="all" defaultChecked>
						All
					</Filter>
					<ColorFilter
						name="colors"
						value="grey"
						swatch="#D9D9D9"
						defaultChecked
					>
						Grey
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="ash"
						swatch="#B1B1B1"
						defaultChecked
					>
						Ash
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="charcoal"
						swatch="#696969"
						defaultChecked
					>
						Charcoal
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="spanish_brown"
						swatch="#95816D"
						defaultChecked
					>
						Spanish Brown
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="sunset_taupe"
						swatch="#C9B098"
						defaultChecked
					>
						Sunset Taupe
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="tan"
						swatch="#DDCCBB"
						defaultChecked
					>
						Tan
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="sunset_clay"
						swatch="#E7A597"
						defaultChecked
					>
						Sunset Clay
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="red"
						swatch="#EF847A"
						defaultChecked
					>
						Red
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="terracotta"
						swatch="#EFA17A"
						defaultChecked
					>
						Terracotta
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="orange"
						swatch="#EBB075"
						defaultChecked
					>
						Orange
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="sunset_tangerine"
						swatch="#E7C769"
						defaultChecked
					>
						Sunset Tangerine
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="yellow"
						swatch="#E7DD69"
						defaultChecked
					>
						Yellow
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="green"
						swatch="#A9D786"
						defaultChecked
					>
						Green
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="custom_blend"
						swatch="conic-gradient(from 180deg at 50% 50.00%, #EF847A 0deg, #E7DD69 72.0000010728836deg, #A9D786 144.0000021457672deg, #959ECB 216.00000858306885deg, #EF7AA4 288.0000042915344deg, #EF847A 360deg)"
						defaultChecked
					>
						Custom Blend
					</ColorFilter>
				</ul>
			</FilterGroup>

			{/* Misc */}
			<FilterGroup displayName="Misc">
				<ul className="space-y-2">
					<Filter name="has_models" value="true">
						Has 3D Models
					</Filter>
				</ul>
			</FilterGroup>
		</>
	);
}

export function FilterSheet() {
	const [open, setOpen] = useState(false);

	return (
		<Sheet onOpenChange={() => setOpen(!open)} open={open}>
			<SheetTrigger asChild>
				<Button intent="tertiary" className="lg:hidden">
					<span className="sr-only">Filters</span>
					<Icon name="tune" />
				</Button>
			</SheetTrigger>
			<SheetContent open={open} position="left">
				<SheetHeader>
					<SheetTitle className="flex-1">Filters</SheetTitle>

					<SheetClose asChild>
						<Button intent="tertiary" size="small">
							<span className="sr-only">Dismiss</span>
							<Icon name="close" />
						</Button>
					</SheetClose>
				</SheetHeader>

				<SheetBody className="space-y-4">
					<Filters />
				</SheetBody>
			</SheetContent>
		</Sheet>
	);
}
