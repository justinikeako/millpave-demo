import { pinecone } from '../utils/pinecone-client';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { PINECONE_INDEX_NAME } from '../config/pinecone';
import { OpenAI } from 'langchain';
import { CallbackManager } from 'langchain/callbacks';

export const openai = new OpenAI(
	{
		modelName: 'gpt-3.5-turbo',
		openAIApiKey: process.env.OPENAI_API_KEY,
		temperature: 0.7,
		callbackManager: CallbackManager.fromHandlers({
			async handleLLMNewToken(token) {
				console.log(token);
			}
		})
	},
	{}
);

const query =
	'How much would 405 sqft of grasscrete and 34 sqft of colonial classic cost? Also, what are the dimensions?';

const model = openai;

async function searchForDocs() {
	const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);
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
