import { StageFooter } from './_components/footer';
import { StageProvider } from './_components/stage-context';
import { Transition } from './_components/transition';

export const metadata = {
	title: 'Get a Quote — Millennium Paving Stones LTD.',
	description:
		'Get a quote for your paving project in under 5 minutes with just the dimensions of your project, and an idea of the patterns you wish to use.',
	openGraph: {
		title: 'Get a Paving Quote Under 5 Minutes',
		description:
			"All you'll need are the dimensions of your project, and an idea of the patterns you wish to use."
	}
};

export default function Layout({ children }: React.PropsWithChildren) {
	return (
		<StageProvider>
			{children}
			<StageFooter />
		</StageProvider>
	);
}
