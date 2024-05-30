'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { VariantPicker, SkuPickerProvider } from '~/components/sku-picker';
import { cn } from '~/lib/utils';
import { type VariantIdTemplate } from '~/types/product';

export function SkuPicker({
	skuId,
	variantIdTemplate
}: {
	skuId: string;
	variantIdTemplate: VariantIdTemplate;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	return (
		<SkuPickerProvider
			skuId={skuId}
			onChange={({ newVariantId }) => {
				const newSearchParams = new URLSearchParams(searchParams);
				newSearchParams.set('sku', newVariantId);

				router.replace(pathname + '?' + newSearchParams.toString(), {
					scroll: false
				});
			}}
		>
			<VariantPicker variantIdTemplate={variantIdTemplate} section={Section} />
		</SkuPickerProvider>
	);
}

type SectionProps = {
	heading: string;
} & React.HTMLAttributes<HTMLElement>;

function Section({
	heading,
	children,
	...props
}: React.PropsWithChildren<SectionProps>) {
	return (
		<section className={cn('space-y-4', props.className)}>
			<h2 className="font-display text-lg lg:text-xl">{heading}</h2>
			{children}
		</section>
	);
}
