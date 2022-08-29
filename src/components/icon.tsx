import { forwardRef, HTMLProps } from 'react';

type IconProps = {
	weight?: 'normal' | 'bold';
	name: string;
} & HTMLProps<HTMLSpanElement>;

const classes = {
	normal: 'font-light',
	bold: 'font-normal'
};

const Icon = forwardRef<HTMLSpanElement, React.PropsWithChildren<IconProps>>(
	function Icon({ weight = 'bold', name, className, ...props }, ref) {
		return (
			<span
				{...props}
				ref={ref}
				className={`material-symbols-outlined ${classes[weight]} ${className}`}
			>
				{name}
			</span>
		);
	}
);

export default Icon;
