import { cn } from '~/lib/utils';

function Main(props: React.PropsWithChildren<{ className?: string }>) {
	return (
		<main className={cn('px-6 2xl:container lg:px-16', props.className)}>
			{props.children}
		</main>
	);
}

export { Main };
