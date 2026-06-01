import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const messages = body.messages as ChatMessage[] | undefined;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const input = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are a helpful, friendly AI assistant. Keep answers clear, practical, and safe.",
      input,
    });

    return NextResponse.json({ reply: response.output_text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Check server logs." },
      { status: 500 }
    );
  }
}
