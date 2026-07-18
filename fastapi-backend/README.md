# Overview

The **Team Productivity Platform** is a modern microservices-based productivity application designed to help teams organize work, collaborate efficiently, and manage daily activities through a secure and scalable architecture.

This repository contains the **FastAPI Backend**, which is responsible for authentication, user management, notes management, and secure API communication. It exposes RESTful APIs consumed by the Next.js frontend while sharing authentication with the NestJS backend through JWT.

The backend follows a clean layered architecture where API routes remain lightweight and business logic is delegated to dedicated service classes. SQLAlchemy 2.x is used as the ORM for database interactions, while PostgreSQL serves as the primary relational database.

The project is structured to support maintainability, scalability, and production deployment. Common concerns such as authentication, validation, exception handling, logging, middleware, configuration management, and dependency injection are separated into dedicated modules to improve code quality and long-term maintainability.

This backend currently provides the following core capabilities:

- User registration and authentication
- JWT-based authorization
- User profile management
- Notes CRUD operations
- Note-to-task conversion support
- PostgreSQL database integration
- Request validation using Pydantic v2
- Automatic OpenAPI (Swagger) documentation
- Centralized exception handling
- Configurable CORS support
- Structured logging middleware
- Environment-based configuration
- Health monitoring endpoint

The FastAPI backend works alongside the following services within the Team Productivity Platform ecosystem:

| Service | Technology | Responsibility |
|----------|------------|----------------|
| Frontend | Next.js, TypeScript, Tailwind CSS | User Interface |
| FastAPI Backend | FastAPI | Authentication, Users, Notes |
| NestJS Backend | NestJS | Tasks, Categories, Tags, Analytics |
| Database | PostgreSQL | Persistent Data Storage |

The application is designed with production-readiness in mind by emphasizing:

- Modular architecture
- Reusable services
- Clean separation of concerns
- Secure authentication
- RESTful API design
- Type safety
- Maintainable project structure
- High code readability
- Scalable backend architecture
- Comprehensive API documentation

This backend serves as the authentication and notes management service within the overall Team Productivity Platform and is intended to integrate seamlessly with the frontend and additional backend services as the platform evolves.

---

# Features

The FastAPI backend has been designed with scalability, maintainability, security, and performance in mind. It provides a modular architecture that separates business logic from API routes while following modern backend development practices.

## Authentication

- JWT-based authentication
- Secure user registration
- User login
- Password hashing using Argon2
- Stateless authentication
- Bearer token authorization
- Protected API endpoints
- Shared authentication support with the NestJS backend

---

## User Management

- Create new users
- Retrieve authenticated user information
- Update user details
- Delete users
- Role-based authorization
- Active and inactive user support
- User profile management

---

## Notes Management

- Create notes
- Retrieve notes
- Update notes
- Delete notes
- Search notes
- Pagination support
- Sorting support
- Personal notes for authenticated users
- Administrator access to all notes
- Convert notes into tasks

---

## API Design

- RESTful API architecture
- Versioned API endpoints
- Request validation
- Response validation
- Consistent HTTP status codes
- Structured API responses
- OpenAPI specification generation
- Interactive Swagger UI
- ReDoc documentation

---

## Security

- JWT Authentication
- Password hashing with Argon2
- Protected routes
- Dependency-based authorization
- Request validation
- SQL Injection protection through SQLAlchemy ORM
- Environment variable configuration
- Secure secret key management
- Role-based access control

---

## Database

- PostgreSQL database
- SQLAlchemy 2.x ORM
- Session management
- Connection pooling
- Repository pattern support
- Automatic table initialization
- Transaction management

---

## Validation

- Pydantic v2 schemas
- Automatic request validation
- Automatic response serialization
- Email validation
- Password validation
- Field constraints
- Type safety throughout the application

---

## Middleware

- Logging middleware
- CORS middleware
- Global exception handling
- Request logging
- Response logging
- Error handling middleware

---

## Logging

- Structured logging
- Startup logs
- Shutdown logs
- API request logs
- Error logging
- Database initialization logs
- Middleware logs

---

## Configuration

- Environment-based configuration
- Centralized settings
- Secure environment variables
- Development and production support
- Configurable JWT settings
- Configurable CORS settings

---

## Documentation

- Swagger UI
- ReDoc
- OpenAPI 3.1 specification
- Endpoint descriptions
- Request examples
- Response schemas
- Validation documentation

---

## Production Ready

