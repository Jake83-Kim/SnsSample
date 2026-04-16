interface Comment {
  id: string;
  author: string;
  handle: string;
  content: string;
  avatar: string;
  timeAgo: string;
  createdAt: string;
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
  isSaved?: boolean;
  isLiked?: boolean;
  isMine?: boolean;
}

export type { Comment, Post };

