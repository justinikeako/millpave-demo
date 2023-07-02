import { forwardRef } from 'react';
import { Icon } from '~/components/icon';
import { cn } from '~/lib/utils';

export type CheckboxProps = React.ComponentProps<'input'> & {
	name: string;
	value: string;
};

export const Checkbox = forwardRef<React.ElementRef<'input'>, CheckboxProps>(
	({ name, value, className, ...props }, ref) => {
		const inputId = name + ':' + value;

		return (
			<label htmlFor={inputId}>
				<input
					{...props}
					type="checkbox"
					ref={ref}
					name={name}
					value={value}
					id={inputId}
					className="peer sr-only"
				/>

				<div
					className={cn(
						'group relative h-5 w-5 rounded-sm border border-gray-400 bg-gray-100 from-white/50 text-gray-100 outline-2 outline-gray-900 hover:border-gray-500 active:border-gray-600 peer-checked:!border-pink-700 peer-checked:bg-pink-600 peer-checked:bg-gradient-to-b peer-checked:hover:from-white/60 peer-checked:active:bg-gradient-to-t peer-checked:active:from-white/25 peer-focus-visible:outline',
						className
					)}
				>
					<Icon name="check_small" className="relative -left-px -top-px" />
				</div>
			</label>
		);
	}
);
