import Link from 'next/link';
import { Logo } from './logo';
import { Icon } from './icon';

function Footer() {
	return (
		<footer className="bg-gray-200 text-gray-900">
			<div className="space-y-16 px-6 pb-8 pt-8 2xl:container md:pt-12 lg:px-16 lg:pt-16">
				<div className="flex flex-col justify-between gap-16 md:flex-row">
					<Link href="/">
						<Logo variant="tagline" height="64" width="190" />
					</Link>

					<div className="flex flex-col flex-wrap gap-16 md:flex-row">
						<div>
							<h3 className="font-semibold">Follow us on social media</h3>
							<br />
							<ul className="flex grid-rows-2 gap-2">
								<li>
									<Link
										target="_blank"
										className="hover:text-gray-700 active:text-gray-500"
										href="https://www.facebook.com/millenniumpavingstones"
									>
										<Icon name="facebook" size={32} />
									</Link>
								</li>
								<li>
									<Link
										target="_blank"
										className="hover:text-gray-700 active:text-gray-500"
										href="http://www.instagram.com/millpave"
									>
										<Icon name="instagram" size={32} />
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold">Kingston Showroom</h3>
							<br />
							<p>
								Shop 1, 27 Mannings Hill Road <br /> Kingston 8
							</p>
							<br />
							<p>Open 9 - 5 from Mon - Fri</p>
							<p>Open 10 - 3 on Sat</p>
							<br />
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
						</div>

						<div>
							<h3 className="font-semibold">St. Thomas Factory</h3>
							<br />
							<p>
								Shop 1, 27 Mannings Hill Road <br /> Kingston 8
							</p>
							<br />
							<p>Open 9 - 5 from Mon - Fri</p>
							<br />
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
						</div>
					</div>
				</div>

				<p className="mx-auto max-w-2xl text-center italic text-gray-500">
					Products on the website are subject to availability and minimum order
					quantities. Please contact Millennium for additional information.
					Product colours should be pulled from multiple pallets during
					installation as colours may vary from pallet to pallet. Colours shown
					on the website may vary from actual product colours. We recommend
					colour selections be made from actual product samples.&nbsp;
					<Link href="/contact?form=samples" className="underline">
						Request samples here
					</Link>
					.
				</p>

				<div className="flex flex-wrap items-center justify-between gap-1 text-gray-500">
					<p>©2023 Millennium Paving Stones Ltd.</p>
					<p>
						<Link
							target="_blank"
							href="https://notprimitive.com"
							className="flex items-center gap-1.5"
						>
							<span>
								Website by <span className="sr-only">Not Primitive</span>
							</span>

							<svg
								width="124"
								height="14"
								className="inline-block fill-current"
								xmlns="http://www.w3.org/2000/svg"
							>
								<use href="/sprite.svg#not_primitive" />
							</svg>
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}

export { Footer };
