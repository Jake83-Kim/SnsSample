interface Comment {
  id: string;
  author: string;
  content: string;
}

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: Comment[];
}

export type { Comment, Post };