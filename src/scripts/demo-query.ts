// import { supabaseClient } from '../utils/supabase-client';
// import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { LLMChain } from 'langchain/chains';
import { OpenAIChat } from 'langchain/llms/openai';
import { CallbackManager } from 'langchain/callbacks';
import { PromptTemplate } from 'langchain/prompts';

const userInquiry = 'What do you sell?';

const INQUIRY_PROMPT = `Given the following user prompt and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
  You should follow the following rules when generating and answer:
  - Always prioritize the user prompt over the conversation log.
  - Ignore any conversation log that is not directly related to the user prompt.
  - Only attempt to answer if a question was posed.
  - The question should be a single sentence.
  - You should remove any punctuation from the question.
  - You should remove any words that are not relevant to the question.
  - If you are unable to formulate a question, respond with the same USER PROMPT you got.
  
  USER PROMPT: {userPrompt}

  CONVERSATION LOG: {conversationHistory}

  Final answer:`;

const llm = new OpenAIChat({
	modelName: 'gpt-3.5-turbo',
	openAIApiKey: process.env.OPENAI_API_KEY,
	temperature: 0,
	callbackManager: CallbackManager.fromHandlers({
		handleLLMStart(prompts) {
			console.log(prompts);
		},
		handleLLMNewToken(token) {
			console.log(token);
		}
	}),
	streaming: true
});

async function chat() {
	// const vectorStore = await SupabaseVectorStore.fromExistingIndex(
	// 	new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' }),
	// 	{ client: supabaseClient }
	// );

	// console.log('Question:', userInquiry);

	const inquiryChain = new LLMChain({
		llm,
		prompt: new PromptTemplate({
			template: INQUIRY_PROMPT,
			inputVariables: ['userPrompt', 'conversationHistory']
		})
	});

	// Ask a question
	const inquiryResponse = await inquiryChain.call({
		userPrompt: userInquiry,
		conversationHistory: []
	});

	// console.log('Refined Question:', inquiryResponse.text);
	// Test similarity search
	// const results = await vectorStore.similaritySearch(userInquiry, 2);
	// console.log(
	// 	'Similarity Results:',
	// 	results.map(({ pageContent }) => pageContent)
	// );
}

(async () => {
	await chat();
})();
