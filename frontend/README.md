# Team Productivity Platform – Frontend

## Status

Frontend Phase 1: Foundation Setup

---

# Technology Stack

## Core Framework

* Next.js 15 (App Router)
* React 19
* TypeScript

## Styling

* Tailwind CSS
* Shadcn UI
* Radix UI

## State Management

* Zustand

## Data Fetching

* Axios
* TanStack Query

## Forms & Validation

* React Hook Form
* Zod
* @hookform/resolvers

## Notifications

* Sonner

## Icons

* Lucide React

## Charts

* Recharts

## Drag & Drop

* DnD Kit

---

# Project Structure

```text
frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── logo/
│
├── src/
│
│   ├── app/
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── notes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── page.tsx
│   │   │   └── kanban/
│   │   │       └── page.tsx
│   │   │
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   │
│   │   ├── tags/
│   │   │   └── page.tsx
│   │   │
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   │
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   │
│   │   ├── activity-logs/
│   │   │   └── page.tsx
│   │   │
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   │
│   │   ├── ui/
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── table.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── form.tsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── app-header.tsx
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── app-footer.tsx
│   │   │   ├── dashboard-layout.tsx
│   │   │   └── auth-layout.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── task-form.tsx
│   │   │   ├── note-form.tsx
│   │   │   ├── category-form.tsx
│   │   │   └── tag-form.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── search-input.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── protected-route.tsx
│   │   │   └── role-guard.tsx
│   │   │
│   │   └── charts/
│   │       ├── tasks-status-chart.tsx
│   │       ├── priority-chart.tsx
│   │       ├── productivity-chart.tsx
│   │       ├── activity-chart.tsx
│   │       └── dashboard-overview-chart.tsx
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   └── components/
│   │   │
│   │   ├── notes/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   └── components/
│   │   │
│   │   ├── tasks/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   └── components/
│   │   │
│   │   ├── categories/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   └── components/
│   │   │
│   │   ├── tags/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   └── components/
│   │   │
│   │   ├── notifications/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   └── components/
│   │   │
│   │   ├── analytics/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   └── components/
│   │   │
│   │   └── activity-logs/
│   │       ├── api/
│   │       ├── hooks/
│   │       ├── types/
│   │       ├── schemas/
│   │       └── components/
│   │
│   ├── services/
│   │   ├── fastapi/
│   │   │   ├── client.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── notes.service.ts
│   │   │   └── users.service.ts
│   │   │
│   │   └── nestjs/
│   │       ├── client.ts
│   │       ├── tasks.service.ts
│   │       ├── categories.service.ts
│   │       ├── tags.service.ts
│   │       ├── notifications.service.ts
│   │       ├── analytics.service.ts
│   │       └── activity-logs.service.ts
│   │
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   ├── auth-provider.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── store/
│   │   ├── auth-store.ts
│   │   ├── task-store.ts
│   │   └── notification-store.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-debounce.ts
│   │   ├── use-pagination.ts
│   │   └── use-role.ts
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── task.schema.ts
│   │   ├── note.schema.ts
│   │   └── category.schema.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── task.ts
│   │   ├── note.ts
│   │   ├── category.ts
│   │   ├── tag.ts
│   │   ├── notification.ts
│   │   └── analytics.ts
│   │
│   ├── constants/
│   │   ├── api-routes.ts
│   │   ├── query-keys.ts
│   │   ├── roles.ts
│   │   └── app.ts
│   │
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── auth.ts
│   │   ├── permissions.ts
│   │   ├── date.ts
│   │   └── utils.ts
│   │
│   ├── middleware/
│   │   └── auth-middleware.ts
│   │
│   └── utils/
│       ├── format-date.ts
│       ├── pagination.ts
│       └── storage.ts
│
├── .env.local
├── .prettierrc
├── components.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── package.json
├── package-lock.json
└── README.md
```

