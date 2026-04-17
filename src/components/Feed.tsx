"use client";

import React from 'react';
import Post from './Post';
import PostForm from './PostForm';
import { Community, Post as PostType } from '../types';

interface FeedProps {
  user: string;
  posts: PostType[];
  communities: Community[];
  onCreateCommunity: (payload: {
    name: string;
    description: string;
    tags: string[];
    banner: string;
  }) => void;
  onJoinCommunity: (id: string) => void;
  onPost: (payload: {
    content: string;
    location: string;
    category: string;
    mood: string;
    tags: string[];
    image: string;
    communityId: string;
  }) => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
  onComment: (id: string, comment: string) => void;
  onLogout: () => void;
  onResetDemo: () => void;
}

type SortMode = 'BEST' | 'HOT' | 'NEW' | 'TOP';

function formatCompactNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
}

function getPostScore(post: PostType, mode: SortMode) {
  const top = post.likes + post.saves + post.comments.length * 2 + post.shares * 2;
  const hours = Math.floor((Date.now() - new Date(post.createdAt).getTime()) / 3600000);
  const hot = top - Math.floor(hours / 2);

  if (mode === 'NEW') return new Date(post.createdAt).getTime();
  if (mode === 'TOP') return top;
  if (mode === 'HOT') return hot;
  return hot + post.comments.length;
}

const leftMenuItems = [
  { id: 'home', icon: '⌂', label: 'Home' },
  { id: 'popular', icon: '◉', label: 'Popular' },
  { id: 'discover', icon: '◇', label: 'Discover' },
];

