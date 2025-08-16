import { NextRequest, NextResponse } from "next/server";

// Supported languages
const supportedModels: { [key: string]: string } = {
  es: "Helsinki-NLP/opus-mt-en-es",
  hi: "Helsinki-NLP/opus-mt-en-hi",
  fr: "Helsinki-NLP/opus-mt-en-fr",
  ru: "Helsinki-NLP/opus-mt-en-ru",
};

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json();
    const model = supportedModels[targetLang] || "Helsinki-NLP/opus-mt-en-es"; // fallback to Spanish

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    const result = await response.json();
    const translatedText = result?.[0]?.translation_text || text; // fallback to original

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    return NextResponse.json({ translatedText: "Translation failed", error: error.message });
  }
}
