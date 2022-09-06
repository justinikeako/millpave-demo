/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from 'next';
import Head from 'next/head';

const Page: NextPage = () => {
	return (
		<>
			<Head>
				<title>Sell More. Work Less.</title>
				<meta
					name="description"
					content="A pitch for Millennium Paving Stones LTD."
				/>
				<link rel="icon" href="/logo.png" />
			</Head>

			<main className="container">
				{/* Hero */}
				<section className="flex h-screen flex-col justify-center px-12">
					<h1 className="font-display text-4xl font-black">
						Sell more. <br /> Work less.
					</h1>
					<p className="mt-8">
						This sounds illogical, but it makes more sense than you'd think...
					</p>
				</section>

				{/* Motivation */}
				<section className="space-y-8 px-12 py-24">
					<p className="font-display text-2xl font-bold">
						The way we sell at Millennium is pretty old school.
					</p>
					<p>
						Prospects have to visit or call in to find out basic information
						about our products. We have to phone or email customers just to send
						them notifications. And we still whip out calculators to invoice
						projects — even when millions are on the table.
					</p>
					<p className="font-display text-lg font-semibold">
						As the status quo, this hurts customer experience.
					</p>
					<p>
						It creates an unnecessary barrier between customers and the company.
						And it slows down the team with lots of simple yet repetitive work.
					</p>
					<p className="mt-16 font-display text-2xl font-bold">
						But what if it could be different?
					</p>
					<p>
						What if you could wave a magic wand and simplify all of this? Reach
						more prospects, give killer first impressions, and close massive
						deals… without lifting a finger?
					</p>
				</section>

				{/* Intro */}
				<section className="px-12 py-24">
					<h2 className="font-display text-4xl font-black">
						Meet the Virtual Showroom.
					</h2>
					<p className="w-2/3 font-display text-xl font-semibold">
						It's way better than magic.
					</p>
				</section>

				{/* Photoshop */}
				<section>
					<div className="px-12 py-24">
						<h2 className="font-semibold">Product Discovery</h2>
						<p className="font-display text-3xl font-black">Photoshop.</p>
						<p className="mt-8">
							Many prospects visit the showroom to find the perfect pavers for
							their space. By going virtual, they can do this from anywhere.
						</p>
					</div>
					<div className="h-[200vh]">
						<div className="sticky top-0 h-screen space-y-8 px-12 py-16">
							<p>
								Prospects can snap a photo of the area they want to work with,
							</p>
							<p>
								And get intelligent product suggestions based on the dominant
								colors in that shot — instantly.
							</p>
							<p>
								And with the revamped product gallery, prospects can also more
								easily shop for what they see.
							</p>
							<p>
								Tap on any photo in the gallery to discover the exact models,
								colors and patterns shown off.
							</p>
							<p>
								There are even links to each product so prospects can start
								shopping in seconds.
							</p>
						</div>
					</div>
				</section>

				{/* 3D */}
				<section className="h-[300vh] px-12 pt-16">
					<p>
						But sometimes, they need to see how our products look in their
						space.
					</p>
					<div className="sticky top-0 space-y-8 py-16">
						<p className="font-display text-4xl font-black">
							So I asked the third dimension for some help.
						</p>
						<p>
							High fidelity 3D models let prospects view any paver in any color
							at any angle.
						</p>
						<p>
							They can create custom patterns that are tailored to their
							project.
						</p>
						<p>
							And using Augmented Reality, prospects can even see their creation
							in their own space without ever having to visit the showroom.
						</p>
						<div className="flex flex-col items-center justify-center space-y-8">
							<p className="text-center font-display text-2xl font-bold">
								Mindblowing, right?
							</p>
							<p>But don't just take my word for it.</p>
							<a
								target="_blank"
								href="/millpave/demo/product"
								className="block rounded-full border border-black px-8 py-4 font-semibold"
							>
								Try it out for yourself
							</a>
						</div>
					</div>
				</section>

				{/* QuickerBooks */}
				<section>
					<div className="px-12 py-24">
						<h2 className="font-semibold">Invoicing</h2>
						<p className="font-display text-3xl font-black">QuickerBooks.</p>

						<p className="mt-8">
							A tool to make invoicing projects so easy, anyone could do it —
							really.
						</p>
					</div>

					<div className="h-[200vh]">
						<div className="sticky top-0 space-y-8 px-12 py-24">
							<p className=" text-center font-display text-2xl font-bold">
								Just enter your measurements
							</p>
							<p className="text-center font-display text-2xl font-bold">
								Pick your patterns
							</p>
							<p className="text-center font-display text-2xl font-bold">
								And get your invoice.
							</p>
							<p className="text-center font-display text-2xl font-bold">
								No, I didn't forget any other steps.
							</p>
							<p className="font-display text-xl font-bold">
								It supports complex borders, infill cutouts and so much more.
							</p>
							<p className="font-display text-xl font-bold">
								So your sales team can invoice projects like this, and this, and
								even this in under a minute.
							</p>
							<p className="font-display text-xl font-bold">
								Then drop those invoices in prospects' inboxes with the click of
								a button using an email service like Sendgrid.
							</p>
						</div>
					</div>
					<div className="px-12">
						<p>And don't worry, all of this still works with QuickBooks 😉</p>
					</div>
				</section>

				{/* Beyond Paper */}
				<section className="space-y-8 px-12 pt-16">
					<div>
						<h2 className="font-bold">Digital Invoices</h2>
						<p className="font-display text-3xl font-black">
							Doing what paper can't.
						</p>
					</div>

					<p>All invoices are digital by default.</p>
					<p>
						This means prospects can add, remove or edit items on their invoices
						with just a few taps. No need to get a new one.
					</p>
					<p>
						As they make changes, their invoice shows them how each product
						looks, the total area covered, and even how much everything weighs.
						So they know exactly what to expect before they buy.
					</p>
					<p>
						And this data can also be used to suggest the perfect amount of
						gravel, sand, or sealer at the bottom of every invoice. Making it
						easy for prospects to get everything they need for their dream
						project — all in one go.
					</p>
				</section>

				{/* Concrete to cash */}
				<section>
					<div className="space-y-8 px-12 pt-16">
						<div>
							<h2 className="font-semibold">Ecommerce</h2>
							<p className="font-display text-3xl font-black">
								Turn concrete to cash.
							</p>
						</div>

						<p>
							Whenever prospects are ready to commit, we can be ready to
							collect.
						</p>
						<p>
							With ecommerce platforms from JNCB and ScotiaBank, new customers
							can buy from us whether they're in
						</p>
					</div>
					<div className="h-[200vh]">
						<div className="sticky top-0 h-screen px-12 pt-16">
							<ul className="space-y-8">
								<li>
									<p className="text-center font-display text-3xl font-black">
										Kingston
									</p>
								</li>
								<li>
									<p className="text-center font-display text-3xl font-black">
										Montego Bay
									</p>
								</li>
								<li>
									<p className="text-center font-display text-3xl font-black">
										Miami
									</p>
								</li>
								<li>
									<p className="text-center font-display text-3xl font-black">
										London
									</p>
								</li>
							</ul>
							<p className="mt-8 font-display text-3xl font-black">
								Or anywhere else on the planet*
							</p>
							<p className="mt-8">*with an internet connection.</p>
						</div>
					</div>
				</section>

				{/* Transition */}
				<section className="space-y-8 px-12 py-16">
					<p>
						The virtual showroom provides our customers with a first class
						shopping experience.
					</p>

					<p>
						But we do a lot more than sales. From procurement to fulfillment,
						there's a ton of work that goes on behind the scenes to get our
						products into customers' hands.
					</p>

					<p>
						To help with that, there are two new systems that power a host of
						new workflows and useful automations that let you and your team move
						as fast as possible.
					</p>
				</section>

				{/* Customer Analytics */}
				<section>
					<div className="px-12 py-16">
						<h2 className="font-semibold">1. Customer Analytics</h2>
						<p className="font-display text-4xl font-black">
							Business intelligence in real time.
						</p>
					</div>

					<div className="h-[400vh]">
						<div className="sticky top-0 space-y-8 px-12 py-16">
							<p className="font-display text-xl font-bold">
								Any time a customer views a product, gets a quote, or makes a
								purchase, this system takes note.
							</p>

							<ul className="space-y-8">
								<li>
									<p className="font-display text-xl font-bold">
										Ask "Which products do customers buy most?"
									</p>
									<p className="mt-2 font-display text-xl font-bold">
										And see what you should be making more.
									</p>
								</li>
								<li>
									<p className="font-display text-xl font-bold">
										Ask "How are customers using our products?"
									</p>
									<p className="mt-2 font-display text-xl font-bold">
										And drive your next ad campaign with insights on customer
										behavior.
									</p>
								</li>
								<li>
									<p className="font-display text-xl font-bold">
										Ask "Where are customers ordering to?"
									</p>
									<p className="mt-2 font-display text-xl font-bold">
										And find out where you should open your next locations.
									</p>
								</li>
							</ul>

							<p className="font-display text-xl font-bold">
								The analytics system keeps track of all this and so much more in
								real time.
							</p>
							<p className="font-display text-xl font-bold">
								Then makes sense of it all in a single dashboard that you can
								check on whenever, wherever.
							</p>
							<p className="font-display text-xl font-bold">
								Business intelligence never looked so good.
							</p>
						</div>
					</div>
				</section>

				{/* Inventory Management */}
				<section>
					<div className="px-12 py-16">
						<h2 className="font-semibold">2. Inventory Management</h2>
						<p className="font-display text-4xl font-black">
							An eye on supply.
						</p>
						<p className="mt-8">
							Any time a customer views a product, gets a quote, or makes a
							purchase, this system takes note.
						</p>
					</div>

					<div className="h-[400vh]">
						<div className="sticky top-0 space-y-8 px-12 py-16">
							<ul className="space-y-8">
								<li>
									<p className="font-display text-xl font-bold">
										Want to check what's available?
									</p>
									<p className="mt-2">
										You and your team can see exactly how much of each product
										you have on hand across the factory and showroom. No more
										guessing.
									</p>
								</li>
								<li>
									<p className="font-display text-xl font-bold">
										Sold some stones?
									</p>
									<p className="mt-2">
										No problem. The system automatically deducts everything that
										was just bought.
									</p>
								</li>
								<li>
									<p className="font-display text-xl font-bold">
										Need to restock?
									</p>
									<p className="mt-2">
										The factory admin can hand off the production schedule and
										the system will update inventory as products leave the
										production line.
									</p>
								</li>
							</ul>
							<p>
								This inventory data can also be used by the virtual showroom to
								keep prospects in the know about what they want to buy right
								from our website. No calls or visits needed.
							</p>
							<p className="">
								And the system can even send work orders to the factory the
								second big customers pay on their invoices.
							</p>
						</div>
					</div>
				</section>

				{/* Combined */}
				<section className="px-12 py-16">
					<h2 className="font-display text-2xl font-black">
						A match made in Heaven.
					</h2>
					<p className="mt-8">
						The utility of the inventory management system — combined with the
						intelligence of the analytics system — introduces powerful new ways
						to do anything from managing logistics to handling customer
						relations.
					</p>
				</section>

				{/* Logistics */}
				<section>
					<div className="px-12 py-16">
						<h2 className="font-display text-3xl font-black">
							Logistics on easy mode.
						</h2>
						<p className="mt-8">Describing paragraph goes here.</p>
					</div>

					<div className="space-y-4 px-4 py-16">
						<div className="space-y-4 rounded-lg bg-neutral-500 px-8 py-12 text-white">
							<h3 className="font-semibold">Just-in-time Manufacturing</h3>
							<p className="font-display text-3xl font-black">
								Data-driven production.
							</p>
							<p>
								The analytics system can track the number of unique customers
								interested in any given item and track how fast those items sell
								out when restocked. With this info, it knows what sells best and
								can automatically send work orders to the factory once the
								forecasted demand is high.
							</p>
						</div>
						<div className="space-y-4 rounded-lg bg-neutral-100 px-8 py-12 text-black">
							<h3 className="font-display text-xl font-bold">
								Smart distribution.
							</h3>
							<p>
								Use item quantities in quotes to know what to send to the
								showroom and what to keep at the factory.
							</p>
						</div>
						<div className="space-y-4 rounded-lg bg-neutral-100 px-8 py-12 text-black">
							<h3 className="font-display text-xl font-bold">
								More goods on less gas.
							</h3>
							<p>
								Use demand forecasts to make smarter decisions on when to order
								raw materials.
							</p>
						</div>
					</div>
				</section>

				{/* Notifications */}
				<section>
					<div className="px-12 py-16">
						<h2 className="font-semibold">Notifications</h2>
						<p className="font-display text-2xl font-black">
							Stay in the loop.
						</p>
						<p className="mt-8">
							The new notification system lets customers keep up with our
							products without any unnecessary calls or emails.
						</p>
					</div>

					<div className="space-y-4 px-4 py-16">
						<div className="space-y-4 rounded-lg bg-neutral-100 px-8 py-12 text-black">
							<h3 className="font-display text-xl font-bold">
								Restock. Preorder.
							</h3>
							<p>
								Prospects can sign up to get notified when their favorite
								products restock right from our website. And we can send out
								notifications right before items leave the production line so
								they can reserve their stock early.
							</p>
						</div>
						<div className="space-y-4 rounded-lg bg-neutral-500 px-8 py-12 text-white">
							<h3 className="font-semibold">Fulfillment Timelines</h3>
							<p className="font-display text-2xl font-black">
								Track every order.
							</p>
							<p>
								Big customers can keep track of their orders from production to
								delivery. And if their project is split into multiple stages,
								they can even stay on top of upcoming payments. Downtime so the
								factory admin can easily reschedule orders when things don't go
								to plan.
							</p>
						</div>
						<div className="space-y-4 rounded-lg bg-neutral-100 px-8 py-12 text-black">
							<h3 className="font-display text-xl font-semibold">
								Repeat customers.
							</h3>
							<p>
								Automatically send well-timed reminders to past customers
								whenever they need to clean their pavers, order some
								replacements, or apply a fresh coat of sealer.
							</p>
						</div>
					</div>
				</section>

				{/* Admin features */}
				<section>
					<div className="px-12 py-16">
						<h2 className="font-display text-4xl font-black">
							Even more to love.
						</h2>
					</div>

					<div className="space-y-4 px-4 py-16">
						<div className="space-y-4 rounded-lg bg-neutral-100 px-8 py-12 text-black">
							<h3 className="font-display text-2xl font-bold">
								You're in control.
							</h3>
							<p>
								Easily add or remove products from your catalogue, edit
								manufacturing requirements, and change pricing all in one place.
								Your changes get reflected everywhere, instantly.
							</p>
						</div>
						<div className="space-y-4 rounded-lg bg-neutral-100 px-8 py-12 text-black">
							<h3 className="font-display text-2xl font-bold">
								Security built in.
							</h3>
							<p>
								Control who can see, create, edit or delete information across
								every system with user permissions.
							</p>
						</div>
						<div className="space-y-4 rounded-lg bg-neutral-100 px-8 py-12 text-black">
							<h3 className="font-display text-2xl font-bold">
								Built to scale.
							</h3>
							<p>
								Add new locations, onboard new team members, and start tracking
								performance in minutes. No technician required.
							</p>
						</div>
						<div className="space-y-4 rounded-lg bg-neutral-100 px-8 py-12 text-black">
							<h3 className="font-display text-2xl font-bold">
								Work anywhere.
							</h3>
							<p>
								Get work done from your desktop, laptop, tablet or even your
								smartphone. All you need is a web browser.
							</p>
						</div>
					</div>
				</section>

				{/* Outro */}
				<section className="flex h-screen flex-col justify-center px-12 py-16">
					<div className="space-y-8">
						<h2 className="font-display text-3xl font-black">Millennium.</h2>
						<p>Remember that magic wand I mentioned earlier?</p>
						<p>
							It's actually in your hand right now. If you like these ideas,
							wave it by
						</p>

						<div>
							<a
								href="tel:+8763384628"
								className="mt-8 block rounded-full bg-black px-8 py-4 text-center text-white"
							>
								Calling Me
							</a>
							<p className="mt-4 text-center">Any time between 11 am - 7 pm</p>
						</div>
					</div>
				</section>
			</main>
		</>
	);
};

export default Page;
