"use client";

import React, { useEffect, useState } from 'react';
import Login from '../components/Login';
import Feed from '../components/Feed';
import { Comment, Community, Post } from '../types';

const starterCommunities: Community[] = [
  {
    id: 'community-1',
    name: 'SeoulCoffee',
    slug: 'r/SeoulCoffee',
    description: '성수, 연남, 한남 중심으로 새로운 카페와 작업하기 좋은 공간을 빠르게 공유하는 커뮤니티',
    banner: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80',
    icon: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=300&q=80',
    theme: '#c66a2b',
    members: 128400,
    online: 1420,
    tags: ['카페', '성수', '작업공간'],
    createdAt: '2026-04-12T09:00:00.000Z',
    isJoined: true,
    isTrending: true,
  },
  {
    id: 'community-2',
    name: 'PopupHunters',
    slug: 'r/PopupHunters',
    description: '오늘 갈 만한 팝업, 굿즈, 웨이팅 팁을 모아보는 실시간 팝업 커뮤니티',
    banner: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80',
    icon: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=300&q=80',
    theme: '#e95f3c',
    members: 89420,
    online: 980,
    tags: ['팝업', '굿즈', '웨이팅'],
    createdAt: '2026-04-11T14:20:00.000Z',
    isJoined: true,
    isTrending: true,
  },
  {
    id: 'community-3',
    name: 'WeekendLocal',
    slug: 'r/WeekendLocal',
    description: '전시, 산책, 브런치, 소규모 이벤트까지 주말 동네 루트를 추천하는 보드',
    banner: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=80',
    icon: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
    theme: '#4d7c6f',
    members: 56100,
    online: 604,
    tags: ['전시', '산책', '주말'],
    createdAt: '2026-04-10T18:50:00.000Z',
    isJoined: false,
    isTrending: true,
  },
];

