/**
 * WHAT IS THIS FILE?
 * 
 * Data Fetcher (The Network Layer) for USERS.
 * Uses the exact same pattern as the `posts` feature!
 */

import { apiClient } from '../../../core/api/axios';
import { FetchUsersResponse } from '../domain/types';

export const fetchUsers = async (): Promise<FetchUsersResponse> => {
  // Target: http://localhost:5000/api/v1/users
  const response = await apiClient.get<FetchUsersResponse>('/users');
  return response.data;
};
