/**
 * WHAT IS THIS FILE?
 * 
 * Custom React Hook (Domain Layer) for USERS.
 * Manages the data-fetching lifecycle exactly like we did for posts.
 */

import { useState, useEffect } from 'react';
import { IUser } from './types';
import { fetchUsers } from '../data/users.api';

export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await fetchUsers();
        setUsers(result.data.users);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return { users, loading, error };
};
