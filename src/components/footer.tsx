import Link from 'next/link';
import { Logo } from './logo';
import { FacebookIcon, InstagramIcon } from 'lucide-react';

function Footer() {
	return (
		<footer className="bg-gray-200 text-gray-900">
			<div className="space-y-16 px-8 pb-8 pt-8 2xl:container md:px-12 md:pt-16 lg:px-16 lg:pt-16">
				<div className="flex flex-col justify-between gap-16 md:flex-row">
					<Link scroll={false} href="/">
						<Logo variant="tagline" height="64" width="190" />
					</Link>

					<div className="flex flex-col flex-wrap gap-16 md:flex-row">
						<div>
							<h3 className="font-semibold">Follow us on social media</h3>
							<br />
							<ul className="flex grid-rows-2 gap-2">
								<li>
									<Link
										scroll={false}
										target="_blank"
										className="hover:text-gray-300 active:text-gray-400"
										href="https://www.facebook.com/millenniumpavingstones"
									>
										<FacebookIcon className="h-8 w-8" />
									</Link>
								</li>
								<li>
									<Link
										scroll={false}
										target="_blank"
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
					colour selections be made from actual product samples. Request
					samples&nbsp;
					<Link
						scroll={false}
						href="/contact?form=samples"
						className="underline"
					>
						here
					</Link>
					.
				</p>

				<div className="flex flex-wrap items-center justify-between text-gray-500">
					<p>©2023 Millennium Paving Stones Ltd.</p>
					<p>
						<Link
							scroll={false}
							target="_blank"
							href="https://notprimitive.com"
						>
							Website by&nbsp;
							<svg
								width="124"
								height="14"
								viewBox="0 0 124 14"
								className="inline-block"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0.0260001 13.5V0.809999H6.452L9.584 12.69H10.394L9.764 10.692V0.809999H13.04V13.5H6.614L3.482 1.62H2.672L3.302 3.618V13.5H0.0260001ZM13.6718 8.928C13.6718 5.706 15.9938 4.212 18.8558 4.212C21.6818 4.212 24.0218 5.706 24.0218 8.928C24.0218 12.186 21.6818 13.68 18.8558 13.68C15.9938 13.68 13.6718 12.186 13.6718 8.928ZM16.7498 8.928C16.7498 10.296 17.5958 10.962 18.8558 10.962C20.0798 10.962 20.9258 10.296 20.9258 8.928C20.9258 7.578 20.0798 6.93 18.8558 6.93C17.5958 6.93 16.7498 7.578 16.7498 8.928ZM32.3952 10.782V13.5H27.4992C26.4912 13.5 25.9332 12.942 25.9332 11.916V7.11H23.7372V4.392H25.9332V2.772L29.0112 1.8V4.392H32.0352V7.11H29.0112V10.8L32.3952 10.782ZM37.3823 13.5V0.809999H42.3863C46.3643 0.809999 48.1283 2.142 48.1283 5.436C48.1283 8.694 46.3643 10.026 42.3863 10.026H40.6583V13.5H37.3823ZM40.6583 7.164H42.5843C44.1683 7.164 44.8703 6.732 44.8703 5.436C44.8703 4.104 44.1683 3.672 42.5843 3.672H40.6583V7.164ZM48.5615 5.958C48.5615 4.932 49.1375 4.392 50.1635 4.392H56.2655V7.11H51.6575V13.5H48.5615V5.958ZM56.3074 13.5V10.782H58.8634V7.11H56.6314V4.392H60.1414C61.1314 4.392 61.7074 4.896 61.7074 5.904V10.782H64.2814V13.5H56.3074ZM58.2694 2.052C58.2694 1.008 58.9714 0.503999 60.0694 0.503999C61.1674 0.503999 61.9234 1.008 61.9234 2.052C61.9234 3.114 61.1674 3.6 60.0694 3.6C58.9714 3.6 58.2694 3.114 58.2694 2.052ZM64.8034 13.5V4.392H67.8814V5.202L67.3054 6.93H68.0614C68.4214 5.31 69.2314 4.212 71.0134 4.212C72.7414 4.212 73.4434 5.364 73.7134 6.93H74.2534C74.6134 5.31 75.3874 4.212 77.1694 4.212C79.5454 4.212 80.1934 6.39 80.1934 8.856V13.5H77.1154V9.054C77.1154 7.326 76.8454 6.93 75.8374 6.93C74.3254 6.93 74.0374 8.226 74.0374 10.404V13.5H70.9414L70.9594 13.464V9.054C70.9594 7.326 70.6894 6.93 69.6814 6.93C68.1694 6.93 67.8814 8.226 67.8814 10.404V13.5H64.8034ZM80.7951 13.5V10.782H83.3511V7.11H81.1191V4.392H84.6291C85.6191 4.392 86.1951 4.896 86.1951 5.904V10.782H88.7691V13.5H80.7951ZM82.7571 2.052C82.7571 1.008 83.4591 0.503999 84.5571 0.503999C85.6551 0.503999 86.4111 1.008 86.4111 2.052C86.4111 3.114 85.6551 3.6 84.5571 3.6C83.4591 3.6 82.7571 3.114 82.7571 2.052ZM96.0505 10.782V13.5H91.1545C90.1465 13.5 89.5885 12.942 89.5885 11.916V7.11H87.3925V4.392H89.5885V2.772L92.6665 1.8V4.392H95.6905V7.11H92.6665V10.8L96.0505 10.782ZM96.5113 13.5V10.782H99.0673V7.11H96.8353V4.392H100.345C101.335 4.392 101.911 4.896 101.911 5.904V10.782H104.485V13.5H96.5113ZM98.4733 2.052C98.4733 1.008 99.1753 0.503999 100.273 0.503999C101.371 0.503999 102.127 1.008 102.127 2.052C102.127 3.114 101.371 3.6 100.273 3.6C99.1753 3.6 98.4733 3.114 98.4733 2.052ZM111.36 4.392H114.384L112.17 13.5H105.78L103.548 4.392H106.644L108.624 12.726H109.398L111.36 4.392ZM114.086 8.91C114.086 5.976 116.102 4.212 118.928 4.212C122.078 4.212 123.896 5.922 123.896 8.784V9.594H117.182C117.29 10.728 117.956 11.358 119.072 11.358C120.026 11.358 120.674 10.98 120.854 10.278H123.914C123.662 12.294 121.88 13.68 119.072 13.68C115.994 13.68 114.086 11.754 114.086 8.91ZM117.182 8.01H120.89C120.8 7.002 120.098 6.444 119.018 6.444C117.956 6.444 117.254 7.002 117.182 8.01Z"
									fill="currentColor"
								/>
							</svg>
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}

export { Footer };
