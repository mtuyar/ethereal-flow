import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getAiMotivation = async (userName: string, completedTasks: number, pendingTasks: number, recentHabit: string) => {
  if (!apiKey) {
    return "API Anahtarı bulunamadı. Lütfen ortam değişkenlerini kontrol edin.";
  }

  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Sen 'Ethereal Flow' adında fütüristik bir uygulamanın bilge, stoacı ve motive edici yapay zeka rehberisin.
      Kullanıcı adı: ${userName}.
      Bugün tamamlanan görev sayısı: ${completedTasks}.
      Kalan görev sayısı: ${pendingTasks}.
      Son zamanlarda odaklandığı alışkanlık: ${recentHabit || 'Genel Gelişim'}.

      Bu verilere dayanarak, kullanıcıya kısa, derin ve sanatsal bir motivasyon tavsiyesi ver. 
      Sıradan "aferin" deme. Onlara potansiyellerini hatırlat. Cümlelerin kısa ve vurucu olsun. Türkçe cevap ver.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Evrenin derinliklerinden gelen bağlantıda bir kopukluk oldu. Lütfen daha sonra tekrar dene.";
  }
};
