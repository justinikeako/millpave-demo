type IconProps = React.ComponentProps<'span'> & {
	name: string;
	weight?: 300 | 400;
	grade?: number;
	fill?: boolean;
	size?: number;
	opticalSize?: 20 | 24 | 40 | 48;
};

export function Icon({
	name,
	weight = 400,
	grade = 1,
	fill = false,
	size = 20,
	opticalSize = 24,
	...props
}: IconProps) {
	return (
		<span
			{...props}
			style={
				{
					fontSize: `${size}px`,
					'--weight': weight,
					'--grade': grade,
					'--optical-size': Math.min(48, opticalSize),
					'--fill': Number(fill)
				} as React.CSSProperties
			}
			className="material-symbols-outlined select-none"
		>
			{name}
		</span>
	);
}
