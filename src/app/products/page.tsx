import { Footer } from '~/components/footer';
import { Button } from '~/components/button';
import { Main } from '~/components/main';
import { RevealContainer, Reveal } from '~/components/reveal';
import { Icon } from '~/components/icon';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select';
import { LearnSection } from '~/components/sections/learn';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { InspirationSection } from '~/components/sections/inspiration';
import { GetAQuoteSection } from '~/components/sections/get-a-quote';
import {
	Sheet,
	SheetBody,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '~/components/ui/sheet';
import { api } from '~/trpc/server';
import { notFound } from 'next/navigation';
import { ProductList } from './_components/product-list';
import { Filters } from './_components/filters';

export const runtime = 'experimental-edge';

export const metadata = {
	title: 'Product Catalogue — Millennium Paving Stones LTD.'
};

export default async function Page() {
	const products = await api.product.getByCategory({ categoryId: 'all' });

	if (!products) return notFound();

	return (
		<>
			<Main>
				<RevealContainer>
					<Reveal asChild delay={0.1}>
						<h1 className="py-16 text-center font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
							Product Catalogue
						</h1>
					</Reveal>

					<div className="flex flex-col gap-12 lg:flex-row lg:items-start">
						<Reveal asChild delay={0.2}>
							<aside className="hidden w-72 space-y-4 rounded-xl border border-gray-300 bg-gray-200 p-6 lg:block">
								<h2 className="font-display text-lg lg:text-xl">Filters</h2>

								<Filters />
							</aside>
						</Reveal>

						{/* Products */}
						<section className="flex-1 space-y-4">
							<Reveal asChild delay={0.3}>
								<div className="flex flex-wrap items-center justify-between gap-2">
									<h2 className="flex items-center gap-2 font-display text-lg lg:text-xl">
										<span>All Items</span>

										<Sheet>
											<SheetTrigger asChild>
												<Button intent="tertiary" className="lg:hidden">
													<span className="sr-only">Filters</span>
													<Icon name="tune" />
												</Button>
											</SheetTrigger>

											<SheetContent open={false} position="left">
												<SheetHeader>
													<SheetTitle className="flex-1">Filters</SheetTitle>

													<SheetClose asChild>
														<Button intent="tertiary" size="small">
															<span className="sr-only">Dismiss</span>
															<Icon name="close" />
														</Button>
													</SheetClose>
												</SheetHeader>

												<SheetBody className="space-y-4">
													<Filters />
												</SheetBody>
											</SheetContent>
										</Sheet>
									</h2>
									<div className="flex items-center gap-2">
										<p>Sort</p>
										<Select defaultValue="alphabetical">
											<SelectTrigger className="px-3 py-2">
												<SelectValue />
											</SelectTrigger>

											<SelectContent>
												<SelectItem value="popular">
													Most Popular First
												</SelectItem>
												<SelectItem value="alphabetical">
													Alphabetical (A - Z)
												</SelectItem>

												<SelectItem value="quantity">
													Quantity In Stock
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</Reveal>
							<Reveal delay={0.4} className="space-y-8">
								<ProductList
									initialData={{ pageParams: [], pages: [products] }}
								/>
							</Reveal>
						</section>
					</div>
				</RevealContainer>

				<GetAQuoteSection />
				<InspirationSection />
				<LearnSection />
				<AugmentedRealityGallerySection />
			</Main>

			<Footer />
		</>
	);
}
