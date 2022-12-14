import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { MdExpandMore, MdForum, MdSend } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
	id: string;
	text: string;
	sender: string;
};

function Chat() {
	const [open, setOpen] = useState(false);
	const closed = !open;

	const [conversation, setConversation] = useState<Message[]>([]);
	const [unreadMessageCount, setUnreadMessageCount] = useState(
		conversation.length
	);

	const [draftText, setDraftText] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	function sendMessage(text: string, sender: string) {
		setConversation([
			...conversation,
			{
				id: nanoid(),
				text,
				sender
			}
		]);

		if (closed && sender !== 'me')
			setUnreadMessageCount(unreadMessageCount + 1);
	}

	function handleSend(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		sendMessage(draftText, 'me');
		setDraftText('');
		inputRef.current?.focus();
	}

	function toggleOpen() {
		setOpen(!open);

		setUnreadMessageCount(0);
	}

	// Very crude auto messaging
	const [messageQueue, setMessageQueue] = useState([
		{
			text: "This chat isn't actually live, just an interactive demo. It would serve as a semi-automated way for customers to interact with the company.",
			delay: 15000
		},
		{
			text: 'Using a service like freshchat by freshworks or tawk.to, prospects could traverse the site, get answers to their questions, and even generate quotes using the chat bot that would live here 24/7.',
			delay: 20000
		},
		{
			text: 'And if their needs solicit human attention, they can also get support from a sales rep live right from the site.',
			delay: 12000
		}
	]);

	useEffect(() => {
		const message = messageQueue[0];

		if (message) {
			const timerId = setTimeout(() => {
				sendMessage(message.text, 'them');

				setMessageQueue(messageQueue.slice(1));
			}, message.delay);

			return () => {
				clearTimeout(timerId);
			};
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageQueue.length]);

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
								<div className="flex h-fit min-h-full shrink-0 flex-col space-y-1 py-2 px-4">
									<AnimatePresence initial={false}>
										{conversation.map((message) => (
											<motion.div
												layout
												layoutScroll
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
												key={message.id}
												className={classNames(
													'max-w-[75%] rounded-lg px-3 py-2',
													message.sender === 'them'
														? 'self-start rounded-bl-none bg-gray-700 text-white'
														: 'self-end  rounded-br-none bg-gray-300 text-black'
												)}
											>
												{message.text}
											</motion.div>
										))}
									</AnimatePresence>
								</div>
							</div>

							<form className="p-4 pt-2" onSubmit={handleSend}>
								<div className="flex overflow-hidden rounded-md bg-white text-gray-900">
									<label htmlFor="chat-input" className="flex-1 p-3">
										<input
											ref={inputRef}
											value={draftText}
											onChange={(e) => setDraftText(e.target.value)}
											type="text"
											id="chat-input"
											className="w-full bg-transparent outline-none placeholder:text-gray-500"
											placeholder="Type something..."
										/>
									</label>
									<button
										disabled={!draftText}
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
					{unreadMessageCount > 0 && (
						<span className="absolute -left-1 -top-1 block rounded-full bg-red-600 p-1 font-semibold text-white">
							<span className="block h-4 w-4 leading-4">
								{unreadMessageCount}
							</span>
						</span>
					)}

					<MdForum name="forum" className="text-[2em]" />
				</motion.button>
			</div>
		</div>
	);
}

export { Chat };
