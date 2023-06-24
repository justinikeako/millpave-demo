import { SplitSection } from './split';
import { Button } from '~/components/button';
import { Icon } from '~/components/icon';
import Link from 'next/link';

export function LocationsSection() {
	return (
		<SplitSection
			slot={null}
			tagline="Our Locations"
			heading="Where to buy."
			body="We operate from two locations, namely, our main office and showroom at 27 Mannings Hill Road, Kingston and our manufacturing plant in Yallahs, St Thomas."
			actions={
				<>
					<Button asChild intent="primary">
						<Link href="/contact">
							<span>Contact Us</span>
							<Icon name="arrow_right_alt" />
						</Link>
					</Button>
					<Button asChild intent="secondary" >
						<Link href="/contact">Get Directions</Link>
					</Button>
				</>
			}
		/>
	);
}
