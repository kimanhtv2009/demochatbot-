
import React from 'react';

const Header: React.FC = () => (
    <header className="flex-shrink-0 p-4 border-b border-slate-200 flex items-center space-x-3">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
            {/* Placeholder SVG logo */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </div>
        <div>
            <h1 className="text-xl font-bold text-slate-800">PsyFriend</h1>
            <p className="text-sm text-slate-500">Không gian an toàn để lắng nghe và chia sẻ</p>
        </div>
    </header>
);

export default Header;
