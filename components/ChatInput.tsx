
import React, { useState } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <footer className="flex-shrink-0 p-4 border-t border-violet-200">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                    id="chat-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập tin nhắn của bạn..."
                    className="flex-grow w-full px-4 py-2 bg-violet-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-violet-500 text-violet-900"
                    disabled={isLoading}
                    autoComplete="off"
                />
                <button
                    id="send-btn"
                    type="submit"
                    className="flex-shrink-0 w-10 h-10 bg-violet-500 text-white rounded-full flex items-center justify-center hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:bg-violet-300 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {/* Send icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45 -mr-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </footer>
    );
};

export default ChatInput;