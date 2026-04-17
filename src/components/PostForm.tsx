"use client";

import React from 'react';
import { Community } from '../types';

interface PostFormProps {
  onPost: (payload: {
    content: string;
    location: string;
    category: string;
    mood: string;
    tags: string[];
    image: string;
    communityId: string;
  }) => void;
  user: string;
  communities: Community[];
  activeCommunityId?: string | null;
  onSubmitted?: () => void;
}

const defaultImage =
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';

const PostForm: React.FC<PostFormProps> = ({ onPost, user, communities, activeCommunityId, onSubmitted }) => {
  const joinedCommunities = communities.filter((community) => community.isJoined);
  const [content, setContent] = React.useState('');
  const [location, setLocation] = React.useState('성수동');
  const [category, setCategory] = React.useState('COMMUNITY');
  const [mood, setMood] = React.useState('Fresh Thread');
  const [tags, setTags] = React.useState('질문, 추천');
  const [image, setImage] = React.useState(defaultImage);
  const [communityId, setCommunityId] = React.useState(activeCommunityId || joinedCommunities[0]?.id || '');

  React.useEffect(() => {
    if (activeCommunityId) {
      setCommunityId(activeCommunityId);
      return;
    }

    if (!joinedCommunities.find((community) => community.id === communityId)) {
      setCommunityId(joinedCommunities[0]?.id || '');
    }
  }, [activeCommunityId, communityId, joinedCommunities]);

  const selectedCommunity = communities.find((community) => community.id === communityId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim() || !communityId) return;

    onPost({
      content: content.trim(),
      location: location.trim() || '홈 피드',
      category,
      mood: mood.trim() || 'Fresh Thread',
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 5),
      image: image.trim() || defaultImage,
      communityId,
    });

    setContent('');
    setTags('질문, 추천');
    setMood('Fresh Thread');
    onSubmitted?.();
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
    <form onSubmit={handleSubmit} className="reddit-panel rounded-[28px] p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-orange)] text-sm font-bold text-white">
          {user.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">{user}</p>
              <p className="text-xs text-[var(--muted)]">커뮤니티 안에서만 글을 올릴 수 있게 구성했습니다.</p>
            </div>
            <span className="rounded-full bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--ink)]">
              {selectedCommunity?.slug ?? '커뮤니티 선택'}
            </span>
          </div>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="질문, 후기, 추천 장소, 오늘의 발견을 남겨보세요."
            rows={5}
            className="w-full resize-none rounded-[18px] border border-[var(--line)] bg-white px-4 py-4 text-sm leading-7 outline-none"
          />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select
              value={communityId}
              onChange={(event) => setCommunityId(event.target.value)}
              className="rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
            >
              {joinedCommunities.length === 0 ? (
                <option value="">가입된 커뮤니티 없음</option>
              ) : (
                joinedCommunities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.slug}
                  </option>
                ))
              )}
            </select>

            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="위치"
              className="rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="COMMUNITY">커뮤니티</option>
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
              onChange={(event) => setMood(event.target.value)}
              placeholder="무드"
              className="rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
            />

            <input
              type="text"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="태그를 쉼표로 구분"
              className="rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none md:col-span-2"
            />
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="이미지 URL"
              className="rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
            />
            <label className="inline-flex cursor-pointer items-center justify-center rounded-[16px] border border-dashed border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--muted)]">
              이미지 업로드
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          <div className="mt-3 overflow-hidden rounded-[20px] bg-[var(--surface-muted)]">
            <div className="aspect-[16/8] w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              {(selectedCommunity?.tags ?? ['커뮤니티', '질문', '추천']).map((tag) => (
                <span key={tag} className="rounded-full bg-[var(--surface-muted)] px-3 py-2">
                  #{tag}
                </span>
              ))}
            </div>
            <button
              type="submit"
              disabled={!communityId}
              className="rounded-full bg-[var(--brand-orange)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              커뮤니티에 게시
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
