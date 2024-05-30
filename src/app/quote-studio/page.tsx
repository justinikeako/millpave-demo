'use client';

import React from 'react';
import { Button } from '~/components/button';
import { Reveal } from '~/components/reveal';
import Link from 'next/link';
import { Icon } from '~/components/icon';
import { Balancer } from 'react-wrap-balancer';
import Image from 'next/image';

function Page() {
	return (
		<>
			<div className="absolute inset-0 z-10 bg-gray-900 after:absolute after:inset-0 after:bg-gray-950/75">
				<Image
					src="/firepit.png"
					priority
					fetchPriority="high"
					width={765}
					height={517}
					alt="A stone firepit surrounded by paving stones"
					className="h-full w-full object-cover"
				/>
			</div>

			<Reveal
				standalone
				delay={0.1}
				data-header-transparent
				exit={{ opacity: 0, transition: { duration: 0.3 } }}
				className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 text-gray-100"
			>
				<h1 className="max-w-xl text-center font-display text-2xl xs:text-3xl md:text-4xl lg:text-5xl">
					<Balancer>
						Get a quote for your paving project in under 5 minutes.
					</Balancer>
				</h1>
				<p className="max-w-xs text-center">
					<Balancer>
						Just enter your project&apos;s measurements, select your patterns,
						and get your quote! Yes, it&apos;s that easy.
					</Balancer>
				</p>
				<div className="flex flex-wrap justify-center gap-2">
					<Button
						autoFocus
						intent="primary"
						backdrop="dark"
						className="group"
						asChild
					>
						<Link href="/quote-studio/shape">
							<span>Get Started</span>
							<Icon
								name="arrow_right_alt"
								className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-0.5"
							/>
						</Link>
					</Button>
					<Button asChild intent="secondary" backdrop="dark">
						<Link href="/">Return to Home Page</Link>
					</Button>
				</div>
			</Reveal>
		</>
	);
}

export default Page;
