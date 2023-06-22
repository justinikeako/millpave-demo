import { cn } from '~/lib/utils';

function Main(props: React.PropsWithChildren<{ className?: string }>) {
	return (
		<main className={cn('px-16 2xl:container', props.className)}>
			{props.children}
		</main>
	);
}

export { Main };
