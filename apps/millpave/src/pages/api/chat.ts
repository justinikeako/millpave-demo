import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import { openai } from '../../../utils/openai-client';
import { initPineconeIndex } from '../../../utils/pinecone-index';
import { makeChain } from '../../../utils/makechain';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { question, history } = req.body;

	if (!question) {
		return res.status(400).json({ message: 'No question in the request' });
	}

	// OpenAI recommends replacing newlines with spaces for best results
	const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

	// Create vectorstore
	const pineconeIndex = await initPineconeIndex();
	const vectorStore = await PineconeStore.fromExistingIndex(
		new OpenAIEmbeddings(),
		{ pineconeIndex }
	);

	res.writeHead(200, {
		'Content-Type': '	text/event-stream',
		'Cache-Control': 'no-cache, no-transform',
		Connection: 'keep-alive'
	});

	const sendData = (data: string) => {
		res.write(`data: ${data}\n\n`);
	};

	sendData(JSON.stringify({ data: '' }));

	// const model = openai;
	// Create the chain
	const chain = makeChain(vectorStore, async (token: string) => {
		sendData(JSON.stringify({ data: token }));
	});

	try {
		// Ask a question
		const response = await chain.call({
			question: sanitizedQuestion,
			chat_history: history || []
		});

		console.log('response', response);
	} catch (error) {
		console.log('error', error);
	} finally {
		sendData('[DONE]');
		res.end();
	}
}