- Layered architecture
- Modular project structure
- Service layer
- Repository layer
- Dependency injection
- Configuration management
- Exception handling
- Type annotations
- Comprehensive documentation

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Language | Python 3.12+ |
| Framework | FastAPI |
| ASGI Server | Uvicorn |
| ORM | SQLAlchemy 2.x |
| Database | PostgreSQL 15+ |
| Validation | Pydantic v2 |
| Authentication | JWT |
| Password Hashing | Argon2 (pwdlib) |
| Database Driver | Psycopg v3 |
| Configuration | pydantic-settings |
| API Documentation | Swagger UI, ReDoc, OpenAPI |
| Dependency Management | pip |
| Logging | Python Logging |
| Architecture | Layered Architecture |
| API Style | REST |
| Serialization | Pydantic |
| Environment Management | .env |
| Version Control | Git |
| Container Support | Docker Ready |
| IDE | Visual Studio Code |

---

## Core Libraries

| Package | Purpose |
|----------|---------|
| fastapi | REST API framework |
| uvicorn | ASGI server |
| sqlalchemy | ORM |
| psycopg | PostgreSQL driver |
| pydantic | Data validation |
| pydantic-settings | Configuration management |
| python-jose | JWT encoding and decoding |
| pwdlib | Password hashing |
| python-multipart | Form data support |
| email-validator | Email validation |
| alembic | Database migrations |

---

# Architecture

The Team Productivity Platform follows a modular microservices architecture where each service is responsible for a specific business domain. The frontend communicates with both backend services through REST APIs while authentication is shared using JSON Web Tokens (JWT).

```
                           ┌─────────────────────────┐
                           │     Next.js Frontend    │
                           │ TypeScript + Tailwind   │
                           └────────────┬────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │                             │
                  REST API Calls                REST API Calls
                         │                             │
                         ▼                             ▼
        ┌────────────────────────┐      ┌────────────────────────┐
        │    FastAPI Backend     │      │    NestJS Backend      │
        │────────────────────────│      │────────────────────────│
        │ Authentication         │      │ Tasks                 │
        │ Users                  │      │ Categories            │
        │ Notes                  │      │ Tags                  │
        │ JWT                    │      │ Analytics             │
        └────────────┬───────────┘      └────────────┬───────────┘
                     │                               │
                     └──────────────┬────────────────┘
                                    │
                                    ▼
                         PostgreSQL Database
```

The FastAPI backend is organized using a layered architecture to ensure separation of concerns and improve maintainability.

```
                HTTP Request
                      │
                      ▼
              FastAPI Router Layer
                      │
                      ▼
             Dependency Injection
                      │
                      ▼
               Service Layer
                      │
                      ▼
            Repository / Database
                      │
                      ▼
             PostgreSQL Database
```

Each layer has a clearly defined responsibility.

| Layer | Responsibility |
|--------|----------------|
| API Routes | Define REST endpoints and validate requests |
| Dependencies | Authentication and shared dependencies |
| Services | Business logic and application rules |
| Models | SQLAlchemy ORM models |
| Schemas | Request and response validation |
| Database | Session management and database initialization |
| Middleware | Logging and CORS |
| Core | Configuration, constants, security and logging |
| Exceptions | Global exception handlers |

---

## Directory Description

### `app/api`

Contains all REST API endpoints and dependency providers.

| File | Description |
|------|-------------|
| `deps.py` | Shared dependencies |
| `routes/auth.py` | Authentication APIs |
| `routes/users.py` | User APIs |
| `routes/notes.py` | Notes APIs |

---

### `app/core`

Contains the application's core configuration and utilities.

| File | Description |
|------|-------------|
| `config.py` | Environment configuration |
| `constants.py` | Global constants |
| `security.py` | JWT and password hashing |
| `logging.py` | Logger configuration |

---

### `app/db`

Responsible for database connectivity and initialization.

| File | Description |
|------|-------------|
| `session.py` | SQLAlchemy session |
| `base.py` | Declarative base |
| `init_db.py` | Database initialization |

---

### `app/models`

Contains SQLAlchemy ORM models.

| Model | Purpose |
|-------|---------|
| User | User table |
| Note | Notes table |

---

### `app/schemas`

Contains all Pydantic models used for validation and serialization.

| Schema | Purpose |
|--------|---------|
| Auth | Authentication |
| User | User operations |
| Note | Notes operations |
| Token | JWT responses |

---

### `app/services`

Contains all business logic.

| Service | Responsibility |
|---------|----------------|
| AuthService | Authentication |
| UserService | User management |
| NoteService | Notes management |

---

### `app/repositories`

