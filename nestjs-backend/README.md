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

# Architecture

```text
Next.js Frontend
        │
        ▼

     FastAPI
        │
        ├── Authentication
        ├── Users
        ├── Notes
        ├── Open Library
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

# Authentication Strategy

FastAPI is the authentication owner.

NestJS does NOT provide:

* Login APIs
* Registration APIs
* Password Management

Authentication Flow:

1. User logs in via FastAPI.
2. FastAPI generates JWT.
3. Frontend stores JWT.
4. Frontend sends JWT to FastAPI.
5. Frontend sends the same JWT to NestJS.
6. NestJS validates the token.
7. User accesses protected NestJS APIs.

Single Login Experience.

---

# Shared JWT Contract

FastAPI JWT Payload:

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

NestJS will validate:

* JWT Signature
* Issuer
* Audience
* Expiration

---

# Installed Dependencies

Core:

```bash
npm install @nestjs/config
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install class-validator class-transformer
npm install @nestjs/swagger swagger-ui-express
npm install helmet
npm install nestjs-pino pino pino-pretty
npm install dotenv
npm install uuid
```

Testing:

```bash
npm install --save-dev supertest
```

TypeORM CLI:

```bash
npm install --save-dev typeorm-ts-node-commonjs
```

---

# Environment Variables

Create a .env file:

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

# Phase 1 - Configuration Layer

Files Created:

```text
src/config/app.config.ts
src/config/database.config.ts
src/config/jwt.config.ts
src/config/swagger.config.ts
src/config/index.ts
```

Purpose:

## app.config.ts

Application configuration:

* NODE_ENV
* PORT
* FRONTEND_URL

---

## database.config.ts

Database configuration:

* DATABASE_HOST
* DATABASE_PORT
* DATABASE_USER
* DATABASE_PASSWORD
* DATABASE_NAME

---

## jwt.config.ts

JWT configuration:

* JWT_SECRET
* JWT_ISSUER
* JWT_AUDIENCE

Used later for FastAPI JWT validation.

---

## swagger.config.ts

Swagger setup configuration.

Will expose:

```text
/api/docs
```

Provides:

* OpenAPI Documentation
* JWT Authorization Support
* API Testing Interface

---

## index.ts

Centralized configuration exports.

---

# Phase 2 - Database Layer

Files Created:

```text
src/database/data-source.ts
```

Purpose:

* PostgreSQL Connection
* TypeORM DataSource
* Migration Support
* CLI Integration

Configuration Highlights:

```typescript
synchronize: false
```

Production-safe configuration.

Database changes will be managed using migrations.

---

# Migration Strategy

Future Structure:

```text
src/database/

├── migrations/
│   ├── create-tasks.ts
│   ├── create-categories.ts
│   ├── create-tags.ts
│   ├── create-task-tags.ts
│   ├── create-notifications.ts
│   └── create-activity-logs.ts
│
└── data-source.ts
```

No migrations have been created yet because entities are not implemented.

---

# TypeORM Scripts

package.json:

```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs -d src/database/data-source.ts",
    "migration:create": "npm run typeorm -- migration:create src/database/migrations/Migration",
    "migration:generate": "npm run typeorm -- migration:generate src/database/migrations/AutoMigration",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert"
  }
}
```

---

# Phase 3 - Application Bootstrap

## Overview

Phase 3 establishes the foundational application bootstrap layer for the NestJS backend.

The goal of this phase is to configure the application startup process, database integration, security middleware, logging, validation, API documentation, and health monitoring.

At the end of this phase, the NestJS application can:

* Start successfully
* Connect to PostgreSQL
* Expose Swagger documentation
* Apply security headers
* Enable CORS
* Validate incoming requests globally
* Log requests using Pino
* Provide a health check endpoint

---

## Features Implemented

### ConfigModule

Global configuration management is enabled using:

* @nestjs/config
* Environment variables
* Centralized configuration files

Loaded configurations:

* app.config.ts
* database.config.ts
* jwt.config.ts

---

### TypeORM Integration

Database connection is configured using:

* PostgreSQL
* TypeORM
* ConfigService
* Async initialization

Configuration includes:

* Host
* Port
* Username
* Password
* Database Name

Database synchronization remains disabled:

```ts
synchronize: false
```

to ensure migration-driven schema management.

---

### Helmet Security

Helmet middleware is enabled globally.

Provides protection through security headers such as:

* X-Content-Type-Options
* X-Frame-Options
* Content-Security-Policy
* Referrer-Policy

---

### CORS Configuration

Cross-Origin Resource Sharing (CORS) is enabled.

Allowed origin:

```env
FRONTEND_URL=http://localhost:3000
```

Credentials support is enabled for future authenticated requests.

---

### Global ValidationPipe

A global validation pipeline is configured.

Features:

* DTO validation
* Automatic transformation
* Payload sanitization
* Unknown property rejection

Configuration:

```ts
whitelist: true
forbidNonWhitelisted: true
transform: true
```

---

### Pino Logger

Structured request logging is configured using:

* nestjs-pino
* pino
* pino-pretty

Provides:

* HTTP request logs
* Response logs
* Error logs
* Development-friendly output

---

### Swagger Documentation

Swagger UI is configured for API documentation.

Features:

* API Explorer
* Request/Response Schemas
* JWT Bearer Authentication Support

Swagger URL:

```text
http://localhost:3001/api/docs
```

Bearer authentication is preconfigured for future FastAPI-issued JWT integration.

---

### Health Check Endpoint

A dedicated health module is implemented.

Endpoint:

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "nestjs-backend"
}
```

