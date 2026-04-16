"use client";

import React from 'react';
import type { Post, Comment } from '../types';

interface PostProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (id: string, comment: string) => void;
}

const Post: React.FC<PostProps> = ({ post, onLike, onComment }) => {
  const [comment, setComment] = React.useState('');

  const handleComment = () => {
    if (comment.trim()) {
      onComment(post.id, comment);
      setComment('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="font-bold">{post.author}</h3>
      <p className="mt-2">{post.content}</p>
      <div className="mt-4 flex items-center">
        <button onClick={() => onLike(post.id)} className="text-blue-500 mr-4">
          Like ({post.likes})
        </button>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          className="flex-1 p-2 border rounded"
        />
        <button onClick={handleComment} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Comment
        </button>
      </div>
      <div className="mt-2">
        {post.comments.map((c) => (
          <div key={c.id} className="text-sm text-gray-600">
            <strong>{c.author}:</strong> {c.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;