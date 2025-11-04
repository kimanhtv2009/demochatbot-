
import React from 'react';

const ThinkingIndicator: React.FC = () => (
    <div className="flex items-end justify-start">
        <div className="bg-violet-100 rounded-2xl rounded-bl-lg p-3">
            <div className="flex items-center justify-center space-x-1">
                <span className="h-2 w-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-violet-400 rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
);

export default ThinkingIndicator;