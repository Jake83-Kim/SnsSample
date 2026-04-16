"use client";

import React from 'react';

interface PostFormProps {
  onPost: (content: string) => void;
  user: string;
}

const PostForm: React.FC<PostFormProps> = ({ onPost, user }) => {
  const [content, setContent] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onPost(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel rounded-[30px] p-5 shadow-[0_22px_50px_rgba(31,41,55,0.08)]">
      <div className="flex items-start gap-3">
        <div className="avatar-ring flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--brand)] text-sm font-semibold text-white">
          {user.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{user}</p>
              <p className="text-xs text-[var(--muted)]">지금 근처 사람들과 공유해보세요</p>
            </div>
            <span className="rounded-full bg-[rgba(45,168,93,0.12)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
              동네 공개
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 발견한 공간, 메뉴, 분위기를 남겨보세요."
            className="min-h-[110px] w-full resize-none rounded-[24px] border border-[rgba(33,35,38,0.08)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 outline-none transition focus:border-[rgba(45,168,93,0.4)] focus:ring-4 focus:ring-[rgba(45,168,93,0.1)]"
            rows={4}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-2">#카페</span>
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-2">#동네소식</span>
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-2">#추천</span>
            </div>
            <button
              type="submit"
              className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-deep)]"
            >
              게시하기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
