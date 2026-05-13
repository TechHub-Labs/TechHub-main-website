/**
 * WHAT IS THIS FILE?
 * 
 * The Master Page (Presentation Layer).
 * This page is connected directly to our routes (`App.tsx`). This is what users see when they visit `/`.
 * 
 * Notice how incredibly clean this file is! 
 * All the messy `fetch` network logic is hidden inside `usePosts()`!
 */

import { usePosts } from '../domain/usePosts';
import { PostCard } from './PostCard';
import { Button } from '../../../shared/components/Button';

export const PostsPage = () => {
  // 1. Call our Brain Hook to give us the data
  const { posts, loading, error } = usePosts();

  // 2. Render the HTML!
  return (
    <div className="max-w-4xl mx-auto p-8">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Community Posts</h1>
          <p className="text-gray-500 mt-2 text-lg">See what everyone is discussing today.</p>
        </div>
        {/* We reuse our global generic Button here! */}
        <Button>Create Post</Button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="py-20 text-center flex flex-col items-center">
            {/* Simple tailwind pulse animation for a loading effect */}
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-xl text-blue-500 font-semibold animate-pulse">Loading posts from backend...</span>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg shadow-sm">
          🚨 {error}
        </div>
      )}

      {/* SUCCESS STATE */}
      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* We loop over every post in the array, and render a `<PostCard>` for each one! */}
          {posts.map((post) => (
            // React requires a unique `key` when rendering lists so it can optimize updates
            <PostCard key={post.id} post={post} />
          ))}

          {/* If the array is empty, show a friendly fallback message */}
          {posts.length === 0 && (
             <div className="col-span-full py-16 text-center text-gray-400 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                 No posts found. Are you sure the backend server is running and returning data?
             </div>
          )}
        </div>
      )}
    </div>
  );
};