```text
src/
└── features/
    │
    ├── auth/
    │   │
    │   ├── api/
    │   │   ├── login.ts
    │   │   ├── register.ts
    │   │   ├── logout.ts
    │   │   ├── refresh-token.ts
    │   │   └── current-user.ts
    │   │
    │   ├── hooks/
    │   │   ├── use-login.ts
    │   │   ├── use-register.ts
    │   │   ├── use-logout.ts
    │   │   ├── use-current-user.ts
    │   │   └── use-auth.ts
    │   │
    │   ├── types/
    │   │   ├── auth.types.ts
    │   │   ├── login.types.ts
    │   │   └── register.types.ts
    │   │
    │   ├── schemas/
    │   │   ├── login.schema.ts
    │   │   └── register.schema.ts
    │   │
    │   └── components/
    │       ├── login-form.tsx
    │       ├── register-form.tsx
    │       ├── auth-guard.tsx
    │       └── role-guard.tsx
    │
    ├── notes/
    │   │
    │   ├── api/
    │   │   ├── create-note.ts
    │   │   ├── get-notes.ts
    │   │   ├── get-note.ts
    │   │   ├── update-note.ts
    │   │   ├── delete-note.ts
    │   │   └── convert-note-to-task.ts
    │   │
    │   ├── hooks/
    │   │   ├── use-notes.ts
    │   │   ├── use-note.ts
    │   │   ├── use-create-note.ts
    │   │   ├── use-update-note.ts
    │   │   └── use-delete-note.ts
    │   │
    │   ├── types/
    │   │   └── note.types.ts
    │   │
    │   ├── schemas/
    │   │   └── note.schema.ts
    │   │
    │   └── components/
    │       ├── note-card.tsx
    │       ├── note-form.tsx
    │       ├── notes-table.tsx
    │       ├── note-filters.tsx
    │       └── convert-task-button.tsx
    │
    ├── tasks/
    │   │
    │   ├── api/
    │   │   ├── create-task.ts
    │   │   ├── get-tasks.ts
    │   │   ├── get-task.ts
    │   │   ├── update-task.ts
    │   │   ├── delete-task.ts
    │   │   └── update-task-status.ts
    │   │
    │   ├── hooks/
    │   │   ├── use-tasks.ts
    │   │   ├── use-task.ts
    │   │   ├── use-create-task.ts
    │   │   ├── use-update-task.ts
    │   │   ├── use-delete-task.ts
    │   │   └── use-task-kanban.ts
    │   │
    │   ├── types/
    │   │   └── task.types.ts
    │   │
    │   ├── schemas/
    │   │   └── task.schema.ts
    │   │
    │   └── components/
    │       ├── task-card.tsx
    │       ├── task-form.tsx
    │       ├── tasks-table.tsx
    │       ├── task-filters.tsx
    │       ├── kanban-board.tsx
    │       ├── kanban-column.tsx
    │       └── task-status-badge.tsx
    │
    ├── categories/
    │   │
    │   ├── api/
    │   │   ├── create-category.ts
    │   │   ├── get-categories.ts
    │   │   ├── get-category.ts
    │   │   ├── update-category.ts
    │   │   └── delete-category.ts
    │   │
    │   ├── hooks/
    │   │   ├── use-categories.ts
    │   │   ├── use-category.ts
    │   │   ├── use-create-category.ts
    │   │   └── use-update-category.ts
    │   │
    │   ├── types/
    │   │   └── category.types.ts
    │   │
    │   ├── schemas/
    │   │   └── category.schema.ts
    │   │
    │   └── components/
    │       ├── category-form.tsx
    │       ├── category-card.tsx
    │       └── category-table.tsx
    │
    ├── tags/
    │   │
    │   ├── api/
    │   │   ├── create-tag.ts
    │   │   ├── get-tags.ts
    │   │   ├── get-tag.ts
    │   │   ├── update-tag.ts
    │   │   └── delete-tag.ts
    │   │
    │   ├── hooks/
    │   │   ├── use-tags.ts
    │   │   ├── use-tag.ts
    │   │   ├── use-create-tag.ts
    │   │   └── use-update-tag.ts
    │   │
    │   ├── types/
    │   │   └── tag.types.ts
    │   │
    │   ├── schemas/
    │   │   └── tag.schema.ts
    │   │
    │   └── components/
    │       ├── tag-form.tsx
    │       ├── tag-badge.tsx
    │       └── tag-table.tsx
    │
    ├── notifications/
    │   │
    │   ├── api/
    │   │   ├── get-notifications.ts
    │   │   ├── get-notification.ts
    │   │   ├── mark-read.ts
    │   │   └── mark-all-read.ts
    │   │
    │   ├── hooks/
    │   │   ├── use-notifications.ts
    │   │   ├── use-notification.ts
    │   │   └── use-mark-read.ts
    │   │
    │   ├── types/
    │   │   └── notification.types.ts
    │   │
    │   ├── schemas/
    │   │   └── notification.schema.ts
    │   │
    │   └── components/
    │       ├── notification-card.tsx
    │       ├── notification-list.tsx
    │       └── notification-badge.tsx
    │
    ├── analytics/
    │   │
    │   ├── api/
    │   │   ├── get-overview.ts
    │   │   ├── get-productivity.ts
    │   │   ├── get-task-status.ts
    │   │   └── get-task-priority.ts
    │   │
    │   ├── hooks/
    │   │   ├── use-overview.ts
    │   │   ├── use-productivity.ts
    │   │   ├── use-task-status.ts
    │   │   └── use-task-priority.ts
    │   │
    │   ├── types/
    │   │   └── analytics.types.ts
    │   │
    │   ├── schemas/
    │   │   └── analytics.schema.ts
    │   │
    │   └── components/
    │       ├── overview-cards.tsx
    │       ├── productivity-chart.tsx
    │       ├── task-status-chart.tsx
    │       └── priority-chart.tsx
    │
    └── activity-logs/
        │
        ├── api/
        │   ├── get-activity-logs.ts
        │   └── get-activity-log.ts
        │
        ├── hooks/
        │   ├── use-activity-logs.ts
        │   └── use-activity-log.ts
        │
        ├── types/
        │   └── activity-log.types.ts
        │
        ├── schemas/
        │   └── activity-log.schema.ts
        │
        └── components/
            ├── activity-log-card.tsx
            ├── activity-log-table.tsx
            └── activity-log-filters.tsx
```

---

# Installed Dependencies

