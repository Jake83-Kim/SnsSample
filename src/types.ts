interface Comment {
  id: string;
  author: string;
  handle: string;
  content: string;
  avatar: string;
  timeAgo: string;
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
  distance: string;
  saves: number;
  likes: number;
  shares: number;
  tags: string[];
  comments: Comment[];
}

export type { Comment, Post };