Responsible for database operations.

Repositories isolate SQLAlchemy queries from the service layer, improving maintainability and testability.

---

### `app/middleware`

Contains middleware executed before and after request processing.

- Logging middleware
- CORS middleware

---

### `app/exceptions`

Provides centralized exception handling for the application.

Global handlers ensure consistent error responses across all API endpoints.

---

# Getting Started

This section explains how to set up and run the FastAPI backend locally for development.

## Prerequisites

Before running the application, ensure the following software is installed on your machine.

| Software | Recommended Version |
|----------|---------------------|
| Python | 3.12 or later |
| PostgreSQL | 15 or later |
| Git | Latest |
| Visual Studio Code | Latest |
| pip | Latest |

Verify the installed versions:

```bash
python --version
pip --version
git --version
psql --version
```

---

# Clone the Repository

Clone the project from GitHub.

```bash
git clone https://github.com/Ashu11122000/Team-Productivity-Platform.git
```

Move into the FastAPI backend.

```bash
cd Team-Productivity-Platform/fastapi-backend
```

---

# Create a Virtual Environment

Windows

```bash
python -m venv .venv
```

Linux / macOS

```bash
python3 -m venv .venv
```

---

# Activate the Virtual Environment

### Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

### Windows Command Prompt

```cmd
.venv\Scripts\activate.bat
```

### Linux / macOS

```bash
source .venv/bin/activate
```

After activation, your terminal should display:

```text
(.venv)
```

---

# Install Dependencies

Upgrade pip.

```bash
python -m pip install --upgrade pip
```

Install project dependencies.

```bash
pip install -r requirements.txt
```

If a `requirements.txt` file is not available, install the required packages manually.

```bash
pip install fastapi
pip install uvicorn
pip install sqlalchemy
pip install psycopg[binary]
pip install pydantic
pip install pydantic-settings
pip install python-jose[cryptography]
pip install pwdlib[argon2]
pip install python-multipart
pip install email-validator
pip install alembic
```

---

# Folder structure

```text
app/
├── main.py
│
├── core/
│   ├── config.py
│   ├── security.py
│   ├── logging.py
│   ├── constants.py
│
├── db/
│   ├── base.py
│   ├── session.py
│   ├── init_db.py
│
├── models/
│   ├── user.py
│   ├── note.py
│   ├── __init__.py
│
├── schemas/
│   ├── user.py
│   ├── note.py
│   ├── auth.py
│   ├── token.py
│   ├── common.py
│
├── repositories/
│   ├── user_repository.py
│   ├── note_repository.py
│
├── services/
│   ├── auth_service.py
│   ├── user_service.py
│   ├── note_service.py
│
├── api/
│   ├── deps.py
│   ├── router.py
│   └── routes/
│       ├── auth.py
│       ├── users.py
│       ├── notes.py
│
├── middleware/
│   ├── auth.py
│   ├── logging.py
│
├── utils/
│   ├── helpers.py
│   ├── pagination.py
│
├── exceptions/
│   ├── handlers.py
│   ├── exceptions.py
│
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_users.py
│   ├── test_notes.py
│
└── __init__.py

alembic/
alembic.ini

.env
.env.example

requirements.txt
Dockerfile
docker-compose.yml
README.md
```

---

# Installation

After configuring the environment variables, verify that PostgreSQL is running.

Start the FastAPI development server.

```bash
uvicorn app.main:app --reload
```

A successful startup should display output similar to:

```text
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

The API is now available locally.

| Service | URL |
|----------|-----|
| API | http://127.0.0.1:8000 |
| Swagger UI | http://127.0.0.1:8000/docs |
| ReDoc | http://127.0.0.1:8000/redoc |
| Health Check | http://127.0.0.1:8000/health |

---

# Verify the Installation

Open the browser and navigate to:

```text
http://127.0.0.1:8000/docs
```

The interactive Swagger UI should load successfully.

You can also verify the health endpoint.

```http
GET /health
```

Example response:

```json
{
  "status": "healthy",
  "service": "Team Productivity Platform API",
  "version": "1.0.0",
  "environment": "development"
}
```

If the application starts successfully and the health endpoint responds correctly, the FastAPI backend has been installed and configured successfully.

---

# Database Setup

The FastAPI backend uses **PostgreSQL** as its primary relational database and **SQLAlchemy 2.x** as the Object Relational Mapper (ORM).

The application automatically establishes a database connection during startup and initializes the required tables if they do not already exist.

---

## Create the Database

Open PostgreSQL and create the project database.

```sql
CREATE DATABASE team_productivity;
```

Verify that the database has been created.

```sql
\l
```

Expected output:

```text
team_productivity
```

---

## Database Configuration

The application reads database configuration from the `.env` file.

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=team_productivity

DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/team_productivity
```

