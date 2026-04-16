"use client";

import React from 'react';

interface PostFormProps {
  onPost: (payload: {
    content: string;
    location: string;
    category: string;
    mood: string;
    tags: string[];
    image: string;
  }) => void;
  user: string;
}

const defaultImage =
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';

const PostForm: React.FC<PostFormProps> = ({ onPost, user }) => {
  const [content, setContent] = React.useState('');
  const [location, setLocation] = React.useState('성수동');
  const [category, setCategory] = React.useState('CAFE');
  const [mood, setMood] = React.useState('Calm Mood');
  const [tags, setTags] = React.useState('동네기록, 추천');
  const [image, setImage] = React.useState(defaultImage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onPost({
      content: content.trim(),
      location: location.trim() || '내 주변 1km',
      category,
      mood: mood.trim() || 'Fresh Update',
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 5),
      image: image.trim() || defaultImage,
    });

    setContent('');
    setTags('동네기록, 추천');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
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
              <p className="text-xs text-[var(--muted)]">지금 근처 사람들과 바로 공유할 새 포스트를 작성해보세요.</p>
            </div>
            <span className="rounded-full bg-[rgba(45,168,93,0.12)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
              동네 공개
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 발견한 공간, 메뉴, 분위기, 동네 소식을 남겨보세요."
            className="min-h-[110px] w-full resize-none rounded-[24px] border border-[rgba(33,35,38,0.08)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 outline-none transition focus:border-[rgba(45,168,93,0.4)] focus:ring-4 focus:ring-[rgba(45,168,93,0.1)]"
            rows={4}
          />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="위치"
              className="rounded-[18px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[rgba(45,168,93,0.4)]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-[18px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[rgba(45,168,93,0.4)]"
            >
              <option value="CAFE">카페</option>
              <option value="FOOD">맛집</option>
              <option value="EXHIBIT">전시</option>
              <option value="POP-UP">팝업</option>
              <option value="LIFESTYLE">라이프</option>
              <option value="UPDATE">업데이트</option>
            </select>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="무드"
              className="rounded-[18px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[rgba(45,168,93,0.4)]"
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="태그를 쉼표로 구분"
              className="rounded-[18px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[rgba(45,168,93,0.4)]"
            />
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="이미지 URL"
              className="rounded-[18px] border border-[rgba(33,35,38,0.08)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[rgba(45,168,93,0.4)]"
            />
            <label className="inline-flex cursor-pointer items-center justify-center rounded-[18px] border border-dashed border-[rgba(33,35,38,0.16)] bg-white px-4 py-3 text-sm font-semibold text-[var(--muted)]">
              이미지 업로드
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          <div className="mt-3 overflow-hidden rounded-[24px] bg-[var(--surface-muted)]">
            <div
              className="aspect-[16/9] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>

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