## Production Dependencies

```bash
axios
zustand
@tanstack/react-query
react-hook-form
zod
@hookform/resolvers
sonner
lucide-react
clsx
tailwind-merge
class-variance-authority
date-fns
recharts
@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities
@next/third-parties
```

## UI Components

Installed through Shadcn UI:

```text
badge
button
card
dialog
dropdown-menu
input
select
sheet
skeleton
table
textarea
```

---

# Environment Variables

Create:

```text
.env.local
```

```env
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_NESTJS_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Team Productivity Platform
NEXT_PUBLIC_GA_ID=
```

---

# API Architecture

The frontend communicates with two backend services.

## FastAPI Backend

Responsible for:

* Authentication
* Users
* Notes
* Admin Notes

Base URL:

```text
http://localhost:8000
```

Client:

```text
src/services/fastapi/client.ts
```

---

## NestJS Backend

Responsible for:

* Tasks
* Categories
* Tags
* Notifications
* Analytics
* Activity Logs

Base URL:

```text
http://localhost:3001
```

Client:

```text
src/services/nestjs/client.ts
```

---

# Authentication Strategy

Frontend will use a unified authentication flow.

Process:

1. User logs in through FastAPI.
2. FastAPI returns JWT access token.
3. Token is stored in Zustand state.
4. Axios sends token to FastAPI APIs.
5. Axios sends same token to NestJS APIs.
6. NestJS validates FastAPI-issued JWT.
7. User accesses all services without logging in again.

---

# Current Completion Status

## Frontend Phase 1

Completed:

* Next.js 15 Setup
* TypeScript Configuration
* Tailwind CSS
* Shadcn UI
* Axios Configuration
* TanStack Query Setup
* Zustand Store
* Sonner Setup
* Feature-Based Architecture
* API Layer Foundation
* Environment Configuration
* Folder Structure Design

---

# Frontend Phase 1 – Project Foundation Setup

## Objective

Establish the frontend foundation for the Team Productivity Platform using Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, TanStack Query, Zustand, and Axios.

This phase focuses on project setup, architecture, environment configuration, state management, API clients, and shared providers.

---

## Technologies Installed

### Core Framework

* Next.js 15 (App Router)
* React 19
* TypeScript

### Styling

* Tailwind CSS
* Shadcn UI
* Radix UI

### State Management

* Zustand

### Data Fetching

* Axios
* TanStack Query

### Forms & Validation

* React Hook Form
* Zod
* @hookform/resolvers

### Notifications

* Sonner

### Icons

* Lucide React

### Utilities

* clsx
* tailwind-merge
* class-variance-authority
* date-fns

### Charts

* Recharts

### Drag and Drop

* @dnd-kit/core
* @dnd-kit/sortable
* @dnd-kit/utilities

### Analytics

* @next/third-parties

---

## Environment Configuration

Created:

```text
.env.local
```

Contents:

```env
NEXT_PUBLIC_APP_NAME=Team Productivity Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_NESTJS_URL=http://localhost:3001

NEXT_PUBLIC_AUTH_STORAGE_KEY=tpp_access_token

NEXT_PUBLIC_GA_ID=

NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_DRAG_AND_DROP=true

NEXT_PUBLIC_DEFAULT_PAGE_SIZE=10
NEXT_PUBLIC_MAX_PAGE_SIZE=100
```

---

## API Client Setup

### FastAPI Client

File:

```text
src/services/fastapi/client.ts
```

Purpose:

* Authentication APIs
* User APIs
* Notes APIs

---

### NestJS Client

File:

```text
src/services/nestjs/client.ts
```

Purpose:

* Tasks APIs
* Categories APIs
* Tags APIs
* Notifications APIs
* Analytics APIs
* Activity Logs APIs

---

## State Management

### Zustand Store

File:

```text
src/store/auth-store.ts
```

Responsibilities:

* Store JWT Access Token
* Logout Handling
* Authentication State

---

## Data Fetching

### TanStack Query Provider

File:

```text
src/providers/query-provider.tsx
```

Responsibilities:

* Query Client Configuration
* API Caching
* Request Management
* Data Synchronization

---

## Shared Constants

Files:

```text
src/constants/api-routes.ts
src/constants/query-keys.ts
src/constants/roles.ts
```

Responsibilities:

* API Route Constants
* React Query Keys
* Role Definitions

---

## Shared Utilities

File:

```text
src/lib/utils.ts
```

Responsibilities:

* Tailwind Class Merging
* Common Utility Functions

---

## Application Layout

Updated:

```text
src/app/layout.tsx
```

Features:

* Global Metadata
* Query Provider Integration
* Sonner Notifications
* Application Font Configuration

---

## Folder Architecture

```text
src/
├── app/
├── components/
├── features/
├── services/
├── providers/
├── store/
├── hooks/
├── schemas/
├── types/
├── constants/
├── lib/
├── middleware/
└── utils/
```

---

## Shadcn UI Components Installed

```text
badge
button
card
dialog
dropdown-menu
input
select
sheet
skeleton
table
textarea
```

---

## Application Verification

Verified:

