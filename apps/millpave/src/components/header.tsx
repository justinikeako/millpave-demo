import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './button';
import { Icon } from './icon';

type NavLinkProps = React.PropsWithChildren<{ href: string }>;

function NavLink({ href, children }: NavLinkProps) {
	return (
		<li>
			<Link href={href}>{children}</Link>
		</li>
	);
}

function Header() {
	const [showMenu, setShowMenu] = useState(false);

	return (
		<header
			className={classNames(
				' mb-12 px-8 py-8 md:px-24 lg:px-32 lg:text-black',
				showMenu && 'text-white'
			)}
		>
			<nav className="flex items-center justify-between">
				<Link href="/" className="z-20 text-lg font-bold">
					Logo
				</Link>

				<ul
					className={classNames(
						'inset-0 z-10 hidden flex-col items-start justify-center gap-8 bg-gray-900 px-16 text-3xl text-white md:px-24 lg:static lg:flex lg:flex-row lg:items-center lg:bg-transparent lg:font-body lg:text-base lg:font-normal lg:text-gray-900',
						showMenu && 'fixed !flex'
					)}
				>
					<NavLink href="/products">Products</NavLink>
					<NavLink href="/gallery">Get Inspired</NavLink>
					<NavLink href="/#where-to-buy">Where to Buy</NavLink>
					<NavLink href="/contact">Contact Us</NavLink>
					<li>
						<Button variant="primary" asChild className="max-lg:!p-0">
							<Link href="/contact">Get A Quote</Link>
						</Button>
					</li>
				</ul>

				<Button
					variant="tertiary"
					className="z-20 lg:hidden"
					onClick={() => setShowMenu(!showMenu)}
				>
					<Icon name="menu" />
				</Button>
			</nav>
		</header>
	);
}

export { Header };
