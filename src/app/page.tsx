"use client";

import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Feed from '../components/Feed';
import { Post, Comment } from '../types';

const starterPosts: Post[] = [
  {
    id: 'seed-1',
    author: '수지',
    handle: 'suji.seongsu',
    content: '오픈하자마자 들어간 성수 골목 카페. 화이트 톤 인테리어에 초록 포인트가 너무 깔끔해서 사진이 바로 살아나요. 라떼 밸런스도 좋고 작업하기에 음악 볼륨도 적당했습니다.',
    location: '성수동 연무장길',
    category: 'CAFE',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
    mood: 'Quiet Morning',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    timeAgo: '12분 전',
    distance: '420m',
    saves: 88,
    likes: 124,
    shares: 19,
    tags: ['성수카페', '작업공간', '화이트무드'],
    comments: [
      {
        id: 'seed-1-comment-1',
        author: '민호',
        handle: 'runwithmin',
        content: '채광 좋으면 오전 러닝 끝나고 들르기 딱 좋겠네요. 콘센트 자리도 많은 편인가요?',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        timeAgo: '5분 전',
      },
      {
        id: 'seed-1-comment-2',
        author: '혜린',
        handle: 'hyer_in',
        content: '이번 주말에 가보려고 저장했어요. 디저트도 맛있다면 완전 취향일 듯!',
        avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
        timeAgo: '방금',
      },
    ],
  },
  {
    id: 'seed-2',
    author: '도윤',
    handle: 'doyoon.local',
    content: '연남 작은 갤러리에서 반려동물 포토 전시 시작했어요. 무료 입장이고 동네 산책 루트에 넣기 좋아서 공유합니다. 사진 톤이 부드러워서 부모님과 같이 보기에도 좋았습니다.',
    location: '연남동 동진시장 근처',
    category: 'EXHIBIT',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    mood: 'Soft Weekend',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    timeAgo: '34분 전',
    distance: '1.2km',
    saves: 51,
    likes: 96,
    shares: 12,
    tags: ['전시추천', '연남산책', '반려생활'],
    comments: [
      {
        id: 'seed-2-comment-1',
        author: '가은',
        handle: 'gaeun.zip',
        content: '사진 전시 후에 들를 만한 브런치 집도 있나요? 동선 좋으면 친구랑 가보려구요.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
        timeAgo: '18분 전',
      },
    ],
  },
  {
    id: 'seed-3',
    author: '지후',
    handle: 'jihu.now',
    content: '한남동 팝업 스토어 대기줄이 생각보다 빨리 빠졌어요. 굿즈보다도 공간 연출이 좋아서 사진 찍기 좋은 포인트가 많았습니다. 저녁 시간대 방문 추천!',
    location: '한남동 메인 스트리트',
    category: 'POP-UP',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    mood: 'Golden Hour',
    avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80',
    timeAgo: '1시간 전',
    distance: '2.3km',
    saves: 73,
    likes: 143,
    shares: 27,
    tags: ['팝업', '한남데이트', '포토스팟'],
    comments: [
      {
        id: 'seed-3-comment-1',
        author: '서연',
        handle: 'today.seo',
        content: '이번 주까지면 퇴근하고 바로 가봐야겠네요. 굿즈 구매 제한도 있었나요?',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        timeAgo: '43분 전',
      },
    ],
  },
];

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedPosts = localStorage.getItem('posts');
    if (savedUser) setUser(savedUser);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
      return;
    }

    setPosts(starterPosts);
    localStorage.setItem('posts', JSON.stringify(starterPosts));
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('user', username);
  };

  const handlePost = (content: string) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: user,
      handle: user.toLowerCase().replace(/\s+/g, ''),
      content,
      location: '내 주변 1km',
      category: 'UPDATE',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      mood: 'Fresh Update',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      timeAgo: '방금',
      distance: '근처 공개',
      saves: 0,
      likes: 0,
      shares: 0,
      tags: ['새포스트', '동네기록'],
      comments: [],
    };
    const newPosts = [newPost, ...posts];
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const handleLike = (id: string) => {
    const newPosts = posts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const handleComment = (id: string, comment: string) => {
    if (!user) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: user,
      handle: user.toLowerCase().replace(/\s+/g, ''),
      content: comment,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      timeAgo: '방금',
    };
    const newPosts = posts.map((post) =>
      post.id === id ? { ...post, comments: [...post.comments, newComment] } : post
    );
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="panel mb-6 rounded-[32px] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">NearU Social</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">동네 기반 SNS MVP 대시보드</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                첨부 시안의 화이트/그린 무드, 모바일 앱 중심 레이아웃, 카드형 탐색 경험을 반영한 실전형 프로토타입입니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
              <div className="rounded-[24px] bg-[var(--surface-muted)] px-4 py-4 text-center">
                <p className="text-xs text-[var(--muted)]">활성 이용자</p>
                <p className="mt-2 text-xl font-semibold">18.2K</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-muted)] px-4 py-4 text-center">
                <p className="text-xs text-[var(--muted)]">오늘 포스트</p>
                <p className="mt-2 text-xl font-semibold">{posts.length}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-muted)] px-4 py-4 text-center">
                <p className="text-xs text-[var(--muted)]">전환율 가정</p>
                <p className="mt-2 text-xl font-semibold">7.4%</p>
              </div>
            </div>
          </div>
        </header>

        <Feed user={user} posts={posts} onPost={handlePost} onLike={handleLike} onComment={handleComment} />
      </div>
    </main>
  );
}
