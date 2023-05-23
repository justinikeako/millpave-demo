import Link from 'next/link';
import { Logo } from './logo';
import { FacebookIcon, InstagramIcon } from 'lucide-react';

function Footer() {
	return (
		<footer className="mt-24 space-y-16 bg-gray-900 px-8 pb-16 pt-12 text-white md:px-24 md:pt-16 lg:mt-32 lg:px-32 lg:pt-24">
			<div className="flex flex-col justify-between gap-16 md:flex-row">
				<Link scroll={false} href="/">
					<Logo withText />
				</Link>

				<div className="flex flex-col flex-wrap gap-16 md:flex-row">
					<div>
						<h3 className="font-semibold">Follow us on social media</h3>
						<br />
						<ul className="flex grid-rows-2 gap-2">
							<li>
								<Link
									scroll={false}
									className="hover:text-gray-300 active:text-gray-400"
									href="https://www.facebook.com/millenniumpavingstones"
								>
									<FacebookIcon className="h-8 w-8" />
								</Link>
							</li>
							<li>
								<Link
									scroll={false}
									className="hover:text-gray-300 active:text-gray-400"
									href="http://www.instagram.com/millpave"
								>
									<InstagramIcon className="h-8 w-8" />
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

			<p className="text-center">
				<i>
					Products on the website are subject to availability and minimum order
					quantities. Please contact a Millennium professional for additional
					information. Product colours should be pulled from multiple pallets
					during installation as colours may vary from pallet to pallet. Colours
					shown on the website may vary from actual product colours. We
					recommend colour selections be made from actual product samples.
					Request a&nbsp;
					<Link
						scroll={false}
						href="/contact?form=samples"
						className="underline"
					>
						sample here
					</Link>
					.
				</i>
			</p>

			<div className="flex flex-wrap justify-between">
				<p>©2023 Millennium Paving Stones Ltd.</p>
				<p>
					Site by&nbsp;
					<Link
						scroll={false}
						className="underline"
						href="https://notprimitive.com"
					>
						Not Primitive
					</Link>
				</p>
			</div>
		</footer>
	);
}

export { Footer };
