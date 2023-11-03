'use client';

import { cn } from '~/lib/utils';

type StageFormProps = React.ComponentPropsWithoutRef<'form'>;

export function StageForm(props: StageFormProps) {
	return (
		<form
			{...props}
			id="stage-form"
			className={cn(
				'min-h-[100svh] px-6 py-24 md:py-32 lg:px-16',
				props.className
			)}
		>
			{props.children}
		</form>
	);
}
