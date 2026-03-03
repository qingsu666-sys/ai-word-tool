import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || "You are a helpful assistant.";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "服务端未配置 API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `${SYSTEM_PROMPT}\n\n${input}`;

    const geminiResult = await model.generateContent(prompt);
    const result = geminiResult.response.text();

    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("API route error:", err);
    const errMsg = err instanceof Error ? err.message : "服务器内部错误";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
