export interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

// Thêm dòng này để TypeScript hiểu đối tượng aistudio trên window
// Fix: Define an interface for the aistudio object to resolve the type conflict as the error indicates a subsequent declaration expects the type to be 'AIStudio'.
interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
}

declare global {
    interface Window {
        aistudio?: AIStudio;
    }
}
