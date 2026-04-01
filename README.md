# Trello Clone

A project management web app inspired by Trello, built as a full-stack project to practice React and related technologies.

**Live demo:** https://trello-rose-zeta.vercel.app

## About

This is the frontend of a Trello clone that supports:

- Boards with columns and cards
- Drag & drop columns and cards (including moving cards between columns)
- User authentication (register, email verification, login/logout)
- Token refresh flow (access token + refresh token)
- Real-time notifications via Socket.io (board invitations)
- Card details: cover image upload, markdown description, comments
- Invite users to boards (accept/reject)
- Pagination for board listing
- Dark mode / Light mode toggle
- Responsive layout with Material UI

## Tech Stack

**Frontend:**
- React 18 + Vite
- Redux Toolkit + Redux Persist
- Material UI v5
- React Router v6
- Axios (with interceptors for auth)
- dnd-kit (drag & drop)
- Socket.io Client
- React Hook Form
- React Markdown Editor (@uiw/react-md-editor)

**Backend:** Node.js + Express + MongoDB (separate repo, deployed on Render)

## Getting Started

```bash
# Clone repo
git clone <repo-url>
cd trello

# Install dependencies
yarn install

# Run dev server (requires backend running on localhost:8017)
yarn dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
src/
  apis/            # API call functions (axios)
  assets/          # Static assets (images, etc.)
  components/      # Shared components (AppBar, Modal, Form, ...)
  customHooks/     # Custom React hooks
  customLibraries/ # Custom dnd-kit sensors
  pages/           # Page components (Auth, Boards, Settings, Users, 404)
  redux/           # Redux store, slices (activeBoard, activeCard, user, notifications)
  utilities/       # Constants, formatters, validators, axios config
```

## Environment

- Dev: API calls go to `http://localhost:8017`
- Production: API calls go to `https://trello-api-wd33.onrender.com`

Handled automatically via `import.meta.env.DEV` / `import.meta.env.PROD` (Vite built-in).

## Deployment

Frontend is deployed on **Vercel**. SPA routing is configured in `vercel.json`.

Backend is deployed on **Render**.