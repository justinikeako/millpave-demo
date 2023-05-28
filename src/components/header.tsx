import Link from 'next/link';
import { Button } from './button';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { forwardRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Logo } from './logo';
import { OrchestratedReveal } from './reveal';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavLinkProps = {
	href: string;
} & React.HTMLProps<HTMLLIElement>;

const NavLink = forwardRef<HTMLLIElement, NavLinkProps>(function NavLink(
	{ href, children, ...props },
	ref
) {
	return (
		<li ref={ref} {...props}>
			<Link scroll={false} href={href}>
				{children}
			</Link>
		</li>
	);
});

const content: Variants = {
	hide: {
		opacity: 0,
		transition: {
			type: 'spring',
			mass: 1,
			damping: 30,
			stiffness: 300
		}
	},
	show: {
		opacity: 1,
		transition: {
			type: 'spring',
			mass: 1,
			damping: 30,
			stiffness: 300
		}
	}
};

const list: Variants = {
	hide: {},
	show: {
		transition: {
			delayChildren: 0.1,
			staggerChildren: 0.075
		}
	}
};

const item: Variants = {
	hide: {
		opacity: 0,
		x: -25,
		transition: {
			type: 'spring',
			mass: 1,
			damping: 30,
			stiffness: 300
		}
	},
	show: {
		opacity: 1,
		x: 0,
		transition: {
			type: 'spring',
			mass: 1,
			damping: 30,
			stiffness: 300
		}
	}
};

const variants = {
	content,
	list,
	item
};

const MotionNavLink = motion(NavLink);

function Header({ simple }: { simple: boolean }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [promoOpen, setPromoOpen] = useState(true);

	return (
		<Dialog.Root open={menuOpen} modal onOpenChange={setMenuOpen}>
			{!simple && promoOpen && (
				<OrchestratedReveal asChild>
					<div className="relative flex flex-col items-center justify-center gap-4 bg-gray-900 p-4 text-white md:flex-row">
						<p>Prices from $203/ft² in our Summer Sale!</p>{' '}
						<div className="flex gap-2">
							<Button
								variant="primary"
								className="!bg-white !text-gray-900 hover:!bg-gray-100 active:!bg-gray-200"
								asChild
							>
								<Link scroll={false} href="/products/all">
									See all Deals
								</Link>
							</Button>
							<Button
								variant="secondary"
								className="border-gray-500 text-white hover:bg-gray-800 active:bg-gray-700 md:hidden"
								onClick={() => setPromoOpen(false)}
							>
								Dismiss
							</Button>
						</div>
						<Button
							variant="tertiary"
							className="absolute right-8 max-md:hidden"
							onClick={() => setPromoOpen(false)}
						>
							<X />
						</Button>
					</div>
				</OrchestratedReveal>
			)}
			<OrchestratedReveal asChild>
				<header
					className={cn('bg-white md:mt-4', !simple && 'sticky top-0 z-40')}
				>
					<nav className="flex select-none items-center justify-between px-8 py-4 md:px-24 lg:px-32">
						<Link scroll={false} href="/">
							{simple ? (
								<Logo />
							) : (
								<>
									<Logo withText className="max-sm:hidden" />
									<Logo className="sm:hidden" />
								</>
							)}
						</Link>

						{/* Desktop Links */}
						{!simple && (
							<ul className="flex flex-row items-center gap-8 bg-transparent px-0 font-normal text-gray-900 max-lg:hidden">
								<NavLink href="/products/all">Products</NavLink>
								<NavLink href="/gallery">Get Inspired</NavLink>
								<NavLink href="/#where-to-buy">Where to Buy</NavLink>
								<NavLink href="/contact">Contact Us</NavLink>
								<li>
									<Button variant="primary" asChild>
										<Link scroll={false} href="/quote-builder">
											Get A Quote
										</Link>
									</Button>
								</li>
							</ul>
						)}

						{/* Mobile Menu */}
						<AnimatePresence>
							{menuOpen && (
								<Dialog.DialogPortal forceMount>
									<Dialog.Overlay />
									<Dialog.DialogContent forceMount asChild>
										<motion.div
											variants={variants.content}
											initial="hide"
											animate="show"
											exit="hide"
											className="fixed inset-0 z-50 flex flex-col bg-gray-900 text-white"
										>
											<div className="flex items-center justify-between px-8 py-4 md:px-24 md:py-8">
												<Link
													scroll={false}
													href="/"
													onClick={() => setMenuOpen(false)}
												>
													<div className="max-sm:hidden">
														<Logo withText />
													</div>
													<div className="sm:hidden">
														<Logo />
													</div>
												</Link>

												<Dialog.Close asChild>
													<Button
														variant="tertiary"
														className="text-white active:bg-gray-800"
													>
														<X />
													</Button>
												</Dialog.Close>
											</div>

											<motion.ul
												variants={variants.list}
												initial="hide"
												animate="show"
												className="flex flex-1 flex-col items-start justify-center gap-8 px-16 text-3xl md:px-24"
											>
												<MotionNavLink
													variants={variants.item}
													href="/products/all"
													onClick={() => setMenuOpen(false)}
												>
													Products
												</MotionNavLink>
												<MotionNavLink
													variants={variants.item}
													href="/gallery"
													onClick={() => setMenuOpen(false)}
												>
													Get Inspired
												</MotionNavLink>
												<MotionNavLink
													variants={variants.item}
													href="/#where-to-buy"
													onClick={() => setMenuOpen(false)}
												>
													Where to Buy
												</MotionNavLink>
												<MotionNavLink
													variants={variants.item}
													href="/contact"
													onClick={() => setMenuOpen(false)}
												>
													Contact Us
												</MotionNavLink>
												<MotionNavLink
													variants={variants.item}
													href="/quote-builder"
													onClick={() => setMenuOpen(false)}
												>
													Get A Quote
												</MotionNavLink>
											</motion.ul>
										</motion.div>
									</Dialog.DialogContent>
								</Dialog.DialogPortal>
							)}
						</AnimatePresence>

						<Dialog.Trigger asChild>
							<Button
								variant="tertiary"
								className={simple ? undefined : 'lg:hidden'}
							>
								<Menu />
							</Button>
						</Dialog.Trigger>
					</nav>
				</header>
			</OrchestratedReveal>
		</Dialog.Root>
	);
}

export { Header };
