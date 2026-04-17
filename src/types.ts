interface Comment {
  id: string;
  author: string;
  handle: string;
  content: string;
  avatar: string;
  timeAgo: string;
  createdAt: string;
}

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner: string;
  icon: string;
  theme: string;
  members: number;
  online: number;
  tags: string[];
  createdAt: string;
  isJoined?: boolean;
  isTrending?: boolean;
  isMine?: boolean;
}

interface Post {
  id: string;
  author: string;
  handle: string;
  content: string;
  location: string;
  category: string;
  image: string;
  mood: string;
  avatar: string;
  timeAgo: string;
  createdAt: string;
  distance: string;
  saves: number;
  likes: number;
  shares: number;
  tags: string[];
  comments: Comment[];
  communityId?: string;
  communityName?: string;
  communitySlug?: string;
  isSaved?: boolean;
  isLiked?: boolean;
  isMine?: boolean;
}

export type { Comment, Community, Post };
