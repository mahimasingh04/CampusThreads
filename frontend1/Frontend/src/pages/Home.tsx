import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  community: {
    name: string;
  };
  createdAt: string;
  upvotes: number;
  comments: number;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/post/feed', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#28264D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#28264D] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#28264D] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-[#383B6E] rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Welcome, {user?.name}!</h1>
              
              {/* Create Post Button */}
              <div className="mb-6">
                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Create Post
                </button>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No posts yet. Be the first to create one!
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="bg-[#28264D] rounded-lg p-4 hover:bg-[#3635DF]/10 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                            {post.author.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <span className="font-medium text-white">{post.author.name}</span>
                            <span className="mx-1">•</span>
                            <span>r/{post.community.name}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                          <p className="text-gray-300 mb-4">{post.content}</p>
                          <div className="flex items-center space-x-4 text-gray-400">
                            <button className="flex items-center space-x-1 hover:text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              <span>{post.upvotes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{post.comments} comments</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#383B6E] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Popular Communities</h2>
              <div className="space-y-4">
                {/* Add community list here */}
                <div className="text-center text-gray-400 py-4">
                  No communities yet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 