import { SplitSection } from './split';
import { Button } from '~/components/button';
import Link from 'next/link';

export function LocationsSection() {
	return (
		<SplitSection
			slot={
				<div className="flex items-center justify-end px-6 pb-16 md:pb-0 md:pr-0 lg:pl-16">
					<div className="aspect-video w-full border border-gray-400 bg-gray-200 lg:w-3/4" />
				</div>
			}
			tagline="Our Locations"
			heading="Where to buy."
			body="We operate from two locations, namely, our main office and showroom at 27 Mannings Hill Road, Kingston and our manufacturing plant in Yallahs, St Thomas."
			actions={
				<>
					<Button asChild intent="primary">
						<Link href="/contact">
							<span>Contact Us</span>
						</Link>
					</Button>
					<Button asChild intent="secondary">
						<Link href="/contact">Get Directions</Link>
					</Button>
				</>
			}
		/>
	);
}
