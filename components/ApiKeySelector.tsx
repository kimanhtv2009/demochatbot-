
import React from 'react';

interface ApiKeySelectorProps {
    onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
    const handleSelectKey = async () => {
        if (window.aistudio) {
            try {
                await window.aistudio.openSelectKey();
                // Theo hướng dẫn, giả định thành công sau khi gọi và cập nhật trạng thái.
                onKeySelected();
            } catch (e) {
                console.error("Không thể mở lựa chọn API key:", e);
                alert("Không thể mở hộp thoại chọn API key. Vui lòng kiểm tra console để biết lỗi.");
            }
        } else {
            alert("Việc chọn API key không khả dụng trong môi trường này.");
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
                    Để bắt đầu trò chuyện, bạn cần chọn một API key. Key của bạn được lưu trữ an toàn và chỉ được sử dụng cho phiên này.
                </p>
                <p className="text-sm text-gray-500">
                    Dự án này yêu cầu một Gemini API key. Để biết thêm thông tin về thanh toán, vui lòng xem{' '}
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">
                        tài liệu thanh toán
                    </a>.
                </p>
                <button
                    onClick={handleSelectKey}
                    className="w-full px-4 py-3 font-semibold text-white bg-violet-500 rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 transition-colors duration-200"
                >
                    Chọn API Key
                </button>
            </div>
        </div>
    );
};

export default ApiKeySelector;
