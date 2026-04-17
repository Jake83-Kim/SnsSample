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
  const [sortMode, setSortMode] = React.useState<'HOT' | 'NEW' | 'TOP'>('HOT');
  const [joinedOnlyHome, setJoinedOnlyHome] = React.useState(true);
  const [isComposerOpen, setIsComposerOpen] = React.useState(false);
  const [communityName, setCommunityName] = React.useState('');
  const [communityDescription, setCommunityDescription] = React.useState('');
  const [communityTags, setCommunityTags] = React.useState('지역소식, 추천');
  const [communityBanner, setCommunityBanner] = React.useState('');

  const filters = ['ALL', 'COMMUNITY', 'CAFE', 'FOOD', 'EXHIBIT', 'POP-UP', 'LIFESTYLE', 'UPDATE'];
  const sortModes: Array<'HOT' | 'NEW' | 'TOP'> = ['HOT', 'NEW', 'TOP'];
  const joinedCommunities = communities.filter((community) => community.isJoined);
  const trendingCommunities = communities.filter((community) => community.isTrending).slice(0, 3);
  const activeCommunity =
    activeCommunityId === 'home' ? null : communities.find((community) => community.id === activeCommunityId) ?? null;
  const recommendedCommunities = communities
    .filter((community) => !joinedOnlyHome || community.isJoined || community.isTrending)
    .slice(0, 6);

  const homeScopedPosts = joinedOnlyHome
    ? posts.filter((post) => {
        if (!post.communityId) return true;
        return joinedCommunities.some((community) => community.id === post.communityId);
      })
    : posts;

  const scopedPosts = activeCommunity ? posts.filter((post) => post.communityId === activeCommunity.id) : homeScopedPosts;
  const categoryFilteredPosts =
    activeFilter === 'ALL' ? scopedPosts : scopedPosts.filter((post) => post.category === activeFilter);
  const filteredPosts = [...categoryFilteredPosts].sort((left, right) => {
    if (sortMode === 'NEW') {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    }

    if (sortMode === 'TOP') {
      const leftScore = left.likes + left.saves + left.comments.length * 2 + left.shares * 2;
      const rightScore = right.likes + right.saves + right.comments.length * 2 + right.shares * 2;
      return rightScore - leftScore;
    }

    const leftHot =
      left.likes * 2 + left.comments.length * 3 + left.shares * 3 + left.saves - Math.floor((Date.now() - new Date(left.createdAt).getTime()) / 3600000);
    const rightHot =
      right.likes * 2 + right.comments.length * 3 + right.shares * 3 + right.saves - Math.floor((Date.now() - new Date(right.createdAt).getTime()) / 3600000);
    return rightHot - leftHot;
  });
  const featuredPost = filteredPosts[0] ?? posts[0];

  const activeCommunityPostCount = activeCommunity
    ? posts.filter((post) => post.communityId === activeCommunity.id).length
    : homeScopedPosts.length;
  const activeCommunityTotalComments = activeCommunity
    ? posts
        .filter((post) => post.communityId === activeCommunity.id)
        .reduce((total, post) => total + post.comments.length, 0)
    : homeScopedPosts.reduce((total, post) => total + post.comments.length, 0);
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
    setActiveFilter('ALL');
  };

  const handleOpenComposer = () => {
    if (!activeCommunity) return;
    setIsComposerOpen(true);
  };

  const handleCloseComposer = () => {
    setIsComposerOpen(false);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
      <aside className="space-y-5">
        <section className="panel rounded-[32px] p-5">
          <div className="flex items-center gap-3">
            <div className="avatar-ring flex h-14 w-14 items-center justify-center bg-[var(--brand-orange)] text-lg font-semibold text-white">
              {user.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold">{user}</p>
              <p className="text-sm text-[var(--muted)]">@{user.toLowerCase().replace(/\s+/g, '')}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={onLogout}
              className="flex-1 rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-orange-deep)]"
            >
              로그아웃
            </button>
            <button
              onClick={onResetDemo}
              className="flex-1 rounded-full bg-[var(--surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--muted)] transition hover:bg-[rgba(32,34,37,0.08)]"
            >
              데모 초기화
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-[22px] bg-[var(--surface-muted)] px-3 py-4">
              <p className="text-lg font-semibold">{joinedCommunities.length}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">가입</p>
            </div>
            <div className="rounded-[22px] bg-[var(--surface-muted)] px-3 py-4">
              <p className="text-lg font-semibold">{formatCompactNumber(posts.length)}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">피드</p>
            </div>
            <div className="rounded-[22px] bg-[var(--surface-muted)] px-3 py-4">
              <p className="text-lg font-semibold">{communities.filter((community) => community.isMine).length}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">생성</p>
            </div>
          </div>
        </section>

        {!activeCommunity && (
          <section className="panel rounded-[32px] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">새 커뮤니티 생성</p>
                <p className="mt-1 text-xs text-[var(--muted)]">메인에서 바로 새 보드를 만들 수 있어요.</p>
              </div>
              <span className="rounded-full bg-[rgba(255,106,50,0.12)] px-3 py-1 text-[11px] font-semibold text-[var(--brand-orange-deep)]">
                Create
              </span>
            </div>

            <form onSubmit={handleCommunitySubmit} className="mt-4 space-y-3">
              <input
                type="text"
                value={communityName}
                onChange={(event) => setCommunityName(event.target.value)}
                placeholder="예: SeongsuMakers"
                className="w-full rounded-[18px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[rgba(255,106,50,0.35)]"
              />
              <textarea
                value={communityDescription}
                onChange={(event) => setCommunityDescription(event.target.value)}
                placeholder="커뮤니티 목적과 분위기를 적어주세요."
                rows={3}
                className="w-full resize-none rounded-[18px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[rgba(255,106,50,0.35)]"
              />
              <input
                type="text"
                value={communityTags}
                onChange={(event) => setCommunityTags(event.target.value)}
                placeholder="태그를 쉼표로 구분"
                className="w-full rounded-[18px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[rgba(255,106,50,0.35)]"
              />
              <input
                type="url"
                value={communityBanner}
                onChange={(event) => setCommunityBanner(event.target.value)}
                placeholder="배너 이미지 URL"
                className="w-full rounded-[18px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[rgba(255,106,50,0.35)]"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-[var(--brand-orange)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-orange-deep)]"
              >
                새 커뮤니티 생성
              </button>
            </form>
          </section>
        )}

        <section className="panel rounded-[32px] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">피드 탐색</p>
              <p className="mt-1 text-xs text-[var(--muted)]">메인과 커뮤니티 뷰를 오가며 탐색할 수 있어요.</p>
            </div>
            <span className="rounded-full bg-[rgba(255,106,50,0.12)] px-3 py-1 text-[11px] font-semibold text-[var(--brand-orange-deep)]">
              Reddit Flow
            </span>
          </div>

          <label className="mt-4 flex items-center justify-between rounded-[18px] bg-[var(--surface-muted)] px-4 py-3 text-sm">
            <span className="font-semibold">가입한 커뮤니티만 메인에 반영</span>
            <input
              type="checkbox"
              checked={joinedOnlyHome}
              onChange={(event) => setJoinedOnlyHome(event.target.checked)}
              className="h-4 w-4 accent-[var(--brand-orange)]"
            />
          </label>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => setActiveCommunityId('home')}
              className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left transition ${
                activeCommunityId === 'home'
                  ? 'bg-[var(--ink)] text-white'
                  : 'bg-[var(--surface-muted)] text-[var(--ink)] hover:bg-[rgba(32,34,37,0.08)]'
              }`}
            >
              <span className="font-semibold">메인 홈</span>
              <span className="text-xs">{formatCompactNumber(homeScopedPosts.length)}</span>
            </button>

            {joinedCommunities.map((community) => (
              <button
                key={community.id}
                onClick={() => setActiveCommunityId(community.id)}
                className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left transition ${
                  activeCommunityId === community.id
                    ? 'bg-[rgba(255,106,50,0.14)] text-[var(--ink)]'
                    : 'bg-[var(--surface-muted)] text-[var(--ink)] hover:bg-[rgba(32,34,37,0.08)]'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{community.slug}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{formatCompactNumber(community.members)} members</p>
                </div>
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: community.theme || 'var(--brand-orange)' }}
                />
              </button>
            ))}
          </div>
        </section>

        <section className="panel rounded-[32px] p-5">
          <p className="text-sm font-semibold">트렌딩 커뮤니티</p>
          <div className="mt-4 space-y-3">
            {trendingCommunities.map((community) => (
              <div key={community.id} className="rounded-[22px] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{community.slug}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{community.online}명 접속 중</p>
                  </div>
                  <button
                    onClick={() => onJoinCommunity(community.id)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      community.isJoined
                        ? 'bg-[var(--ink)] text-white'
                        : 'bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-deep)]'
                    }`}
                  >
                    {community.isJoined ? '가입됨' : '가입'}
                  </button>
                </div>
                <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{community.description}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>

      <section className="space-y-5">
        <section className="panel overflow-hidden rounded-[32px]">
          <div
            className="relative h-56 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeCommunity?.banner ?? featuredPost?.image ?? ''})` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.18)_0%,rgba(17,24,39,0.78)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
                {activeCommunity ? 'Community View' : 'Home Feed'}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                {activeCommunity ? activeCommunity.slug : '당신을 위한 커뮤니티 피드'}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82">
                {activeCommunity
                  ? activeCommunity.description
                  : '메인 화면에서는 추천 커뮤니티와 추천 피드를 먼저 보여줍니다. 커뮤니티에 들어가면 그 안에서만 글을 작성하고 스레드를 탐색할 수 있어요.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(activeCommunity?.tags ?? ['홈', '트렌딩', '커뮤니티']).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/16 bg-white/10 px-3 py-2 text-xs font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {!activeCommunity ? (
          <>
            <section className="panel rounded-[30px] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">추천 커뮤니티</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">메인에서 먼저 둘러볼 만한 보드를 보여줍니다.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recommendedCommunities.slice(0, 3).map((community) => (
                    <button
                      key={community.id}
                      onClick={() => setActiveCommunityId(community.id)}
                      className="rounded-full bg-[var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:bg-[rgba(255,106,50,0.12)] hover:text-[var(--ink)]"
                    >
                      {community.slug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {recommendedCommunities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => setActiveCommunityId(community.id)}
                    className="overflow-hidden rounded-[26px] border border-[rgba(33,35,38,0.08)] bg-white text-left transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(31,41,55,0.08)]"
                  >
                    <div
                      className="h-28 bg-cover bg-center"
                      style={{ backgroundImage: `url(${community.banner})` }}
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-base font-semibold">{community.slug}</p>
                        <span className="rounded-full bg-[rgba(255,106,50,0.12)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-orange-deep)]">
                          {community.isJoined ? 'Joined' : 'Recommended'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{community.description}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
                        <span>{formatCompactNumber(community.members)} members</span>
                        <span>{community.online} online</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel rounded-[30px] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold">추천 피드</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {joinedOnlyHome ? '가입한 커뮤니티와 추천 보드 중심' : '전체 보드 기준'}으로 정렬된 스레드입니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-wrap gap-2">
                    {sortModes.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setSortMode(mode)}
                        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                          sortMode === mode
                            ? 'bg-[var(--ink)] text-white'
                            : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:bg-[rgba(32,34,37,0.08)]'
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
                        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                          activeFilter === item
                            ? 'bg-[var(--brand-orange)] text-white'
                            : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:bg-[rgba(32,34,37,0.08)]'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="panel rounded-[30px] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold">커뮤니티 피드</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{`${activeCommunity.slug}에 올라온 글 ${activeCommunityPostCount}개`}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                  {sortModes.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSortMode(mode)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                        sortMode === mode
                          ? 'bg-[var(--ink)] text-white'
                          : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:bg-[rgba(32,34,37,0.08)]'
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
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                        activeFilter === item
                          ? 'bg-[var(--brand-orange)] text-white'
                          : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:bg-[rgba(32,34,37,0.08)]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {filteredPosts.length === 0 ? (
          <div className="panel rounded-[30px] p-8 text-center text-[var(--muted)]">
            아직 이 영역에는 글이 없습니다. 새 게시글을 올리거나 다른 커뮤니티 피드로 이동해보세요.
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

      <aside className="space-y-5">
        {activeCommunity && (
          <section className="panel rounded-[32px] p-5">
            <p className="text-sm font-semibold">{activeCommunity.slug} 정보</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-lg font-semibold">{formatCompactNumber(activeCommunity.members)}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">멤버</p>
              </div>
              <div className="rounded-[20px] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-lg font-semibold">{activeCommunity.online}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">접속 중</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-lg font-semibold">{activeCommunityPostCount}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">스레드</p>
              </div>
              <div className="rounded-[20px] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-lg font-semibold">{activeCommunityTotalComments}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">댓글</p>
              </div>
            </div>
            <div className="mt-4 rounded-[22px] bg-[var(--surface-muted)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-orange-deep)]">About</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{activeCommunity.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(activeCommunityTopTags.length ? activeCommunityTopTags : activeCommunity.tags).map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[var(--muted)]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onJoinCommunity(activeCommunity.id)}
              className={`mt-4 w-full rounded-full px-4 py-3 text-sm font-semibold transition ${
                activeCommunity.isJoined
                  ? 'bg-[var(--ink)] text-white'
                  : 'bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-deep)]'
              }`}
            >
              {activeCommunity.isJoined ? '가입 해제' : '이 커뮤니티 가입'}
            </button>
          </section>
        )}

        {!activeCommunity && (
          <section className="panel rounded-[32px] p-5">
            <p className="text-sm font-semibold">추천 포인트</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] bg-[var(--surface-muted)] p-4">
                <p className="text-sm font-semibold">커뮤니티부터 탐색</p>
                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                  메인에서는 글 작성 대신 어떤 커뮤니티에 들어갈지 먼저 선택하는 구조로 바꿨습니다.
                </p>
              </div>
              <div className="rounded-[22px] bg-[var(--surface-muted)] p-4">
                <p className="text-sm font-semibold">커뮤니티 안에서만 작성</p>
                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                  글 쓰기는 보드 안에서 하단 고정 `+` 버튼을 눌러 팝업으로 여는 흐름입니다.
                </p>
              </div>
            </div>
          </section>
        )}
      </aside>

      {activeCommunity && (
        <button
          onClick={handleOpenComposer}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-orange)] text-3xl leading-none text-white shadow-[0_18px_40px_rgba(255,106,50,0.35)] transition hover:scale-[1.03] hover:bg-[var(--brand-orange-deep)] sm:bottom-8 sm:right-8"
          aria-label="새 글 작성"
        >
          +
        </button>
      )}

      {activeCommunity && isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(17,24,39,0.48)] p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[32px]">
            <div className="mb-3 flex justify-end">
              <button
                onClick={handleCloseComposer}
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(17,24,39,0.12)]"
              >
                닫기
              </button>
            </div>
            <PostForm
              onPost={onPost}
              user={user}
              communities={communities}
              activeCommunityId={activeCommunity.id}
              onSubmitted={handleCloseComposer}
            />
          </div>
          <button className="absolute inset-0 -z-10 cursor-default" onClick={handleCloseComposer} aria-label="팝업 닫기" />
        </div>
      )}
    </div>
  );
};

export default Feed;
