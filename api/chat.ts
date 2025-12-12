
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { promises as fs } from 'fs';
import path from 'path';

// This is a Vercel Serverless Function
export default async function handler(req: any, res: any) {
  // 1. Chỉ chấp nhận method POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Kiểm tra API Key
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("❌ LỖI: Chưa cấu hình biến môi trường API_KEY");
    return res.status(500).json({ 
        error: 'Server Misconfiguration: API_KEY is missing. Please check Vercel Settings.' 
    });
  }

  const { chatHistory } = req.body;
  if (!chatHistory) {
    return res.status(400).json({ error: 'chatHistory is required' });
  }

  try {
    // 3. Xử lý đọc file knowledge.md (Cố gắng tìm file ở nhiều vị trí)
    let knowledgeBase = "";
    // Fix: Cast process to any to avoid TS error about cwd() not existing on Process interface in some environments
    const currentDir = (process as any).cwd ? (process as any).cwd() : '/';
    
    const possiblePaths = [
        path.join(currentDir, 'api', 'knowledge.md'), // Vercel thường dùng cái này
        path.join(currentDir, 'knowledge.md'),       // Đôi khi file nằm ở root
    ];

    let fileFound = false;
    for (const filePath of possiblePaths) {
        try {
            knowledgeBase = await fs.readFile(filePath, 'utf-8');
            fileFound = true;
            // console.log(`✅ Đã đọc knowledge.md tại: ${filePath}`);
            break; 
        } catch (e) {
            // console.warn(`⚠️ Không tìm thấy file tại: ${filePath}`);
        }
    }

    if (!fileFound) {
        console.error("❌ LỖI: Không tìm thấy file knowledge.md ở bất kỳ đường dẫn nào.");
        // Nếu không đọc được file, dùng nội dung mặc định để app không bị crash
        knowledgeBase = "Lưu ý: Hệ thống không tải được dữ liệu kiến thức chuyên sâu. Hãy trả lời dựa trên kiến thức chung về tâm lý học đường.";
    }

    // ===================================================================================
    // ✨ HƯỚNG DẪN VAI TRÒ VÀ TÍNH CÁCH CHO PSYFRIEND ✨
    // ===================================================================================
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
Giọng văn: Thân thiện, nhẹ nhàng, gần gũi, ấm áp, không phán xét. Xưng hô "mình" và gọi người dùng là "bạn".
Luôn tích cực, khuyến khích và tạo cảm giác an toàn.

[CÁC NGUYÊN TẮC AN TOÀN - BẮT BUỘC TUÂN THỦ]
- TUYỆT ĐỐI KHÔNG đưa ra chẩn đoán y khoa. Thay vào đó, hãy nói: "Mình không thể đưa ra chẩn đoán, nhưng nếu bạn cảm thấy lo lắng, việc trò chuyện với một chuyên gia tâm lý hoặc cố vấn học đường sẽ rất hữu ích."
- KHÔNG BAO GIỜ đưa ra lời khuyên tiêu cực, nguy hiểm hoặc khuyến khích các hành vi tự hại.
- Nếu người dùng có biểu hiện khủng hoảng nghiêm trọng, hãy cung cấp thông tin liên hệ của các đường dây nóng hỗ trợ tâm lý tại Việt Nam và khuyến khích họ tìm kiếm sự giúp đỡ ngay lập tức.
- Luôn bảo vệ cảm xúc của người dùng, không bao giờ phán xét hay chỉ trích.

[QUY TRÌNH TƯƠNG TÁC VỚI BÀI KHẢO SÁT 30 CÂU HỎI]
Đây là quy trình chính khi người dùng đồng ý làm khảo sát.
1.  BẮT ĐẦU: Khi người dùng nói "bắt đầu", "ok", "đồng ý" hoặc một từ tương tự để làm khảo sát, bạn sẽ bắt đầu với câu hỏi số 1.
2.  HỎI TỪNG CÂU: Mỗi lần bạn chỉ hỏi MỘT câu hỏi trong danh sách 30 câu. Bắt đầu bằng "Câu 1/30: [Nội dung câu hỏi]".
3.  CHỜ PHẢN HỒI: Sau khi hỏi, hãy đợi người dùng tự nhập câu trả lời của họ (ví dụ: "Hoàn toàn đúng", "Đúng", "Không đúng", v.v.). Bạn không cần tạo các nút lựa chọn.
4.  GHI NHẬN VÀ TIẾP TỤC: Khi người dùng trả lời, bạn ghi nhận câu trả lời đó và tiếp tục với câu hỏi tiếp theo (ví dụ: "Câu 2/30: [Nội dung câu hỏi]"). Lặp lại cho đến hết 30 câu.
5.  KẾT THÚC VÀ PHÂN TÍCH: Sau khi người dùng trả lời câu 30, hãy nói một câu cảm ơn và thông báo rằng bạn đang phân tích kết quả. DỰA VÀO LỊCH SỬ TRÒ CHUYỆN, bạn phải:
    a. Chuyển đổi 30 câu trả lời chữ thành điểm (dựa vào bảng quy ước).
    b. Tính tổng điểm cho các nhóm HN, SN, NPD (dựa vào công thức).
    c. Xác định người dùng thuộc Nhóm nào (A, B, C, D, E, F) dựa vào bảng phân nhóm.
    d. Trả về kết quả phân tích CHI TIẾT và DỄ HIỂU.
6.  ĐỊNH DẠNG KẾT QUẢ: Khi trả kết quả, hãy trình bày rõ ràng, sử dụng Markdown để làm nổi bật:
    - "Kết quả khảo sát của bạn:"
    - "**Nhóm hành vi của bạn:** [Tên nhóm] - [Ý nghĩa nhóm]"
    - "**Phân tích chi tiết:** [Giải thích về đặc điểm của nhóm này một cách nhẹ nhàng, không phán xét]."
    - "**Gợi ý dành cho bạn:** [Đưa ra các lời khuyên, khuyến nghị phù hợp với nhóm đó]."

[CƠ SỞ DỮ LIỆU ĐỂ PHÂN TÍCH KHẢO SÁT]
Dưới đây là toàn bộ kiến thức bạn cần để thực hiện bài khảo sát. Hãy tuân thủ nghiêm ngặt các quy tắc tính điểm và phân nhóm.
---
${knowledgeBase}
---
`;

    // Khởi tạo Gemini
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    // FIX: Replaced deprecated getGenerativeModel and startChat with the new ai.chats.create API.
    const chat = ai.chats.create({
      // FIX: Updated to a recommended model for complex text tasks as per guidelines.
      model: "gemini-3-pro-preview",
      history: chatHistory.slice(0, -1), // Gửi lịch sử trừ tin nhắn cuối cùng của người dùng
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        ...generationConfig,
        safetySettings: safetySettings,
      },
    });

    // Lấy tin nhắn cuối cùng của người dùng để gửi
    const lastUserMessage = chatHistory[chatHistory.length - 1].parts.map(p => p.text).join("");

    // FIX: sendMessageStream now takes a message object and returns the stream iterator directly.
    const resultStream = await chat.sendMessageStream({ message: lastUserMessage });
    
    // Thiết lập Header để trả về Stream
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Gửi từng đoạn text về Client
    // FIX: Iterate over the stream directly and use the .text property instead of the .text() method.
    for await (const chunk of resultStream) {
        const chunkText = chunk.text;
        if (chunkText) {
          res.write(chunkText);
        }
    }

    res.end();

  } catch (error: any) {
    console.error('❌ CRITICAL ERROR in /api/chat:', error);
    
    // Phân loại lỗi để trả về thông báo có ích
    let clientErrorMessage = 'Failed to get response from Gemini API.';
    
    if (error.message?.includes('API_KEY')) {
        clientErrorMessage = 'Server Error: Invalid API Key configuration.';
    } else if (error.status === 429) {
        clientErrorMessage = 'Server Error: Too many requests. Please try again later.';
    } else if (error.status === 503) {
        clientErrorMessage = 'Server Error: AI Service is temporarily overloaded.';
    }

    res.status(500).json({ error: clientErrorMessage, details: error.message });
  }
}