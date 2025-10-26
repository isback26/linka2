# Next Steps (Week 2 Kickoff)

0) 런 전 점검
- [ ] npm run dev / http://localhost:3000
- [ ] OPENAI 키/모델 OK
- [ ] npx prisma studio 에서 Interaction 보임

1) 온보딩 빈 화면 + 샘플 질문 3개
- 빈 상태 카드 + 버튼 3개 → 클릭 시 자동 전송

2) 응답 스트리밍
- /api/ai 스트리밍 엔드포인트 추가
- 클라이언트 chunk 렌더

3) 미니 평가셋(10개)
- scripts/eval.ts → 평균 latency/토큰/오류 출력

4) 배포/운영
- Vercel 배포 + ENV 설정
- 브랜치 보호 + Actions CI
