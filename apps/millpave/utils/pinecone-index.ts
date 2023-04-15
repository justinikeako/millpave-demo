import { PineconeClient } from '@pinecone-database/pinecone';

const client = new PineconeClient();

async function initPineconeIndex() {
	await client.init({
		apiKey: process.env.PINECONE_API_KEY as string,
		environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT as string
	});

	return client.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX as string);
}

export { initPineconeIndex };
