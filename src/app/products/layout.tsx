import { PrismaClient } from '@prisma/client';
import { OrchestratedReveal } from '@/components/orchestrated-reveal';
import { Chip } from './chip';

export const metadata = {
	title: 'Product Catalogue — Millennium Paving Stones'
};

async function getCategories() {
	const prisma = new PrismaClient({});

	const categories = await prisma.category.findMany({
		select: {
			id: true,
			displayName: true
		}
	});

	return [{ id: 'all', displayName: 'All Categories' }, ...categories];
}

type PageProps = React.PropsWithChildren;

async function Page({ children }: PageProps) {
	const categories = await getCategories();

	return (
		<main className="space-y-8 px-8 md:px-24 lg:space-y-16 lg:px-32">
			<OrchestratedReveal delay={0.1} asChild>
				<h1 className="text-center font-display text-4xl">Product Catalogue</h1>
			</OrchestratedReveal>

			<div className="flex flex-col items-center gap-8 lg:gap-12">
				<OrchestratedReveal delay={0.2} asChild>
					<div className="no-scrollbar -mx-8 self-stretch overflow-x-scroll">
						<ul className="mx-auto flex w-fit space-x-2  px-8">
							{categories?.map((category) => (
								<Chip key={category.id} categoryId={category.id}>
									{category.displayName}
								</Chip>
							))}
						</ul>
					</div>
				</OrchestratedReveal>

				{/* Products */}

				<OrchestratedReveal delay={0.3} className="space-y-16 self-stretch">
					{children}
				</OrchestratedReveal>
			</div>
		</main>
	);
}

export default Page;
