import Head from 'next/head';
import classNames from 'classnames';
import { Button } from '../components/button';

type GalleryFilterProps = React.PropsWithChildren<{
	selected?: boolean;
}>;

function GalleryFilter({ children, selected }: GalleryFilterProps) {
	return (
		<li
			className={classNames(
				'aspect-[4/3] w-full shrink-0 snap-center p-2 sm:h-[40vh] sm:w-auto',
				selected
					? 'inner-border-2 inner-border-black'
					: 'inner-border inner-border-gray-200'
			)}
		>
			<div className="flex h-full w-full items-end bg-gray-200 p-8">
				<p className="font-display text-lg">{children}</p>
			</div>
		</li>
	);
}

function Page() {
	return (
		<>
			<Head>
				<title>Inspiration Gallery — Millennium Paving Stones</title>
			</Head>

			<main className="space-y-32 px-8 md:px-24 lg:space-y-48 lg:px-32">
				<section className="space-y-24">
					<h1 className="text-center font-display text-4xl">
						Inspiration Gallery
					</h1>

					<div className="space-y-16">
						<p className="mx-auto max-w-[25ch] text-center font-display text-lg">
							Which types of projects would you like to see?
						</p>

						<ul className="no-scrollbar -mx-8 flex snap-x snap-mandatory gap-4 overflow-scroll px-8 lg:-mx-32 lg:px-32">
							<GalleryFilter>Walkways</GalleryFilter>
							<GalleryFilter>Pool Decks</GalleryFilter>
							<GalleryFilter selected>Driveways</GalleryFilter>
							<GalleryFilter>Plazas</GalleryFilter>
							<GalleryFilter>Gardens</GalleryFilter>
							<GalleryFilter>Patios</GalleryFilter>
						</ul>
					</div>
				</section>

				<section className="space-y-4 md:space-y-8">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
						<div className="mb-8 flex items-center md:col-span-3 md:mb-0 lg:col-span-2">
							<p className="font-display text-2xl">
								Get inspiration for your new driveway.
							</p>
						</div>

						<ul className="contents">
							<div className="h-[40vh] bg-gray-200 md:col-span-3 lg:col-span-2" />
							<div className="h-[40vh] bg-gray-200 md:col-span-3 lg:col-span-2" />
							<div className="h-[40vh] bg-gray-200 md:col-span-3" />
							<div className="h-[40vh] bg-gray-200 md:col-span-3" />
							<div className="h-[40vh] bg-gray-200 md:col-span-3 lg:col-span-2" />
							<div className="h-[40vh] bg-gray-200 md:col-span-3 lg:col-span-2" />
							<div className="h-[40vh] bg-gray-200 md:col-span-3 lg:col-span-2" />
						</ul>
					</div>

					<Button variant="secondary" className="mx-auto">
						See More
					</Button>
				</section>

				{/* Process */}
				<section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-32">
					<div className="flex-1 lg:order-2">
						<p className="font-display text-lg">Our Process</p>
						<h2 className="max-w-[20ch] font-display text-3xl">
							Starting from zero.
						</h2>

						<br />

						<p className="font-display text-lg">
							Integer a velit in sapien aliquam consectetur et vitae ligula.
							Integer ornare egestas enim a malesuada. Suspendisse arcu lectus,
							blandit nec gravida at, maximus ut lorem. Nulla malesuada vehicula
							neque at laoreet. Nullam efficitur mauris sit amet accumsan
							pulvinar.
						</p>

						<br />

						<Button variant="primary">Find an Installer</Button>
					</div>

					<div className="aspect-video w-full bg-gray-200 lg:w-[70vmin]"></div>
				</section>
			</main>
		</>
	);
}

export default Page;
