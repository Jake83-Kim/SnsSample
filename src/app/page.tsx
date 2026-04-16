"use client";

import React, { useEffect, useState } from 'react';
import Login from '../components/Login';
import Feed from '../components/Feed';
import { Comment, Post } from '../types';

const starterPosts: Post[] = [
  {
    id: 'seed-1',
    author: '수지',
    handle: 'suji.seongsu',
    content:
      '오픈하자마자 들른 성수 골목 카페. 화이트 인테리어에 그린 포인트가 깔끔해서 사진이 정말 잘 나와요. 음악 볼륨과 좌석 간격도 좋아서 작업하기 편했습니다.',
    location: '성수동 연무장길',
    category: 'CAFE',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
    mood: 'Quiet Morning',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    timeAgo: '12분 전',
    createdAt: '2026-04-16T09:12:00.000Z',
    distance: '420m',
    saves: 88,
    likes: 124,
    shares: 19,
    tags: ['성수카페', '작업공간', '화이트무드'],
    isSaved: false,
    isLiked: false,
    comments: [
      {
        id: 'seed-1-comment-1',
        author: '민호',
        handle: 'runwithmin',
        content: '채광이 좋다면 오전 러닝 끝나고 들르기 좋겠네요. 콘센트 좌석도 많은 편인가요?',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        timeAgo: '5분 전',
        createdAt: '2026-04-16T09:18:00.000Z',
      },
      {
        id: 'seed-1-comment-2',
        author: '혜린',
        handle: 'hyer_in',
        content: '이번 주말에 가보려고 저장했어요. 디저트까지 맛있으면 완전 취향일 것 같아요.',
        avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
        timeAgo: '방금',
        createdAt: '2026-04-16T09:22:00.000Z',
      },
    ],
  },
  {
    id: 'seed-2',
    author: '도윤',
    handle: 'doyoon.local',
    content:
      '연남 작은 갤러리에서 반려동물 포토 전시가 시작됐어요. 무료 입장이고 동네 산책 루트에 넣기 좋아서 공유합니다. 사진 톤이 부드럽고 공간도 편안했어요.',
    location: '연남동 동진시장 근처',
    category: 'EXHIBIT',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    mood: 'Soft Weekend',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    timeAgo: '34분 전',
    createdAt: '2026-04-16T08:50:00.000Z',
    distance: '1.2km',
    saves: 51,
    likes: 96,
    shares: 12,
    tags: ['전시추천', '연남산책', '반려생활'],
    isSaved: true,
    isLiked: false,
    comments: [
      {
        id: 'seed-2-comment-1',
        author: '가은',
        handle: 'gaeun.zip',
        content: '전시 보고 나서 같이 갈 브런치 집도 있나요? 동선 좋으면 친구랑 가보려구요.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
        timeAgo: '18분 전',
        createdAt: '2026-04-16T09:04:00.000Z',
      },
    ],
  },
  {
    id: 'seed-3',
    author: '지후',
    handle: 'jihu.now',
    content:
      '한남동 팝업 스토어 대기줄이 생각보다 빨리 빠졌어요. 굿즈보다 공간 연출이 더 좋아서 사진 찍기 좋은 포인트가 많았습니다. 저녁 시간대 방문 추천!',
    location: '한남동 메인 스트리트',
    category: 'POP-UP',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    mood: 'Golden Hour',
    avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80',
    timeAgo: '1시간 전',
    createdAt: '2026-04-16T08:20:00.000Z',
    distance: '2.3km',
    saves: 73,
    likes: 143,
    shares: 27,
    tags: ['팝업', '한남데이트', '포토스팟'],
    isSaved: false,
    isLiked: true,
    comments: [
      {
        id: 'seed-3-comment-1',
        author: '서연',
        handle: 'today.seo',
        content: '이번 주까지면 퇴근하고 바로 가봐야겠네요. 굿즈 구매 제한도 있었나요?',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        timeAgo: '43분 전',
        createdAt: '2026-04-16T08:39:00.000Z',
      },
    ],
  },
];

const fallbackImage =
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';
const fallbackAvatar =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80';

function getTimeAgo(dateString: string) {
  const parsed = new Date(dateString).getTime();
  if (Number.isNaN(parsed)) return '방금';

  const diffMs = Date.now() - parsed;
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function normalizeComment(comment: Partial<Comment>, fallbackAuthor: string): Comment {
  const createdAt = typeof comment.createdAt === 'string' && comment.createdAt
    ? comment.createdAt
    : new Date().toISOString();

  return {
    id: typeof comment.id === 'string' && comment.id ? comment.id : `${Date.now()}-${Math.random()}`,
    author: typeof comment.author === 'string' && comment.author ? comment.author : fallbackAuthor,
    handle: typeof comment.handle === 'string' && comment.handle ? comment.handle : fallbackAuthor.toLowerCase().replace(/\s+/g, ''),
    content: typeof comment.content === 'string' ? comment.content : '',
    avatar: typeof comment.avatar === 'string' && comment.avatar ? comment.avatar : fallbackAvatar,
    timeAgo: getTimeAgo(createdAt),
    createdAt,
  };
}

function normalizePost(post: Partial<Post>): Post {
  const createdAt = typeof post.createdAt === 'string' && post.createdAt
    ? post.createdAt
    : new Date().toISOString();
  const author = typeof post.author === 'string' && post.author ? post.author : '게스트';
  const handle = typeof post.handle === 'string' && post.handle ? post.handle : author.toLowerCase().replace(/\s+/g, '');
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const tags = Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === 'string') : [];

  return {
    id: typeof post.id === 'string' && post.id ? post.id : `${Date.now()}-${Math.random()}`,
    author,
    handle,
    content: typeof post.content === 'string' ? post.content : '',
    location: typeof post.location === 'string' && post.location ? post.location : '내 주변 1km',
    category: typeof post.category === 'string' && post.category ? post.category : 'UPDATE',
    image: typeof post.image === 'string' && post.image ? post.image : fallbackImage,
    mood: typeof post.mood === 'string' && post.mood ? post.mood : 'Fresh Update',
    avatar: typeof post.avatar === 'string' && post.avatar ? post.avatar : fallbackAvatar,
    timeAgo: getTimeAgo(createdAt),
    createdAt,
    distance: typeof post.distance === 'string' && post.distance ? post.distance : '내 주변 1km',
    saves: typeof post.saves === 'number' ? post.saves : 0,
    likes: typeof post.likes === 'number' ? post.likes : 0,
    shares: typeof post.shares === 'number' ? post.shares : 0,
    tags: tags.length ? tags : ['동네기록'],
    comments: comments.map((comment) => normalizeComment(comment, author)),
    isSaved: Boolean(post.isSaved),
    isLiked: Boolean(post.isLiked),
    isMine: Boolean(post.isMine),
  };
}

