/**
 * WHAT IS THIS FILE?
 * 
 * A UI Component (Presentation Layer) for an individual USER.
 */

import { IUser } from '../domain/types';

interface UserCardProps {
  user: IUser;
}

export const UserCard = ({ user }: UserCardProps) => {
  // A helper function to make dates readable
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    // Beautiful Glassmorphic-styled card using Tailwind!
    <div className="flex items-center gap-4 p-5 bg-white shadow-lg shadow-indigo-900/5 rounded-2xl border border-indigo-50 hover:shadow-xl transition-all duration-300">
      
      {/* Avatar Circle */}
      <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
        {user.name.charAt(0).toUpperCase()}
      </div>
      
      {/* User Info */}
      <div>
        <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
        <p className="text-sm text-indigo-600 font-medium">{user.email}</p>
        <p className="text-xs text-gray-400 mt-1">Joined {formatDate(user.createdAt)}</p>
      </div>
    </div>
  );
};
