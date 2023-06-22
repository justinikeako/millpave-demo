import { Button } from '../button';
import Link from 'next/link';
import { Icon } from '../icon';
import { Balancer } from 'react-wrap-balancer';
import { ViewportReveal } from '../reveal';

function LearnSection() {
	return (
		<ViewportReveal asChild>
			<section className="flex gap-4 py-16">
				<Link
					href="/contractors"
					className="flex h-96 flex-[2] flex-col items-start justify-between bg-gray-600 p-6 text-white"
				>
					<div className="max-w-xs space-y-2">
						<h3 className="font-display text-xl">
							Connect with certified professionals.
						</h3>
						<p>
							<Balancer>
								Find installers and delivery personnel and start your project
								off on the right foot.
							</Balancer>
						</p>
					</div>
					<Button asChild intent="primary" backdrop="dark">
						<div>
							<span>Discover Contractors</span> <Icon name="arrow_right_alt" />
						</div>
					</Button>
				</Link>

				<Link
					href="/resources"
					className="flex h-96 flex-[1] flex-col items-start justify-end space-y-2 bg-gray-200 p-6"
				>
					<div className="space-y-1">
						<h3 className="font-display text-lg">Resources</h3>
						<p>
							Peruse frequently asked questions, DIY guides and product cost
							calculators.
						</p>
					</div>
					<Button asChild intent="secondary" backdrop="light">
						<div>Learn More</div>
					</Button>
				</Link>
				<Link
					href="/blog/why-use-pavers"
					className="flex h-96 flex-[1] flex-col items-start justify-start space-y-2 bg-gray-200 p-6"
				>
					<div className="space-y-1">
						<h3 className="font-display text-lg">Why use paving stones?</h3>
						<p>
							Compare the benefits of paving stones to other paving solutions.
						</p>
					</div>
					<Button asChild intent="secondary" backdrop="light">
						<div>Read the Article</div>
					</Button>
				</Link>
			</section>
		</ViewportReveal>
	);
}

export { LearnSection };
