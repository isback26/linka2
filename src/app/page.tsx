"use client";

import { useEffect, useState } from "react";

type Interaction = {
  id: string;
  prompt: string;
  answer: string;
  createdAt: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Interaction[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnswer("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "요청 실패");
      setAnswer(data.text);
      setPrompt("");
      // 새로고침 없이 히스토리 갱신
      refreshHistory();
    } catch (err: any) {
      setError(err?.message ?? "예상치 못한 오류");
    } finally {
      setLoading(false);
    }
  }

  async function refreshHistory() {
    const res = await fetch("/api/history", { cache: "no-store" });
    const data = await res.json();
    setHistory(data.items ?? []);
  }

  useEffect(() => {
    refreshHistory();
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Linka 2.0 — AI 응답 & 히스토리</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <label className="block">
          <span className="text-sm text-gray-600">질문</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 w-full rounded border p-3 outline-none focus:ring"
            rows={4}
            placeholder="무엇이든 물어보세요"
            aria-label="질문 입력"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "생각 중..." : "질문 보내기"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {answer && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-medium">이번 답변</h2>
          <div className="whitespace-pre-wrap rounded border bg-white p-4">
            {answer}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-medium">최근 질문 20개</h2>
        <ul className="space-y-3">
          {history.map((h) => (
            <li key={h.id} className="rounded border bg-white p-4">
              <div className="text-sm text-gray-500">
                {new Date(h.createdAt).toLocaleString()} · {h.latencyMs}ms ·
                토큰 P{h.promptTokens}/C{h.completionTokens}
              </div>
              <div className="mt-1 font-medium">Q: {h.prompt}</div>
              <div className="mt-1 whitespace-pre-wrap">A: {h.answer}</div>
            </li>
          ))}
          {history.length === 0 && (
            <li className="text-sm text-gray-500">아직 기록이 없습니다.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
