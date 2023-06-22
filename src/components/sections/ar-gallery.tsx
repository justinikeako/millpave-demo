import { SplitSection } from './split';
import { Button } from '~/components/button';
import { Icon } from '~/components/icon';
import Link from 'next/link';

export function AugmentedRealityGallerySection() {
	return (
		<SplitSection
			slot={null}
			tagline="AR Sample Gallery"
			heading="See our pavers in your space."
			body="Use your smartphone camera to visualize and virtually place paving stones in real-time, right in your own space."
			actions={
				<Button asChild intent="primary" className="w-fit">
					<Link href="/contact">
						<span>Try it Out</span>
						<Icon name="arrow_right_alt" />
					</Link>
				</Button>
			}
		/>
	);
}
