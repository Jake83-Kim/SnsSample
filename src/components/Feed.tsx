import React from 'react';
import Post from './Post';
import PostForm from './PostForm';

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

interface FeedProps {
  posts: Post[];
  onPost: (content: string) => void;
  onLike: (id: string) => void;
  onComment: (id: string, comment: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onPost, onLike, onComment }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <PostForm onPost={onPost} />
      {posts.map((post) => (
        <Post key={post.id} post={post} onLike={onLike} onComment={onComment} />
      ))}
    </div>
  );
};

export default Feed;