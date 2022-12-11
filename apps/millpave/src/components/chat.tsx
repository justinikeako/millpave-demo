import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { AnimatePresence, motion } from 'framer-motion';

function Chat() {
	const [open, setOpen] = useState(false);
	const closed = !open;

	const [conversation, setConversation] = useState([
		{
			id: nanoid(),
			from: 'them',
			text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit enim error minima sit unde, temporibus delectus provident cum placeat eligendi?'
		},
		{
			id: nanoid(),
			from: 'me',
			text: 'helo'
		},
		{
			id: nanoid(),
			from: 'me',
			text: 'u r big nubz'
		}
	]);

	const [draftText, setDraftText] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	function handleSend(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setConversation([
			...conversation,
			{
				id: nanoid(),
				text: draftText,
				from: 'me'
			}
		]);

		if (inputRef.current) inputRef.current.focus();

		setDraftText('');
	}

	return (
		<div className="fixed bottom-8 right-8 left-8 flex justify-end">
			<motion.div
				layout
				className="flex items-end justify-end rounded-lg bg-gray-900"
			>
				<AnimatePresence mode="wait" initial={false}>
					{open && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="w-full max-w-[24em] text-white opacity-0"
						>
							<div className="flex items-center justify-between p-4 pb-2">
								<h2 className="text-lg">Totally not live chat™</h2>
								<Button
									variant="tertiary"
									className="hover:!bg-gray-800 active:!bg-gray-700"
									onClick={() => setOpen(false)}
								>
									<Icon name="expand_more" />
								</Button>
							</div>

							<div className="flex h-96 flex-col-reverse overflow-y-auto">
								<div className="flex flex-col space-y-2 py-2 px-4">
									{conversation.map((message) => (
										<div
											key={message.id}
											className={classNames(
												'max-w-[75%] rounded-md p-4',
												message.from === 'them'
													? 'self-start rounded-bl-none bg-blue-500 text-white'
													: 'self-end  rounded-br-none bg-gray-300 text-black'
											)}
										>
											{message.text}
										</div>
									))}
								</div>
							</div>

							<form className="p-4 pt-2" onSubmit={handleSend}>
								<div className="flex overflow-hidden rounded-md bg-white text-black">
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
										className="flex select-none p-3 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-500"
									>
										<Icon name="send" />
									</button>
								</div>
							</form>
						</motion.div>
					)}
					{closed && (
						<motion.button
							layout
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setOpen(true)}
							className="relative flex select-none rounded-lg p-4 text-white  hover:bg-gray-800 active:bg-gray-700"
						>
							{conversation.length && (
								<span className="absolute -left-1 -top-1 block rounded-full bg-red-600 p-1 font-semibold text-white">
									<span className="block h-4 w-4 leading-4">
										{conversation.length}
									</span>
								</span>
							)}

							<Icon name="forum" className="!text-[2em]" />
						</motion.button>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}

export { Chat };
