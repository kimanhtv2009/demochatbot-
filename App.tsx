
import React, { useState, useEffect, useCallback } from 'react';
import { callGeminiAPI } from './api/chat';
import type { Message } from './types';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import ApiKeySelector from './components/ApiKeySelector';

const App: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isKeySelected, setIsKeySelected] = useState<boolean>(false);

    useEffect(() => {
        const checkApiKey = async () => {
            try {
                if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                    setIsKeySelected(true);
                }
            } catch (e) {
                console.error("Error checking for API key:", e);
            }
        };
        checkApiKey();
    }, []);
    
    const initializeChat = useCallback(() => {
        const welcomeMessage: Message = {
            role: 'model',
            parts: [{ text: "Xin chào! Tôi là PsyFriend, người bạn đồng hành của bạn. Tôi ở đây để lắng nghe và cung cấp một không gian an toàn để bạn chia sẻ về những khó khăn, đặc biệt là các vấn đề liên quan đến ái kỷ trong môi trường học đường. Bạn muốn bắt đầu cuộc trò chuyện như thế nào?" }]
        };
        // Chỉ đặt tin nhắn chào mừng nếu cuộc trò chuyện trống, để tránh đặt lại khi render lại
        if (chatHistory.length === 0) {
            setChatHistory([welcomeMessage]);
        }
    }, [chatHistory.length]);

    // Khởi tạo cuộc trò chuyện khi component được mount NẾU một key đã được chọn
    useEffect(() => {
        if (isKeySelected) {
            initializeChat();
        }
    }, [isKeySelected, initializeChat]);

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
            const errorMessage = err instanceof Error ? err.message : "Đã có lỗi không xác định xảy ra. Vui lòng thử lại sau.";
            
            if (errorMessage.includes('API key not valid') || errorMessage.includes('Requested entity was not found')) {
                const keyErrorMessage = "API key của bạn không hợp lệ. Vui lòng chọn một key khác.";
                setError(keyErrorMessage);
                const errorBotMessage: Message = { role: 'model', parts: [{ text: `Lỗi: ${keyErrorMessage}` }] };
                setChatHistory(prev => [...prev, errorBotMessage]);
                setIsKeySelected(false); // Kích hoạt lại việc chọn API key
                setIsLoading(false);
                return;
            }

            setError(errorMessage);
            const errorBotMessage: Message = { role: 'model', parts: [{ text: `Lỗi: ${errorMessage}` }] };
            setChatHistory(prev => [...prev, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isKeySelected) {
        return <ApiKeySelector onKeySelected={() => setIsKeySelected(true)} />;
    }

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
