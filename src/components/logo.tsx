type LogoVariant = 'mark' | 'text' | 'tagline';

type LogoProps = React.ComponentProps<'svg'> & { variant?: LogoVariant };

const variantDimensions: {
	[key in LogoVariant]: { width: number; height: number };
} = {
	mark: { width: 36, height: 36 },
	text: { width: 143, height: 36 },
	tagline: { width: 143, height: 48 }
};

function Logo({ variant = 'mark', ...props }: LogoProps) {
	return (
		<svg
			{...variantDimensions[variant]}
			className="fill-current"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			{variant === 'mark' && <use href="/sprite.svg#mark" />}
			{variant === 'text' && <use href="/sprite.svg#mark_with_text" />}
			{variant === 'tagline' && (
				<use href="/sprite.svg#mark_with_text_and_tagline" />
			)}
		</svg>
	);
}

export { Logo };
