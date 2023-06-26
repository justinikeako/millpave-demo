import Link from 'next/link';
import { Button } from './button';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { forwardRef, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Logo } from './logo';
import { OrchestratedReveal } from './reveal';
import { Icon } from './icon';
import { useRouter } from 'next/router';
import { cn } from '~/lib/utils';

type NavLinkProps = {
	href: string;
} & React.HTMLProps<HTMLLIElement>;

const NavLink = forwardRef<HTMLLIElement, NavLinkProps>(function NavLink(
	{ href, children, ...props },
	ref
) {
	return (
		<li ref={ref} {...props}>
			<Link href={href}>{children}</Link>
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

function Header({ minimal }: { minimal: boolean }) {
	const headerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);
	const [isTransparent, setTransparent] = useState(false);

	useEffect(() => {
		const headerElement = headerRef.current;
		if (!headerElement) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const isIntersecting =
						entry.isIntersecting || entry.intersectionRatio > 0;

					setTransparent(isIntersecting);
				});
			},
			{ threshold: 0 } // Adjust the threshold as needed
		);

		const targetElements = document.querySelectorAll(
			'[data-header-transparent]'
		);

		targetElements.forEach((targetElement) => {
			observer.observe(targetElement);
		});

		if (targetElements.length === 0) setTransparent(false);

		return () => {
			targetElements.forEach((targetElement) => {
				observer.unobserve(targetElement);
			});
		};
	}, [router.asPath]);

	return (
		<Dialog.Root open={menuOpen} modal onOpenChange={setMenuOpen}>
			<header
				data-transparent={isTransparent || undefined}
				className="group sticky top-0 z-10 bg-gray-100 text-gray-900 transition-colors data-[transparent]:bg-transparent data-[transparent]:text-gray-100"
				ref={headerRef}
			>
				<OrchestratedReveal className="flex px-16 py-4 2xl:container">
					<div className="flex-1">
						<Link href="/" className="block w-fit">
							<Logo variant="text" className="max-sm:hidden" />
							<Logo className="sm:hidden" />
						</Link>
					</div>
					{!minimal && (
						<nav className="flex select-none items-center justify-between">
							{/* Desktop Links */}
							<ul className="flex flex-row items-center gap-4 bg-transparent px-0 font-normal max-lg:hidden">
								<NavLink href="/products">Products</NavLink>
								<NavLink href="/gallery">Inspiration</NavLink>
								<NavLink href="/resources">Resources</NavLink>
								<NavLink href="/quote-builder">
									Get a Quote&nbsp;
									<span className="relative inline-block rounded-sm bg-gradient-to-t from-black/10 px-1 text-sm font-semibold before:absolute  before:inset-0 before:rounded-sm before:border before:border-black/10 before:gradient-mask-t-0 group-data-[transparent]:border-white/25 group-data-[transparent]:bg-gradient-to-b group-data-[transparent]:from-white/25 group-data-[transparent]:before:border-white/25 group-data-[transparent]:before:gradient-mask-b-0 ">
										New
									</span>
								</NavLink>
								<NavLink href="/contact">Contact</NavLink>
							</ul>
						</nav>
					)}
					<div className="flex flex-1 items-center justify-end gap-4">
						{!minimal && (
							<Button
								intent="tertiary"
								asChild
								className="group-data-[transparent]:text-gray-100"
							>
								<Link href="/quote">
									<Icon name="shopping_cart" size={24} />
								</Link>
							</Button>
						)}
						<Dialog.Trigger asChild>
							<Button
								intent="tertiary"
								className={cn(
									'group-data-[transparent]:text-gray-100 ',
									!minimal && 'lg:hidden'
								)}
							>
								<Icon name="menu" size={24} />
							</Button>
						</Dialog.Trigger>
					</div>
				</OrchestratedReveal>
			</header>

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
									<Link href="/" onClick={() => setMenuOpen(false)}>
										<div className="max-sm:hidden">
											<Logo variant="text" />
										</div>
										<div className="sm:hidden">
											<Logo />
										</div>
									</Link>

									<Dialog.Close asChild>
										<Button
											intent="tertiary"
											className="text-white active:bg-gray-800"
										>
											<Icon name="close" />
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
										href="/products"
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
		</Dialog.Root>
	);
}

export { Header };