const starterPosts: Post[] = [
  {
    id: 'seed-1',
    author: '수지',
    handle: 'suji.seongsu',
    content:
      '성수 새벽 오픈 카페 후기입니다. 콘센트 좌석이 많고 창가가 넓어서 오전 작업하기 좋았어요. 시그니처 라떼보다 필터 커피가 더 깔끔했고, 10시 전엔 웨이팅 없이 들어갔습니다.',
    location: '성수동 연무장길',
    category: 'CAFE',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
    mood: 'Work-Friendly',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    timeAgo: '12분 전',
    createdAt: '2026-04-16T09:12:00.000Z',
    distance: '420m',
    saves: 88,
    likes: 124,
    shares: 19,
    tags: ['성수카페', '작업공간', '오픈런'],
    communityId: 'community-1',
    communityName: 'SeoulCoffee',
    communitySlug: 'r/SeoulCoffee',
    isSaved: false,
    isLiked: false,
    comments: [
      {
        id: 'seed-1-comment-1',
        author: '민호',
        handle: 'runwithmin',
        content: '오전 8시대에도 자리가 괜찮았나요? 러닝 끝나고 바로 가보고 싶어요.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        timeAgo: '5분 전',
        createdAt: '2026-04-16T09:18:00.000Z',
      },
    ],
  },
  {
    id: 'seed-2',
    author: '도윤',
    handle: 'doyoon.local',
    content:
      '한남 팝업 대기 줄이 생각보다 빨리 빠집니다. 6시 이후에는 입장 회전이 빨라서 20분 안쪽이었고, 2층 포토존이 제일 괜찮았어요. 굿즈 품절은 후드보다 키링이 빨랐습니다.',
    location: '한남동 메인 스트리트',
    category: 'POP-UP',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    mood: 'Fast Queue',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    timeAgo: '34분 전',
    createdAt: '2026-04-16T08:50:00.000Z',
    distance: '1.2km',
    saves: 51,
    likes: 96,
    shares: 12,
    tags: ['팝업', '웨이팅팁', '한남'],
    communityId: 'community-2',
    communityName: 'PopupHunters',
    communitySlug: 'r/PopupHunters',
    isSaved: true,
    isLiked: false,
    comments: [
      {
        id: 'seed-2-comment-1',
        author: '가은',
        handle: 'gaeun.zip',
        content: '주말 오후보다 평일 저녁이 낫다는 거군요. 실시간 팁 감사합니다.',
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
      '연남 작은 전시 보고 브런치까지 이어지는 루트 추천합니다. 전시는 무료이고 관람 시간이 길지 않아 근처 식당 예약 시간 맞추기 좋았어요. 산책하기도 편해서 데이트 코스로 괜찮았습니다.',
    location: '연남동 동진시장 근처',
    category: 'EXHIBIT',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    mood: 'Soft Weekend',
    avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80',
    timeAgo: '1시간 전',
    createdAt: '2026-04-16T08:20:00.000Z',
    distance: '2.3km',
    saves: 73,
    likes: 143,
    shares: 27,
    tags: ['전시추천', '연남산책', '브런치루트'],
    communityId: 'community-3',
    communityName: 'WeekendLocal',
    communitySlug: 'r/WeekendLocal',
    isSaved: false,
    isLiked: true,
    comments: [
      {
        id: 'seed-3-comment-1',
        author: '서연',
        handle: 'today.seo',
        content: '이 루트 좋네요. 전시 끝나고 바로 갈 만한 브런치 집도 저장해둘게요.',
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

function formatCompactNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
}

function normalizeComment(comment: Partial<Comment>, fallbackAuthor: string): Comment {
  const createdAt =
    typeof comment.createdAt === 'string' && comment.createdAt
      ? comment.createdAt
      : new Date().toISOString();

  return {
    id: typeof comment.id === 'string' && comment.id ? comment.id : `${Date.now()}-${Math.random()}`,
    author: typeof comment.author === 'string' && comment.author ? comment.author : fallbackAuthor,
    handle:
      typeof comment.handle === 'string' && comment.handle
        ? comment.handle
        : fallbackAuthor.toLowerCase().replace(/\s+/g, ''),
    content: typeof comment.content === 'string' ? comment.content : '',
    avatar: typeof comment.avatar === 'string' && comment.avatar ? comment.avatar : fallbackAvatar,
    timeAgo: getTimeAgo(createdAt),
    createdAt,
  };
}

function normalizeCommunity(community: Partial<Community>): Community {
  return {
    id: typeof community.id === 'string' && community.id ? community.id : `${Date.now()}-${Math.random()}`,
    name: typeof community.name === 'string' && community.name ? community.name : 'NewCommunity',
    slug:
      typeof community.slug === 'string' && community.slug
        ? community.slug
        : `r/${typeof community.name === 'string' ? community.name.replace(/\s+/g, '') : 'NewCommunity'}`,
    description:
      typeof community.description === 'string' && community.description
        ? community.description
        : '새 커뮤니티 설명',
    banner: typeof community.banner === 'string' && community.banner ? community.banner : fallbackImage,
    icon: typeof community.icon === 'string' && community.icon ? community.icon : fallbackAvatar,
    theme: typeof community.theme === 'string' && community.theme ? community.theme : '#ff6a32',
    members: typeof community.members === 'number' ? community.members : 1,
    online: typeof community.online === 'number' ? community.online : 1,
    tags: Array.isArray(community.tags)
      ? community.tags.filter((tag): tag is string => typeof tag === 'string').slice(0, 4)
      : [],
    createdAt:
      typeof community.createdAt === 'string' && community.createdAt
        ? community.createdAt
        : new Date().toISOString(),
    isJoined: Boolean(community.isJoined),
    isTrending: Boolean(community.isTrending),
    isMine: Boolean(community.isMine),
  };
}

function normalizePost(post: Partial<Post>): Post {
  const createdAt =
    typeof post.createdAt === 'string' && post.createdAt ? post.createdAt : new Date().toISOString();
  const author = typeof post.author === 'string' && post.author ? post.author : '게스트';
  const handle =
    typeof post.handle === 'string' && post.handle ? post.handle : author.toLowerCase().replace(/\s+/g, '');
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
    tags: tags.length ? tags : ['로컬피드'],
    comments: comments.map((comment) => normalizeComment(comment, author)),
    communityId: typeof post.communityId === 'string' ? post.communityId : '',
    communityName: typeof post.communityName === 'string' ? post.communityName : '',
    communitySlug: typeof post.communitySlug === 'string' ? post.communitySlug : '',
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

function hydrateCommunities(communities: Community[], posts: Post[], currentUser?: string | null) {
  return communities.map((community) => {
    const relatedPosts = posts.filter((post) => post.communityId === community.id);
    const latestActivity =
      relatedPosts.length > 0
        ? Math.max(...relatedPosts.map((post) => new Date(post.createdAt).getTime()))
        : new Date(community.createdAt).getTime();

    return {
      ...normalizeCommunity(community),
      online: Math.max(community.online, Math.ceil(relatedPosts.length * 8) + 12),
      members: Math.max(community.members, relatedPosts.length * 17 + community.members),
      isMine: currentUser ? community.isMine || community.name === currentUser : community.isMine,
      createdAt: new Date(latestActivity).toISOString(),
    };
  });
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

function loadStoredCommunities() {
  try {
    const savedCommunities = localStorage.getItem('communities');
    if (!savedCommunities) return starterCommunities;

    const parsed = JSON.parse(savedCommunities);
    if (!Array.isArray(parsed)) return starterCommunities;

    return parsed.map((community) => normalizeCommunity(community));
  } catch {
    return starterCommunities;
  }
}

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(savedUser);

    const normalizedPosts = loadStoredPosts();
    const normalizedCommunities = loadStoredCommunities();

    setPosts(normalizedPosts);
    setCommunities(normalizedCommunities);
    localStorage.setItem('posts', JSON.stringify(normalizedPosts));
    localStorage.setItem('communities', JSON.stringify(normalizedCommunities));
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    if (communities.length > 0) {
      localStorage.setItem('communities', JSON.stringify(communities));
    }
  }, [communities]);

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
    setCommunities(starterCommunities);
    localStorage.setItem('posts', JSON.stringify(starterPosts));
    localStorage.setItem('communities', JSON.stringify(starterCommunities));
  };

  const handleCreateCommunity = (payload: {
    name: string;
    description: string;
    tags: string[];
    banner: string;
  }) => {
    if (!user) return;

    const trimmedName = payload.name.trim();
    if (!trimmedName) return;

    const compactName = trimmedName.replace(/\s+/g, '');
    const slug = `r/${compactName}`;
    const createdAt = new Date().toISOString();

    const newCommunity: Community = {
      id: `community-${Date.now()}`,
      name: trimmedName,
      slug,
      description: payload.description.trim() || `${trimmedName} 관련 정보를 나누는 새로운 커뮤니티`,
      banner: payload.banner.trim() || fallbackImage,
      icon: fallbackAvatar,
      theme: '#ff6a32',
      members: 1,
      online: 1,
      tags: payload.tags.length ? payload.tags : ['새커뮤니티'],
      createdAt,
      isJoined: true,
      isTrending: true,
      isMine: true,
    };

    setCommunities((currentCommunities) => [newCommunity, ...currentCommunities]);

    const announcementPost: Post = {
      id: `post-${Date.now()}`,
      author: user,
      handle: user.toLowerCase().replace(/\s+/g, ''),
      content: `${slug} 커뮤니티를 만들었습니다. 첫 멤버로 들어와서 추천 장소, 질문, 후기, 사진을 자유롭게 올려보세요.`,
      location: '홈 커뮤니티 허브',
      category: 'COMMUNITY',
      image: payload.banner.trim() || fallbackImage,
      mood: 'New Community',
      avatar: fallbackAvatar,
      timeAgo: '방금',
      createdAt,
      distance: '전체 공개',
      saves: 0,
      likes: 1,
      shares: 0,
      tags: payload.tags.length ? payload.tags : ['새커뮤니티'],
      comments: [],
      communityId: newCommunity.id,
      communityName: newCommunity.name,
      communitySlug: newCommunity.slug,
      isSaved: false,
      isLiked: false,
      isMine: true,
    };

    setPosts((currentPosts) => [announcementPost, ...currentPosts]);
  };

  const handlePost = (payload: {
    content: string;
    location: string;
    category: string;
    mood: string;
    tags: string[];
    image: string;
    communityId: string;
  }) => {
    if (!user) return;

    const selectedCommunity = communities.find((community) => community.id === payload.communityId);
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
      distance: selectedCommunity ? selectedCommunity.slug : '홈 피드',
      saves: 0,
      likes: 0,
      shares: 0,
      tags: payload.tags.length ? payload.tags : ['로컬피드'],
      comments: [],
      communityId: selectedCommunity?.id,
      communityName: selectedCommunity?.name,
      communitySlug: selectedCommunity?.slug,
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
      currentPosts.map((post) => (post.id === id ? { ...post, shares: post.shares + 1 } : post))
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

  const handleJoinCommunity = (id: string) => {
    setCommunities((currentCommunities) =>
      currentCommunities.map((community) =>
        community.id === id
          ? {
              ...community,
              isJoined: !community.isJoined,
              members: community.isJoined ? Math.max(1, community.members - 1) : community.members + 1,
              online: community.isJoined ? Math.max(1, community.online - 1) : community.online + 1,
            }
          : community
      )
    );
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const hydratedPosts = hydratePosts(posts, user);
  const hydratedCommunities = hydrateCommunities(communities, posts, user).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const joinedCount = hydratedCommunities.filter((community) => community.isJoined).length;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="panel mb-6 overflow-hidden rounded-[32px] px-5 py-5 sm:px-7">
          <div className="absolute pointer-events-none right-[-4rem] top-[-4rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(255,106,50,0.24),_transparent_68%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-orange)]">Community Home</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">레딧 스타일 커뮤니티 허브</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                커뮤니티를 만들고 바로 홈 피드에 등장시키는 흐름을 추가했습니다. 이제 사용자들은 관심사별
                보드를 만들고, 해당 커뮤니티의 글이 홈 화면과 개별 커뮤니티 피드에 함께 노출됩니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
              <div className="rounded-[24px] bg-[var(--surface-muted)] px-4 py-4 text-center">
                <p className="text-xs text-[var(--muted)]">전체 커뮤니티</p>
                <p className="mt-2 text-xl font-semibold">{hydratedCommunities.length}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-muted)] px-4 py-4 text-center">
                <p className="text-xs text-[var(--muted)]">가입 커뮤니티</p>
                <p className="mt-2 text-xl font-semibold">{joinedCount}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-muted)] px-4 py-4 text-center">
                <p className="text-xs text-[var(--muted)]">홈 피드 포스트</p>
                <p className="mt-2 text-xl font-semibold">{formatCompactNumber(hydratedPosts.length)}</p>
              </div>
            </div>
          </div>
        </header>

        <Feed
          user={user}
          posts={hydratedPosts}
          communities={hydratedCommunities}
          onCreateCommunity={handleCreateCommunity}
          onJoinCommunity={handleJoinCommunity}
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
