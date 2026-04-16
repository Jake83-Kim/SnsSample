import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Feed from '../components/Feed';

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

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedPosts = localStorage.getItem('posts');
    if (savedUser) setUser(savedUser);
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('user', username);
  };

  const handlePost = (content: string) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: user,
      content,
      likes: 0,
      comments: [],
    };
    const newPosts = [newPost, ...posts];
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const handleLike = (id: string) => {
    const newPosts = posts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const handleComment = (id: string, comment: string) => {
    if (!user) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: user,
      content: comment,
    };
    const newPosts = posts.map((post) =>
      post.id === id ? { ...post, comments: [...post.comments, newComment] } : post
    );
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">SNS MVP</h1>
        <Feed posts={posts} onPost={handlePost} onLike={handleLike} onComment={handleComment} />
      </div>
    </main>
  );
}