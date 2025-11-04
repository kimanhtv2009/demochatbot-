
import React from 'react';

const Header: React.FC = () => (
    <header className="flex-shrink-0 p-4 border-b border-violet-200 flex items-center space-x-3">
        <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
            <img 
                src="https://raw.githubusercontent.com/kimanhtv2009/PSYFRIEND/refs/heads/main/cropped_circle_image%20(2).png"
                alt="PsyFriend logo" 
                className="w-9 h-9 object-contain"
            />
        </div>
        <div>
            <h1 className="text-xl font-bold text-violet-900">PsyFriend</h1>
            <p className="text-sm text-violet-600">Không gian an toàn để lắng nghe và chia sẻ</p>
        </div>
    </header>
);

export default Header;