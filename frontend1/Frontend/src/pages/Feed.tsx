
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useInView } from 'react-intersection-observer';
import PostCard from '@/components/posts/PostCard';
import { feedPostsState, feedLoadingState, feedPageState } from '@/store/Atom';
import { mockPosts } from '@/mockData';
import { Post } from '@/types';

const Feed: React.FC = () => {
  const [posts, setPosts] = useRecoilState<Post[]>(feedPostsState);
  const [loading, setLoading] = useRecoilState(feedLoadingState);
  const [page, setPage] = useRecoilState(feedPageState);
  const [hasMore, setHasMore] = useState(true);
  
  // Set up intersection observer for infinite scrolling
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Load initial posts
  useEffect(() => {
    if (posts.length === 0) {
      loadMorePosts();
    }
  }, []);

  // Handle infinite scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView]);

  // Simulates loading more posts from an API
  const loadMorePosts = async () => {
    try {
      setLoading(true);
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch posts from an API
      // For now, we'll just use mockPosts with pagination
      const postsPerPage = 3;
      const startIndex = (page - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      
      // Simulate pagination by slicing a portion of mockPosts
      const newPosts = mockPosts.slice(startIndex, endIndex);
      
      if (newPosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Your Feed</h1>
        <p className="text-slate-300">Posts from communities you've joined</p>
      </div>
      
      {posts.length === 0 && !loading ? (
        <div className="text-center py-10">
          <h3 className="text-xl text-white mb-2">Your feed is empty</h3>
          <p className="text-slate-300">Join some communities to see posts here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {/* Loading indicator and infinite scroll trigger */}
          <div ref={ref} className="py-4 text-center">
            {loading && <p className="text-slate-300">Loading more posts...</p>}
            {!hasMore && posts.length > 0 && (
              <p className="text-slate-300">No more posts to load</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;