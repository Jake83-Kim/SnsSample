"use client";

import React from 'react';
import Post from './Post';
import PostForm from './PostForm';
import { Post as PostType } from '../types';

interface FeedProps {
  user: string;
  posts: PostType[];
  onPost: (content: string) => void;
  onLike: (id: string) => void;
  onComment: (id: string, comment: string) => void;
}

const Feed: React.FC<FeedProps> = ({ user, posts, onPost, onLike, onComment }) => {
  const featuredPost = posts[0];

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-5">
        <section className="panel rounded-[32px] p-5">
          <div className="flex items-center gap-3">
            <div className="avatar-ring flex h-14 w-14 items-center justify-center bg-[var(--brand)] text-lg font-semibold text-white">
              {user.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold">{user}</p>
              <p className="text-sm text-[var(--muted)]">@{user.toLowerCase().replace(/\s+/g, '')}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-[22px] bg-[var(--surface-muted)] px-3 py-4">
              <p className="text-lg font-semibold">128</p>
              <p className="mt-1 text-xs text-[var(--muted)]">팔로잉</p>
            </div>
            <div className="rounded-[22px] bg-[var(--surface-muted)] px-3 py-4">
              <p className="text-lg font-semibold">2.4K</p>
              <p className="mt-1 text-xs text-[var(--muted)]">팔로워</p>
            </div>
            <div className="rounded-[22px] bg-[var(--surface-muted)] px-3 py-4">
              <p className="text-lg font-semibold">38</p>
              <p className="mt-1 text-xs text-[var(--muted)]">포스트</p>
            </div>
          </div>
        </section>

        {featuredPost && (
          <section className="panel overflow-hidden rounded-[32px]">
            <div
              className="h-52 bg-cover bg-center"
              style={{ backgroundImage: `url(${featuredPost.image})` }}
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Spotlight</p>
              <p className="mt-3 text-xl font-semibold">{featuredPost.location}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{featuredPost.content}</p>
            </div>
          </section>
        )}

        <section className="panel rounded-[32px] p-5">
          <p className="text-sm font-semibold">탐색 카테고리</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['카페', '전시', '팝업', '러닝', '반려동물', '맛집'].map((item) => (
              <span
                key={item}
                className="rounded-full bg-[var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--muted)]"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </aside>

      <section className="space-y-5">
        <PostForm onPost={onPost} user={user} />
        {posts.map((post) => (
          <Post key={post.id} post={post} onLike={onLike} onComment={onComment} />
        ))}
      </section>
    </div>
  );
};

export default Feed;