---

## Test the Database Connection

Connect to PostgreSQL.

```bash
psql -U postgres -h localhost
```

Select the project database.

```sql
\c team_productivity
```

List all available tables.

```sql
\dt
```

Example output:

```text
users
notes
```

---

## Automatic Initialization

When the FastAPI application starts, it automatically performs the following tasks:

- Connects to PostgreSQL
- Creates database tables if they do not exist
- Initializes the SQLAlchemy engine
- Configures the database session
- Verifies database connectivity

No manual schema creation is required after the initial setup.

---

# Authentication

The FastAPI backend uses **JWT (JSON Web Token)** authentication to secure protected API endpoints.

After a successful login, the server returns an access token that must be included in subsequent authenticated requests.

Authentication is shared across backend services, allowing the FastAPI backend and the NestJS backend to validate the same JWT.

---

## Authentication Flow

```
User
 │
 │ Register
 ▼
FastAPI
 │
 │ Store User
 ▼
PostgreSQL

--------------------------

User
 │
 │ Login
 ▼
FastAPI
 │
 │ Verify Credentials
 ▼
Generate JWT
 │
 ▼
Return Access Token
 │
 ▼
Frontend Stores Token
 │
 ▼
Authorization: Bearer <token>
 │
 ▼
Protected API Endpoints
```

---

## Protected Routes

The following endpoints require authentication.

| Module | Authentication Required |
|----------|------------------------|
| Current User | Yes |
| User Management | Yes |
| Notes | Yes |
| Update Notes | Yes |
| Delete Notes | Yes |
| Convert Note to Task | Yes |

Public endpoints include:

- Register
- Login
- Root endpoint
- Health endpoint

---

# JWT Flow

After successful authentication, the backend returns an access token.

Example response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "<jwt-token>",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "USER"
    }
  }
}
```

---

## Using the Token

Include the token in every authenticated request.

```
Authorization: Bearer <access_token>
```

Example:

```http
GET /api/v1/notes HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## JWT Lifecycle

```
Register User
      │
      ▼
Store Hashed Password
      │
      ▼
Login
      │
      ▼
Verify Password
      │
      ▼
Generate JWT
      │
      ▼
Return Access Token
      │
      ▼
Frontend Stores Token
      │
      ▼
Authenticated Requests
      │
      ▼
Protected Endpoints
```

---

# User Module

The User module is responsible for managing user accounts and authenticated user information.

## Responsibilities

- Register new users
- Authenticate users
- Retrieve authenticated user information
- Manage user profiles
- Support role-based authorization

---

## User Schema

A user consists of the following information.

| Field | Type |
|--------|------|
| id | Integer |
| email | String |
| hashed_password | String |
| role | String |
| is_active | Boolean |
| created_at | DateTime |
| updated_at | DateTime |

---

## User Features

- Secure password hashing
- Email validation
- JWT authentication
- Profile retrieval
- Role support
- Active account verification

---

# Notes Module

The Notes module provides complete CRUD functionality for personal notes.

Each authenticated user can manage only their own notes unless they have administrator privileges.

---

## Responsibilities

- Create notes
- Retrieve notes
- Search notes
- Update notes
- Delete notes
- Pagination
- Sorting
- Administrator access
- Convert notes into task payloads

---

## Note Schema

| Field | Type |
|--------|------|
| id | Integer |
| title | String |
| content | String |
| user_id | Integer |
| created_at | DateTime |
| updated_at | DateTime |

---

## Supported Operations

- Create
- Read
- Update
- Delete
- Search
- Pagination
- Sorting
- Note ownership validation
- Administrator access
- Note-to-task conversion

---

# API Documentation

The FastAPI backend automatically generates OpenAPI documentation for all available endpoints.

The documentation includes:

- Request schemas
- Response schemas
- Authentication support
- Validation rules
- HTTP status codes
- Interactive endpoint testing

---

## Swagger UI

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

Swagger UI allows you to:

- View all API endpoints
- Authenticate using JWT
- Execute API requests
- Inspect request bodies
- Inspect response models
- View validation errors
- Test APIs directly from the browser

---

## ReDoc

Alternative API documentation is available at:

```text
http://127.0.0.1:8000/redoc
```

ReDoc provides a clean, structured view of the API specification.

---

## OpenAPI Specification

