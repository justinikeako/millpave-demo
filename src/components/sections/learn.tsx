import { Button } from '../button';
import Link from 'next/link';
import { Icon } from '../icon';
import { Balancer } from 'react-wrap-balancer';
import { ViewportReveal } from '../reveal';
import Image from 'next/image';

function LearnSection() {
	return (
		<ViewportReveal asChild>
			<section className="grid grid-cols-1 gap-4 py-16 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-3 xl:grid-cols-4 xl:grid-rows-none">
				<div className="banjo-grid group relative flex h-[32rem] shrink-0 flex-col items-start gap-3 bg-gray-600 p-6 text-white sm:col-span-2 sm:h-[28rem] sm:justify-between md:col-span-2 md:row-span-2 md:h-auto md:justify-start xl:row-span-full xl:h-[28rem] xl:justify-between">
					<div className="absolute bottom-0 right-0 h-3/5 w-full xs:h-full xs:w-3/5 md:w-3/4 xl:w-1/2">
						<Image
							src="/contractor.png"
							alt="A construction worker smiling into the distance wearing a high visibility vest and an orange hard hat."
							fill
							className="pointer-events-none object-contain object-bottom"
						/>
					</div>
					<div className="max-w-xs space-y-2">
						<Link
							href="/contractors"
							className="before:absolute before:inset-0"
						>
							<h3 className="font-display text-xl sm:text-2xl">
								Connect with certified professionals.
							</h3>
						</Link>
						<p>
							<Balancer>
								Find installers and delivery personnel and start your project
								off on the right foot.
							</Balancer>
						</p>
					</div>
					<Button
						asChild
						intent="primary"
						backdrop="dark"
						className="pointer-events-none"
					>
						<div>
							<span>Discover Contractors</span>
							<Icon
								name="arrow_right_alt"
								className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-0.5"
							/>
						</div>
					</Button>
				</div>

				<div className="group relative flex h-[28rem] shrink-0 flex-col items-start justify-end space-y-2 bg-gray-200 p-6 md:h-96 xl:h-[28rem]">
					<Image
						src="/resources.png"
						alt="Paving stones around a firepit"
						fill
						className="pointer-events-none object-contain object-top"
					/>
					<div className="max-w-xs space-y-1">
						<Link href="/resources" className="before:absolute before:inset-0">
							<h3 className="font-display text-lg">Resources</h3>
						</Link>
						<p>
							<Balancer>
								Peruse frequently asked questions, DIY guides and product cost
								calculators.
							</Balancer>
						</p>
					</div>
					<Button
						asChild
						intent="secondary"
						backdrop="light"
						className="pointer-events-none"
					>
						<div>Learn More</div>
					</Button>
				</div>

				<div className="group relative flex h-[28rem] shrink-0 flex-col items-start justify-start space-y-2 bg-gray-200 p-6 md:h-96 xl:h-[28rem]">
					<Image
						src="/blog.png"
						alt="Paving stones around a firepit"
						fill
						className="pointer-events-none object-contain object-bottom"
					/>
					<div className="max-w-xs space-y-1">
						<Link href="/blog" className="before:absolute before:inset-0">
							<h3 className="font-display text-lg">Why use paving stones?</h3>
						</Link>
						<p>
							<Balancer>
								Compare the benefits of paving stones to other paving solutions.
							</Balancer>
						</p>
					</div>

					<Button
						asChild
						intent="secondary"
						backdrop="light"
						className="pointer-events-none"
					>
						<div>Read the Article</div>
					</Button>
				</div>
			</section>
		</ViewportReveal>
	);
}

export { LearnSection };
