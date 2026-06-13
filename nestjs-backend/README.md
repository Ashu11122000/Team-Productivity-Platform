# Team Productivity Platform - NestJS Backend

## Overview

The NestJS Backend is the second backend service of the Team Productivity Platform.

This service is responsible for task management, categorization, tagging, notifications, analytics, and activity tracking.

The application follows a microservice-inspired architecture where:

- FastAPI owns Authentication and Notes
- NestJS owns Productivity Features
- Next.js acts as the unified frontend
- PostgreSQL is the shared database

NestJS does not perform user authentication.

Authentication is delegated to FastAPI, while NestJS validates the JWT issued by FastAPI to provide a seamless single-login experience.

---

# Responsibilities

## NestJS Service Owns

### Tasks

- Create Tasks
- Update Tasks
- Delete Tasks
- Task Status Management
- Task Priority Management
- Task Querying & Filtering

### Categories

- Create Categories
- Update Categories
- Delete Categories
- Organize Tasks

### Tags

- Create Tags
- Update Tags
- Delete Tags
- Task Tagging

### Notifications

- Notification Listing
- Mark Notifications as Read

### Activity Logs

- Activity History
- User Actions Tracking

### Analytics

- Productivity Dashboard
- Task Statistics
- Completion Metrics

### Public Holiday Integration

- Holiday Awareness
- Due Date Validation
- Sprint Planning Support

---

# Architecture

```text
Next.js Frontend
        │
        ▼

     FastAPI
        │
        ├── Authentication
        ├── User Management
        ├── Notes
        └── Note → Task Conversion

        ▼

      NestJS
        │
        ├── Tasks
        ├── Categories
        ├── Tags
        ├── Notifications
        ├── Analytics
        └── Activity Logs

        ▼

     PostgreSQL
```

---

# Authentication Flow

FastAPI is the JWT issuer.

Flow:

1. User logs in through FastAPI
2. FastAPI generates JWT
3. Frontend stores JWT
4. Frontend sends JWT to FastAPI APIs
5. Frontend sends same JWT to NestJS APIs
6. NestJS validates JWT
7. User accesses all services without re-authentication

---

# Shared JWT Contract

```json
{
  "sub": "1",
  "email": "user@example.com",
  "role": "ADMIN",
  "iss": "team-productivity-platform",
  "aud": "team-productivity-users",
  "type": "access"
}
```

NestJS validates:

- JWT Signature
- Issuer
- Audience
- Expiration
- User Role

---

# API Ownership

## FastAPI

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Notes

```http
POST   /api/v1/notes
GET    /api/v1/notes
GET    /api/v1/notes/{id}
PUT    /api/v1/notes/{id}
DELETE /api/v1/notes/{id}
```

### Admin

```http
GET /api/v1/notes/admin/all
```

### Conversion

```http
POST /api/v1/notes/{id}/convert-to-task
```

---

## NestJS

### Tasks

```http
POST   /api/v1/tasks
GET    /api/v1/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```

### Categories

```http
POST   /api/v1/categories
GET    /api/v1/categories
GET    /api/v1/categories/:id
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

### Tags

```http
POST   /api/v1/tags
GET    /api/v1/tags
GET    /api/v1/tags/:id
PATCH  /api/v1/tags/:id
DELETE /api/v1/tags/:id
```

### Notifications

```http
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
```

### Analytics

```http
GET /api/v1/analytics/dashboard
```

### Activity Logs

```http
GET /api/v1/activity-logs
```

---

# Database Ownership

## FastAPI Tables

```text
users
notes
```

## NestJS Tables

```text
tasks
categories
tags
task_tags
notifications
activity_logs
```

---

# Technology Stack

## Framework

- NestJS

## Language

- TypeScript

## Database

- PostgreSQL

## ORM

- TypeORM

## Authentication

- Passport JWT
- Shared JWT Validation

## Validation

- class-validator
- class-transformer

## Documentation

- Swagger

## Containerization

- Docker

## Testing

- Jest
- Supertest

---

# Dependencies Installed

## Core NestJS

```bash
npm install @nestjs/config
```

## Database

```bash
npm install @nestjs/typeorm typeorm pg
```

## Authentication

```bash
npm install @nestjs/jwt
npm install passport
npm install passport-jwt
npm install @nestjs/passport
```

Development Types:

```bash
npm install -D @types/passport-jwt
```

## Validation

```bash
npm install class-validator
npm install class-transformer
```

## Swagger

```bash
npm install @nestjs/swagger
npm install swagger-ui-express
```

## Environment Variables

```bash
npm install dotenv
```

## UUID

```bash
npm install uuid
```

## Security

```bash
npm install helmet
```

## Logging

```bash
npm install nestjs-pino
npm install pino
npm install pino-pretty
```

## Testing

```bash
npm install -D supertest
```

## Formatting

```bash
npm install -D prettier
```

## Linting

```bash
npm install -D eslint
npm install -D eslint-config-prettier
npm install -D eslint-plugin-prettier
```

---

# Setup

## Clone Repository

```bash
git clone https://github.com/Ashu11122000/Team-Productivity-Platform.git
```

## Navigate to NestJS Backend

```bash
cd Team-Productivity-Platform/nestjs-backend
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create:

```text
.env
```

Example:

```env
NODE_ENV=development

PORT=3001

DATABASE_HOST=localhost
DATABASE_PORT=5432

DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

DATABASE_NAME=team_productivity

JWT_SECRET=super-secret-key

JWT_ISSUER=team-productivity-platform
JWT_AUDIENCE=team-productivity-users

FRONTEND_URL=http://localhost:3000
```

---

# Run Development Server

```bash
npm run start:dev
```

Server:

```text
http://localhost:3001
```

---

# Current Development Status

## Completed

### Project Setup

- NestJS Application Created
- TypeScript Configuration
- Dependency Installation
- Folder Structure Design
- Docker Files Added
- Environment Configuration
- Testing Structure Created

### Architecture

- API Ownership Defined
- Authentication Strategy Defined
- Database Ownership Defined
- Shared JWT Contract Defined

### Project Structure

- Configuration Layer
- Database Layer
- Authentication Layer
- Common Utilities Layer
- Feature Modules Layer
- Integrations Layer
- Testing Layer

---

# Next Development Phase

The following modules will now be implemented:

## Configuration

- app.config.ts
- database.config.ts
- jwt.config.ts
- swagger.config.ts

## Database

- TypeORM Configuration
- PostgreSQL Connection

## Bootstrap

- main.ts
- app.module.ts

## Authentication

- JwtStrategy
- JwtAuthGuard
- RolesGuard
- CurrentUser Decorator

## Health Module

```http
GET /health
```

## Tasks Module

First fully implemented business module.

Includes:

- Entity
- DTOs
- CRUD APIs
- Swagger Documentation
- RBAC Support
- Ownership Validation

---

# License

This project is developed as part of a Full Stack Evaluation Assignment demonstrating:

- NestJS Development
- FastAPI Integration
- Shared Authentication
- PostgreSQL Design
- API Architecture
- TypeScript Development
- Production-Ready Backend Design
