import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeDrawResult(drawResult: { category: string, order: number, id: string, name: string }[]) {
  const prompt = `
    你是一位專業的科技賽事評論員。以下是「網管處AI推動競賽」決賽的抽籤結果順序：
    ${drawResult.map(item => `${item.category}類 第${item.order}順位: [${item.id}] ${item.name}`).join('\n')}

    請撰寫一段「戰情分析」（約150~200字）。
    分析重點：
    1. 這個順序對於前、中、後段出場隊伍的影響。
    2. 哪些隊伍的對決組合特別有看點。
    3. 結尾給予參賽隊伍勉勵，展現科技競爭的臨場感。
    請用繁體中文撰寫，語氣要專業、具備戰鬥感且充滿科技感。
    請使用 Markdown 格式，將隊伍 ID（如 [A-01]）用 ** 加粗，這將會被前端特別標註。
    標題請用：## 【 戰情分析：網管AI 巔峰決賽 】
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "無法生成戰情分析。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 戰情分析系統暫時離線，請觀察現場氣氛。";
  }
}
