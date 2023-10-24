import { ViewportReveal } from '~/components/reveal';
import { Footer } from '~/components/footer';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { Button } from '~/components/button';
import { ProductCard } from '~/components/product-card';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { InspirationSection } from '~/components/sections/inspiration';
import { LocationsSection } from '~/components/sections/locations';
import { LearnSection } from '~/components/sections/learn';
import { Main } from '~/components/main';
import { FullWidthSection } from '~/components/sections/full-width';
import { HorizontalScroller } from '~/components/horizontal-scroller';
import { GetAQuoteSection } from '~/components/sections/get-a-quote';
import { Hero } from '~/components/hero';

function Page() {
	return (
		<>
			<Main>
				<Hero />

				<ViewportReveal asChild>
					<FullWidthSection className="space-y-8 p-6 lg:space-y-12 lg:p-16">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<h2 className="font-display text-4xl sm:text-6xl md:text-6xl">
								Products
							</h2>
							<p className="w-80 self-end text-right font-display text-lg">
								<Balancer>
									Our concrete pavers can turn your outdoor walkway, deck,
									patio, or plaza into a functional work of art.
								</Balancer>
							</p>
						</div>
						<HorizontalScroller className="gap-4" snap>
							<ProductCard
								name="Colonial Classic"
								startingSku={{ price: 203, unit: 'sqft' }}
								productId="colonial_classic"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Banjo"
								startingSku={{ price: 219, unit: 'sqft' }}
								productId="banjo"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Heritage Series"
								startingSku={{ price: 219, unit: 'sqft' }}
								productId="heritage"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Cobble Mix"
								startingSku={{ price: 219, unit: 'sqft' }}
								productId="cobble_mix"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Old World Cobble"
								startingSku={{ price: 203, unit: 'sqft' }}
								productId="owc"
								className="w-80 shrink-0 grow snap-center"
							/>
						</HorizontalScroller>
						<Button intent="secondary" className="mx-auto w-fit" asChild>
							<Link href="/products">View All Products</Link>
						</Button>
					</FullWidthSection>
				</ViewportReveal>

				<GetAQuoteSection />
				<InspirationSection />

				<LocationsSection />

				<LearnSection />

				<AugmentedRealityGallerySection />
			</Main>

			<Footer />
		</>
	);
}

export default Page;
