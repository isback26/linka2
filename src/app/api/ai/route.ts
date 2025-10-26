// src/app/api/ai/route.ts
export const runtime = "nodejs"; // Vercel/Next에서 Node 런타임 사용

import OpenAI from "openai";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompt"; // ← 시스템 프롬프트 분리본
import { prisma } from "@/lib/db";            // ← Prisma 클라이언트

// 환경변수에서 모델명/키 읽기 (모델은 필요 시 변경)
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    // 1) 환경 체크
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "서버에 OPENAI_API_KEY가 설정되어 있지 않습니다." },
        { status: 500 }
      );
    }

    // 2) 요청 파싱
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "유효하지 않은 JSON 요청입니다." }, { status: 400 });
    }

    const promptRaw =
      typeof body === "object" && body !== null ? (body as any).prompt : undefined;
    const cleaned = typeof promptRaw === "string" ? promptRaw.trim() : "";

    // 3) 입력 검증
    if (!cleaned) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }
    if (cleaned.length > 2000) {
      return NextResponse.json({ error: "질문이 너무 깁니다(최대 2000자)." }, { status: 400 });
    }

    // 4) OpenAI 호출 + 지연 측정
    const started = Date.now();

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: cleaned },
      ],
    });

    const latencyMs = Date.now() - started;

    const text = completion.choices?.[0]?.message?.content?.trim() ?? "";
    const usage = completion.usage ?? {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    // 5) 서버 로그(관측)
    console.log("[/api/ai]", {
      ts: new Date().toISOString(),
      latency_ms: latencyMs,
      prompt_len: cleaned.length,
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
      model: MODEL,
    });

    // 6) ←← 여기서 **DB 저장** (Prisma)
    try {
      await prisma.interaction.create({
        data: {
          prompt: cleaned,
          answer: text,
          latencyMs,
          promptTokens: usage.prompt_tokens ?? 0,
          completionTokens: usage.completion_tokens ?? 0,
        },
      });
    } catch (dbErr) {
      // 저장 실패가 전체 요청을 망치지 않도록 경고만 출력
      console.warn("[/api/ai] DB save failed:", dbErr);
    }

    // 7) 응답
    return NextResponse.json({ text });
  } catch (err: any) {
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      "server error";
    console.error("[/api/ai][error]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
