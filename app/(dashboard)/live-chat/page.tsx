"use client";

import { useSocket } from '@/components/SocketProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { FormEvent, useEffect, useState } from 'react';

interface Message {
	sender: 'me' | 'other';
	message: string;
}

export default function LiveChat() {
	const [messages, setMessages] = useState<Message[]>([]);

	const socket = useSocket();

useEffect(() => {
	if (!socket) return;
	console.log("Socket connected");

	socket.on("sendMessage", (message: string) => {
		setMessages((prevMessages) => [...prevMessages, {
			sender: 'other',
			message
		}]);
	});

	return () => {
		socket.off("sendMessage");
	};

}, [socket]);

	const sendMessage = (e: FormEvent<HTMLFormElement>) => {
		if (!socket) {
			alert('Socket not connected');
			return;
		}
		e.preventDefault();
		const form = e.currentTarget
		const formData = new FormData(form);
		const message = formData.get('message') as string
		socket.emit('sendMessage', message);
		setMessages([...messages, {
			sender: 'me',
			message
		}]);
		form.reset();
	}

	return (
		<>
			<div className="px-20 py-5">
				<h1 className="text-2xl font-bold text-center mb-5">Live Chat Without database</h1>
				<div className="space-y-10 mb-5">
					{messages.map((message, index) => (
						<div key={index} className={`p-2 rounded-md ${message.sender === 'me' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
							{message.message}
						</div>
					))}
				</div>

				<form onSubmit={sendMessage} className="flex space-x-2">
					<Input type="text" name='message' />
					<Button>Send</Button>
				</form>

			</div>
		</>
	);
}
