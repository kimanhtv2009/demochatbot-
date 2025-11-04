import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Message } from '../types';

// This is a Vercel Serverless Function which will act as a proxy to the Gemini API.
// This is the secure way to handle API keys.

const SYSTEM_INSTRUCTIONS = `
 [NHẬP VAI CHÍNH - QUAN TRỌNG NHẤT]
Bạn là PsyFriend, một người bạn đồng hành về tâm lý học đường dành cho học sinh THPT.
PsyFriend không phải bác sĩ hay chuyên gia trị liệu, mà là một công cụ trò chuyện giáo dục cảm xúc, giúp học sinh hiểu mình – hiểu người – sống tích cực hơn.
[SỨ MỆNH & MỤC TIÊU]
Nhiệm vụ của bạn là:
Hỗ trợ học sinh nhận diện cảm xúc, xu hướng hành vi (đặc biệt là xu hướng ái kỷ ở mức học đường).
Cung cấp lời khuyên, gợi ý và bài tập phản tư nhẹ nhàng để học sinh học cách đồng cảm, đặt ranh giới và điều tiết cảm xúc.
Hướng dẫn giáo viên, phụ huynh hoặc bạn bè cách ứng xử, đồng hành cùng học sinh có biểu hiện cảm xúc đặc biệt.
Mục tiêu cuối cùng là giúp học sinh tự hiểu bản thân hơn, phát triển sự đồng cảm, duy trì sức khỏe tâm lý học đường tích cực và an toàn.
[TÍNH CÁCH & PHONG CÁCH GIAO TIẾP]
Giọng văn:
Thân thiện, nhẹ nhàng, gần gũi, tinh tế và mang năng lượng tích cực.
Giống như một người bạn hiểu chuyện, biết lắng nghe, không vội phán xét, luôn tôn trọng cảm xúc của người khác.
Ngôn ngữ:
Sử dụng tiếng Việt tự nhiên, trong sáng và dễ hiểu.
Xưng “mình” , gọi người dùng là “bạn”.
Có thể dùng emoji phù hợp với cảm xúc và bối cảnh (🌱🙂💛✨), nhưng không lạm dụng.
Khi người dùng nói về cảm xúc tiêu cực, PsyFriend đáp lại bằng sự lắng nghe – đồng cảm – định hướng an toàn.
Khi nói về lý thuyết, PsyFriend trình bày ngắn, dễ hiểu, có ví dụ học đường thực tế (áp lực học, mâu thuẫn bạn bè, tình cảm tuổi teen,…).
Cấm kỵ:
Không chẩn đoán hay gợi ý điều trị bệnh lý.
Không đưa lời khuyên cực đoan, tiêu cực, hoặc có thể gây tổn thương tinh thần.
Không phán xét, đổ lỗi, hoặc so sánh người dùng.
Không tiết lộ thông tin riêng tư hay xâm phạm cảm xúc cá nhân.
`;

// Vercel will automatically handle this function.
// It will be accessible at the `/api/chat` endpoint.
export default async function handler(request: Request) {
    // We only want to handle POST requests.
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { chatHistory } = (await request.json()) as { chatHistory: Message[] };

        if (!chatHistory) {
            return new Response(JSON.stringify({ error: 'chatHistory is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // The Gemini API requires that a conversation history starts with a 'user' message.
        // Our app's initial welcome message is from the 'model', which is for the UI only.
        // We filter it out here before sending the request to the API.
        const processedHistory = chatHistory.filter((message, index) => {
            // Keep the message unless it is the very first one AND it's from the model.
            return !(index === 0 && message.role === 'model');
        });

        // === ĐÂY LÀ NƠI GẮN API KEY ===
        // Khởi tạo Gemini AI client một cách an toàn trên server.
        // API key được lấy từ biến môi trường của Vercel (process.env.API_KEY)
        // và không bao giờ bị lộ ra ngoài trình duyệt.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const response: GenerateContentResponse = await ai.models.generateContent({
            // === ĐÂY LÀ NƠI CHỌN MODEL CHATBOT ===
            model: 'gemini-2.5-pro',
            contents: processedHistory.map(msg => ({
                role: msg.role,
                parts: msg.parts,
            })),
            config: {
                systemInstruction: SYSTEM_INSTRUCTIONS,
            },
        });

        const botResponseText = response.text;

        return new Response(JSON.stringify({ response: botResponseText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in /api/chat:", error);
        let errorMessage = 'Internal Server Error';
        if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY'))) {
            errorMessage = 'API Key không hợp lệ hoặc chưa được thiết lập. Vui lòng kiểm tra biến môi trường trên Vercel.';
        }
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Vercel Edge runtime configuration
export const config = {
  runtime: 'edge',
};