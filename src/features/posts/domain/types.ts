/**
 * WHAT IS THIS FILE?
 * 
 * Domain Types: The blueprints defining exact structures.
 * 
 * Whenever we fetch data from the internet, TypeScript has no idea what shape that data is.
 * Is it a string? Does the post have an `author` or a `writer` field?
 * If we define the Interface here, TypeScript will loudly warn us if we type `post.auther` by mistake!
 */

// Represents a single Post object
export interface IPost {
  id: number;
  title: string;
  author: string;
}

// Represents the exact JSON structure our backend sends when we hit `/api/v1/posts`
export interface FetchPostsResponse {
  status: string;   // e.g. "success"
  results: number;  // e.g. 2
  data: {
    posts: IPost[]; // An array of the IPost objects defined above!
  };
}
