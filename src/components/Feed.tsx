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

function formatCompactNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
}

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
  const [sortMode, setSortMode] = React.useState<'BEST' | 'HOT' | 'NEW' | 'TOP'>('BEST');
  const [joinedOnlyHome, setJoinedOnlyHome] = React.useState(true);
  const [isComposerOpen, setIsComposerOpen] = React.useState(false);
  const [communityName, setCommunityName] = React.useState('');
  const [communityDescription, setCommunityDescription] = React.useState('');
  const [communityTags, setCommunityTags] = React.useState('지역소식, 추천');
  const [communityBanner, setCommunityBanner] = React.useState('');

  const filters = ['ALL', 'COMMUNITY', 'CAFE', 'FOOD', 'EXHIBIT', 'POP-UP', 'LIFESTYLE', 'UPDATE'];
  const sortModes: Array<'BEST' | 'HOT' | 'NEW' | 'TOP'> = ['BEST', 'HOT', 'NEW', 'TOP'];
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

  const categoryFilteredPosts =
    activeFilter === 'ALL' ? scopedPosts : scopedPosts.filter((post) => post.category === activeFilter);

  const filteredPosts = [...categoryFilteredPosts].sort((left, right) => {
    const leftTop = left.likes + left.saves + left.comments.length * 2 + left.shares * 2;
    const rightTop = right.likes + right.saves + right.comments.length * 2 + right.shares * 2;
    const leftHot = leftTop - Math.floor((Date.now() - new Date(left.createdAt).getTime()) / 7200000);
    const rightHot = rightTop - Math.floor((Date.now() - new Date(right.createdAt).getTime()) / 7200000);

    if (sortMode === 'NEW') {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    }

    if (sortMode === 'TOP') {
      return rightTop - leftTop;
    }

    if (sortMode === 'HOT') {
      return rightHot - leftHot;
    }

    return rightHot + right.comments.length - (leftHot + left.comments.length);
  });

  const trendingPosts = [...homeScopedPosts]
    .sort((left, right) => right.likes + right.comments.length * 2 - (left.likes + left.comments.length * 2))
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
    <div className="reddit-shell mx-auto max-w-[1440px]">
      <header className="reddit-topbar sticky top-0 z-30 mb-4 flex items-center gap-3 rounded-[20px] px-4 py-3">
        <button
          onClick={() => setActiveCommunityId('home')}
          className="flex items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 py-2 text-sm font-bold text-white"
        >
          <span className="text-lg leading-none">r</span>
          <span>Community Hub</span>
        </button>
        <div className="hidden min-w-0 flex-1 items-center rounded-full bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted)] md:flex">
          {activeCommunity ? `${activeCommunity.slug} 안에서 검색하는 느낌의 커뮤니티 뷰` : '추천 커뮤니티와 추천 피드를 보는 홈'}
        </div>
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

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="space-y-4">
          <section className="reddit-panel rounded-[24px] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-orange)] text-sm font-bold text-white">
                {user.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--ink)]">{user}</p>
                <p className="text-xs text-[var(--muted)]">@{user.toLowerCase().replace(/\s+/g, '')}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-[16px] bg-[var(--surface-muted)] px-2 py-3">
                <p className="text-sm font-bold">{joinedCommunities.length}</p>
                <p className="mt-1 text-[11px] text-[var(--muted)]">Joined</p>
              </div>
              <div className="rounded-[16px] bg-[var(--surface-muted)] px-2 py-3">
                <p className="text-sm font-bold">{formatCompactNumber(posts.length)}</p>
                <p className="mt-1 text-[11px] text-[var(--muted)]">Posts</p>
              </div>
              <div className="rounded-[16px] bg-[var(--surface-muted)] px-2 py-3">
                <p className="text-sm font-bold">{communities.filter((community) => community.isMine).length}</p>
                <p className="mt-1 text-[11px] text-[var(--muted)]">Created</p>
              </div>
            </div>
          </section>

          {!activeCommunity && (
            <section className="reddit-panel rounded-[24px] p-4">
              <p className="text-sm font-bold text-[var(--ink)]">새 커뮤니티 만들기</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                레딧의 왼쪽 사이드바 아래 도구 영역처럼, 메인에서 바로 새 보드를 만들 수 있습니다.
              </p>

              <form onSubmit={handleCommunitySubmit} className="mt-4 space-y-3">
                <input
                  type="text"
                  value={communityName}
                  onChange={(event) => setCommunityName(event.target.value)}
                  placeholder="예: SeongsuMakers"
                  className="w-full rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
                />
                <textarea
                  value={communityDescription}
                  onChange={(event) => setCommunityDescription(event.target.value)}
                  rows={3}
                  placeholder="이 커뮤니티에서 다룰 주제를 적어주세요."
                  className="w-full resize-none rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
                />
                <input
                  type="text"
                  value={communityTags}
                  onChange={(event) => setCommunityTags(event.target.value)}
                  placeholder="태그를 쉼표로 구분"
                  className="w-full rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
                />
                <input
                  type="url"
                  value={communityBanner}
                  onChange={(event) => setCommunityBanner(event.target.value)}
                  placeholder="배너 이미지 URL"
                  className="w-full rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
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

          <section className="reddit-panel rounded-[24px] p-4">
            <p className="text-sm font-bold text-[var(--ink)]">탐색</p>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => setActiveCommunityId('home')}
                className={`flex w-full items-center justify-between rounded-[14px] px-3 py-2.5 text-sm ${
                  !activeCommunity ? 'bg-[var(--surface-muted)] font-bold text-[var(--ink)]' : 'text-[var(--muted)]'
                }`}
              >
                <span>Home</span>
                <span>{formatCompactNumber(homeScopedPosts.length)}</span>
              </button>

              {joinedCommunities.map((community) => (
                <button
                  key={community.id}
                  onClick={() => setActiveCommunityId(community.id)}
                  className={`flex w-full items-center justify-between rounded-[14px] px-3 py-2.5 text-sm ${
                    activeCommunity?.id === community.id
                      ? 'bg-[var(--surface-muted)] font-bold text-[var(--ink)]'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  <span className="truncate">{community.slug}</span>
                  <span>{formatCompactNumber(community.members)}</span>
                </button>
              ))}
            </div>

            <label className="mt-4 flex items-center justify-between rounded-[14px] bg-[var(--surface-muted)] px-3 py-3 text-sm">
              <span className="font-semibold text-[var(--ink)]">가입 커뮤니티만 홈에 반영</span>
              <input
                type="checkbox"
                checked={joinedOnlyHome}
                onChange={(event) => setJoinedOnlyHome(event.target.checked)}
                className="h-4 w-4 accent-[var(--brand-orange)]"
              />
            </label>
          </section>
        </aside>

        <main className="space-y-4">
          <section className="reddit-panel rounded-[24px] p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                  {activeCommunity ? 'Community View' : 'Home Feed'}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--ink)]">
                  {activeCommunity ? activeCommunity.slug : '추천 커뮤니티와 추천 피드'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {activeCommunity
                    ? activeCommunity.description
                    : 'reddit.com처럼 메인에서는 다양한 커뮤니티의 인기 글을 먼저 보고, 커뮤니티 안으로 들어가면 그 보드의 글만 깊게 탐색하는 흐름으로 맞췄습니다.'}
                </p>
              </div>

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
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
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
          </section>

          {!activeCommunity && (
            <section className="reddit-panel rounded-[24px] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[var(--ink)]">추천 커뮤니티</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">오른쪽 랭킹 박스와 별개로 메인 상단에 추천 보드를 노출합니다.</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {recommendedCommunities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => setActiveCommunityId(community.id)}
                    className="flex items-center gap-3 rounded-[18px] border border-[var(--line)] bg-white p-3 text-left transition hover:border-[rgba(255,106,50,0.32)] hover:bg-[rgba(255,106,50,0.03)]"
                  >
                    <div
                      className="h-14 w-14 rounded-[16px] bg-cover bg-center"
                      style={{ backgroundImage: `url(${community.icon || community.banner})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[var(--ink)]">{community.slug}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{community.description}</p>
                    </div>
                    <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-bold text-[var(--muted)]">
                      {community.isJoined ? 'Joined' : 'View'}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="reddit-panel rounded-[24px] p-8 text-center text-sm text-[var(--muted)]">
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
          <section className="reddit-panel rounded-[24px] p-4">
            <p className="text-sm font-bold text-[var(--ink)]">
              {activeCommunity ? `${activeCommunity.slug} 정보` : 'Popular Communities'}
            </p>

            {activeCommunity ? (
              <div className="mt-4">
                <div
                  className="h-28 rounded-[18px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeCommunity.banner})` }}
                />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[16px] bg-[var(--surface-muted)] px-3 py-4">
                    <p className="text-lg font-bold">{formatCompactNumber(activeCommunity.members)}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Members</p>
                  </div>
                  <div className="rounded-[16px] bg-[var(--surface-muted)] px-3 py-4">
                    <p className="text-lg font-bold">{activeCommunity.online}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Online</p>
                  </div>
                  <div className="rounded-[16px] bg-[var(--surface-muted)] px-3 py-4">
                    <p className="text-lg font-bold">{activeCommunityPostCount}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Threads</p>
                  </div>
                  <div className="rounded-[16px] bg-[var(--surface-muted)] px-3 py-4">
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

                <button
                  onClick={() => onJoinCommunity(activeCommunity.id)}
                  className={`mt-4 w-full rounded-full px-4 py-3 text-sm font-bold ${
                    activeCommunity.isJoined ? 'bg-[var(--ink)] text-white' : 'bg-[var(--brand-orange)] text-white'
                  }`}
                >
                  {activeCommunity.isJoined ? '가입 해제' : '이 커뮤니티 가입'}
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {recommendedCommunities.slice(0, 5).map((community, index) => (
                  <div key={community.id} className="flex items-center gap-3 rounded-[16px] bg-[var(--surface-muted)] px-3 py-3">
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
            <section className="reddit-panel rounded-[24px] p-4">
              <p className="text-sm font-bold text-[var(--ink)]">Trending Today</p>
              <div className="mt-4 space-y-3">
                {trendingPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setActiveCommunityId(post.communityId || 'home')}
                    className="block w-full rounded-[16px] bg-[var(--surface-muted)] p-3 text-left"
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
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-orange)] text-3xl font-light text-white shadow-[0_18px_40px_rgba(255,106,50,0.35)]"
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
