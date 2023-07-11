import { forwardRef } from 'react';
import { cn } from '~/lib/utils';

const Main = forwardRef<
	React.ComponentRef<'main'>,
	React.ComponentPropsWithoutRef<'main'>
>((props, ref) => {
	return (
		<main
			ref={ref}
			className={cn('px-6 2xl:container lg:px-16', props.className)}
		>
			{props.children}
		</main>
	);
});

Main.displayName = 'Main';

export { Main };