const Feed: React.FC<FeedProps> = ({
  user,
  posts,
  communities,
  onCreateCommunity,
  onJoinCommunity,
  onPost,
  onLike,
  onSave,
  onShare,
  onDelete,
  onComment,
  onLogout,
  onResetDemo,
}) => {
  const [activeFilter, setActiveFilter] = React.useState('ALL');
  const [activeCommunityId, setActiveCommunityId] = React.useState('home');
  const [sortMode, setSortMode] = React.useState<SortMode>('BEST');
  const [joinedOnlyHome, setJoinedOnlyHome] = React.useState(true);
  const [isComposerOpen, setIsComposerOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [communityName, setCommunityName] = React.useState('');
  const [communityDescription, setCommunityDescription] = React.useState('');
  const [communityTags, setCommunityTags] = React.useState('지역소식, 추천');
  const [communityBanner, setCommunityBanner] = React.useState('');

  const filters = ['ALL', 'COMMUNITY', 'CAFE', 'FOOD', 'EXHIBIT', 'POP-UP', 'LIFESTYLE', 'UPDATE'];
  const sortModes: SortMode[] = ['BEST', 'HOT', 'NEW', 'TOP'];
  const joinedCommunities = communities.filter((community) => community.isJoined);
  const recommendedCommunities = [...communities]
    .sort((left, right) => right.members + right.online - (left.members + left.online))
    .slice(0, 6);
  const activeCommunity =
    activeCommunityId === 'home' ? null : communities.find((community) => community.id === activeCommunityId) ?? null;

  const homeScopedPosts = joinedOnlyHome
    ? posts.filter((post) => {
        if (!post.communityId) return true;
        return joinedCommunities.some((community) => community.id === post.communityId);
      })
    : posts;

  const scopedPosts = activeCommunity
    ? posts.filter((post) => post.communityId === activeCommunity.id)
    : homeScopedPosts;

  const searchFilteredPosts = scopedPosts.filter((post) => {
    const haystack = `${post.content} ${post.communityName || ''} ${post.communitySlug || ''} ${post.tags.join(' ')}`.toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  const categoryFilteredPosts =
    activeFilter === 'ALL'
      ? searchFilteredPosts
      : searchFilteredPosts.filter((post) => post.category === activeFilter);

  const filteredPosts = [...categoryFilteredPosts].sort(
    (left, right) => getPostScore(right, sortMode) - getPostScore(left, sortMode)
  );

  const trendingPosts = [...homeScopedPosts]
    .sort((left, right) => getPostScore(right, 'HOT') - getPostScore(left, 'HOT'))
    .slice(0, 3);

  const activeCommunityPostCount = activeCommunity
    ? posts.filter((post) => post.communityId === activeCommunity.id).length
    : filteredPosts.length;

  const activeCommunityTotalComments = activeCommunity
    ? posts
        .filter((post) => post.communityId === activeCommunity.id)
        .reduce((total, post) => total + post.comments.length, 0)
    : filteredPosts.reduce((total, post) => total + post.comments.length, 0);

  const activeCommunityTopTags = activeCommunity
    ? Array.from(
        new Set(
          posts
            .filter((post) => post.communityId === activeCommunity.id)
            .flatMap((post) => post.tags)
        )
      ).slice(0, 4)
    : [];

  const handleCommunitySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!communityName.trim()) return;

    onCreateCommunity({
      name: communityName.trim(),
      description: communityDescription.trim(),
      tags: communityTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 4),
      banner: communityBanner.trim(),
    });

    setCommunityName('');
    setCommunityDescription('');
    setCommunityTags('지역소식, 추천');
    setCommunityBanner('');
    setActiveCommunityId('home');
  };

  return (
    <div className="reddit-shell mx-auto max-w-[1480px]">
      <header className="reddit-topbar sticky top-0 z-30 mb-4 flex items-center gap-3 rounded-[16px] px-3 py-3">
        <button
          onClick={() => setActiveCommunityId('home')}
          className="flex items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 py-2 text-sm font-bold text-white"
        >
          <span className="text-lg leading-none">r</span>
          <span>Reddit Style</span>
        </button>

        <label className="reddit-search hidden min-w-0 flex-1 items-center gap-3 rounded-full px-4 py-3 md:flex">
          <span className="text-sm text-[var(--muted)]">⌕</span>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={activeCommunity ? `${activeCommunity.slug} 검색` : '커뮤니티와 피드 검색'}
            className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDemo}
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--muted)]"
          >
            초기화
          </button>
          <button
            onClick={onLogout}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_330px]">
        <aside className="space-y-4">
          <section className="reddit-panel rounded-[18px] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-orange)] text-sm font-bold text-white">
                {user.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--ink)]">{user}</p>
                <p className="text-xs text-[var(--muted)]">@{user.toLowerCase().replace(/\s+/g, '')}</p>
              </div>
            </div>
          </section>

          <section className="reddit-panel rounded-[18px] p-3">
            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Menu</p>
            <div className="mt-2 space-y-1">
              {leftMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCommunityId('home')}
                  className="reddit-nav-item flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold text-[var(--ink)]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="reddit-panel rounded-[18px] p-3">
            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Communities</p>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => setActiveCommunityId('home')}
                className={`reddit-nav-item flex w-full items-center justify-between rounded-[12px] px-3 py-2.5 text-sm ${
                  !activeCommunity ? 'bg-[var(--surface-muted)] font-bold text-[var(--ink)]' : 'text-[var(--muted)]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs">⌂</span>
                  <span>Home</span>
                </span>
                <span>{formatCompactNumber(homeScopedPosts.length)}</span>
              </button>

              {joinedCommunities.map((community) => (
                <button
                  key={community.id}
                  onClick={() => setActiveCommunityId(community.id)}
                  className={`reddit-nav-item flex w-full items-center justify-between rounded-[12px] px-3 py-2.5 text-sm ${
                    activeCommunity?.id === community.id
                      ? 'bg-[var(--surface-muted)] font-bold text-[var(--ink)]'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs">r/</span>
                    <span className="truncate">{community.slug}</span>
                  </span>
                  <span>{formatCompactNumber(community.members)}</span>
                </button>
              ))}
            </div>

            <label className="mt-4 flex items-center justify-between rounded-[12px] bg-[var(--surface-muted)] px-3 py-3 text-sm">
              <span className="font-semibold text-[var(--ink)]">가입 커뮤니티만 홈 반영</span>
              <input
                type="checkbox"
                checked={joinedOnlyHome}
                onChange={(event) => setJoinedOnlyHome(event.target.checked)}
                className="h-4 w-4 accent-[var(--brand-orange)]"
              />
            </label>
          </section>

          {!activeCommunity && (
            <section className="reddit-panel rounded-[18px] p-4">
              <p className="text-sm font-bold text-[var(--ink)]">새 커뮤니티 만들기</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                홈에서 바로 새 보드를 만들고 추천 목록에 노출할 수 있습니다.
              </p>

              <form onSubmit={handleCommunitySubmit} className="mt-4 space-y-3">
                <input
                  type="text"
                  value={communityName}
                  onChange={(event) => setCommunityName(event.target.value)}
                  placeholder="예: SeongsuMakers"
                  className="w-full rounded-[14px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
                />
                <textarea
                  value={communityDescription}
                  onChange={(event) => setCommunityDescription(event.target.value)}
                  rows={3}
                  placeholder="이 커뮤니티에서 다룰 주제를 적어주세요."
                  className="w-full resize-none rounded-[14px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
                />
                <input
                  type="text"
                  value={communityTags}
                  onChange={(event) => setCommunityTags(event.target.value)}
                  placeholder="태그를 쉼표로 구분"
                  className="w-full rounded-[14px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
                />
                <input
                  type="url"
                  value={communityBanner}
                  onChange={(event) => setCommunityBanner(event.target.value)}
                  placeholder="배너 이미지 URL"
                  className="w-full rounded-[14px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-[var(--brand-orange)] px-4 py-3 text-sm font-bold text-white"
                >
                  커뮤니티 생성
                </button>
              </form>
            </section>
          )}
        </aside>

        <main className="space-y-4">
          {activeCommunity ? (
            <section className="reddit-panel overflow-hidden rounded-[18px]">
              <div
                className="h-28 bg-cover bg-center"
                style={{ backgroundImage: `url(${activeCommunity.banner})` }}
              />
              <div className="p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Community</p>
                <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--ink)]">{activeCommunity.slug}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{activeCommunity.description}</p>
                  </div>
                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <div className="text-sm text-[var(--muted)]">
                      {formatCompactNumber(activeCommunity.members)} members · {activeCommunity.online} online
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onJoinCommunity(activeCommunity.id)}
                        className={`rounded-full px-4 py-2 text-sm font-bold ${
                          activeCommunity.isJoined ? 'bg-[var(--ink)] text-white' : 'bg-[var(--brand-orange)] text-white'
                        }`}
                      >
                        {activeCommunity.isJoined ? '가입 해제' : 'Join'}
                      </button>
                      <button
                        onClick={() => setIsComposerOpen(true)}
                        className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-bold text-[var(--ink)]"
                      >
                        Create Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="reddit-panel rounded-[18px] p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Home Feed</p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--ink)]">추천 커뮤니티와 추천 피드</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    reddit.com처럼 홈에서는 여러 커뮤니티의 글을 보고, 관심 있는 보드 안으로 들어가면 그 커뮤니티의 글만 깊게 탐색하도록 구성했습니다.
                  </p>
                </div>
                <div className="hidden rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-2 text-xs font-semibold text-[var(--muted)] md:block">
                  데스크톱 레딧형 3열 구조
                </div>
              </div>
            </section>
          )}

          <section className="reddit-panel rounded-[18px] p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {sortModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSortMode(mode)}
                    className={`rounded-full px-3 py-2 text-xs font-bold ${
                      sortMode === mode ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-muted)] text-[var(--muted)]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveFilter(item)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold ${
                      activeFilter === item ? 'bg-[var(--brand-orange)] text-white' : 'bg-[var(--surface-muted)] text-[var(--muted)]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {!activeCommunity && (
            <section className="reddit-panel rounded-[18px] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[var(--ink)]">추천 커뮤니티</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">홈 상단에서 먼저 진입할 만한 보드를 보여줍니다.</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {recommendedCommunities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => setActiveCommunityId(community.id)}
                    className="rounded-[16px] border border-[var(--line)] bg-white p-3 text-left transition hover:border-[rgba(255,69,0,0.32)] hover:bg-[rgba(255,69,0,0.03)]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-[14px] bg-cover bg-center"
                        style={{ backgroundImage: `url(${community.icon || community.banner})` }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[var(--ink)]">{community.slug}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{community.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-2">
            {filteredPosts.length === 0 ? (
              <div className="reddit-panel rounded-[18px] p-8 text-center text-sm text-[var(--muted)]">
                이 조건에 맞는 글이 없습니다. 다른 커뮤니티를 보거나 필터를 바꿔보세요.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onLike={onLike}
                  onSave={onSave}
                  onShare={onShare}
                  onDelete={onDelete}
                  onComment={onComment}
                />
              ))
            )}
          </section>
        </main>

        <aside className="space-y-4">
          <section className="reddit-panel rounded-[18px] p-4">
            <p className="text-sm font-bold text-[var(--ink)]">
              {activeCommunity ? `${activeCommunity.slug} 정보` : 'Popular Communities'}
            </p>

            {activeCommunity ? (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[14px] bg-[var(--surface-muted)] px-3 py-4">
                    <p className="text-lg font-bold">{formatCompactNumber(activeCommunity.members)}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Members</p>
                  </div>
                  <div className="rounded-[14px] bg-[var(--surface-muted)] px-3 py-4">
                    <p className="text-lg font-bold">{activeCommunity.online}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Online</p>
                  </div>
                  <div className="rounded-[14px] bg-[var(--surface-muted)] px-3 py-4">
                    <p className="text-lg font-bold">{activeCommunityPostCount}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Threads</p>
                  </div>
                  <div className="rounded-[14px] bg-[var(--surface-muted)] px-3 py-4">
                    <p className="text-lg font-bold">{activeCommunityTotalComments}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Comments</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(activeCommunityTopTags.length ? activeCommunityTopTags : activeCommunity.tags).map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {recommendedCommunities.slice(0, 5).map((community, index) => (
                  <div key={community.id} className="flex items-center gap-3 rounded-[14px] bg-[var(--surface-muted)] px-3 py-3">
                    <span className="w-5 text-center text-xs font-bold text-[var(--muted)]">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => setActiveCommunityId(community.id)}
                        className="truncate text-left text-sm font-bold text-[var(--ink)]"
                      >
                        {community.slug}
                      </button>
                      <p className="mt-1 text-xs text-[var(--muted)]">{formatCompactNumber(community.members)} members</p>
                    </div>
                    <button
                      onClick={() => onJoinCommunity(community.id)}
                      className={`rounded-full px-3 py-2 text-xs font-bold ${
                        community.isJoined ? 'bg-white text-[var(--ink)]' : 'bg-[var(--brand-orange)] text-white'
                      }`}
                    >
                      {community.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {!activeCommunity && (
            <section className="reddit-panel rounded-[18px] p-4">
              <p className="text-sm font-bold text-[var(--ink)]">Trending Today</p>
              <div className="mt-4 space-y-3">
                {trendingPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setActiveCommunityId(post.communityId || 'home')}
                    className="block w-full rounded-[14px] bg-[var(--surface-muted)] p-3 text-left"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brand-orange-deep)]">
                      {post.communitySlug || 'Home Feed'}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm font-bold text-[var(--ink)]">{post.content}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      업보트 {post.likes} · 댓글 {post.comments.length}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {activeCommunity && (
        <button
          onClick={() => setIsComposerOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-orange)] text-3xl font-light text-white shadow-[0_18px_40px_rgba(255,69,0,0.35)]"
          aria-label="새 글 작성"
        >
          +
        </button>
      )}

      {activeCommunity && isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(15,23,42,0.52)] p-4 sm:items-center">
          <button className="absolute inset-0" onClick={() => setIsComposerOpen(false)} aria-label="팝업 닫기" />
          <div className="relative z-10 w-full max-w-4xl">
            <div className="mb-3 flex justify-end">
              <button
                onClick={() => setIsComposerOpen(false)}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--ink)]"
              >
                닫기
              </button>
            </div>
            <PostForm
              onPost={onPost}
              user={user}
              communities={communities}
              activeCommunityId={activeCommunity.id}
              onSubmitted={() => setIsComposerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
