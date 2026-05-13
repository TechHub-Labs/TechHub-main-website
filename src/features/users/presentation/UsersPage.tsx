/**
 * WHAT IS THIS FILE?
 * 
 * The Members Page (Presentation Layer).
 * This page loads when the user clicks 'Members' on the navbar (`/users`).
 */

import { useUsers } from '../domain/useUsers';
import { UserCard } from './UserCard';
import { Button } from '../../../shared/components/Button';

export const UsersPage = () => {
  const { users, loading, error } = useUsers();

  return (
    <div className="max-w-4xl mx-auto p-8">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">
            Community Members
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Connect with other developers.</p>
        </div>
        <Button variant="secondary">Invite Member</Button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-20 text-center flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-xl text-indigo-500 font-semibold animate-pulse">Loading amazing people...</span>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg shadow-sm">
          🚨 {error}
        </div>
      )}

      {/* SUCCESS */}
      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}

          {users.length === 0 && (
             <div className="col-span-full py-16 text-center text-gray-400 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl">
                 No users found. Are you sure the backend server is running?
             </div>
          )}
        </div>
      )}
    </div>
  );
};
