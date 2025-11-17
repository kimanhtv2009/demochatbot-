import React from 'react';

interface SuggestionChipsProps {
    chips: string[];
    onChipClick: (chipText: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ chips, onChipClick }) => {
    if (chips.length === 0) {
        return null;
    }

    return (
        <div className="px-4 pt-4 pb-2 flex flex-wrap gap-2 justify-center">
            {chips.map((chip, index) => (
                <button
                    key={index}
                    onClick={() => onChipClick(chip)}
                    className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-colors"
                >
                    {chip}
                </button>
            ))}
        </div>
    );
};

export default SuggestionChips;
