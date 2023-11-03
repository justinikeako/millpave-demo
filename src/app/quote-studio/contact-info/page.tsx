'use client';

import { StageForm } from '../_components/form';
import { Button } from '~/components/button';
import Balancer from 'react-wrap-balancer';
import { Icon } from '~/components/icon';
import { useFormContext } from 'react-hook-form';
import Link from 'next/link';

export default function Page() {
	const { register, formState } = useFormContext();

	return (
		<StageForm className="space-y-8">
			<h2 className="mx-auto max-w-sm text-center font-display text-3xl md:text-4xl lg:text-5xl">
				<Balancer>Enter your email to get your quote!</Balancer>
			</h2>
			<p className="mx-auto max-w-sm text-center">
				<Balancer>
					Your email enables us to tailor our services to meet your unique needs
					and deliver an exceptional experience.
				</Balancer>
			</p>
			<div className="mx-auto flex w-full justify-center gap-2 sm:w-fit">
				<input
					{...register('email', {
						required: true,
						pattern: {
							value: /\S+@\S+\.\S+/,
							message: 'Please enter a valid email address'
						}
					})}
					type="email"
					inputMode="email"
					placeholder="janedoe@example.com"
					className="h-12 flex-1 rounded-sm border border-gray-400 bg-gray-50 px-2  outline-2 outline-pink-700 placeholder:text-gray-500 hover:border-gray-500"
				/>
				<Button
					asChild
					intent="primary"
					type="button"
					className="h-12"
					disabled={!formState.isValid}
				>
					<Link href="/quote-studio/configure">
						<span className="whitespace-nowrap">Get Your Quote</span>
						<Icon name="arrow_right_alt" />
					</Link>
				</Button>
			</div>
		</StageForm>
	);
}
