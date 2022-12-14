import Link from 'next/link';
import { Button } from './button';
import { MdClose, MdMenu } from 'react-icons/md';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { forwardRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Logo } from './logo';

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

function Header() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} modal onOpenChange={setOpen}>
			<motion.header
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ type: 'spring', stiffness: 100, damping: 20 }}
				className="mb-12 select-none px-8 py-8 md:px-24 lg:px-32"
			>
				<nav className="flex items-center justify-between">
					<Link href="/">
						<div className="max-sm:hidden">
							<Logo withText />
						</div>
						<div className="sm:hidden">
							<Logo />
						</div>
					</Link>

					{/* Desktop Links */}
					<ul className="flex flex-row items-center gap-8 bg-transparent px-0 font-body text-base font-normal text-gray-900 max-lg:hidden">
						<NavLink href="/products/all">Products</NavLink>
						<NavLink href="/gallery">Get Inspired</NavLink>
						<NavLink href="/#where-to-buy">Where to Buy</NavLink>
						<NavLink href="/contact">Contact Us</NavLink>
						<li>
							<Button variant="primary" asChild>
								<Link href="/contact?form=quote">Get A Quote</Link>
							</Button>
						</li>
					</ul>

					{/* Mobile Menu */}
					<AnimatePresence>
						{open && (
							<Dialog.DialogPortal forceMount>
								<Dialog.Overlay />
								<Dialog.DialogContent forceMount asChild>
									<motion.div
										variants={variants.content}
										initial="hide"
										animate="show"
										exit="hide"
										className="fixed inset-0 flex flex-col bg-gray-900 text-white"
									>
										<div className="flex items-center justify-between px-8 py-8 md:px-24">
											<Link href="/" onClick={() => setOpen(false)}>
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
													<MdClose />
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
												onClick={() => setOpen(false)}
											>
												Products
											</MotionNavLink>
											<MotionNavLink
												variants={variants.item}
												href="/gallery"
												onClick={() => setOpen(false)}
											>
												Get Inspired
											</MotionNavLink>
											<MotionNavLink
												variants={variants.item}
												href="/#where-to-buy"
												onClick={() => setOpen(false)}
											>
												Where to Buy
											</MotionNavLink>
											<MotionNavLink
												variants={variants.item}
												href="/contact"
												onClick={() => setOpen(false)}
											>
												Contact Us
											</MotionNavLink>
											<MotionNavLink
												variants={variants.item}
												href="/contact?form=quote"
												onClick={() => setOpen(false)}
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
						<Button variant="tertiary" className=" lg:hidden">
							<MdMenu />
						</Button>
					</Dialog.Trigger>
				</nav>
			</motion.header>
		</Dialog.Root>
	);
}

export { Header };
