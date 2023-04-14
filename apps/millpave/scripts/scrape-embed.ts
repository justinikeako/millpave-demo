import { Document } from 'langchain/document';
import * as fs from 'fs/promises';
import { CustomWebLoader } from '../utils/custom_web_loader';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { initPineconeIndex } from '../utils/pinecone-index';
import { PrismaClient } from '@prisma/client';

async function getUrls() {
	const prisma = new PrismaClient();

	const ids = await prisma.product.findMany({ select: { id: true } });
	const productUrls = ids.map(
		({ id }) => `https://millpave.notprimitive.com/product/${id}`
	);

	return [
		'https://millpave.notprimitive.com/',
		'https://millpave.notprimitive.com/contact',
		...productUrls
	];
}

async function extractDataFromUrl(url: string): Promise<Document[]> {
	try {
		const loader = new CustomWebLoader(url);
		const docs = await loader.load();
		return docs;
	} catch (error) {
		console.error(`Error while extracting data from ${url}: ${error}`);
		return [];
	}
}

async function extractDataFromUrls(urls: string[]): Promise<Document[]> {
	console.log('Extracting data from urls...');
	const documents: Document[] = [];
	for (const url of urls) {
		const docs = await extractDataFromUrl(url);
		documents.push(...docs);
	}
	console.log('Data successfully extracted from urls');
	const json = JSON.stringify(documents);
	await fs.writeFile('millpave.json', json);
	console.log('JSON file containing data saved on disk');
	return documents;
}

async function embedDocuments(
	pineconeIndex: VectorOperationsApi,
	docs: Document[],
	embeddings: OpenAIEmbeddings
) {
	console.log('Creating embeddings...');
	await PineconeStore.fromDocuments(docs, embeddings, { pineconeIndex });
	console.log('Embeddings successfully stored in pinecone');
}

async function splitDocsIntoChunks(docs: Document[]): Promise<Document[]> {
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 2000,
		chunkOverlap: 200
	});
	return await textSplitter.splitDocuments(docs);
}

(async function run() {
	try {
		// Get URLs
		const urls = await getUrls();

		// Load data from each url
		const rawDocs = await extractDataFromUrls(urls);

		// Split docs into chunks for openai context window
		const docs = await splitDocsIntoChunks(rawDocs);

		// Embed docs into pinecone

		const pineconeIndex = await initPineconeIndex();
		await embedDocuments(pineconeIndex, docs, new OpenAIEmbeddings());
	} catch (error) {
		console.log('error occured:', error);
	}
})();
