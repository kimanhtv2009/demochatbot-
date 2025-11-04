
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Message } from '../types';

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

// 🤫 QUAN TRỌNG: Hãy thay thế "YOUR_API_KEY_HERE" bằng API Key Google AI của bạn.
const API_KEY = "AIzaSyDTzed7QlVlKU_ccbu1I6UEMuE1Pc8LCw4";

export const callGeminiAPI = async (chatHistory: Message[]): Promise<string> => {
    if (!API_KEY || API_KEY === "AIzaSyDTzed7QlVlKU_ccbu1I6UEMuE1Pc8LCw4") {
        return "Lỗi: Vui lòng thay thế 'YOUR_API_KEY_HERE' bằng API Key của bạn trong file api/chat.ts.";
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const processedHistory = chatHistory.filter((message, index) => {
            return !(index === 0 && message.role === 'model');
        });

        if (processedHistory.length === 0) {
            return "Vui lòng nhập một tin nhắn để bắt đầu cuộc trò chuyện.";
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: processedHistory.map(msg => ({
                role: msg.role,
                parts: msg.parts,
            })),
            config: {
                systemInstruction: SYSTEM_INSTRUCTIONS,
            },
        });

        return response.text;

    } catch (error) {
        console.error("Lỗi khi gọi trực tiếp API Gemini:", error);
        if (error instanceof Error) {
            // Trả về thông báo lỗi gốc từ API để hiển thị trên UI
            throw new Error(error.message);
        }
        // Lỗi dự phòng
        throw new Error('Đã có lỗi không xác định xảy ra khi kết nối đến dịch vụ AI.');
    }
};
