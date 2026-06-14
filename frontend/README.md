# Team Productivity Platform – Frontend

## Status

Frontend Phase 1: Foundation Setup

Current Progress: ✅ Completed

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
