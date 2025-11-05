
import React, { useState } from 'react';

interface ApiKeySelectorProps {
    onKeySelected: () => void;
}

const API_KEY_STORAGE_KEY = 'gemini_api_key';

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSaveKey = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
            onKeySelected();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-violet-100 to-violet-200">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg text-center">
                <div className="flex justify-center">
                    <img 
                        src="https://raw.githubusercontent.com/kimanhtv2009/PSYFRIEND/refs/heads/main/cropped_circle_image%20(2).png"
                        alt="PsyFriend logo" 
                        className="w-16 h-16 object-contain"
                    />
                </div>
                <h1 className="text-2xl font-bold text-violet-900">Chào mừng đến với PsyFriend</h1>
                <p className="text-violet-600">
                    Để bắt đầu trò chuyện, vui lòng nhập Gemini API key của bạn. Key của bạn được lưu trữ an toàn trong trình duyệt.
                </p>
                
                <form onSubmit={handleSaveKey} className="space-y-4">
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Dán API key của bạn vào đây"
                        className="w-full px-4 py-2 bg-violet-50 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-violet-400 text-violet-900"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-3 font-semibold text-white bg-violet-500 rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 transition-colors duration-200 disabled:bg-violet-300"
                        disabled={!apiKey.trim()}
                    >
                        Lưu & Bắt đầu Trò chuyện
                    </button>
                </form>

                <p className="text-sm text-gray-500">
                    Bạn có thể lấy API key từ{' '}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">
                        Google AI Studio
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default ApiKeySelector;
