import { SplitSection } from './split';
import { Button } from '~/components/button';
import { Icon } from '~/components/icon';
import Link from 'next/link';
import Image from 'next/image';

export function AugmentedRealityGallerySection() {
	return (
		<SplitSection
			slot={
				<div className="relative aspect-square py-0 md:aspect-auto">
					<Image
						src="/ar.png"
						alt="An iPhone featuring a patio design in augmented reality"
						fill
						sizes="(max-width: 480px) 90vw, (max-width: 768px) 50vw, (max-width: 1536px) 33vw"
						className="object-contain"
					/>
				</div>
			}
			tagline="AR Sample Gallery"
			heading="See our pavers in your space."
			body="Use your smartphone camera to visualize and virtually place paving stones in real-time, right in your own space."
			actions={
				<Button asChild intent="primary" className="group w-fit">
					<Link href="/ar-gallery">
						<span>Try it Out</span>
						<Icon
							name="arrow_right_alt"
							className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-1"
						/>
					</Link>
				</Button>
			}
		/>
	);
}
