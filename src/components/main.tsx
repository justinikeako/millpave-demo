import { cn } from '~/lib/utils';

function Main(props: React.PropsWithChildren<{ className?: string }>) {
	return (
		<main
			className={cn(
				'px-8 pt-8 md:px-24 md:pt-16 lg:px-32 2xl:px-48',
				props.className
			)}
		>
			{props.children}
		</main>
	);
}

export { Main };
