import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
    message: Message;
    onRetry?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
    const isUser = message.role === 'user';
    const isError = message.isError;
    const textContent = message.parts.map(part => part.text).join("");

    // Nếu là tin nhắn lỗi
    if (isError) {
        return (
            <div className="flex items-start justify-start space-x-2">
                <div className="flex flex-col space-y-2 max-w-xs md:max-w-md lg:max-w-lg">
                    <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-800 rounded-2xl rounded-bl-lg">
                        <div className="flex items-center space-x-2 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold text-xs uppercase tracking-wide">Lỗi hệ thống</span>
                        </div>
                        <p className="text-sm break-words">{textContent}</p>
                    </div>
                    {onRetry && (
                        <button 
                            onClick={onRetry}
                            className="self-start text-xs flex items-center space-x-1 text-red-600 hover:text-red-800 hover:underline transition-colors focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Thử lại</span>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                    isUser
                        ? 'bg-violet-500 text-white rounded-br-lg'
                        : 'bg-violet-100 text-violet-900 rounded-bl-lg'
                }`}
            >
                <p className="text-sm break-words whitespace-pre-wrap">{textContent}</p>
            </div>
        </div>
    );
};

export default ChatMessage;