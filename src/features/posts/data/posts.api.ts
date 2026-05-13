/**
 * WHAT IS THIS FILE?
 * 
 * Data Fetcher (The Network Layer).
 * This is the ONLY file in the `posts` feature that's allowed to talk to the Internet.
 * 
 * WHY IS THIS GOOD?
 * Imagine if we change our backend URL, or how `/posts` works. 
 * Instead of hunting through 100 UI files to find where `axios.get` was used, 
 * we just come here and update it in one single spot.
 */

import { apiClient } from '../../../core/api/axios';
import { FetchPostsResponse } from '../domain/types';

// Connects to the backend and fetches the posts
export const fetchPosts = async (): Promise<FetchPostsResponse> => {
  // It automatically attaches to the baseURL defined in `apiClient` (e.g. http://localhost:5000/api/v1/posts)
  const response = await apiClient.get<FetchPostsResponse>('/posts');
  return response.data;
};
