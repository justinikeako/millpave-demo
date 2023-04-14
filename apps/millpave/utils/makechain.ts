import { OpenAI } from 'langchain/llms/openai';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/dist/callbacks';

const CONDENSE_PROMPT =
	PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
	`You are a customer service agent for Millennium Paving Stones. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
You should only use hyperlinks as references that are explicitly listed as a source in the context below. Do NOT make up a hyperlink that is not listed below.
If you can't find the answer in the context below, just say something along the lines of "I'm not sure" Don't try to make up an answer.
If the question is not related to the Millennium Paving stones, or context provided, politely inform them that you are tuned to only answer questions that are related to Millennium Paving Stones.
Choose the most relevant link that matches the context provided:

Question: {question}
=========
{context}
=========
Answer in Markdown:`
);

export const makeChain = (
	vectorstore: PineconeStore,
	onTokenStream: (token: string) => Promise<void>
) => {
	const questionGenerator = new LLMChain({
		llm: new OpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0.7 }),
		prompt: CONDENSE_PROMPT
	});

	const callbackManager = CallbackManager.fromHandlers({
		handleLLMNewToken: onTokenStream
	});

	const docChain = loadQAChain(
		new OpenAI({
			modelName: 'gpt-3.5-turbo',
			temperature: 0.7,
			streaming: Boolean(onTokenStream),
			callbackManager
		}),
		{ prompt: QA_PROMPT }
	);

	return new ChatVectorDBQAChain({
		vectorstore,
		combineDocumentsChain: docChain,
		questionGeneratorChain: questionGenerator
	});
};
