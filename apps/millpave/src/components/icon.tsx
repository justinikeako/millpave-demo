import cx from 'classnames';
import React, { forwardRef, HTMLProps } from 'react';

type IconProps = {
	weight?: 300 | 400;
	opticalSize?: 20 | 24 | 40 | 48;
	grade?: -25 | 0 | 200;
	fill?: boolean;
	name: string;
} & HTMLProps<HTMLSpanElement>;

const Icon = forwardRef<HTMLSpanElement, React.PropsWithChildren<IconProps>>(
	function Icon(
		{
			weight = 400,
			opticalSize = 24,
			fill = false,
			grade = 0,
			name,
			className,
			...props
		},
		ref
	) {
		return (
			<span
				{...props}
				ref={ref}
				style={
					{
						'--weight': weight,
						'--optical-size': opticalSize,
						'--grade': grade,
						'--fill': Number(fill)
					} as React.CSSProperties
				}
				className={cx('material-symbols-outlined', className)}
			>
				{name}
			</span>
		);
	}
);

export default Icon;
