/**
 * WHAT IS THIS FILE?
 * 
 * A UI Component (Presentation Layer).
 * It just receives raw data (a single `post` object) and transforms it into visual HTML.
 * It does NOT fetch any data itself. It just renders what it is given.
 */

import { IPost } from '../domain/types';

// What data does this component need to receive from the parent page?
interface PostCardProps {
  post: IPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    // We use Tailwind to make it look like a nice floating card!
    <div className="p-6 bg-white shadow-xl shadow-blue-900/5 rounded-xl border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group cursor-pointer">
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
        {post.title}
      </h3>
      {/* Author Name */}
      <p className="mt-2 text-sm text-gray-500 font-medium tracking-wide uppercase">
        By {post.author}
      </p>
    </div>
  );
};
