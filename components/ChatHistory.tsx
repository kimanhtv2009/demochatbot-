import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';
import ThinkingIndicator from './ThinkingIndicator';

interface ChatHistoryProps {
    chatHistory: Message[];
    isLoading: boolean;
    onRetry?: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory, isLoading, onRetry }) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isLoading]);

    return (
        <main
            id="chat-container"
            ref={chatContainerRef}
            className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar"
        >
            {chatHistory.map((msg, index) => (
                <ChatMessage 
                    key={index} 
                    message={msg} 
                    onRetry={index === chatHistory.length - 1 && msg.isError ? onRetry : undefined}
                />
            ))}
            {isLoading && <ThinkingIndicator />}
        </main>
    );
};

export default ChatHistory;