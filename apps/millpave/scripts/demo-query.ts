import { pineconeIndex } from '../utils/pinecone-index';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { openai } from '../utils/openai-client';

const query =
	'How much would 405 sqft of grasscrete and 34 sqft of colonial classic cost? Also, what are the dimensions?';

const model = openai;

async function searchForDocs() {
	const vectorStore = await PineconeStore.fromExistingIndex(
		new OpenAIEmbeddings(),
		{ pineconeIndex }
	);

	// Test similarity search
	// const results = await vectorStore.similaritySearch(query, 2);
	// console.log('results', results);

	const chain = VectorDBQAChain.fromLLM(model, vectorStore);

	// Ask a question
	const response = await chain.call({
		query: query
	});

	console.log('Question:', query);
	console.log('AI Answer:', response.text);
}

(async () => {
	await searchForDocs();
})();