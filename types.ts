export interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

// Thêm dòng này để TypeScript hiểu đối tượng aistudio trên window
// Fix: Resolve "Subsequent property declarations must have the same type" error by inlining the type definition for `aistudio` and removing the potentially conflicting `AIStudio` interface.
declare global {
    interface Window {
        aistudio?: {
            hasSelectedApiKey: () => Promise<boolean>;
            openSelectKey: () => Promise<void>;
        };
    }
}
