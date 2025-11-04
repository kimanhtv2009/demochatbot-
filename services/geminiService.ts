import type { Message } from '../types';

export const callGeminiAPI = async (chatHistory: Message[]): Promise<string> => {
    try {
        // The frontend now calls our own backend API route on Vercel,
        // instead of calling the Gemini API directly. This is more secure.
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatHistory }),
        });

        if (!response.ok) {
            // Try to get a more specific error message from the backend
            const errorData = await response.json().catch(() => null); // Gracefully handle non-JSON error responses
            const errorMessage = errorData?.error || `Error: ${response.status} ${response.statusText}`;
            throw new Error(`API request failed: ${errorMessage}`);
        }

        const data = await response.json();
        
        // The backend API returns the response text in a 'response' property.
        return data.response;

    } catch (error) {
        console.error("Lỗi khi gọi API proxy:", error);
        // Propagate the error to the UI component to handle it.
        throw error;
    }
};
