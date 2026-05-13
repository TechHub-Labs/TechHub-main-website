# TechHub Frontend Template (React + Vite + TypeScript)

This documentation is extremely detailed to ensure that anyone, regardless of their experience level, can understand exactly how our app is structured, and how to start building immediately.

---

## 🏗️ 1. Understanding the File Structure

Our codebase is inside the `src/` folder. It is split into two main concepts: **Core/Shared** (stuff used everywhere) and **Features** (specific app pages/modules).

### `src/` Root Files

- **`main.tsx`**: The ignition switch. It grabs the HTML element `<div id="root">` and injects our entire React application into it. You rarely edit this.
- **`App.tsx`**: The main router. It dictates which Page Component loads based on the URL (e.g. going to `/users` loads `UsersPage`). Look here to add new routes!
- **`index.css`**: Our primary stylesheet. Contains standard Tailwind resets and global body colors.
- **`vite-env.d.ts`**: Tells TypeScript how to handle special Vite features, like importing `.svg` files or using environment variables.

### `src/core/` (The Engine)

This holds fundamental, app-wide setups.

- **`api/axios.ts`**: The "Internet Messenger". Instead of configuring `fetch()` on every page, we setup an Axios instance. It knows our backend URL (`http://localhost:5000`) and automatically attaches special headers (like Auth Tokens) before talking to the backend.

### `src/shared/` (The Lego Blocks)

- **`components/`**: Reusable UI that doesn't care about business logic. E.g., `Button.tsx`. You can drop these chunks into any page!
- **`context/`**: Global State files. E.g., `ThemeContext.tsx` if you wanted Light/Dark mode.

### `src/features/` (The Meat of the App)

Instead of having one giant `pages/` folder, we use a **Feature-First + Data/Domain/Presentation** architecture.
Each feature (like `posts` or `users`) has its own sandbox. Inside a feature:

1. **`data/`**: The Network layer. Code here (like `users.api.ts`) is only allowed to grab raw JSON from `src/core/api/axios.ts`.
2. **`domain/`**: The Brain layer. Holds `types.ts` (what the data looks like) and `useUsers.ts` (React Hooks that orchestrate loading, data, and errors).
3. **`presentation/`**: The Skin layer. Visual components and Pages (like `UsersPage.tsx`). It just uses the Domain hook and renders HTML blocks. **Never write `axios.get` inside presentation files!**

---

## 🎨 2. How Styling Works

We use **Tailwind CSS**. It is a "Utility-First" framework, which means you style things directly inside the JSX `className` attribute.

### How to style a component?

Instead of creating a `Button.css` file and writing:

```css
.btn { background-color: blue; padding: 10px; border-radius: 5px; }
```

You simply add Tailwind classes to the element in React:

```jsx
<button className="bg-blue-600 p-2 rounded-md hover:bg-blue-700">Click</button>
```

### Where to edit global styles?

1. **`tailwind.config.js` (Root directory)**: This is the brain behind Tailwind. If you want to add a custom color like `techhub-orange: #ff9900`, you put it in the `theme.extend.colors` object here.
2. **`src/index.css`**: This is where Tailwind injects its raw CSS. If you really want to write regular CSS, or override base HTML tags (like `h1`, `body`), put them under `@layer base {}`.

---

## 🚀 3. Getting Started

### Installation

Open your terminal inside this `frontend-react-vite-ts` folder and run:

```bash
npm install
```

### Configuration

We need to know where the backend is. Copy the environment variables:
*(Mac/Linux)*: `cp .env.example .env`
*(Windows)*: `copy .env.example .env`

Edit the `.env` to point to your backend:
`VITE_API_URL=http://localhost:5000/api/v1`

### Start the Server

```bash
npm run dev
```

---

## 🛠️ 4. Adding a New Feature (Tutorial)

Let's add a `Comments` feature!

1. **Create the Folders**: `src/features/comments/data`, `domain`, and `presentation`.
2. **Types (`domain/types.ts`)**: Define `interface IComment { id: string text: string }`.
3. **API (`data/comments.api.ts`)**: Import `apiClient` from `core/api/axios.ts` and write a function `fetchComments()` that runs `apiClient.get('/comments')`.
4. **Logic (`domain/useComments.ts`)**: Create a React Hook that runs `fetchComments` inside a `useEffect`, returning `comments`, `loading`, and `error`.
5. **UI (`presentation/CommentsPage.tsx`)**: Import `useComments()`. If `loading` is true, show a spinner. If not, map over the comments and show a div with Tailwind classes!
6. **Activate it (`App.tsx`)**: Import `CommentsPage` and add `<Route path="/comments" element={<CommentsPage />} />` inside the `<Routes>` block.

You are now a master of Clean Architecture!
