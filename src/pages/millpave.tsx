/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from 'next';
import Head from 'next/head';

const Page: NextPage = () => {
	return (
		<>
			<Head>
				<title>Sell more. Work less.</title>
				<meta
					name="description"
					content="A pitch for Millennium Paving Stones LTD."
				/>
				<link rel="icon" href="/logo.png" />
			</Head>

			<main className="container min-h-screen">
				<section className="h-screen px-12 flex flex-col justify-center">
					<h1 className="text-3xl leading-tight font-display font-black">
						Sell more. <br /> Work less.
					</h1>
					<p className="mt-8">
						It might sound counterintuitive, but it makes more sense than you'd
						think...
					</p>
				</section>

				<section className="px-12 py-24">
					<p className="text-xl leading-tight font-display font-black">
						The way we do sales at Millennium is pretty old school.
					</p>
					<p className="mt-8">
						Prospects have to visit or call in to find out basic information
						about our products. We have to phone or email customers just to send
						them notifications. And we still whip out calculators to quote
						projects — even when millions are on the table.
					</p>
					<p className="mt-8">
						As the status quo, this doesn't improve customer experience.
					</p>
					<p className="mt-8">
						Instead, it creates an unnecessary barrier between customers and the
						company. And it slows down the team with lots of simple yet
						repetitive work.
					</p>
					<p className="mt-16 text-xl leading-tight font-display font-black">
						But what if it could be different?
					</p>
					<p className="mt-8">
						What if you could wave a magic wand and simplify all of this? Reach
						more prospects, give killer first impressions, and close massive
						deals… without lifting a finger?
					</p>
				</section>

				<section className="px-12 py-24">
					<h2 className="text-3xl leading-tight font-display font-black">
						Meet the Virtual Showroom.
					</h2>
					<p className="text-lg font-display font-semibold">
						It's way better than magic.
					</p>
				</section>

				<section>
					<div className="px-12 py-24">
						<h2>Product Discovery</h2>
						<p className="text-2xl leading-tight font-display font-black">
							Photoshop.
						</p>
						<p className="mt-8">
							Many prospects visit the showroom to find the perfect pavers for
							their space. By going virtual, they can do this from anywhere.
						</p>
					</div>
					<div className="h-[200vh]">
						<div className="sticky top-0 h-screen px-12 py-16">
							<p className="mt-8">
								Prospects can snap a photo of the area they want to work with,
							</p>
							<p className="mt-8">
								And get intelligent product suggestions based on the dominant
								colors in that shot — instantly.
							</p>
							<p className="mt-8">
								And with the revamped product gallery, prospects can also more
								easily shop for what they see.
							</p>
							<p className="mt-8">
								Tap on any photo in the gallery to discover the exact models,
								colors and patterns shown off.
							</p>
							<p className="mt-8">
								There are even links to each product so prospects can start
								shopping in seconds.
							</p>
						</div>
					</div>
				</section>

				<section className="h-[300vh] px-12 pt-16">
					<p>
						But sometimes, they need to see how our products look in their
						space.
					</p>
					<div className="sticky top-0 py-16">
						<p className="mt-8 text-3xl leading-tight font-display font-black">
							So I asked the third dimension for some help.
						</p>
						<p className="mt-8">
							High fidelity 3D models let prospects view any paver in any color
							at any angle.
						</p>
						<p className="mt-8">
							They can create custom patterns that are tailored to their
							project.
						</p>
						<p className="mt-8">
							And using Augmented Reality, prospects can even see their creation
							in their own space without ever having to visit the showroom.
						</p>
						<div className="flex flex-col items-center justify-center">
							<p className="mt-8 text-xl text-center leading-tight font-display font-bold">
								Mindblowing, right?
							</p>
							<p className="mt-8">But don't just take my word for it.</p>
							<a
								target="_blank"
								href="/"
								className="block mt-8 px-8 py-4 bg-black text-white rounded-full"
							>
								Try it out for yourself
							</a>
						</div>
					</div>
				</section>

				<section>
					<div className="px-12 py-24">
						<h2>Quote Tool</h2>
						<p className="text-2xl leading-tight font-display font-black">
							Quickerbooks.
						</p>

						<p className="mt-8">
							Makes quoting projects so easy, anyone could do it. Really.
						</p>
					</div>

					<div className="h-[200vh]">
						<div className="sticky top-0 px-12 py-24">
							<p className=" text-xl text-center leading-tight font-display font-bold">
								Just enter your measurements
							</p>
							<p className="mt-8 text-xl text-center leading-tight font-display font-bold">
								Pick your patterns
							</p>
							<p className="mt-8 text-xl text-center leading-tight font-display font-bold">
								And get your quote.
							</p>
							<p className="mt-8 text-xl text-center leading-tight font-display font-bold">
								No, I didn't forget any other steps.
							</p>
							<p className="mt-8">
								It supports complex borders, infill cutouts and so much more.
							</p>
							<p className="mt-8 text-lg leading-tight font-display font-bold">
								So your sales team can quote projects like this,{' '}
								<span>this,</span> <span>and even this in under a minute.</span>
							</p>
							<p className="mt-8 text-lg leading-tight font-display font-bold">
								Then drop those quotes in prospects' inboxes with the click of a
								button using an email service like Sendgrid.
							</p>
						</div>
					</div>
					<div className="px-12">
						<p>And don't worry, all of this still works with QuickBooks 😉</p>
					</div>
				</section>

				<section className="px-12 pt-16">
					<h2>Digital quotes</h2>
					<p className="text-2xl leading-tight font-display font-black">
						Doing what paper can't.
					</p>

					<p className="mt-8">All quotes are digital by default.</p>
					<p className="mt-8">
						This means prospects can add, remove or edit items on their quote
						with just a few taps. No need to get a new one.
					</p>
					<p className="mt-8">
						As they make changes, their quotes show them how each product looks,
						the total area the products cover and how much everything weighs.
					</p>
					<p className="mt-8">
						And this data can also be used to suggest the perfect amount of
						gravel, sand, or sealer inside of every quote. Making it easy for
						prospects to get everything they need for their dream project — all
						in one go.
					</p>
				</section>

				<section>
					<div className="px-12 pt-16">
						<h2>Ecommerce</h2>
						<p className="text-2xl leading-tight font-display font-black">
							Concrete to cash.
						</p>

						<p className="mt-8">
							Whenever prospects are ready to commit, we can be ready to
							collect.
						</p>
						<p className="mt-8">
							With ecommerce platforms from JNCB and ScotiaBank, new customers
							can buy from us whether they're in
						</p>
					</div>
					<div className="h-[200vh]">
						<div className="sticky top-0 h-screen px-12 pt-16">
							<ul>
								<li>
									<p className="mt-8 text-2xl text-center leading-tight font-display font-black">
										Kingston
									</p>
								</li>
								<li>
									<p className="mt-8 text-2xl text-center leading-tight font-display font-black">
										Montego Bay
									</p>
								</li>
								<li>
									<p className="mt-8 text-2xl text-center leading-tight font-display font-black">
										Miami
									</p>
								</li>
								<li>
									<p className="mt-8 text-2xl text-center leading-tight font-display font-black">
										London
									</p>
								</li>
							</ul>
							<p className="mt-8 text-2xl leading-tight font-display font-black">
								Or anywhere else on the planet*
							</p>
							<p className="mt-8">*with an internet connection.</p>
						</div>
					</div>
				</section>

				<section className="px-12 py-16">
					<p>
						The virtual showroom provides our customers with a first class
						shopping experience.
					</p>

					<p className="mt-8">
						But we do a lot more than sales. From procurement to fulfillment,
						there's a ton of work that goes on behind the scenes to get our
						products into customers' hands.
					</p>

					<p className="mt-8">
						To help with that, there are two new systems that power a host of
						new workflows and useful automations that let you and your team move
						as fast as possible.
					</p>
				</section>

				<section>
					<div className="px-12 py-16">
						<h2>1. Customer Analytics</h2>
						<p className="text-2xl leading-tight font-display font-black">
							Business intelligence in real time.
						</p>
						<p className="mt-8">
							Any time a customer views a product, gets a quote, or makes a
							purchase, this system takes note.
						</p>
					</div>

					<div className="h-[400vh]">
						<div className="sticky top-0 px-12 py-16">
							<ul>
								<li>
									<p className="mt-8 text-lg leading-tight font-display font-bold">
										Ask "What are customers buying the most?"
									</p>
									<p className="mt-4 text-lg leading-tight font-display font-bold">
										And see what you should be making more of.
									</p>
								</li>
								<li>
									<p className="mt-8 text-lg leading-tight font-display font-bold">
										Ask "How are customers using our products?"
									</p>
									<p className="mt-4 text-lg leading-tight font-display font-bold">
										And drive your next ad campaign with insights on customer
										behavior.
									</p>
								</li>
								<li>
									<p className="mt-8 text-lg leading-tight font-display font-bold">
										Ask "Where are customers coming from?"
									</p>
									<p className="mt-4 text-lg leading-tight font-display font-bold">
										And find out where you should open your next locations.
									</p>
								</li>
							</ul>
							<p className="mt-8 text-lg leading-tight font-display font-bold">
								The analytics system keeps track of all this and so much more in
								real time.
							</p>
							<p className="mt-8 text-lg leading-tight font-display font-bold">
								Then makes sense of it all in a single dashboard that you can
								check on whenever, wherever.
							</p>
							<p className="mt-8 text-lg leading-tight font-display font-bold">
								Business intelligence never looked so good.
							</p>
						</div>
					</div>
				</section>

				<section>
					<div className="px-12 py-16">
						<h2>2. Inventory Management</h2>
						<p className="text-2xl leading-tight font-display font-black">
							An eye on supply.
						</p>
						<p className="mt-8">
							Any time a customer views a product, gets a quote, or makes a
							purchase, this system takes note.
						</p>
					</div>

					<div className="h-[400vh]">
						<div className="sticky top-0 px-12 py-16">
							<ul>
								<li>
									<p className="mt-8 text-lg leading-tight font-display font-bold">
										Want to check what's available?
									</p>
									<p className="mt-8">
										You and your team can see exactly how much of each product
										you have on hand across the factory and showroom. No more
										guessing.
									</p>
								</li>
								<li>
									<p className="mt-8 text-lg leading-tight font-display font-bold">
										Sold some stones?
									</p>
									<p className="mt-8">
										No problem. The system automatically deducts everything that
										was just bought.
									</p>
								</li>
								<li>
									<p className="mt-8 text-lg leading-tight font-display font-bold">
										Need to restock?
									</p>
									<p className="mt-8">
										The factory admin can hand off the production schedule and
										the system will update inventory as products leave the
										production line.
									</p>
								</li>
							</ul>
							<p className="mt-8">
								This inventory data can also be used by the virtual showroom to
								keep prospects in the know about what they want to buy right
								from our website. No calls or visits needed.
							</p>
							<p className="mt-8">
								And the system can even send work orders to the factory the
								second big customers pay on their invoices.
							</p>
						</div>
					</div>
				</section>

				<section className="px-12 py-16">
					<h2 className="text-2xl leading-tight font-display font-black">
						A match made in Heaven.
					</h2>
					<p className="mt-8">
						The utility of the inventory management system — combined with the
						intelligence of the analytics system — introduces powerful new ways
						to do anything from managing logistics to handling customer
						relations.
					</p>
				</section>

				<section>
					<div className="px-12 py-16">
						<h2></h2>
						<p className="text-2xl leading-tight font-display font-black">
							Logistics on easy mode.
						</p>
						<p className="mt-8">Describing paragraph goes here.</p>
					</div>

					<div className="px-4 py-16">
						<div className="px-8 py-12 bg-gray-500 text-white rounded-2xl">
							<h3>Just-in-time Manufacturing</h3>
							<p className="text-2xl leading-tight font-display font-black">
								Data-driven production.
							</p>
							<p className="mt-4">
								Customer analytics can track data such as “” so it can know what
								sells best. With this info, it can automatically send work
								orders to the factory once forecasted demand is high.
							</p>
						</div>
						<div className="mt-4 px-8 py-12 bg-gray-200 text-black rounded-2xl">
							<h3 className="text-lg leading-tight font-display font-bold">
								Smart distribution.
							</h3>
							<p className="mt-8">
								Customer analytics knows the exact quantity of any given item in
								every quote. Use this data to know what to send to the showroom
								and what to keep at the factory.
							</p>
						</div>
						<div className="mt-4 px-8 py-12 bg-gray-200 text-black rounded-2xl">
							<h3 className="text-lg leading-tight font-display font-bold">
								Optimized Pickups.
							</h3>
							<p className="mt-8">
								Use demand forecasts to make smarter decisions on when to order
								raw materials. Get more goods on less gas.
							</p>
						</div>
					</div>
				</section>

				<section>
					<div className="px-12 py-16">
						<h2>Notifications</h2>
						<p className="text-2xl leading-tight font-display font-black">
							Stay in the loop.
						</p>
						<p className="mt-8">
							The new notification system lets customers stay up to date on our
							products without any unnecessary calls or emails.
						</p>
					</div>

					<div className="px-4 py-16">
						<div className="px-8 py-12 bg-gray-200 text-black rounded-2xl">
							<h3 className="text-lg leading-tight font-display font-bold">
								Restock. Preorder.
							</h3>
							<p className="mt-8">
								Prospects can sign up to get notified when their favorite
								products restock right from our website. And we can send out
								notifications right before items leave the production line so
								they can reserve their stock early.
							</p>
						</div>
						<div className="mt-4 px-8 py-12 bg-gray-500 text-white rounded-2xl">
							<h3 className="font-medium">Fulfillment Timelines</h3>
							<p className="text-2xl leading-tight font-display font-black">
								Track every order.
							</p>
							<p className="mt-4">
								Big customers can keep track of their orders from production to
								delivery. And if their project is split into multiple stages,
								they can even stay on top of upcoming payments. Downtime so the
								factory admin can easily reschedule orders when things don't go
								to plan.
							</p>
						</div>
						<div className="mt-4 px-8 py-12 bg-gray-200 text-black rounded-2xl">
							<h3 className="text-lg leading-tight font-display font-bold">
								Repeat Customers.
							</h3>
							<p className="mt-8">
								Autosend well-timed reminders to past customers whenever they
								need to clean their pavers, order some replacements, or apply a
								fresh coat of sealer.
							</p>
						</div>
					</div>
				</section>

				<section>
					<div className="px-12 py-16">
						{/* <h2>Notifications</h2> */}
						<p className="text-2xl leading-tight font-display font-black">
							Even more to love.
						</p>
						<p className="mt-8">
							The new notification system lets customers stay up to date on our
							products without any unnecessary calls or emails.
						</p>
					</div>

					<div className="px-4 py-16">
						<div className="px-8 py-12 bg-gray-200 text-black rounded-2xl">
							<h3 className="text-xl leading-tight font-display font-bold">
								You're in control.
							</h3>
							<p className="mt-8">
								Easily add or remove products from your catalogue, edit
								manufacturing requirements, and change pricing all in one place.
								Your changes get reflected everywhere, instantly.
							</p>
						</div>
						<div className="mt-4 px-8 py-12 bg-gray-200 text-black rounded-2xl">
							<h3 className="text-xl leading-tight font-display font-bold">
								Security built in.
							</h3>
							<p className="mt-8">
								Control who can see, create, edit or delete information across
								every system with user permissions.
							</p>
						</div>
						<div className="mt-4 px-8 py-12 bg-gray-200 text-black rounded-2xl">
							<h3 className="text-xl leading-tight font-display font-bold">
								Built to scale.
							</h3>
							<p className="mt-8">
								Add new locations, onboard new team members, and start tracking
								performance in minutes. No technician required.
							</p>
						</div>
						<div className="mt-4 px-8 py-12 bg-gray-200 text-black rounded-2xl">
							<h3 className="text-xl leading-tight font-display font-bold">
								Work anywhere.
							</h3>
							<p className="mt-8">
								Get work done from your desktop, laptop, tablet or even your
								smartphone. All you need is a web browser.
							</p>
						</div>
					</div>
				</section>

				<section className="h-screen px-12 py-16 flex flex-col justify-center">
					<div>
						{/* <h2>Notifications</h2> */}
						<p className="text-xl font-display font-bold">
							So, remember that magic wand I mentioned earlier?
						</p>
						<p className="mt-8">It's actually in your hand right now.</p>
						<p className="mt-8">To wave it,</p>

						<div>
							<a
								href="tel:+8763384628"
								className="block text-center mt-8 px-8 py-4 bg-black text-white rounded-full"
							>
								Call Me
							</a>
							<p className="text-center mt-4">Any time between 11 am - 7 pm</p>
						</div>
					</div>
				</section>
			</main>
		</>
	);
};

export default Page;
