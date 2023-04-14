import classNames from 'classnames';
import { useMemo, useRef, useState } from 'react';
import { Button } from './button';
import { MdExpandMore, MdForum, MdSend } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import ReactMarkdown from 'react-markdown';

type Message = {
	text: string;
	sender: string;
};

function Chat() {
	const [open, setOpen] = useState(false);
	const [draftText, setDraftText] = useState('');
	const [loading, setLoading] = useState<boolean>(false);
	const [chatState, setChatState] = useState<{
		messages: Message[];
		pending?: string;
		history: [string, string][];
	}>({
		messages: [
			{
				text: 'Hi, how can I help?',
				sender: 'gpt'
			}
		],
		history: []
	});

	const { messages, pending, history } = chatState;

	const inputRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!draftText) {
			alert('Please input a question');
			return;
		}

		const question = draftText.trim();

		setChatState((state) => ({
			...state,
			messages: [
				...state.messages,
				{
					sender: 'userMessage',
					text: question
				}
			],
			pending: undefined
		}));

		setLoading(true);
		setDraftText('');
		setChatState((state) => ({ ...state, pending: '' }));

		const ctrl = new AbortController();

		try {
			fetchEventSource('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					question,
					history
				}),
				signal: ctrl.signal,
				onmessage: (event) => {
					if (event.data === '[DONE]') {
						setChatState((state) => ({
							history: [...state.history, [question, state.pending ?? '']],
							messages: [
								...state.messages,
								{
									text: state.pending ?? '',
									sender: 'gpt'
								}
							],
							pending: undefined
						}));
						setLoading(false);
						ctrl.abort();
					} else {
						const data = JSON.parse(event.data);
						setChatState((state) => ({
							...state,
							pending: (state.pending ?? '') + data.data
						}));
					}
				}
			});
		} catch (error) {
			setLoading(false);
			console.log('error', error);
		}
	}

	function toggleOpen() {
		setOpen(!open);
	}

	const chatMessages = useMemo(() => {
		return [
			...messages,
			...(pending ? [{ sender: 'gpt', text: pending }] : [])
		];
	}, [messages, pending]);

	return (
		<div className="pointer-events-none fixed inset-x-8 bottom-8 flex justify-end">
			<div className="pointer-events-auto flex flex-col items-end justify-end space-y-2">
				<AnimatePresence>
					{open && (
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{
								opacity: 1,
								y: 0,
								transition: {
									type: 'spring',
									stiffness: 300,
									damping: 30
								}
							}}
							exit={{
								opacity: 0,
								y: 50,
								transition: { type: 'spring', stiffness: 150, damping: 15 }
							}}
							className="w-full max-w-[24em] rounded-lg bg-gray-900 text-white opacity-0 shadow-button"
						>
							<div className="flex items-center justify-between pr-4">
								<h2 className="p-4 pb-2 font-semibold">
									Not actually live chat™
								</h2>
								<Button
									variant="tertiary"
									className="!p-2 hover:!bg-gray-800 active:!bg-gray-700"
									onClick={() => setOpen(false)}
								>
									<MdExpandMore />
								</Button>
							</div>

							<div className="flex h-96 flex-col-reverse overflow-y-scroll overscroll-y-contain">
								<div className="flex h-fit min-h-full shrink-0 flex-col space-y-1 px-4 py-2">
									<AnimatePresence initial={false}>
										{chatMessages.map((message, index) => (
											<motion.div
												initial={{ y: 50, opacity: 0 }}
												animate={{
													y: 0,
													opacity: 1,
													transition: {
														type: 'spring',
														stiffness: 100,
														damping: 15
													}
												}}
												key={index}
												className={classNames(
													'max-w-[75%] rounded-lg px-3 py-2',
													message.sender === 'gpt'
														? 'self-start rounded-bl-none bg-gray-700 text-white'
														: 'self-end  rounded-br-none bg-gray-300 text-black'
												)}
											>
												<ReactMarkdown linkTarget="_blank">
													{message.text}
												</ReactMarkdown>
											</motion.div>
										))}
									</AnimatePresence>
								</div>
							</div>

							<form className="p-4 pt-2" onSubmit={handleSubmit}>
								<div className="flex overflow-hidden rounded-md bg-white text-gray-900">
									<label htmlFor="chat-input" className="flex-1 p-3">
										<input
											disabled={loading}
											ref={inputRef}
											value={draftText}
											onChange={(e) => setDraftText(e.target.value)}
											type="text"
											id="chat-input"
											className="w-full bg-transparent outline-none placeholder:text-gray-500"
											placeholder="Ask a question..."
										/>
									</label>
									<button
										disabled={loading || !draftText}
										type="submit"
										className="flex select-none p-3 text-[1.5rem] text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent disabled:active:bg-transparent"
									>
										<MdSend />
									</button>
								</div>
							</form>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.button
					initial={{ y: 100, opacity: 0 }}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							delay: 0.4,
							type: 'spring',
							stiffness: 100,
							damping: 20
						}
					}}
					exit={{ opacity: 0 }}
					onClick={toggleOpen}
					className="relative flex select-none rounded-lg bg-gray-900 p-4 text-white shadow-button  hover:bg-gray-800 active:bg-gray-700"
				>
					{/* {unreadMessageCount > 0 && (
						<span className="absolute -left-1 -top-1 block rounded-full bg-red-600 p-1 font-semibold text-white">
							<span className="block h-4 w-4 leading-4">
								{unreadMessageCount}
							</span>
						</span>
					)} */}

					<MdForum name="forum" className="text-[2em]" />
				</motion.button>
			</div>
		</div>
	);
}

export { Chat };
