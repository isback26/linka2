# Linka 2.0 — Session Notes (2025-10-26)

## ✅ Today’s Outcome
- Next.js(App Router, TS) + OpenAI 연결
- API: POST /api/ai (SYSTEM_PROMPT, 입력 검증, 지연/토큰 로깅)
- DB: Prisma + SQLite(Interaction) — 질문/답변 저장
- UI: 홈(page.tsx) 질문 폼 + 최근 히스토리 20개 렌더

## 🧩 Paths & Env
- Repo: C:\A_Linka_v2.0\linka2  (GitHub: isback26/linka2)
- Run: npm install && npm run dev  → http://localhost:3000
- DB UI: npx prisma studio  → http://localhost:5555
- .env (UTF-8): DATABASE_URL="file:./dev.db"
- .env.local: OPENAI_API_KEY=..., OPENAI_MODEL=gpt-4o-mini

## 🧯 Tips
- PowerShell 정책: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
- Port 충돌: $env:PORT="3001"; npm run dev
- Prisma .env 충돌: prisma\.env 제거, 루트 .env만 사용
