import { SplitSection } from './split';
import { Button } from '~/components/button';
import Link from 'next/link';

export function LocationsSection() {
	return (
		<SplitSection
			slot={
				<div className="flex items-center justify-center px-6 md:pr-0 lg:pl-16">
					<iframe
						src="https://snazzymaps.com/embed/500656"
						className="aspect-video w-full border border-gray-400 bg-gray-200 lg:w-5/6"
					/>
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
						<Link
							target="_blank"
							href="https://www.google.com/maps/dir/?api=1&destination=QVB&destination_place_id=ChIJzfGZtUE-244RDig1pOMvezw"
						>
							Get Directions
						</Link>
					</Button>
				</>
			}
		/>
	);
}
