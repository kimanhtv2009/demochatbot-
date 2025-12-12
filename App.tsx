
import React, { useState, useEffect, useCallback } from 'react';
import type { Message } from './types';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

    // Hàm xử lý logic gọi API và Stream dữ liệu
    const processChatResponse = async (historyToProcess: Message[]) => {
        setIsLoading(true);

        // Thêm placeholder cho tin nhắn bot đang trả lời
        setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "" }] }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatHistory: historyToProcess }),
            });

            if (!response.ok) {
                let errorMessage = 'Đã có lỗi xảy ra từ server.'; // Tin nhắn mặc định
                try {
                    // Cố gắng đọc lỗi chi tiết dạng JSON từ server
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage; // Ưu tiên dùng lỗi chi tiết
                } catch (jsonError) {
                    // Nếu server trả về không phải JSON, dùng statusText
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            if (!response.body) {
                throw new Error('Không nhận được phản hồi từ server.');
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                accumulatedText += decoder.decode(value, { stream: true });

                setChatHistory(prev => {
                    const updatedHistory = [...prev];
                    updatedHistory[updatedHistory.length - 1] = { role: 'model', parts: [{ text: accumulatedText }] };
                    return updatedHistory;
                });
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Đã có lỗi không xác định xảy ra.";
            
            // Cập nhật tin nhắn cuối cùng (placeholder) thành tin nhắn lỗi
            setChatHistory(prev => {
                const historyWithoutPlaceholder = prev.slice(0, -1);
                const errorBotMessage: Message = { 
                    role: 'model', 
                    parts: [{ text: `Rất tiếc, đã có lỗi xảy ra: ${errorMessage}` }],
                    isError: true 
                };
                return [...historyWithoutPlaceholder, errorBotMessage];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (userInput: string) => {
        if (!userInput.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', parts: [{ text: userInput }] };
        const newChatHistory = [...chatHistory, userMessage];
        
        setChatHistory(newChatHistory);
        await processChatResponse(newChatHistory);
    };

    const handleRetry = async () => {
        // Tìm tin nhắn lỗi cuối cùng và xóa nó đi để thử lại
        if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].isError) {
            const historyToRetry = chatHistory.slice(0, -1); // Bỏ tin nhắn lỗi
            setChatHistory(historyToRetry);
            await processChatResponse(historyToRetry);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
            <div className="flex flex-col w-full max-w-2xl h-[95vh] sm:h-[90vh] bg-white rounded-2xl shadow-lg">
                <Header />
                <ChatHistory 
                    chatHistory={chatHistory} 
                    isLoading={isLoading} 
                    onRetry={handleRetry}
                />
                <ChatInput 
                    onSendMessage={handleSendMessage} 
                    isLoading={isLoading} 
                />
            </div>
        </div>
    );
};

export default App;