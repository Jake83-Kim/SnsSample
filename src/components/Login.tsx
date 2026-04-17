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
      onLogin(username.trim());
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--surface)] px-5 py-8 text-[var(--ink)]">
      <div className="absolute inset-x-0 top-[-18rem] mx-auto h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(255,106,50,0.22),_transparent_68%)]" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(32,34,37,0.14),_transparent_70%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_420px]">
          <section className="hidden lg:block">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--brand-orange)]">
              Community-first Social MVP
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.05]">
              취향별 커뮤니티를 만들고
              <span className="block text-[var(--brand-orange)]">홈 피드에 바로 띄우는 SNS</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              레딧처럼 관심사 기반 커뮤니티를 만들고, 각 커뮤니티에서 올라온 글이 홈 피드에 섞여 노출되는
              흐름을 체험할 수 있게 구성했습니다. 로그인 후 커뮤니티를 생성하고, 가입하고, 게시까지 바로
              이어서 테스트해볼 수 있습니다.
            </p>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className="glass-card rounded-[28px] p-5">
                <p className="text-3xl font-semibold">3+</p>
                <p className="mt-2 text-sm text-[var(--muted)]">기본 커뮤니티 시드</p>
              </div>
              <div className="glass-card rounded-[28px] p-5">
                <p className="text-3xl font-semibold">1분</p>
                <p className="mt-2 text-sm text-[var(--muted)]">커뮤니티 생성부터 홈 노출까지</p>
              </div>
              <div className="glass-card rounded-[28px] p-5">
                <p className="text-3xl font-semibold">Live</p>
                <p className="mt-2 text-sm text-[var(--muted)]">로컬 저장 데모 상태 유지</p>
              </div>
            </div>
          </section>

          <section className="phone-shell mx-auto w-full max-w-[420px] rounded-[40px] p-4">
            <div className="panel relative overflow-hidden rounded-[32px] px-6 py-7">
              <div className="mx-auto mb-6 h-1.5 w-16 rounded-full bg-[rgba(33,35,38,0.12)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-orange)]">Welcome</p>
              <h2 className="mt-3 text-3xl font-semibold">Community Hub</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                간단히 이름만 입력하면 홈 피드, 커뮤니티 생성, 포스트 작성 흐름을 바로 확인할 수 있습니다.
              </p>

              <div className="mt-7 rounded-[28px] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">오늘의 인기 보드</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">r/SeoulCoffee, r/PopupHunters, r/WeekendLocal</p>
                  </div>
                  <div className="flex -space-x-2">
                    <span className="avatar-ring h-10 w-10 bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')] bg-cover bg-center" />
                    <span className="avatar-ring h-10 w-10 bg-[url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80')] bg-cover bg-center" />
                    <span className="avatar-ring h-10 w-10 bg-[url('https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80')] bg-cover bg-center" />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-7">
                <label className="mb-3 block text-sm font-semibold text-[var(--muted)]">프로필 이름</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="예: suji.seoul"
                  className="w-full rounded-[22px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-4 text-base outline-none transition focus:border-[rgba(255,106,50,0.38)] focus:ring-4 focus:ring-[rgba(255,106,50,0.12)]"
                />

                <button
                  type="submit"
                  className="mt-4 w-full rounded-[22px] bg-[var(--brand-orange)] px-4 py-4 text-base font-semibold text-white shadow-[0_18px_30px_rgba(255,106,50,0.28)] transition hover:bg-[var(--brand-orange-deep)]"
                >
                  커뮤니티 피드 시작하기
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between rounded-[22px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">데모 모드</p>
                  <p className="mt-1 text-[var(--muted)]">브라우저 로컬 저장 기반 인터랙션</p>
                </div>
                <span className="rounded-full bg-[rgba(255,106,50,0.12)] px-3 py-1 text-xs font-semibold text-[var(--brand-orange-deep)]">
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
