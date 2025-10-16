
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { callGeminiAPI } from './services/geminiService';
import type { Message } from './types';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const initializeChat = useCallback(() => {
        setIsLoading(true);
        const welcomeMessage: Message = {
            role: 'model',
            parts: [{ text: "Xin chào! Tôi là PsyFriend, người bạn đồng hành của bạn. Tôi ở đây để lắng nghe và cung cấp một không gian an toàn để bạn chia sẻ về những khó khăn, đặc biệt là các vấn đề liên quan đến ái kỷ trong môi trường học đường. Bạn muốn bắt đầu cuộc trò chuyện như thế nào?" }]
        };
        setChatHistory([welcomeMessage]);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        initializeChat();
    }, [initializeChat]);

    const handleSendMessage = async (userInput: string) => {
        if (!userInput.trim()) return;

        const userMessage: Message = { role: 'user', parts: [{ text: userInput }] };
        const newChatHistory = [...chatHistory, userMessage];
        
        setChatHistory(newChatHistory);
        setIsLoading(true);
        setError(null);

        try {
            const botResponse = await callGeminiAPI(newChatHistory);
            const botMessage: Message = { role: 'model', parts: [{ text: botResponse }] };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";
            setError(errorMessage);
            const errorBotMessage: Message = { role: 'model', parts: [{ text: errorMessage }] };
            setChatHistory(prev => [...prev, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
            <div className="flex flex-col w-full max-w-2xl h-[95vh] sm:h-[90vh] bg-white rounded-2xl shadow-lg">
                <Header />
                <ChatHistory chatHistory={chatHistory} isLoading={isLoading} />
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default App;
