import { forwardRef } from 'react';
import { cn } from '~/lib/utils';

export const FullWidthSection = forwardRef<
	React.ElementRef<'section'>,
	React.ComponentPropsWithoutRef<'section'>
>(function (props, ref) {
	return (
		<section {...props} ref={ref} className={cn('-mx-16', props.className)} />
	);
});

FullWidthSection.displayName = 'FullWidthSection';
