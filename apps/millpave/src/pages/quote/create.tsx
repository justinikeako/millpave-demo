import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '../../components/button';
import Icon from '../../components/icon';
import cx from 'classnames';

const stages = [0, 0, 0, 0, 0];

const Page: NextPage = () => {
	const router = useRouter();

	const [currentStage, setStage] = useState(0);

	return (
		<>
			<Head>
				<title>Create your Quote — Millennium Paving Stones</title>
			</Head>

			<main className="flex min-h-screen flex-col space-y-4 px-8 pb-12">
				<nav className="flex items-center space-x-6 pt-12 pb-8">
					<Button variant="tertiary" onClick={() => router.back()}>
						<Icon name="arrow_back" />
					</Button>

					<ul className="flex flex-1 space-x-2">
						{stages.map((_, index) => (
							<li
								key={index}
								className={cx(
									'h-2 flex-1 rounded-full',
									index < currentStage && 'bg-bubblegum-300',
									index === currentStage && 'bg-bubblegum-700',
									index > currentStage && 'bg-zinc-100'
								)}
								onClick={() => setStage(index)}
							/>
						))}
						{/* <li className="h-2 flex-1 rounded-full bg-zinc-100" />
						<li className="h-2 flex-1 rounded-full bg-zinc-100" />
						<li className="h-2 flex-1 rounded-full bg-zinc-100" />
						<li className="h-2 flex-1 rounded-full bg-zinc-100" /> */}
					</ul>
				</nav>

				<h1 className="text-center font-display text-xl font-semibold">
					Pick a shape to get started.
				</h1>

				<ul className="flex flex-1 flex-col justify-center space-y-2">
					<Option
						value="rectangle"
						title="Rectangle"
						description="Requires length and width"
					/>
					<Option
						value="circle"
						title="Circle"
						description="Requires diameter or circumference"
					/>
					<Option
						value="arbitrary"
						title="Rectangle"
						description="Requires area and/or running length"
					/>
				</ul>

				<footer>
					<Button
						variant="primary"
						className="w-full"
						onClick={() =>
							setStage((currentStage) =>
								Math.min(currentStage + 1, stages.length - 1)
							)
						}
					>
						Next
						<Icon name="arrow_forward" />
					</Button>
				</footer>
			</main>
		</>
	);
};

type OptionProps = {
	title: string;
	description: string;
	value: string;
};

const Option = ({ title, description, value }: OptionProps) => {
	// Do some value matching here and adjust the styles accordingly
	return (
		<li>
			<input
				type="radio"
				name="shape"
				id={value}
				value={value}
				className="peer hidden"
			/>

			<label
				htmlFor={value}
				className="checked flex items-center rounded-md border border-zinc-300 p-6 pr-4 peer-checked:border-2 peer-checked:border-bubblegum-700 peer-checked:bg-bubblegum-50 peer-checked:text-bubblegum-700"
			>
				<div className="flex-1">
					<p className="font-semibold">{title}</p>
					<p className="text-sm">{description}</p>
				</div>

				<div className="rounded-full border-2 border-inherit p-0.5">
					<div className="h-4 w-4 rounded-full bg-transparent" />
				</div>
			</label>
		</li>
	);
};

export default Page;
