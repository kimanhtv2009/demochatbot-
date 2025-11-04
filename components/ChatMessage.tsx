
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const textContent = message.parts.map(part => part.text).join("");

    return (
        <div className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                    isUser
                        ? 'bg-violet-500 text-white rounded-br-lg'
                        : 'bg-violet-100 text-violet-900 rounded-bl-lg'
                }`}
            >
                <p className="text-sm break-words">{textContent}</p>
            </div>
        </div>
    );
};

export default ChatMessage;