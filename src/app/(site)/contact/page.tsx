import { Footer } from '~/components/footer';
import { Button } from '../../components/button';
import { Main } from '~/components/main';
import { Reveal, RevealContainer } from '~/components/reveal';
import { Icon } from '~/components/icon';
import Link from 'next/link';
import { GetAQuoteSection } from '~/components/sections/get-a-quote';
import { type Metadata } from 'next';
import { FormSelect } from './form-select';

type FormType = 'general' | 'media' | 'sample';

export const metadata: Metadata = {
	title: 'Contact — Millennium Paving Stones LTD.'
};

function Page({ searchParams }: { searchParams: { form: FormType } }) {
	const formType = searchParams.form || 'general';

	return (
		<>
			<RevealContainer asChild>
				<Main>
					<Reveal delay={0.1}>
						<h1 className="mt-16 text-center font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
							Get in touch.
						</h1>
					</Reveal>

					<div className="flex flex-col gap-16 py-16 md:flex-row">
						{/* Form */}
						<Reveal delay={0.2} className="top-8 flex-1 space-y-8">
							<h2 className="font-display text-lg lg:text-xl">Contact Form</h2>

							<form className="space-y-8">
								<div className="space-y-2">
									<label className="block font-semibold" htmlFor="nature">
										How can we help you?
									</label>
									<FormSelect value={formType} />
								</div>

								<div className="flex gap-4">
									<div className="flex-1 space-y-2">
										<label htmlFor="name" className="block font-semibold">
											What is your name?
										</label>
										<input
											id="name"
											type="text"
											className="h-12 w-full rounded-sm border border-gray-400 bg-gray-50 px-3 placeholder:text-gray-500 hover:border-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-pink-700"
											placeholder="E.g. Jane Doe"
										/>
									</div>
									<div className="flex-1 space-y-2">
										<label htmlFor="email" className="block font-semibold">
											What is your email?
										</label>
										<input
											id="email"
											type="email"
											className="h-12 w-full rounded-sm border border-gray-400 bg-gray-50 px-3 placeholder:text-gray-500 hover:border-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-pink-700"
											placeholder="E.g. janedoe@example.com"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="block font-semibold" htmlFor="inquiry">
										How can we help you?
									</label>
									<textarea
										id="inquiry"
										rows={7}
										placeholder="Describe your inquiry..."
										className="w-full rounded-sm border border-gray-400 bg-gray-50 p-3 placeholder:text-gray-500 hover:border-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-pink-700"
									/>
								</div>
								<Button intent="primary" type="submit" className="mx-auto">
									Submit
								</Button>
							</form>
						</Reveal>

						{/* Locations */}
						<Reveal
							delay={0.3}
							className="top-8 flex-1 space-y-8 self-start lg:sticky lg:block"
						>
							<h2 className="font-display text-lg lg:text-xl">
								Millennium Locations
							</h2>
							<iframe
								src="https://snazzymaps.com/embed/500656"
								className="aspect-video w-full border border-gray-400 bg-gray-200"
							/>
							<ul className="flex gap-4">
								<li className="flex items-center gap-1">
									<Icon name="retail_circle" />
									<span>Retail</span>
								</li>
								<li className="flex items-center gap-1">
									<Icon name="manufacturing_circle" />
									<span>Manufacturing</span>
								</li>
							</ul>
							<ul className="flex flex-wrap gap-8">
								<li className="space-y-5">
									<h3 className="flex items-center gap-1 font-semibold">
										<span>Kingston Showroom</span>
										<Icon name="retail_circle" />
									</h3>
									<p>
										Shop 1, 27 Mannings Hill Road <br /> Kingston 8
									</p>

									<ul>
										<li>Open 9 - 5 from Mon - Fri</li>
										<li> Open 10 - 3 on Sat</li>
									</ul>

									<ul>
										<li>
											Phone:&nbsp;
											<a href="tel:8769691716" className="underline">
												876-969-1716
											</a>
											&nbsp;/&nbsp;
											<a href="tel:8769697385" className="underline">
												876-969-7385
											</a>
										</li>
										<li>
											Cell:&nbsp;
											<a href="tel:8763612817" className="underline">
												876-361-2817
											</a>
										</li>
										<li>
											Fax:&nbsp;
											<a href="tel:8769319651" className="underline">
												876-931-9651
											</a>
										</li>
									</ul>

									<Button asChild intent="secondary" className="w-fit">
										<Link
											target="_blank"
											href="https://www.google.com/maps/dir/?api=1&destination=QVB&destination_place_id=ChIJzfGZtUE-244RDig1pOMvezw"
										>
											Get Directions
										</Link>
									</Button>
								</li>

								<li className="space-y-5">
									<h3 className="flex items-center gap-1 font-semibold">
										<span>St. Thomas Factory</span>
										<Icon name="manufacturing_circle" />
									</h3>
									<p>
										Lot 16, Yallahs Industrial Estates
										<br />
										Yallahs P.O. St. Thomas
									</p>
									<p>Open 9 - 5 from Mon - Fri</p>
									<ul>
										<li>
											Phone:&nbsp;
											<a href="tel:8767063284" className="underline">
												876-703-3151
											</a>
										</li>
										<li>
											Fax:&nbsp;
											<a href="tel:8767063284" className="underline">
												876-706-3284
											</a>
										</li>
									</ul>

									<Button asChild intent="secondary" className="w-fit">
										<Link
											target="_blank"
											href="https://www.google.com/maps/dir/?api=1&destination=17.876839,-76.551713"
										>
											Get Directions
										</Link>
									</Button>
								</li>
							</ul>
						</Reveal>
					</div>

					<GetAQuoteSection />
				</Main>
			</RevealContainer>

			<Footer />
		</>
	);
}

export default Page;
