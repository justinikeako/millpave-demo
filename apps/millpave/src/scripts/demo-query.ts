import { supabaseClient } from '../utils/supabase-client';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { CallbackManager } from 'langchain/callbacks';

const openai = new OpenAI(
	{
		modelName: 'gpt-3.5-turbo',
		openAIApiKey: process.env.OPENAI_API_KEY,
		temperature: 0,
		callbackManager: CallbackManager.fromHandlers({
			async handleLLMNewToken(token) {
				console.log(token);
			}
		})
	},
	{}
);

const query = 'Give me the price of colonial classic.';

const model = openai;

async function searchForDocs() {
	const vectorStore = await SupabaseVectorStore.fromExistingIndex(
		new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' }),
		{ client: supabaseClient }
	);

	// Test similarity search
	const results = await vectorStore.similaritySearch(query, 2);
	console.log('results', results);

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
