import { Document } from 'langchain/document';
import * as fs from 'fs/promises';
import { CustomWebLoader } from './utils/custom_web_loader';
import type { SupabaseClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { supabaseClient } from '../src/utils/supabase-client';
import { getCatalogueDocument, getProductDocuments } from './utils/db-loaders';

async function getUrls() {
	return [
		'https://beta.millpave.notprimitive.com/',
		'https://beta.millpave.notprimitive.com/contact'
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

	const productDocs = await getProductDocuments();
	documents.push(...productDocs);

	const catalogueDoc = await getCatalogueDocument();
	documents.push(...catalogueDoc);

	console.log('Data successfully extracted from urls');
	const json = JSON.stringify(documents);
	await fs.writeFile('millpave.json', json);
	console.log('JSON file containing data saved on disk');
	return documents;
}

async function embedDocuments(
	client: SupabaseClient,
	docs: Document[],
	embeddings: OpenAIEmbeddings
) {
	console.log('Creating embeddings...');
	await SupabaseVectorStore.fromDocuments(docs, embeddings, { client });
	console.log('Embeddings successfully stored in supabase');
}

async function splitDocsIntoChunks(docs: Document[]): Promise<Document[]> {
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
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

		// // Embed docs into supabase
		await embedDocuments(
			supabaseClient,
			docs,
			new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' })
		);
	} catch (error) {
		console.log('error occured:', error);
	}
})();
