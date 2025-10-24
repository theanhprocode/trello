# 📋 Trello Clone - Full Stack Project Management App

> A modern, full-featured Trello clone built with React, Redux Toolkit, and Material-UI. Features real-time collaboration, drag-and-drop functionality, and comprehensive project management tools.

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0.1-purple.svg)](https://redux-toolkit.js.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.13.0-blue.svg)](https://mui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

### ✨ Core Functionality
- **🏗️ Board Management** - Create, edit, and organize project boards
- **📝 List & Card System** - Flexible task organization with lists and cards
- **🖱️ Drag & Drop** - Smooth drag-and-drop interface powered by @dnd-kit
- **👥 User Authentication** - Secure login/register with email verification
- **🔄 Real-time Updates** - Live collaboration and state synchronization
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🛡️ Security & Performance
- **🔐 JWT Authentication** - Secure token-based authentication
- **🔄 Auto Token Refresh** - Seamless token renewal for uninterrupted sessions
- **⚡ Optimistic Updates** - Instant UI feedback with error handling
- **💾 State Persistence** - Redux Persist for maintaining app state

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Modern React with Hooks and Concurrent Features
- **Redux Toolkit** - Efficient state management with RTK Query
- **Material-UI v5** - Google's Material Design components
- **React Router v6** - Client-side routing with protected routes
- **@dnd-kit** - Modern drag-and-drop library
- **React Hook Form** - Performant form handling with validation
- **Axios** - HTTP client with interceptors and error handling

### Development Tools
- **Vite** - Lightning-fast build tool and dev server
- **ESLint** - Code linting and formatting
- **Cross-env** - Cross-platform environment variables

## 📦 Installation & Setup

### Prerequisites
- **Node.js** >= 18.x
- **Yarn** or **npm**
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/theanhprocode/trello.git
cd trello
```

### 2. Install Dependencies
```bash
# Using Yarn (recommended)
yarn install

# Or using npm
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```bash
VITE_API_ROOT=http://localhost:8017
VITE_BUILD_MODE=dev
```

### 4. Run Development Server
```bash
# Using Yarn
yarn dev

# Or using npm
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppBar/         # Navigation and header
│   ├── Form/           # Form components and validation
│   ├── Loading/        # Loading states and spinners
│   └── ModeSelect/     # Theme switching
├── pages/              # Page components and routing
│   ├── Auth/           # Authentication pages
│   ├── Boards/         # Board management pages
│   └── 404/            # Error pages
├── redux/              # State management
│   ├── store.js        # Redux store configuration
│   ├── activeBoard/    # Board state slice
│   └── user/           # User authentication slice
├── apis/               # API layer and HTTP requests
├── assets/             # Static assets and images
├── utilities/          # Helper functions and utilities
└── customHooks/        # Custom React hooks
```

## 🚀 Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn build           # Build for production
yarn preview         # Preview production build
yarn lint           # Run ESLint

# Using npm
npm run dev
npm run build
npm run preview
npm run lint
```

## 🎯 Key Features Breakdown

### Authentication System
- User registration with email verification
- Secure login with JWT tokens
- Auto token refresh mechanism
- Protected routes and auth guards

### Board Management
- Create and customize project boards
- Real-time collaboration features
- Board sharing and permissions

### Drag & Drop Interface
- Smooth card and list reordering
- Cross-list card movement
- Visual feedback and animations
- Touch-friendly mobile support

### State Management
- Redux Toolkit for predictable state updates
- Redux Persist for offline state preservation
- Optimistic updates for better UX

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**AnhThe** - [@theanhprocode](https://github.com/theanhprocode)

## 🙏 Acknowledgments

- [TrungQuanDev](https://youtube.com/@trungquandev) - Original tutorial inspiration
- [Material-UI](https://mui.com/) - Amazing React component library
- [Redux Toolkit](https://redux-toolkit.js.org/) - Efficient Redux development
- [@dnd-kit](https://dndkit.com/) - Modern drag-and-drop solution

---

⭐ **If you found this project helpful, please give it a star!** ⭐