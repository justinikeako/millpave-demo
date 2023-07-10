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
import { RemoveScroll } from 'react-remove-scroll';

const NavLink = forwardRef<
	React.ComponentRef<typeof Link>,
	React.ComponentPropsWithoutRef<typeof Link>
>(function NavLink({ href, children, ...props }, ref) {
	return (
		<li className="contents">
			<Link
				{...props}
				href={href}
				ref={ref}
				className={cn('block', props.className)}
			>
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
			duration: 0.3,
			bounce: 0
		}
	},
	show: {
		opacity: 1,
		transition: {
			type: 'spring',
			duration: 0.3,
			bounce: 0
		}
	}
};

const list: Variants = {
	hide: {},
	show: {
		transition: {
			delayChildren: 0.1,
			staggerChildren: 0.05
		}
	}
};

const item: Variants = {
	hide: {
		opacity: 0,
		x: -50,
		transition: {
			type: 'spring',
			duration: 0.3,
			bounce: 0
		}
	},
	show: {
		opacity: 1,
		x: 0,
		transition: {
			type: 'spring',
			duration: 0.75,
			bounce: 0.2
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
	const [isTransparent, setTransparent] = useState(router.pathname === '/');

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
				data-minimal={minimal}
				data-transparent={isTransparent || undefined}
				className="group sticky top-0 z-20 -mb-px border-b border-gray-500/5 bg-gray-100/90 text-gray-900 transition-colors before:absolute before:inset-0 before:-z-10 before:backdrop-blur-sm before:transition-opacity data-[transparent]:border-transparent data-[transparent]:bg-transparent data-[transparent]:text-gray-100 data-[transparent]:before:opacity-0"
				ref={headerRef}
			>
				<OrchestratedReveal className="flex h-16 items-center px-6 2xl:container lg:px-16">
					<Dialog.Trigger asChild>
						<Button
							intent="tertiary"
							className="group-data-[minimal=true]:order-3 group-data-[transparent]:text-gray-100 group-data-[minimal=false]:lg:hidden"
						>
							<Icon name="menu" size={24} />
						</Button>
					</Dialog.Trigger>

					<div className="flex flex-1 justify-center group-data-[minimal=true]:justify-start lg:justify-start">
						<Link href="/" className="block w-fit">
							<Logo variant="text" className="max-sm:hidden" />
							<Logo className="sm:hidden" />
						</Link>
					</div>
					<nav className="flex select-none items-center justify-between group-data-[minimal=true]:hidden">
						{/* Desktop Links */}
						<ul className="flex flex-row items-center gap-4 bg-transparent px-0 max-lg:hidden">
							<NavLink href="/products">Products</NavLink>
							<NavLink href="/inspiration">Inspiration</NavLink>
							<NavLink href="/resources">Resources</NavLink>
							<NavLink href="/quote-studio">
								Get a Quote&nbsp;
								<span className="relative inline-block rounded-sm bg-gradient-to-t from-black/10 px-1 text-sm font-semibold before:absolute  before:inset-0 before:rounded-sm before:border before:border-black/10 before:gradient-mask-t-0 group-data-[transparent]:border-white/25 group-data-[transparent]:bg-gradient-to-b group-data-[transparent]:from-white/25 group-data-[transparent]:before:border-white/25 group-data-[transparent]:before:gradient-mask-b-0 ">
									New
								</span>
							</NavLink>
							<NavLink href="/contact">Contact</NavLink>
						</ul>
					</nav>
					<div className="flex items-center justify-end gap-4 lg:flex-1">
						<Button
							asChild
							intent="tertiary"
							className="group-data-[minimal=true]:hidden group-data-[transparent]:text-gray-100"
						>
							<Link href="/quote">
								<Icon name="shopping_cart" size={24} />
							</Link>
						</Button>
					</div>
				</OrchestratedReveal>
			</header>

			{/* Fullscreen Menu */}
			<AnimatePresence>
				{menuOpen && (
					<Dialog.DialogPortal forceMount>
						{/* This prevents scrolling outside of the menu */}
						<Dialog.Overlay />

						<Dialog.DialogContent forceMount asChild data-minimal={minimal}>
							<motion.div
								data-minimal={minimal}
								variants={variants.content}
								initial="hide"
								animate="show"
								exit="hide"
								className="group fixed inset-0 z-50 bg-gray-900 text-white"
							>
								<div
									className={cn(
										RemoveScroll.classNames.zeroRight,
										'fixed inset-x-0 z-10 bg-gray-900'
									)}
								>
									<div className="flex h-16 items-center justify-between px-6 2xl:container lg:px-16">
										<Dialog.Close asChild>
											<Button
												intent="tertiary"
												backdrop="dark"
												className="group-data-[minimal=true]:order-3 lg:order-3"
											>
												<Icon name="close-wght_300" size={24} />
											</Button>
										</Dialog.Close>

										<Link href="/" onClick={() => setMenuOpen(false)}>
											<div className="max-sm:hidden">
												<Logo variant="text" />
											</div>
											<div className="sm:hidden">
												<Logo />
											</div>
										</Link>

										<Button
											asChild
											intent="tertiary"
											backdrop="dark"
											onClick={() => setMenuOpen(false)}
											className="group-data-[minimal=true]:hidden lg:hidden"
										>
											<Link href="/quote">
												<Icon name="shopping_cart" size={24} />
											</Link>
										</Button>
									</div>
								</div>

								<div
									className={cn(
										RemoveScroll.classNames.zeroRight,
										'flex h-full flex-col overflow-y-auto px-6 py-24 md:px-16'
									)}
								>
									<motion.ul
										variants={variants.list}
										initial="hide"
										animate="show"
										className="my-auto flex flex-col gap-8 text-center font-display text-4xl md:text-5xl lg:text-6xl"
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
											href="/inspiration"
											onClick={() => setMenuOpen(false)}
										>
											Inspiration
										</MotionNavLink>
										<MotionNavLink
											variants={variants.item}
											href="/resources"
											onClick={() => setMenuOpen(false)}
										>
											Resources
										</MotionNavLink>
										<MotionNavLink
											variants={variants.item}
											href="/quote-studio"
											onClick={() => setMenuOpen(false)}
										>
											Get a Quote
										</MotionNavLink>
										<MotionNavLink
											variants={variants.item}
											href="/contact"
											onClick={() => setMenuOpen(false)}
										>
											Contact Us
										</MotionNavLink>
									</motion.ul>
								</div>
							</motion.div>
						</Dialog.DialogContent>
					</Dialog.DialogPortal>
				)}
			</AnimatePresence>
		</Dialog.Root>
	);
}

export { Header };
