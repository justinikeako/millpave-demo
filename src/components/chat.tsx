import { useState } from 'react';
import { Button } from './button';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { OrchestratedReveal } from './reveal';
import { cn } from '~/lib/utils';
import { Icon } from './icon';
import * as Dialog from '@radix-ui/react-dialog';
import { RemoveScroll } from 'react-remove-scroll';
import { useChat, Message } from 'ai/react';

const initialMessages: Message[] = [
	{ id: 'first', content: 'Hi, how can I help?', role: 'assistant' }
];

function Chat({ hide }: { hide: boolean }) {
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		stop,
		setMessages
	} = useChat({
		initialMessages,
		api: '/api/chat'
	});

	const [open, setOpen] = useState(false);
	const closed = !open;

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<AnimatePresence>
				<OrchestratedReveal
					delay={0.4}
					className="pointer-events-none fixed inset-0 z-20 flex items-end justify-end p-4"
				>
					<AnimatePresence>
						{open && (
							<Dialog.Overlay asChild forceMount>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="absolute inset-0 bg-gray-900/50"
								/>
							</Dialog.Overlay>
						)}
					</AnimatePresence>

					<div
						className={cn(
							RemoveScroll.classNames.zeroRight,
							open && 'h-full w-full lg:h-auto lg:w-auto',
							'pointer-events-auto relative text-gray-100',
							hide && 'pointer-events-none opacity-0'
						)}
					>
						<motion.div
							layout
							className="absolute -inset-px -z-10 rounded-md bg-gray-900 font-semibold shadow-button"
							style={{
								borderRadius: 8,
								boxShadow: '0px 1px 2px 1px rgb(28 25 23 / 0.5)'
							}}
							transition={{ type: 'spring', duration: 0.75, bounce: 0.15 }}
						/>

						<AnimatePresence initial={false}>
							{open && (
								<Dialog.Content forceMount asChild>
									<motion.div
										initial={{ opacity: 0, scale: 0.85 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.85 }}
										transition={{
											type: 'spring',
											delay: 0.15,
											duration: 0.75,
											bounce: 0.2
										}}
										className="flex h-full max-h-[100rem] w-full origin-bottom-right flex-col lg:w-80"
									>
										<div className="flex h-10 items-center gap-1 px-3">
											<Icon name="auto_awesome" size={18} />
											<Dialog.Title className="flex-1">
												Customer Service AI
											</Dialog.Title>

											<div className="flex gap-3">
												<Button
													type="button"
													intent="tertiary"
													backdrop="dark"
													size="small"
													onClick={() => setMessages(initialMessages)}
												>
													<span className="sr-only">Refresh</span>
													<Icon name="refresh" />
												</Button>

												<Dialog.Close asChild>
													<Button
														type="button"
														intent="tertiary"
														backdrop="dark"
														size="small"
													>
														<span className="sr-only">Dismiss</span>
														<Icon name="chevron_down" />
													</Button>
												</Dialog.Close>
											</div>
										</div>
										<ul className="flex grow flex-col justify-end gap-1 overflow-y-auto p-2 lg:h-96">
											{messages.map((message) => (
												<li
													key={message.id}
													className={cn(
														'w-fit max-w-[90%] rounded-xl p-2 px-3 py-1',
														message.role === 'user' && 'self-end bg-gray-700',
														message.role === 'assistant' &&
															'self-start bg-pink-600'
													)}
												>
													<ReactMarkdown
														linkTarget="_blank"
														className="markdownanswer"
													>
														{message.content}
													</ReactMarkdown>
												</li>
											))}
										</ul>
										<div className="flex items-center p-2">
											<form
												className="flex h-10 w-full rounded-sm border border-gray-700 bg-gray-800 outline-2 -outline-offset-2 outline-pink-700 focus-visible:focus-within:outline"
												onSubmit={isLoading ? stop : handleSubmit}
											>
												<input
													type="text"
													name="chat-input"
													id="chat-input"
													value={input}
													onChange={handleInputChange}
													placeholder="Ask a question..."
													className="h-full flex-1 bg-transparent pl-2 outline-none placeholder:text-gray-500"
												/>
												<div className="h-5/6 w-px " />
												<button
													type="submit"
													disabled={input.length === 0 && !isLoading}
													className="aspect-square h-full hover:bg-gray-100/5 active:bg-gray-100/10 disabled:text-gray-500 "
												>
													{isLoading ? (
														<>
															<span className="sr-only">Stop</span>
															<Icon name="stop" />
														</>
													) : (
														<>
															<Icon name="send" />
															<span className="sr-only">Send</span>
														</>
													)}
												</button>
											</form>
										</div>
									</motion.div>
								</Dialog.Content>
							)}
							{closed && (
								<Dialog.Trigger asChild>
									<motion.button
										initial={{ opacity: 0, scale: 2 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 2 }}
										transition={{
											type: 'spring',
											delay: 0.1,
											duration: 0.75,
											bounce: 0.2
										}}
										className="h-16 w-16 origin-bottom-right rounded-md border border-gray-950 before:absolute before:inset-0 before:block before:rounded-[7px] before:bg-gray-100/50 before:opacity-50 before:transition-opacity before:gradient-mask-b-0 after:absolute after:inset-0 after:block after:rounded-[7px] after:border after:border-gray-100/50 after:opacity-50 after:transition-opacity after:gradient-mask-b-0 hover:before:opacity-60 hover:after:opacity-60 active:before:opacity-50 active:before:transition-none active:before:gradient-mask-t-0 active:after:opacity-50 active:after:transition-none"
									>
										<span className="sr-only">Chat</span>
										<Icon name="chat_bubble" size={40} />

										<span className="absolute -right-1 -top-1 z-10 h-4 w-4 rounded-full border border-pink-900 bg-pink-600 bg-gradient-to-b from-white/25" />
									</motion.button>
								</Dialog.Trigger>
							)}
						</AnimatePresence>
					</div>
				</OrchestratedReveal>
			</AnimatePresence>
		</Dialog.Root>
	);
}

export { Chat };