Purpose:

* Service monitoring
* Docker health checks
* Load balancer verification
* Deployment validation

---

## Files Created

```text
src/

├── health/
│   ├── health.controller.ts
│   └── health.module.ts
```

---

## Files Updated

```text
src/

├── main.ts
├── app.module.ts
```

---

## Files Removed

Default NestJS starter files were removed:

```text
src/

├── app.controller.ts
├── app.controller.spec.ts
└── app.service.ts
```

---

## Verification

Start the application:

```bash
npm run start:dev
```

Verify health endpoint:

```http
GET http://localhost:3001/health
```

Verify Swagger:

```text
http://localhost:3001/api/docs
```

Verify database connectivity:

Application startup should complete successfully without TypeORM connection errors.

---

## Phase 3 Completion Status

Completed:

* ConfigModule
* TypeOrmModule
* Helmet
* CORS
* ValidationPipe
* Pino Logger
* Swagger
* Health Endpoint

Result:

The NestJS backend is successfully bootstrapped and ready for authentication integration and feature module development.

---

# Phase 4 - Authentication Foundation

## Overview

Phase 4 establishes the authentication and authorization foundation for the NestJS Backend.

NestJS does not own authentication. Authentication remains fully managed by the FastAPI Backend.

NestJS validates JWT access tokens issued by FastAPI and provides role-based access control (RBAC) utilities that will be used by all future modules such as Tasks, Categories, Tags, Notifications, Analytics, and Activity Logs.

---

## Objectives

Implemented:

* JWT Authentication Strategy
* JWT Authentication Guard
* Role-Based Authorization Guard
* Roles Decorator
* Current User Decorator
* Shared JWT Payload Interface
* Shared Role Enumeration
* FastAPI JWT Validation

---

## Authentication Architecture

Authentication ownership:

```text
FastAPI
│
├── Register User
├── Login User
├── Generate JWT
└── Manage Credentials

        │

        ▼

Frontend
        │
        ├── Calls FastAPI APIs
        └── Calls NestJS APIs

        ▼

NestJS
│
├── Validate JWT
├── Extract User Information
└── Enforce Authorization Rules
```

NestJS never creates, refreshes, or manages tokens.

---

## JWT Contract

NestJS validates JWTs generated by FastAPI.

Expected payload:

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

Validation rules:

* Signature Validation
* Issuer Validation
* Audience Validation
* Expiration Validation

---

## Folder Structure

```text
src/

├── auth/
│
│   ├── auth.module.ts
│
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│
│   └── strategies/
│       └── jwt.strategy.ts
│
├── common/
│
│   ├── constants/
│   │   └── roles.enum.ts
│
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│
│   └── interfaces/
│       └── jwt-payload.interface.ts
```

---

## Implemented Components

### AuthModule

Registers Passport and JWT authentication components.

Responsibilities:

* Authentication configuration
* JWT strategy registration
* Guard exports

---

### JwtStrategy

Validates FastAPI-issued JWTs.

Checks:

* JWT Signature
* JWT Issuer
* JWT Audience
* JWT Expiration

Returns authenticated user payload to request context.

---

### JwtAuthGuard

Protects endpoints that require authentication.

Example:

```ts
@UseGuards(JwtAuthGuard)
@Get()
findAll() {}
```

---

### RolesGuard

Provides role-based authorization.

Example:

```ts
@Roles(Role.ADMIN)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Get('admin')
adminOnly() {}
```

---

### Roles Decorator

Declares allowed roles for a route.

Example:

```ts
@Roles(Role.ADMIN)
```

---

### CurrentUser Decorator

Extracts authenticated user information from the request.

Example:

```ts
@Get('profile')
profile(
  @CurrentUser() user: JwtPayload,
) {
  return user;
}
```

---

### Role Enum

Supported roles:

```ts
ADMIN
USER
```

Future roles can be added without modifying existing modules.

---

### JWT Payload Interface

Defines the shared authentication contract used across the application.

Properties:

```ts
sub
email
role
iss
aud
type
iat
exp
```

---

## Security Features

Implemented security checks:

* JWT Signature Verification
* JWT Expiration Validation
* Issuer Validation
* Audience Validation
* Authentication Guard
* Authorization Guard
* RBAC Foundation

---

## Swagger Integration

Swagger authentication support was already configured in Phase 3.

Authentication can be tested through:

```text
http://localhost:3001/api/docs
```

Use:

```text
Authorize
Bearer <FastAPI JWT Token>
```

to test protected APIs.

---

## Testing Checklist

Build Verification:

```bash
npm run build
```

Run Application:

```bash
npm run start:dev
```

Health Check:

```http
GET /health
```

Expected Response:

```json
{
  "status": "ok",
  "service": "nestjs-backend"
}
```

Authentication Tests:

* Valid JWT → 200 OK
* Missing JWT → 401 Unauthorized
* Expired JWT → 401 Unauthorized
* Invalid Issuer → 401 Unauthorized
* Invalid Audience → 401 Unauthorized

Authorization Tests:

* ADMIN accessing ADMIN route → Allowed
* USER accessing ADMIN route → Forbidden (403)

---

## Phase 4 Deliverables

Completed:

* AuthModule
* JwtStrategy
* JwtAuthGuard
* RolesGuard
* Roles Decorator
* CurrentUser Decorator
* Role Enum
* JWT Payload Interface
* FastAPI JWT Validation
* RBAC Foundation

---

