import { StreamingTextResponse, LangChainStream, Message } from 'ai';
import { supabaseClient } from '~/utils/supabase-client';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { AIChatMessage, HumanChatMessage } from 'langchain/schema';

export const runtime = 'edge';

const INQUIRY_TEMPLATE =
	PromptTemplate.fromTemplate(`Given the following USER PROMPT and CONVERSATION LOG, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
  You should follow the following rules when generating and answer:
  - Always prioritize the USER PROMPT over the CONVERSATION LOG.
  - Ignore any CONVERSATION LOG that is not directly related to the USER PROMPT.
  - Only attempt to answer if a question was posed.
	- If the USER PROMPT reads along the lines of "that will be all" or "thank you" respond with the same USER PROMPT you got.
  - The question should be a single sentence.
  - You should remove any punctuation from the question.
  - You should remove any words that are not relevant to the question.
  - If you are unable to formulate a question, respond with the same USER PROMPT you got.
  
  USER PROMPT: {userPrompt}

  CONVERSATION LOG: {conversationHistory}

  Final answer:`);

const QA_TEMPLATE = PromptTemplate.fromTemplate(
	`Answer the question based on the context below. You should follow ALL the following rules when generating and answer:
	- There will be a CONVERSATION LOG, CONTEXT, SOURCES and a QUESTION.
	- The final answer must always be styled using markdown.
	- Your main goal is to point the user to the right source of information (the source is always a URL) based on the CONTEXT you are given.
	- Your secondary goal is to provide the user with an answer that is relevant to the question.
	- Take into account the entire conversation so far, marked as CONVERSATION LOG, but prioritize the CONTEXT.
	- Based on the CONTEXT, choose the source that is most relevant to the QUESTION.
	- Do not make up any answers if the CONTEXT does not have relevant information.
	- The CONTEXT is a set of JSON objects, each includes the field "text" where the content is stored, and "url" where the url of the page is stored.
	- The URLs are the URLs of the pages that contain the CONTEXT. Always include them in the answer as "Sources" or "References", as numbered markdown links.
	- Do not mention the CONTEXT or the CONVERSATION LOG in the answer, but use them to generate the answer.
	- ALWAYS prefer the result with the highest "score" value.
	- Ignore any content that is stored in html tables.
	- The answer should only be based on the CONTEXT. Do not use any external sources. Do not generate the response based on the question without clear reference to the context.
	- Your answer should be concise and conversational. Avoid unnecessary repetition and redundancy.
	- It is IMPERATIVE that any link provided is found in the CONTEXT. Prefer not to provide a link if it is not found in the CONTEXT.
	
	CONVERSATION LOG: {conversationHistory}
	
	CONTEXT: {documents}
	
	SOURCES: {sources}

	QUESTION: {question}
	
	Final Answer:`
);

const llm = new ChatOpenAI({
	modelName: 'gpt-3.5-turbo',
	openAIApiKey: process.env.OPENAI_API_KEY,
	temperature: 0
});

export default async function POST(req: Request) {
	console.log('Invoked');

	const messages = (await req.json()).messages as Message[];
	const { stream, handlers } = LangChainStream();

	// OpenAI recommends replacing newlines with spaces for best results

	const mostRecentMessage = messages.at(-1);
	if (!mostRecentMessage) return;
	const sanitizedUserPrompt = mostRecentMessage.content
		.trim()
		.replaceAll('\n', ' ');

	// Create vector store
	const vectorStore = await SupabaseVectorStore.fromExistingIndex(
		new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' }),
		{
			client: supabaseClient,
			tableName: 'documents',
			queryName: 'match_documents'
		}
	);

	// Rephrase user prompt
	const inquiryChain = new LLMChain({
		llm,
		prompt: INQUIRY_TEMPLATE
	});

	const rephrasedUserInput = await inquiryChain.call({
		userPrompt: sanitizedUserPrompt,
		conversationHistory: messages
	});
	console.log('Rephrased user input:', rephrasedUserInput);

	const embedder = new OpenAIEmbeddings({
		modelName: 'text-embedding-ada-002'
	});

	const embeddings = await embedder.embedQuery(rephrasedUserInput.text);

	const results = await vectorStore.similaritySearchVectorWithScore(
		embeddings,
		2
	);
	// console.log('Similarity search results:', results);

	const chat = new ChatOpenAI({
		modelName: 'gpt-3.5-turbo',
		temperature: 0.5,
		streaming: true
	});

	const chatChain = new LLMChain({
		prompt: QA_TEMPLATE,
		llm: chat
	});

	chatChain.call(
		{
			documents: JSON.stringify(results),
			sources: results
				.flatMap(([document]) => document.metadata.source)
				.join('\n'),

			question: rephrasedUserInput.text,
			conversationHistory: messages.map((m) =>
				m.role == 'user'
					? new HumanChatMessage(m.content)
					: new AIChatMessage(m.content)
			)
		},
		[
			handlers,
			{
				handleLLMEnd(output) {
					console.log('Output:', output.generations.at(0)?.at(0)?.text);
				}
			}
		]
	);

	return new StreamingTextResponse(stream);
}
