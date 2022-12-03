function Footer() {
	return (
		<footer className="mt-24 space-y-16 bg-gray-900 px-8 pt-12 pb-16 text-white md:px-24 md:pt-16 lg:mt-32 lg:px-32 lg:pt-24">
			<div className="flex flex-col justify-between md:flex-row md:space-x-16">
				<span className="text-xl font-bold ">Logo</span>

				<div className="flex flex-col flex-wrap space-y-16 md:flex-row md:gap-16 md:space-y-0">
					<div>
						<h3 className="font-semibold">Follow us on social media</h3>
						<br />
						<ul className="flex grid-rows-2 gap-2">
							<li className="h-16 w-16 bg-white" />
							<li className="h-16 w-16 bg-white" />
							<li className="h-16 w-16 bg-white" />
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
					Colours on the website are subject to availability and minimum order
					quantities. Please contact a Millennium professional for additional
					information. Product colours should be pulled from multiple pallets
					during installation as colours may vary from pallet to pallet. Colours
					shown on the website may vary from actual product colours. We
					recommend colour selections be made from actual product samples.
					Request a sample here.
				</i>
			</p>

			<div className="flex flex-wrap justify-between">
				<p>©2022 Millennium Paving Stones Ltd.</p>
				<p>Site by Not Primitive</p>
			</div>
		</footer>
	);
}

export { Footer };
