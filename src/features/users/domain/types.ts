/**
 * WHAT IS THIS FILE?
 * 
 * Domain Types: The blueprints defining exact structures for the USERS feature.
 */

// Represents a single User object from the backend
export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Represents the exact JSON structure our backend sends when we hit `/api/v1/users`
export interface FetchUsersResponse {
  status: string;   // e.g. "success"
  results: number;  // e.g. 2
  data: {
    users: IUser[]; 
  };
}
