"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      setError(err?.message ?? "예상치 못한 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Linka 2.0 — 첫 AI 응답</h1>

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
          <h2 className="mb-2 text-lg font-medium">답변</h2>
          <div className="whitespace-pre-wrap rounded border bg-white p-4">{answer}</div>
        </section>
      )}
    </main>
  );
}
