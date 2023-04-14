import { PineconeClient } from '@pinecone-database/pinecone';

const client = new PineconeClient();
await client.init({
	apiKey: process.env.PINECONE_API_KEY as string,
	environment: process.env.PINECONE_ENVIRONMENT as string
});

export const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string);
