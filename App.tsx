import React, { useState, useEffect, useCallback } from 'react';
import type { Message } from './types';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestionChips, setSuggestionChips] = useState<string[]>([]);

    const initializeChat = useCallback(() => {
        const welcomeMessage: Message = {
            role: 'model',
            parts: [{ text: "Xin chào! Mình là PsyFriend, người bạn đồng hành về tâm lý học đường của bạn. 🌱\n\nMình ở đây để lắng nghe và tạo một không gian an toàn để bạn chia sẻ. Bạn đang cảm thấy thế nào hôm nay?\n\nNếu bạn muốn, chúng ta có thể bắt đầu với một bài khảo sát nhỏ để hiểu rõ hơn về bản thân." }]
        };
        if (chatHistory.length === 0) {
            setChatHistory([welcomeMessage]);
        }
    }, [chatHistory.length]);

    useEffect(() => {
        initializeChat();
    }, [initializeChat]);


    const handleSendMessage = async (userInput: string) => {
        if (!userInput.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', parts: [{ text: userInput }] };
        const newChatHistory = [...chatHistory, userMessage];
        
        setChatHistory(newChatHistory);
        setIsLoading(true);
        setError(null);
        setSuggestionChips([]);

        const botMessagePlaceholder: Message = { role: 'model', parts: [{ text: "" }] };
        setChatHistory(prev => [...prev, botMessagePlaceholder]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatHistory: newChatHistory }),
            });

            if (!response.ok || !response.body) {
                const errorData = response.statusText;
                throw new Error(errorData || 'Đã có lỗi xảy ra từ server.');
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                accumulatedText += decoder.decode(value, { stream: true });
                
                const suggestionMarker = '[SUGGESTIONS]:';
                const markerIndex = accumulatedText.indexOf(suggestionMarker);
                
                let displayText = accumulatedText;

                if (markerIndex !== -1) {
                    displayText = accumulatedText.substring(0, markerIndex).trim();
                    const suggestionsPart = accumulatedText.substring(markerIndex + suggestionMarker.length);
                    const chips = suggestionsPart.split(';').map(s => s.trim()).filter(Boolean);
                    if (JSON.stringify(chips) !== JSON.stringify(suggestionChips)) {
                         setSuggestionChips(chips);
                    }
                } else {
                    setSuggestionChips([]);
                }

                setChatHistory(prev => {
                    const updatedHistory = [...prev];
                    updatedHistory[updatedHistory.length - 1] = { role: 'model', parts: [{ text: displayText }] };
                    return updatedHistory;
                });
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Đã có lỗi không xác định xảy ra. Vui lòng thử lại sau.";
            setError(errorMessage);
            const errorBotMessage: Message = { role: 'model', parts: [{ text: `Lỗi: ${errorMessage}` }] };
            // Replace the placeholder with the error message
            setChatHistory(prev => {
                const historyWithoutPlaceholder = prev.slice(0, -1);
                return [...historyWithoutPlaceholder, errorBotMessage];
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
            <div className="flex flex-col w-full max-w-2xl h-[95vh] sm:h-[90vh] bg-white rounded-2xl shadow-lg">
                <Header />
                <ChatHistory chatHistory={chatHistory} isLoading={isLoading} />
                <ChatInput 
                    onSendMessage={handleSendMessage} 
                    isLoading={isLoading} 
                    suggestionChips={suggestionChips}
                />
            </div>
        </div>
    );
};

export default App;