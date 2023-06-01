import Head from 'next/head';
import NextError from 'next/error';
import { api } from '@/utils/api';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { createInnerTRPCContext } from '@/server/api/trpc';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { appRouter } from '@/server/api/routers/root';
import { Main } from '@/components/main';
import { useRouter } from 'next/router';
import { Button } from '@/components/button';

function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();

	const quoteId = props.id;

	const quoteQuery = api.quote.getById.useQuery(
		{ quoteId },
		{ refetchOnWindowFocus: false }
	);
	const deleteQuote = api.quote.deleteById.useMutation();
	const quote = quoteQuery.data;

	if (!quote) {
		const quoteNotFound = quoteQuery.error?.data?.code === 'NOT_FOUND';

		if (quoteNotFound) return <NextError statusCode={404} />;

		return <NextError statusCode={500} />;
	}

	return (
		<>
			<Head>
				<title>{`${quote.title} — Millennium Paving Stones`}</title>
			</Head>

			<Main className="space-y-32">
				{JSON.stringify(quote)}{' '}
				<Button
					variant="primary"
					onClick={async () => {
						await deleteQuote.mutateAsync({ quoteId });

						router.push('/');
					}}
				>
					Delete
				</Button>
			</Main>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssrContext = await createInnerTRPCContext({});

	const ssr = await createServerSideHelpers({
		router: appRouter,
		ctx: ssrContext,
		transformer: superjson
	});

	const quoteId = context.params?.id as string;
	// prefetch `product.getById`
	await ssr.quote.getById.prefetch({ quoteId });

	return {
		props: {
			trpcState: ssr.dehydrate(),
			id: quoteId
		}
	};
};

export default api.withTRPC(Page);
