import { CallbackManager } from 'langchain/callbacks';
import { OpenAI } from 'langchain/llms/openai';

if (!process.env.OPENAI_API_KEY) {
	throw new Error('Missing OpenAI Credentials');
}

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

export const openaiStream = new OpenAI({
	modelName: 'gpt-3.5-turbo',
	temperature: 0.7,
	streaming: true,
	callbackManager: CallbackManager.fromHandlers({
		async handleLLMNewToken(token) {
			console.log(token);
		}
	})
});
