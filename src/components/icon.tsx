import { forwardRef } from 'react';
import { cn } from '~/lib/utils';

type IconProps = React.ComponentProps<'svg'> & {
	name: string;
	size?: number;
};

export const Icon = forwardRef<React.ElementRef<'svg'>, IconProps>(
	({ name, size = 20, ...props }, ref) => {
		return (
			<svg
				{...props}
				ref={ref}
				width={size}
				height={size}
				className={cn('inline-block fill-current', props.className)}
			>
				<use href={`/sprite.svg#${name}`} />
			</svg>
		);
	}
);

Icon.displayName = 'Icon';
