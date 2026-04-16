"use client";

import React from 'react';
import type { Post } from '../types';

interface PostProps {
  post: Post;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
  onComment: (id: string, comment: string) => void;
}

const PostCard: React.FC<PostProps> = ({ post, onLike, onSave, onShare, onDelete, onComment }) => {
  const [comment, setComment] = React.useState('');
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];

  const handleComment = () => {
    if (!comment.trim()) return;
    onComment(post.id, comment);
    setComment('');
  };

  return (
    <article className="panel overflow-hidden rounded-[32px] shadow-[0_24px_60px_rgba(31,41,55,0.08)]">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className="avatar-ring h-12 w-12 shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.avatar})` }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{post.author}</h3>
                  <span className="rounded-full bg-[rgba(45,168,93,0.12)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
                    {post.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  @{post.handle} · {post.timeAgo} · {post.location} · {post.distance}
                </p>
              </div>
              {post.isMine ? (
                <button
                  onClick={() => onDelete(post.id)}
                  className="rounded-full border border-[rgba(33,35,38,0.08)] px-3 py-1 text-xs font-semibold text-[var(--muted)] transition hover:border-[rgba(220,38,38,0.3)] hover:text-[rgb(220,38,38)]"
                >
                  삭제
                </button>
              ) : (
                <button className="text-xl leading-none text-[var(--muted)]">⋯</button>
              )}
            </div>

            <p className="mt-4 text-[15px] leading-7 text-[var(--ink)]">{post.content}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative aspect-[1.05/1] bg-[var(--surface-muted)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0)_46%,rgba(17,24,39,0.62)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/80">{post.mood}</p>
            <p className="mt-2 text-lg font-semibold">{post.location}</p>
          </div>
          <div className="rounded-full border border-white/20 bg-white/12 px-3 py-2 text-xs font-semibold backdrop-blur">
            저장 {post.saves}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3 border-b border-[rgba(33,35,38,0.07)] pb-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <button
              onClick={() => onLike(post.id)}
              className={`rounded-full px-4 py-2 font-semibold transition ${
                post.isLiked
                  ? 'bg-[var(--brand)] text-white'
                  : 'bg-[rgba(45,168,93,0.12)] text-[var(--brand-deep)] hover:bg-[rgba(45,168,93,0.18)]'
              }`}
            >
              좋아요 {post.likes}
            </button>
            <button
              onClick={() => onSave(post.id)}
              className={`rounded-full px-4 py-2 font-semibold transition ${
                post.isSaved
                  ? 'bg-[var(--ink)] text-white'
                  : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:bg-[rgba(32,34,37,0.08)]'
              }`}
            >
              저장 {post.saves}
            </button>
            <button
              onClick={() => onShare(post.id)}
              className="rounded-full bg-[var(--surface-muted)] px-4 py-2 font-semibold text-[var(--muted)] transition hover:bg-[rgba(32,34,37,0.08)]"
            >
              공유 {post.shares}
            </button>
            <span>댓글 {comments.length}</span>
          </div>
          <div className="text-sm text-[var(--muted)]">{String(post.createdAt).slice(0, 10)}</div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="공감이나 질문을 남겨보세요"
            className="flex-1 rounded-full border border-[rgba(33,35,38,0.08)] bg-[var(--surface-muted)] px-4 py-3 text-sm outline-none transition focus:border-[rgba(45,168,93,0.4)] focus:ring-4 focus:ring-[rgba(45,168,93,0.1)]"
          />
          <button
            onClick={handleComment}
            className="rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-deep)]"
          >
            댓글
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {comments.map((commentItem) => (
            <div key={commentItem.id} className="flex gap-3 rounded-[22px] bg-[var(--surface-muted)] px-4 py-3">
              <div
                className="avatar-ring h-10 w-10 shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${commentItem.avatar})` }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {commentItem.author}
                  <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                    @{commentItem.handle} · {commentItem.timeAgo}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--ink)]">{commentItem.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
