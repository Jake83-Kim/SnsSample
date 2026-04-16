"use client";

import React from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--surface)] px-5 py-8 text-[var(--ink)]">
      <div className="absolute inset-x-0 top-[-18rem] mx-auto h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(103,230,171,0.28),_transparent_68%)]" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(32,34,37,0.14),_transparent_70%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_420px]">
          <section className="hidden lg:block">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--brand)]">
              Hyperlocal Social MVP
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.05]">
              동네를 발견하고 바로 연결되는
              <span className="block text-[var(--brand)]">실전형 SNS 플랫폼</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              지도 기반 발견, 감도 있는 피드, 빠른 작성 흐름을 하나의 모바일 경험으로 묶었습니다.
              첨부하신 시안의 깨끗한 화이트 베이스와 그린 포인트를 유지하면서, 실제 서비스용 정보 밀도와 신뢰감을 더했습니다.
            </p>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className="glass-card rounded-[28px] p-5">
                <p className="text-3xl font-semibold">4.8</p>
                <p className="mt-2 text-sm text-[var(--muted)]">지역 탐색 만족도</p>
              </div>
              <div className="glass-card rounded-[28px] p-5">
                <p className="text-3xl font-semibold">12m</p>
                <p className="mt-2 text-sm text-[var(--muted)]">첫 게시까지 평균 시간</p>
              </div>
              <div className="glass-card rounded-[28px] p-5">
                <p className="text-3xl font-semibold">92%</p>
                <p className="mt-2 text-sm text-[var(--muted)]">모바일 리텐션 가정</p>
              </div>
            </div>
          </section>

          <section className="phone-shell mx-auto w-full max-w-[420px] rounded-[40px] p-4">
            <div className="panel relative overflow-hidden rounded-[32px] px-6 py-7">
              <div className="mx-auto mb-6 h-1.5 w-16 rounded-full bg-[rgba(33,35,38,0.12)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">
                Welcome
              </p>
              <h2 className="mt-3 text-3xl font-semibold">NearU Social</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                취향과 위치가 자연스럽게 만나도록 설계된 로컬 SNS입니다. 지금 닉네임만 정하고 샘플 운영 피드에 바로 प्रवेश하세요.
              </p>

              <div className="mt-7 rounded-[28px] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">오늘의 동네 무드</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">성수, 연남, 한남에서 새 포스트 146개</p>
                  </div>
                  <div className="flex -space-x-2">
                    <span className="avatar-ring h-10 w-10 bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')] bg-cover bg-center" />
                    <span className="avatar-ring h-10 w-10 bg-[url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80')] bg-cover bg-center" />
                    <span className="avatar-ring h-10 w-10 bg-[url('https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80')] bg-cover bg-center" />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-7">
                <label className="mb-3 block text-sm font-semibold text-[var(--muted)]">
                  프로필 이름
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="예: suji.seoul"
                  className="w-full rounded-[22px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-4 text-base outline-none transition focus:border-[rgba(45,168,93,0.45)] focus:ring-4 focus:ring-[rgba(45,168,93,0.12)]"
                />

                <button
                  type="submit"
                  className="mt-4 w-full rounded-[22px] bg-[var(--brand)] px-4 py-4 text-base font-semibold text-white shadow-[0_18px_30px_rgba(45,168,93,0.28)] transition hover:bg-[var(--brand-deep)]"
                >
                  피드 시작하기
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between rounded-[22px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">운영 모드</p>
                  <p className="mt-1 text-[var(--muted)]">더미 데이터 기반 MVP 프리뷰</p>
                </div>
                <span className="rounded-full bg-[rgba(45,168,93,0.12)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                  READY
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Login;
