# 🎨 Frontend Base Template

> A modern React + TypeScript frontend template with authentication, admin panel, dark mode, and responsive design. Built with Vite, Tailwind CSS, and Framer Motion.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.x-purple?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4.x-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
</p>

---

## ✨ Features

- 🔐 **Authentication System** — Login page, JWT management, protected routes
- 👥 **User Management UI** — List, create, and edit users with role assignment
- 🎭 **Role Management** — Admin panel for managing system roles
- 🌙 **Dark/Light Theme** — Toggle with persistent preference
- 📱 **Responsive Sidebar** — Collapsible navigation with mobile support
- 🎬 **Smooth Animations** — Page transitions and hover effects with Framer Motion
- 🔔 **Toast Notifications** — User feedback with react-hot-toast
- 📝 **Form Handling** — react-hook-form with Zod validation
- 🧩 **Reusable Components** — Modal, dialogs, buttons, inputs, and more
- 🎨 **shadcn/ui Primitives** — Accessible Radix UI components
- 📡 **API Service Layer** — Centralized requests with timeout and auth handling
- 🐳 **Docker Ready** — Dockerfile, dev config, and nginx included

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **TypeScript 5** | Type safety |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router 7** | Client-side routing |
| **Framer Motion** | Animations |
| **react-hook-form** | Form management |
| **Zod** | Schema validation |
| **Lucide React** | Icon library |
| **Radix UI** | Accessible primitives |
| **Socket.IO Client** | Real-time communication |

## 📁 Project Structure

```
app/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # shadcn/ui primitives
│   │   ├── Layout.tsx   # Main layout wrapper
│   │   ├── Sidebar.tsx  # Navigation sidebar
│   │   └── ...
│   ├── contexts/        # React contexts (Auth, Theme)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route page components
│   ├── services/        # API service layer
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component & routes
│   └── main.tsx         # Entry point
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your API URL

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📡 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3001/api` |

## 📄 Pages & Routes

| Route | Page | Access | Description |
|---|---|---|---|
| `/login` | LoginPage | Public | User authentication |
| `/home` | HomePage | Private | Dashboard landing page |
| `/users` | UsersPage | Admin | User management |
| `/roles` | RolesPage | Admin | Role management |
| `/register-user` | UserForm | Admin | Create new user |
| `/edit-user/:id` | UserForm | Admin | Edit existing user |

## 🧩 Available Components

### Layout & Navigation

| Component | Description |
|---|---|
| `Layout` | Main layout with header, sidebar, and content area |
| `Sidebar` | Collapsible navigation with dropdowns and mobile support |
| `Container` | Content wrapper with consistent spacing |
| `ResponsiveGrid` | Responsive grid layout helper |

### Forms & Inputs

| Component | Description |
|---|---|
| `LoginForm` | Authentication form with validation |
| `UserForm` | User create/edit form with role selection |
| `Modal` | Accessible modal dialog |
| `ConfirmDialog` | Confirmation dialog for destructive actions |

### UI Elements

| Component | Description |
|---|---|
| `AppButton` | Styled button with variants |
| `LoadingSpinner` | Animated loading indicator |

### shadcn/ui Primitives

Button, Input, Select, Dialog, Checkbox, Label, Popover, Tooltip, Badge, Card, Chart, Calendar, Textarea

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 🔐 Authentication Flow

1. User enters credentials on `/login`
2. JWT token is stored in `localStorage`
3. `AuthProvider` validates token on app load
4. `PrivateRoute` redirects to login if not authenticated
5. API requests include token in `Authorization` header
6. Expired/invalid tokens trigger automatic logout

## 🌙 Theme

Theme preference is stored in context and persists via CSS classes. Toggle with the moon/sun button in the header.

## 🐳 Docker

```bash
# Development
docker compose up -d

# Production build
docker build -t frontend-app .
```

## 📄 License

MIT
