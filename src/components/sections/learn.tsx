import { Button } from '../button';
import Link from 'next/link';
import { Icon } from '../icon';
import { Balancer } from 'react-wrap-balancer';
import { ViewportReveal } from '../reveal';

function LearnSection() {
	return (
		<ViewportReveal asChild>
			<section className="flex gap-4 py-16">
				<div className="group relative flex h-96 flex-[2] flex-col items-start justify-between bg-gray-600 p-6 text-white">
					<div className="max-w-xs space-y-2">
						<Link
							href="/contractors"
							className="before:absolute before:inset-0"
						>
							<h3 className="font-display text-xl">
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
					<Button asChild intent="primary" backdrop="dark">
						<div>
							<span>Discover Contractors</span>
							<Icon
								name="arrow_right_alt"
								className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-1"
							/>
						</div>
					</Button>
				</div>

				<div className="group relative flex h-96 flex-[1] flex-col items-start justify-end space-y-2 bg-gray-200 p-6">
					<div className="space-y-1">
						<Link href="/resources" className="before:absolute before:inset-0">
							<h3 className="font-display text-lg">Resources</h3>
						</Link>
						<p>
							Peruse frequently asked questions, DIY guides and product cost
							calculators.
						</p>
					</div>
					<Button asChild intent="secondary" backdrop="light">
						<div>Learn More</div>
					</Button>
				</div>
				<div className="group relative flex h-96 flex-[1] flex-col items-start justify-start space-y-2 bg-gray-200 p-6">
					<div className="space-y-1">
						<Link
							href="/blog/why-use-pavers"
							className="before:absolute before:inset-0"
						>
							<h3 className="font-display text-lg">Why use paving stones?</h3>
						</Link>
						<p>
							Compare the benefits of paving stones to other paving solutions.
						</p>
					</div>

					<Button asChild intent="secondary" backdrop="light">
						<div>Read the Article</div>
					</Button>
				</div>
			</section>
		</ViewportReveal>
	);
}

export { LearnSection };
