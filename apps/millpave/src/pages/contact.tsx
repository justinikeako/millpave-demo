import Head from 'next/head';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import * as Select from '../components/select';
import { Button } from '../components/button';

function Page() {
	return (
		<>
			<Head>
				<title>Contact — Millennium Paving Stones</title>
			</Head>

			<Header />

			<main className="space-y-16 px-8 md:px-24 lg:space-y-32 lg:px-32">
				<h1 className="text-center font-display text-4xl">Get in touch.</h1>

				<div className="flex flex-col gap-16 lg:flex-row lg:gap-16">
					{/* Form */}
					<div className="top-8 flex-1 space-y-8">
						<h2 className="font-display text-xl">Contact Form</h2>

						<form className="space-y-8">
							<Select.Root defaultValue="QUOTE">
								<Select.Trigger className="w-full" />

								<Select.Content>
									<Select.ScrollUpButton />
									<Select.Viewport>
										<Select.Item value="QUOTE">
											I want to get a quote
										</Select.Item>
										<Select.Item value="PRESS">
											I&apos;m from the media
										</Select.Item>
									</Select.Viewport>
									<Select.ScrollDownButton />
								</Select.Content>
							</Select.Root>

							<Button variant="primary" type="submit" className="mx-auto">
								Submit
							</Button>
						</form>
					</div>

					{/* Locations */}
					<div className="top-8 flex-1 space-y-8 self-start lg:sticky lg:block">
						<h2 className="font-display text-xl">Millennium Locations</h2>
						<ul className="flex gap-4">
							<li>
								<span className="inline-grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-white">
									R
								</span>
								&nbsp;Retail
							</li>
							<li>
								<span className="inline-grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-white">
									M
								</span>
								&nbsp;Manufacturing
							</li>
						</ul>
						<ul className="flex flex-wrap gap-8">
							<li>
								<h3 className="font-semibold">
									Kingston, JA&nbsp;
									<span className="inline-grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-white">
										R
									</span>
								</h3>
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
							</li>

							<li>
								<h3 className="font-semibold">
									St. Thomas, JA&nbsp;
									<span className="inline-grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-white">
										M
									</span>
								</h3>
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
							</li>
						</ul>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}

export default Page;
