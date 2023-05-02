import { cn } from '@/lib/utils';

type SectionProps = {
	heading: string;
} & React.HTMLAttributes<HTMLElement>;
export function Section({
	heading,
	children,
	...props
}: React.PropsWithChildren<SectionProps>) {
	return (
		<section className={cn('space-y-2', props.className)}>
			<h2 className="text-lg">{heading}</h2>
			{children}
		</section>
	);
}
