"use client";

import React from 'react';

interface PostFormProps {
  onPost: (content: string) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPost }) => {
  const [content, setContent] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onPost(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded"
        rows={3}
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Post
      </button>
    </form>
  );
};

export default PostForm;