The generated OpenAPI schema is available at:

```text
http://127.0.0.1:8000/openapi.json
```

This specification can be imported into tools such as:

- Postman
- Insomnia
- Swagger Editor
- API Gateway
- Code Generators

---

# API Endpoints

## Root Endpoints

| Method | Endpoint | Description | Authentication |
|----------|----------|-------------|----------------|
| GET | `/` | Application information | No |
| GET | `/health` | Health check | No |

---

## Authentication APIs

| Method | Endpoint | Description | Authentication |
|----------|----------|-------------|----------------|
| POST | `/api/v1/auth/register` | Register a new user | No |
| POST | `/api/v1/auth/login` | Authenticate user | No |
| GET | `/api/v1/auth/me` | Get current authenticated user | Yes |

---

## User APIs

| Method | Endpoint | Description | Authentication |
|----------|----------|-------------|----------------|
| GET | `/api/v1/users` | List users | Yes |
| GET | `/api/v1/users/me` | Current user profile | Yes |
| GET | `/api/v1/users/{user_id}` | Get user by ID | Yes |
| PUT | `/api/v1/users/{user_id}` | Update user | Yes |
| DELETE | `/api/v1/users/{user_id}` | Delete user | Yes |

---

## Notes APIs

| Method | Endpoint | Description | Authentication |
|----------|----------|-------------|----------------|
| POST | `/api/v1/notes` | Create note | Yes |
| GET | `/api/v1/notes` | List notes | Yes |
| GET | `/api/v1/notes/{note_id}` | Get note by ID | Yes |
| PUT | `/api/v1/notes/{note_id}` | Update note | Yes |
| DELETE | `/api/v1/notes/{note_id}` | Delete note | Yes |
| GET | `/api/v1/notes/admin/all` | List all notes (Admin) | Yes |
| POST | `/api/v1/notes/{note_id}/convert-to-task` | Convert note to task | Yes |

---

## HTTP Status Codes

| Status Code | Description |
|--------------|-------------|
| 200 | Request completed successfully |
| 201 | Resource created successfully |
| 202 | Request accepted |
| 204 | Resource deleted successfully |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Conflict |
| 422 | Validation error |
| 500 | Internal server error |

---

# Response Format

The API follows a consistent JSON response structure for successful operations.

## Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

---

## Login Response

```json
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "access_token": "<jwt-token>",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "role": "USER"
        }
    }
}
```

---

## Validation Error Response

```json
{
    "detail": [
        {
            "type": "string_too_short",
            "loc": [
                "body",
                "password"
            ],
            "msg": "String should have at least 8 characters.",
            "input": "123"
        }
    ]
}
```

---

## Unauthorized Response

```json
{
    "detail": "Could not validate credentials."
}
```

---

## Forbidden Response

```json
{
    "detail": "Admin access required."
}
```

---

## Resource Not Found

```json
{
    "detail": "Resource not found."
}
```

---

## Internal Server Error

```json
{
    "detail": "Internal server error."
}
```

---

# Error Handling

The FastAPI backend uses centralized exception handling to provide consistent error responses across all endpoints.

Global exception handlers are responsible for:

- Handling HTTP exceptions
- Validation errors
- Database exceptions
- Authentication failures
- Authorization failures
- Unexpected server errors

---

## Common Errors

| HTTP Status | Description |
|--------------|-------------|
| 400 | Invalid request or credentials |
| 401 | Missing or invalid JWT token |
| 403 | Insufficient permissions |
| 404 | Requested resource not found |
| 409 | Duplicate resource |
| 422 | Request validation failed |
| 500 | Unexpected server error |

---

## Validation Errors

Request validation is handled automatically using **Pydantic v2**.

Validation includes:

- Required fields
- Data types
- Email format
- Password length
- String constraints
- Numeric constraints
- Custom validators

---

## Authentication Errors

Protected endpoints automatically return appropriate responses when:

- Authorization header is missing
- JWT token is invalid
- JWT token has expired
- User account does not exist
- User account is inactive

---

## Database Errors

Database exceptions are handled centrally to prevent internal implementation details from being exposed.

Examples include:

- Connection failures
- Constraint violations
- Duplicate records
- Transaction failures

Appropriate HTTP status codes and user-friendly messages are returned while detailed errors are recorded in the application logs.

---

## Logging

All exceptions are logged through the centralized logging system to simplify debugging and production monitoring.

Logged information includes:

- Timestamp
- Request path
- HTTP method
- Response status
- Exception details
- Stack trace (development)

---