* Application compiles successfully
* Development server runs successfully
* Root layout configured correctly
* Providers integrated correctly
* Folder architecture established
* Environment variables configured

---

# Frontend Phase 2 – Authentication Module

## Overview

Phase 2 implements the complete authentication flow for the Team Productivity Platform frontend using the FastAPI backend.

The frontend now supports:

* User Registration
* User Login
* JWT Authentication
* Current User Fetching
* Authentication State Management
* Protected Routes
* Role-Based Route Protection
* Logout Functionality
* React Query Integration
* Zustand Authentication Persistence

---

## Authentication Flow

```text
Register
   ↓
Login
   ↓
FastAPI Returns JWT
   ↓
JWT Stored in Zustand
   ↓
AuthInitializer Executes
   ↓
GET /auth/me
   ↓
User Stored in Zustand
   ↓
Protected Routes Enabled
   ↓
Same JWT Used For NestJS APIs
```

---

## FastAPI Authentication Endpoints

```http
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

---

## Folder Structure

```text
src/
├── features/
│   └── auth/
│       ├── api/
│       │   ├── login.ts
│       │   ├── register.ts
│       │   ├── logout.ts
│       │   ├── refresh-token.ts
│       │   └── current-user.ts
│       │
│       ├── hooks/
│       │   ├── use-login.ts
│       │   ├── use-register.ts
│       │   ├── use-current-user.ts
│       │   └── use-logout.ts
│       │
│       ├── schemas/
│       │   ├── login.schema.ts
│       │   └── register.schema.ts
│       │
│       ├── types/
│       │   ├── auth.types.ts
│       │   ├── login.types.ts
│       │   ├── register.types.ts
│       │   └── user.types.ts
│       │
│       └── components/
│           ├── auth-guard.tsx
│           ├── auth-initializer.tsx
│           ├── login-form.tsx
│           ├── register-form.tsx
│           └── role-guard.tsx
│
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   └── (protected)/
│       └── layout.tsx
```

---

## Implemented Features

### Authentication Types

Created:

```text
auth.types.ts
login.types.ts
register.types.ts
user.types.ts
```

Responsibilities:

* Request Types
* Response Types
* User Model
* Authentication State Types

---

### Validation Schemas

Created using Zod:

```text
login.schema.ts
register.schema.ts
```

Features:

* Email Validation
* Password Validation
* Confirm Password Validation
* Type Inference

---

### API Layer

Created:

```text
login.ts
register.ts
logout.ts
refresh-token.ts
current-user.ts
```

Responsibilities:

* FastAPI Communication
* Authentication Requests
* Current User Fetching
* Token Refresh Requests

---

### Authentication Hooks

Created:

```text
use-login.ts
use-register.ts
use-current-user.ts
use-logout.ts
```

Responsibilities:

* React Query Mutations
* React Query Queries
* Sonner Notifications
* Zustand Integration
* Authentication Lifecycle Management

---

### Authentication Components

Created:

```text
login-form.tsx
register-form.tsx
auth-guard.tsx
role-guard.tsx
auth-initializer.tsx
```

Responsibilities:

* Login UI
* Registration UI
* Route Protection
* Role Validation
* User Hydration

---

### Authentication Pages

Created:

```text
/ login
/ register
```

Features:

* Shadcn Card Layout
* Form Validation
* API Integration
* Navigation Links

---

### Zustand Integration

Enhanced Authentication Store:

```text
accessToken
user
isAuthenticated
```

Actions:

```text
setAccessToken()
setUser()
logout()
```

Persistence:

```text
localStorage
```

Storage Key:

```text
NEXT_PUBLIC_AUTH_STORAGE_KEY
```

---

### Route Protection

Implemented:

```text
AuthGuard
RoleGuard
Protected Layout
```

Capabilities:

* Redirect Unauthenticated Users
* Protect Private Pages
* Restrict Role-Based Pages

---

### User Hydration

Implemented:

```text
AuthInitializer
```

Responsibilities:

* Execute on App Load
* Fetch Current User
* Store User in Zustand
* Restore Authentication State

---

## Authentication State

```ts
{
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
```

---

## Current Routes

```text
/
/login
/register
```

Protected Routes (Upcoming):

```text
/dashboard
/notes
/tasks
/analytics
/settings
```

---

## Testing Checklist

### Registration

* Create New User
* Validate Form Inputs
* Display Success Message

### Login

* Authenticate User
* Store JWT
* Redirect User

### Current User

* Fetch /auth/me
* Store User Information

### Logout

* Clear Zustand Store
* Clear React Query Cache
* Remove JWT

### Protected Routes

* Block Unauthenticated Access
* Redirect to Login

### Role Protection

* Allow Authorized Roles
* Deny Unauthorized Roles

---


# Phase 3 – Dashboard Foundation

## Overview

Phase 3 focused on building the authenticated application shell that serves as the foundation for all protected features within the Team Productivity Platform.

The dashboard architecture was implemented with protected routing, reusable layouts, sidebar navigation, application header, user section, and dashboard widgets.

This phase established the UI structure that will be reused throughout the remaining frontend development phases.

---

## Features Implemented

### Protected Dashboard Layout

Created a shared dashboard layout used across all authenticated pages.

Responsibilities:

* Application shell rendering
* Sidebar navigation
* Header rendering
* Content area management
* Responsive page structure

---

### Protected Routing

Integrated the existing `AuthGuard` with the protected layout.

Unauthenticated users are automatically redirected to:

```text
/login
```

Authenticated users can access all protected routes.

---

### Dashboard Page

Created:

```text
src/app/(protected)/dashboard/page.tsx
```

Features:

* Dashboard heading
* Responsive widget grid
* Summary cards
* Placeholder statistics

Widgets:

```text
Total Notes
Total Tasks
Notifications
Analytics
```

---

### Sidebar Navigation

Created:

```text
src/components/layouts/app-sidebar.tsx
```

Navigation Links:

```text
Dashboard
Notes
Tasks
Analytics
Notifications
Settings
```

Features:

* Active route highlighting
* Responsive structure
* Lucide React icons
* Centralized navigation configuration

---

### Header

Created:

```text
src/components/layouts/app-header.tsx
```

Features:

* Application title
* User information section
* Layout consistency across protected pages

---

### User Navigation

Created:

```text
src/components/layouts/user-nav.tsx
```

Features:

* Display authenticated user email
* Logout functionality
* Zustand integration
* React Query cache clearing through logout workflow

---

### Dashboard Layout Component

Created:

```text
src/components/layouts/dashboard-layout.tsx
```

Responsibilities:

* Sidebar placement
* Header placement
* Content rendering
* Full-height application shell

---

### Navigation Configuration

Created:

```text
src/constants/navigation.ts
```

Benefits:

* Centralized navigation management
* Easy route additions
* Reusable sidebar configuration

---

### Authentication Improvements

Updated login flow.

Features:

* JWT storage in Zustand
* User data storage in Zustand
* Automatic redirect after login

Flow:

```text
Login
→ Store Access Token
→ Store User
→ Redirect to /dashboard
```

---

### Layout Architecture

Implemented route groups:

```text
src/app/
├── (auth)
│   ├── login
│   └── register
│
├── (protected)
│   ├── dashboard
│   ├── notes
│   ├── tasks
│   ├── analytics
│   ├── notifications
│   └── settings
```

Benefits:

* Separation of authenticated and public routes
* Shared protected layout
* Cleaner route organization

---

## Files Created

### Layout Components

```text
src/components/layouts/
├── app-sidebar.tsx
├── app-header.tsx
├── user-nav.tsx
└── dashboard-layout.tsx
```

### Dashboard

```text
src/app/(protected)/dashboard/page.tsx
```

### Navigation

```text
src/constants/navigation.ts
```

---

## Files Updated

### Authentication

```text
src/features/auth/hooks/use-login.ts
```

Added:

* User persistence
* Dashboard redirect

---

### Protected Layout

```text
src/app/(protected)/layout.tsx
```

Integrated:

* AuthGuard
* DashboardLayout

---

### Root Layout

```text
src/app/layout.tsx
```

Updated:

* Font handling
* Global application structure
* Sonner configuration

---

### Global Styling

```text
src/app/globals.css
```

Updated:

* Geist font integration
* Theme variable configuration

---

# Phase 3 – Dashboard Foundation

## Overview

Phase 3 establishes the protected application shell for the Team Productivity Platform frontend.

This phase introduces the dashboard layout, sidebar navigation, header, user navigation menu, protected route groups, and authenticated application structure that all future modules will use.

After successful login, authenticated users are redirected into a fully protected dashboard experience.

---

## Objectives

* Create a reusable dashboard layout
* Implement protected application routing
* Build sidebar navigation
* Build application header
* Add user navigation menu
* Create dashboard landing page
* Configure authenticated route groups
* Prepare structure for Notes, Tasks, Analytics, Notifications, and Settings modules

---

## Implemented Features

### Dashboard Layout

Created a reusable dashboard shell that wraps all authenticated pages.

#### Components

```text
src/components/layouts/
├── app-sidebar.tsx
├── app-header.tsx
├── user-nav.tsx
└── dashboard-layout.tsx
```

Responsibilities:

* Sidebar navigation
* Header
* User account section
* Shared application layout
* Responsive page structure

---

### Protected Route Group

Created a protected route group for authenticated pages.

```text
src/app/(protected)/
```

All routes inside this group are protected by authentication.

Example:

```tsx
<AuthGuard>
  <DashboardLayout>
    {children}
  </DashboardLayout>
</AuthGuard>
```

---

### Dashboard Page

Created the main dashboard page.

```text
src/app/(protected)/dashboard/page.tsx
```

Dashboard widgets display summary information and serve as the application's landing page after login.

Widgets include:

* Total Notes
* Total Tasks
* Notifications
* Analytics

---

### Sidebar Navigation

Configured application navigation.

Navigation items:

```text
Dashboard
Notes
Tasks
Analytics
Notifications
Settings
```

Features:

* Route navigation
* Active route highlighting
* Nested route support
* Responsive layout integration

---

### Header

Created a reusable application header.

Features:

* Application title
* User navigation menu
* Mobile navigation support
* Shared across all protected pages

---

### User Navigation

Created authenticated user menu.

Features:

* Display current user
* Logout functionality
* Future account settings support

---

### Authentication Integration

Integrated dashboard routing with authentication flow.

Flow:

```text
Login
→ Authenticate User
→ Store JWT
→ Store User
→ Redirect /dashboard
→ Protected Application
```

Unauthenticated users are redirected to:

```text
/login
```

---

### Route Structure

Public Routes

```text
/
/login
/register
```

Protected Routes

```text
/dashboard
/notes
/tasks
/analytics
/notifications
/settings
```

---

### Mobile Navigation

Implemented responsive navigation support.

Features:

* Mobile sidebar
* Hamburger menu
* Sheet-based navigation
* Responsive header layout

---

### Active Route Highlighting

Implemented automatic sidebar highlighting.

Examples:

```text
/dashboard
/notes
/tasks
```

Nested routes are also supported:

```text
/notes/1
/tasks/5
```

---

## Files Created

### Layout Components

```text
src/components/layouts/
├── app-sidebar.tsx
├── app-header.tsx
├── user-nav.tsx
└── dashboard-layout.tsx
```

### Dashboard

```text
src/app/(protected)/dashboard/page.tsx
```

### Protected Routes

```text
src/app/(protected)/
├── dashboard/
├── notes/
├── tasks/
├── analytics/
├── notifications/
└── settings/
```

---

# Phase 5 – Tasks Module

## Overview

The Tasks Module provides complete task management functionality for the Team Productivity Platform. It integrates with the NestJS backend and allows users to create, manage, organize, and track tasks through both table and Kanban interfaces.

---

## Features Implemented

### Task Management

* Create Task
* View Task Details
* Update Task
* Delete Task
* Update Task Status
* View Converted Note Information

### Task Listing

* Paginated Task List
* Search Tasks
* Status Filtering
* Priority Filtering
* Loading State
* Error State
* Empty State

### Task Detail Page

Route:

```text
/tasks/[id]
```

Features:

* Task Information
* Description
* Status Management
* Priority Display
* Due Date
* Created Date
* Updated Date
* Converted Note Metadata
* Edit Task
* Delete Task

### Kanban Board

Route:

```text
/tasks/kanban
```

Columns:

* TODO
* IN_PROGRESS
* COMPLETED

Features:

* Automatic Task Grouping
* Status-Based Organization
* Task Cards
* Direct Navigation To Task Details
* React Query Integration
* Automatic Refetch After Updates

### Navigation

* Table View → Kanban View
* Kanban View → Table View

---

## API Integration

### Tasks Endpoints

```http
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

### Query Parameters

```ts
page?: number;
limit?: number;
search?: string;
status?: TaskStatus;
priority?: TaskPriority;
```

Supported Status Values:

```ts
TODO
IN_PROGRESS
COMPLETED
```

Supported Priority Values:

```ts
LOW
MEDIUM
HIGH
```

---

## Frontend Architecture

### API Layer

```text
features/tasks/api/
├── create-task.ts
├── get-task.ts
├── get-tasks.ts
├── update-task.ts
├── update-task-status.ts
└── delete-task.ts
```

### React Query Hooks

```text
features/tasks/hooks/
├── use-task.ts
├── use-tasks.ts
├── use-create-task.ts
├── use-update-task.ts
├── use-update-task-status.ts
├── use-delete-task.ts
└── use-task-kanban.ts
```

### Components

```text
features/tasks/components/
├── task-form.tsx
├── create-task-dialog.tsx
├── update-task-dialog.tsx
├── delete-task-dialog.tsx
├── task-actions.tsx
├── task-status-select.tsx
├── task-status-badge.tsx
├── task-card.tsx
├── tasks-filters.tsx
├── tasks-table.tsx
├── pagination.tsx
├── kanban-board.tsx
└── kanban-column.tsx
```

### Types

```text
features/tasks/types/
├── task.types.ts
├── create-task.types.ts
├── update-task.types.ts
└── task-query.types.ts
```

### Validation Schemas

```text
features/tasks/schemas/
├── task.schema.ts
└── create-task.schema.ts
```

---

## React Query

### Query Keys

```ts
export const QUERY_KEYS = {
  TASKS: ['tasks'],
};
```

### Automatic Cache Invalidation

The following actions automatically invalidate task queries:

* Create Task
* Update Task
* Delete Task
* Update Task Status

This ensures:

* Task List Refresh
* Task Detail Refresh
* Kanban Board Refresh

---

## Pages

### Tasks List

```text
/tasks
```

Features:

* Search
* Status Filter
* Priority Filter
* Pagination
* Create Task
* View Task
* Edit Task
* Delete Task
* Kanban Navigation

### Task Details

```text
/tasks/[id]
```

Features:

* Full Task Information
* Status Updates
* Edit
* Delete

### Kanban Board

```text
/tasks/kanban
```

Features:

* Status Columns
* Task Cards
* Board Navigation

---

# Phase 6 – Categories Module ✅

## Overview

The Categories Module enables users to organize tasks into logical groups such as Work, Personal, Learning, Health, and more.

This module provides complete Category CRUD functionality, search capabilities, and integration support for Tasks.

---

## Backend Integration

### NestJS Endpoints

#### Create Category

```http
POST /api/categories
```

#### Get Categories

```http
GET /api/categories
```

#### Get Category By ID

```http
GET /api/categories/:id
```

#### Update Category

```http
PATCH /api/categories/:id
```

#### Delete Category

```http
DELETE /api/categories/:id
```

---

## Frontend Architecture

```txt
features/categories/
├── api/
├── hooks/
├── schemas/
├── types/
└── components/
```

---

## Types

### category.types.ts

Contains:

* Category
* CategoriesResponse
* CategoryResponse
* CategoryQueryParams
* CreateCategoryRequest
* UpdateCategoryRequest

---

## Validation

### category.schema.ts

Implemented using Zod.

Validation Rules:

| Field       | Validation              |
| ----------- | ----------------------- |
| name        | Required, max 100 chars |
| description | Optional                |
| color       | Optional                |

---

## API Layer

### Implemented APIs

```txt
create-category.ts
get-category.ts
get-categories.ts
update-category.ts
delete-category.ts
```

Features:

* Axios via nestjsClient
* Typed responses
* Reusable API layer

---

## React Query Hooks

### Implemented Hooks

```txt
useCategory.ts
useCategories.ts
useCreateCategory.ts
useUpdateCategory.ts
useDeleteCategory.ts
```

Features:

* Server state management
* Query invalidation
* Error handling
* Success notifications

---

## Components

### CategoryForm

Reusable form component for:

* Create Category
* Update Category

Fields:

* Name
* Description
* Color

---

### CreateCategoryDialog

Features:

* Modal dialog
* React Hook Form
* Zod validation
* Create mutation

---

### UpdateCategoryDialog

Features:

* Prefilled values
* Edit category
* React Query invalidation

---

### DeleteCategoryDialog

Features:

* Confirmation dialog
* Safe deletion flow

---

### CategoryActions

Actions Menu:

* View
* Edit
* Delete

---

### CategoryTable

Features:

* Category listing
* Search support
* Empty state
* Responsive layout

Columns:

* Name
* Description
* Color
* Created At
* Actions

---

### CategoryCard

Card-based category display for future grid views and dashboard widgets.

---

## Categories Page

Route:

```txt
/categories
```

Features:

* Categories listing
* Search
* Create Category
* Update Category
* Delete Category
* Loading State
* Error State
* Empty State

---

## Query Keys

Added:

```ts
QUERY_KEYS.CATEGORIES
```

Used for:

* Category queries
* Automatic cache invalidation

---

## User Experience Features

### Loading State

Implemented using:

* Skeletons
* Loading indicators

### Error State

Implemented using:

* Error messages
* Retry support

### Empty State

Displayed when:

```txt
No categories found
```

---

## Completed Features

### CRUD Operations

* Create Category
* Read Categories
* View Category
* Update Category
* Delete Category

### Search

* Client-side search support
* API query support

### Form Validation

* React Hook Form
* Zod Schema Validation

### Notifications

* Success Toasts
* Error Toasts

### React Query Integration

* Automatic cache updates
* Query invalidation

---

## Task Integration Preparation

Categories are prepared for Task association via:

```ts
categoryId
```

Supported in:

* Task Types
* Task Schemas
* Task Forms
* Task Create
* Task Update

This integration is completed in Phase 6.5.

---

# Phase 7 – Notifications Module

## Overview

The Notifications Module enables users to view and manage system notifications generated by various actions within the Team Productivity Platform.

Notifications provide users with real-time awareness of important events such as task updates, completed tasks, reminders, and other system activities.

The module is implemented using NestJS APIs and integrated into the Next.js frontend using React Query for data fetching and state synchronization.

---

## Features

### View Notifications

Users can view all notifications assigned to them.

Displayed information includes:

* Notification Title
* Notification Message
* Read / Unread Status
* Creation Date and Time

---

### Mark Notification as Read

Unread notifications can be marked as read directly from the notifications page.

When a notification is marked as read:

* Backend data is updated
* React Query cache is invalidated
* Notification list automatically refreshes
* User receives a success toast message

---

### Notification Status

Each notification contains a status indicator.

#### Unread

Displayed with a visual badge.

Example:

```txt
Unread
```

#### Read

Displayed after user interaction.

Example:

```txt
Read
```

---

### Loading State

While notifications are being fetched, skeleton loaders are displayed to improve user experience.

---

### Error State

If the API request fails, the user is presented with an error message.

Example:

```txt
Failed to load notifications.
```

---

### Empty State

If no notifications are available, the user sees an empty state message.

Example:

```txt
No notifications found.
```

---

## API Ownership

### NestJS Service

Notifications Module

#### Get Notifications

```http
GET /notifications
```

Returns all notifications for the authenticated user.

---

#### Mark Notification as Read

```http
PUT /notifications/:id/read
```

Marks a notification as read.

---

## Frontend Architecture

```txt
features/notifications/

├── api/
│   ├── get-notification.ts
│   ├── get-notifications.ts
│   ├── mark-notification-read.ts
│   └── mark-all-read.ts
│
├── hooks/
│   ├── use-notification.ts
│   ├── use-notifications.ts
│   └── use-notification-read.ts
│
├── types/
│   └── notification.types.ts
│
├── schemas/
│   └── notification.schema.ts
│
└── components/
    ├── notification-card.tsx
    ├── notification-list.tsx
    ├── notification-badge.tsx
    └── notification-skeleton.tsx
```

---

## React Query Integration

The module uses React Query for:

* Data Fetching
* Caching
* Automatic Refetching
* Mutation Handling
* Cache Invalidation

Query Key:

```ts
QUERY_KEYS.NOTIFICATIONS
```

Example:

```ts
queryClient.invalidateQueries({
  queryKey: QUERY_KEYS.NOTIFICATIONS,
});
```

---

## User Flow

1. User navigates to Notifications page.
2. Frontend requests notifications from NestJS.
3. Notifications are displayed in a list.
4. User clicks "Mark Read".
5. Frontend calls the update API.
6. React Query invalidates cached data.
7. Updated notification state is displayed.

---

## Route

```txt
/notifications
```

---

# Phase 8 – Analytics Module ✅

## Overview

The Analytics Module provides visual insights into team productivity and task management performance. It aggregates task-related metrics from the NestJS Analytics Service and displays them through interactive charts and summary cards.

---

## Backend APIs

Analytics data is provided by the NestJS backend through the following endpoints:

### Task Status Analytics

```http
GET /api/analytics/tasks/status
```

Response:

```json
{
  "success": true,
  "data": {
    "todo": 1,
    "inProgress": 0,
    "completed": 0,
    "cancelled": 0
  }
}
```

---

### Task Priority Analytics

```http
GET /api/analytics/tasks/priority
```

Response:

```json
{
  "success": true,
  "data": {
    "low": 0,
    "medium": 1,
    "high": 0,
    "urgent": 0
  }
}
```

---

### Productivity Analytics

```http
GET /api/analytics/productivity
```

Response:

```json
{
  "success": true,
  "data": {
    "totalTasks": 1,
    "completedTasks": 0,
    "activeTasks": 1,
    "completionRate": 0
  }
}
```

---

## Frontend Architecture

### Feature Structure

```text
features/
└── analytics
    ├── api
    │   ├── get-overview.ts
    │   ├── get-productivity.ts
    │   ├── get-task-priority.ts
    │   └── get-task-status.ts
    │
    ├── components
    │   ├── overview-cards.tsx
    │   ├── priority-chart.tsx
    │   ├── productivity-chart.tsx
    │   └── task-status-chart.tsx
    │
    ├── hooks
    │   ├── use-overview.ts
    │   ├── use-productivity.ts
    │   ├── use-task-priority.ts
    │   └── use-task-status.ts
    │
    ├── schemas
    │   └── analytics.schema.ts
    │
    └── types
        └── analytics.types.ts
```

---

## Analytics Types

### Task Status

```ts
interface TaskStatusAnalytics {
  todo: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}
```

### Task Priority

```ts
interface TaskPriorityAnalytics {
  low: number;
  medium: number;
  high: number;
  urgent: number;
}
```

### Productivity

```ts
interface ProductivityAnalytics {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
}
```

---

## React Query Integration

Analytics data is fetched using TanStack Query.

### Query Keys

```ts
TASK_STATUS_ANALYTICS
TASK_PRIORITY_ANALYTICS
PRODUCTIVITY_ANALYTICS
```

### Hooks

```ts
useTaskStatus()
useTaskPriority()
useProductivity()
useOverview()
```

---

## UI Components

### Overview Cards

Displays key productivity metrics:

* Total Tasks
* Completed Tasks
* Active Tasks
* Completion Rate

---

### Task Status Chart

Visualization Type:

* Pie Chart

Metrics:

* Todo Tasks
* In Progress Tasks
* Completed Tasks
* Cancelled Tasks

---

### Task Priority Chart

Visualization Type:

* Bar Chart

Metrics:

* Low Priority
* Medium Priority
* High Priority
* Urgent Priority

---

### Productivity Chart

Visualization Type:

* Bar Chart

Metrics:

* Total Tasks
* Completed Tasks
* Active Tasks

---

## Analytics Route

```text
/analytics
```

The Analytics page includes:

1. Overview Cards
2. Task Status Pie Chart
3. Task Priority Bar Chart
4. Productivity Overview Chart

Layout:

```text
Analytics
│
├── Overview Cards
│
├── Task Status Chart
├── Task Priority Chart
│
└── Productivity Chart
```

---

## Libraries Used

### Recharts

Used for data visualization.

Installation:

```bash
npm install recharts
```

### TanStack Query

Used for analytics data fetching and caching.

### Shadcn UI

Used for:

* Cards
* Layout Components
* UI Consistency

---

## Features Implemented

### Analytics Data

* Fetch Task Status Analytics
* Fetch Task Priority Analytics
* Fetch Productivity Analytics

### Dashboard Insights

* Total Tasks
* Active Tasks
* Completed Tasks
* Completion Rate

### Charts

* Pie Chart
* Bar Chart
* Productivity Comparison Chart

### User Experience

* Loading States
* Error Handling
* Empty State Support
* Responsive Layout


---

