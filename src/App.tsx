/**
 * WHAT IS THIS FILE?
 * 
 * `App.tsx` is the BIG BOSS of what pages show up based on the URL. 
 * This is where we define our "Routes".
 * 
 * - If the user types `http://localhost:5173/`, we load `<PostsPage />`
 * - If they type `http://localhost:5173/users`, we load `<UsersPage />`
 * 
 * Everything inside the <Router> gets the magic ability to navigate between pages
 * instantly without refreshing the browser!
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import our presentation pages (UI layers) from our features
import { PostsPage } from './features/posts/presentation/PostsPage';
// Note: We'll create UsersPage shortly!
import { UsersPage } from './features/users/presentation/UsersPage';

function App() {
  return (
    <Router>
      {/* 
        This is our master Layout. 
        It applies a minimum height, a background color, and a blue selection color.
      */}
      <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900">
        
        {/* GLOBAL NAVIGATION HEADER */}
        {/* Because this header is OUTSIDE the <Routes>, it will ALWAYS appear on every single page! */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 shadow-sm flex items-center justify-between">
            {/* The Logo */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent w-max">
                TechHub
            </h2>
            
            {/* The Links to swap pages */}
            <nav className="flex gap-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">Posts</Link>
              <Link to="/users" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">Members</Link>
            </nav>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="py-8">
          {/* <Routes> acts like a switch statement. 
              It looks at the URL, and only shows the Route that matches. */}
          <Routes>
            {/* The root URL loads the Posts page */}
            <Route path="/" element={<PostsPage />} />
            {/* The /users URL loads the Users page */}
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
