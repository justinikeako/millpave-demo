import Link from 'next/link';
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
	return (
		<header className=" mb-12 select-none px-8 py-8 md:px-24 lg:px-32 lg:text-black">
			<nav className="flex items-center justify-between">
				<input type="checkbox" id="menu-toggle" className="peer hidden" />

				<Link
					href="/"
					className="z-20 text-lg font-bold peer-checked:text-white"
				>
					Logo
				</Link>

				<ul className="inset-0 z-10 hidden flex-col items-start justify-center gap-8 bg-gray-900 px-16 text-3xl  text-white peer-checked:fixed peer-checked:flex md:px-24 lg:static lg:flex lg:flex-row lg:items-center lg:bg-transparent lg:px-0 lg:font-body lg:text-base lg:font-normal lg:text-gray-900">
					<NavLink href="/products">Products</NavLink>
					<NavLink href="/gallery">Get Inspired</NavLink>
					<NavLink href="/#where-to-buy">Where to Buy</NavLink>
					<NavLink href="/contact">Contact Us</NavLink>
					<li>
						<Button
							variant="primary"
							asChild
							className="max-lg:!p-0 max-lg:shadow-none"
						>
							<Link href="/contact?form=quote">Get A Quote</Link>
						</Button>
					</li>
				</ul>

				<Button
					variant="tertiary"
					className="z-20 peer-checked:text-white peer-checked:active:bg-gray-800 lg:hidden"
					asChild
				>
					<label htmlFor="menu-toggle">
						<Icon name="menu" />
					</label>
				</Button>
			</nav>
		</header>
	);
}

export { Header };
