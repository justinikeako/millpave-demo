import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { supabaseClient } from '../../utils/supabase-client';
import { makeChain } from '../../utils/makechain';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { question, history } = req.body;

	// Only accept post requests
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	if (!question) {
		return res.status(400).json({ message: 'No question in the request' });
	}

	// OpenAI recommends replacing newlines with spaces for best results
	const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

	try {
		// Create vector store
		const vectorStore = await SupabaseVectorStore.fromExistingIndex(
			new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' }),
			{ client: supabaseClient }
		);

		// Create chain
		const chain = makeChain(vectorStore);

		// Ask a question using chat history
		const response = await chain.call({
			question: sanitizedQuestion,
			chat_history: history || []
		});

		console.log('response', response);

		res.status(200).json(response);
	} catch (error: any) {
		console.log('error', error);
		res.status(500).json({ error: error.message || 'Something went wrong' });
	}
}
