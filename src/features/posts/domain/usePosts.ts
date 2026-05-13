/**
 * WHAT IS THIS FILE?
 * 
 * Custom React Hook (The Brain / Domain Layer).
 * 
 * This hook is responsible for fetching the posts using the API file,
 * saving them into Local React State (`useState`), and catching any errors.
 * 
 * It abstracts away all the messy `useEffect` and `try/catch` logic so our UI files stay clean!
 */

import { useState, useEffect } from 'react';
import { IPost } from './types';
import { fetchPosts } from '../data/posts.api';

export const usePosts = () => {
  // 1. STATE VARIABLES
  // `posts` holds the actual data (starts as an empty array)
  const [posts, setPosts] = useState<IPost[]>([]);
  // `loading` tells the UI to show a spinner while waiting for the network
  const [loading, setLoading] = useState(true);
  // `error` holds a string if the server crashes
  const [error, setError] = useState<string | null>(null);

  // 2. LIFECYCLE HOOK
  // useEffect runs automatically exactly ONCE when the component using this hook first appears on the screen
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Attempt to fetch from the data layer
        const result = await fetchPosts();
        // If successful, save the posts array into our state
        setPosts(result.data.posts);
      } catch (err: any) {
        // If the backend is off or crashed, save the error message
        setError(err.message || 'Failed to fetch posts. Is the backend running?');
      } finally {
        // Regardless of success or failure, turn off the loading spinner!
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // 3. EXPORT THE DATA
  // The UI file will call this hook and receive exactly these three variables to render HTML with.
  return { posts, loading, error };
};