function hydratePosts(posts: Post[], currentUser?: string | null) {
  return posts.map((post) => ({
    ...normalizePost(post),
    timeAgo: getTimeAgo(post.createdAt),
    isMine: currentUser ? post.author === currentUser : false,
    comments: (Array.isArray(post.comments) ? post.comments : []).map((comment) => {
      const normalized = normalizeComment(comment, post.author);
      return {
        ...normalized,
        timeAgo: getTimeAgo(normalized.createdAt),
      };
    }),
  }));
}

function loadStoredPosts() {
  try {
    const savedPosts = localStorage.getItem('posts');
    if (!savedPosts) return starterPosts;

    const parsed = JSON.parse(savedPosts);
    if (!Array.isArray(parsed)) return starterPosts;

    return parsed.map((post) => normalizePost(post));
  } catch {
    return starterPosts;
  }
}

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(savedUser);

    const normalizedPosts = loadStoredPosts();
    setPosts(normalizedPosts);
    localStorage.setItem('posts', JSON.stringify(normalizedPosts));
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }, [posts]);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleResetDemo = () => {
    setPosts(starterPosts);
    localStorage.setItem('posts', JSON.stringify(starterPosts));
  };

  const handlePost = (payload: {
    content: string;
    location: string;
    category: string;
    mood: string;
    tags: string[];
    image: string;
  }) => {
    if (!user) return;

    const createdAt = new Date().toISOString();
    const newPost: Post = {
      id: Date.now().toString(),
      author: user,
      handle: user.toLowerCase().replace(/\s+/g, ''),
      content: payload.content,
      location: payload.location,
      category: payload.category,
      image: payload.image || fallbackImage,
      mood: payload.mood,
      avatar: fallbackAvatar,
      timeAgo: '방금',
      createdAt,
      distance: '내 주변 1km',
      saves: 0,
      likes: 0,
      shares: 0,
      tags: payload.tags.length ? payload.tags : ['동네기록'],
      comments: [],
      isSaved: false,
      isLiked: false,
      isMine: true,
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
  };

  const handleLike = (id: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? Math.max(0, post.likes - 1) : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSave = (id: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              isSaved: !post.isSaved,
              saves: post.isSaved ? Math.max(0, post.saves - 1) : post.saves + 1,
            }
          : post
      )
    );
  };

  const handleShare = (id: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id ? { ...post, shares: post.shares + 1 } : post
      )
    );
  };

  const handleComment = (id: string, comment: string) => {
    if (!user) return;

    const createdAt = new Date().toISOString();
    const newComment: Comment = {
      id: Date.now().toString(),
      author: user,
      handle: user.toLowerCase().replace(/\s+/g, ''),
      content: comment,
      avatar: fallbackAvatar,
      timeAgo: '방금',
      createdAt,
    };

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id ? { ...post, comments: [...(post.comments ?? []), newComment] } : post
      )
    );
  };

  const handleDelete = (id: string) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const hydratedPosts = hydratePosts(posts, user);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="panel mb-6 rounded-[32px] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">NearU Social</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">동네 기반 SNS MVP 대시보드</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                시안의 화이트/그린 무드와 모바일 중심 피드 경험을 유지하면서, 로컬 저장 기반으로 실제 기능을 모두 체험할 수 있게 구성한 SNS MVP입니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
              <div className="rounded-[24px] bg-[var(--surface-muted)] px-4 py-4 text-center">
                <p className="text-xs text-[var(--muted)]">활성 이용자</p>
                <p className="mt-2 text-xl font-semibold">18.2K</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-muted)] px-4 py-4 text-center">
                <p className="text-xs text-[var(--muted)]">오늘 포스트</p>
                <p className="mt-2 text-xl font-semibold">{hydratedPosts.length}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-muted)] px-4 py-4 text-center">
                <p className="text-xs text-[var(--muted)]">참여 전환율</p>
                <p className="mt-2 text-xl font-semibold">7.4%</p>
              </div>
            </div>
          </div>
        </header>

        <Feed
          user={user}
          posts={hydratedPosts}
          onPost={handlePost}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          onDelete={handleDelete}
          onComment={handleComment}
          onLogout={handleLogout}
          onResetDemo={handleResetDemo}
        />
      </div>
    </main>
  );
}
