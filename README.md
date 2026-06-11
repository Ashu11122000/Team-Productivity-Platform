# Team Productivity Platform

## Project Overview

Team Productivity Platform is a modern full-stack productivity application designed to help individuals and teams organize work efficiently through notes, tasks, categories, tags, notifications, analytics, and activity tracking.

The application combines the flexibility of note-taking tools like Notion with the task management capabilities of Todoist, providing a unified workspace where users can capture ideas, manage tasks, track progress, and analyze productivity.

The system follows a microservices-inspired architecture where FastAPI and NestJS work together behind a single Next.js frontend, demonstrating seamless integration between multiple backend services with a common authentication system.

---

# Problem Statement

Modern teams often use separate tools for note-taking, task management, reminders, and productivity tracking. This creates fragmented workflows and reduces productivity.

The goal of this project is to provide a centralized platform where users can:

* Create and manage notes
* Convert notes into actionable tasks
* Organize work using categories and tags
* Receive notifications and reminders
* Track productivity through analytics
* View activity history
* Discover relevant books while taking learning notes
* Plan tasks more effectively using public holiday information

The platform aims to improve productivity by connecting knowledge management and task management within a single application.

---

# Key Features

## Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Role-Based Access Control (RBAC)
* Common Authentication Across Services

### Roles

#### Admin

* View all users
* View system analytics
* Access all notes and tasks

#### Member

* Manage own notes
* Manage own tasks
* View personal analytics

---

# Notes Management

Users can:

* Create Notes
* Edit Notes
* Delete Notes
* Search Notes
* Filter Notes
* Add Tags
* Add Categories

### Open Library Integration

Users can attach book references directly inside notes.

Example:

Learning React Note

Recommended Books:

* React Explained
* Learning React
* JavaScript: The Definitive Guide

This feature uses the Open Library API.

---

# Task Management

Users can:

* Create Tasks
* Assign Due Dates
* Set Priority
* Update Status
* Delete Tasks

### Task Status

* Not Started
* In Progress
* Completed

### Drag & Drop Kanban Board

Tasks can be moved between columns:

TODO → IN PROGRESS → DONE

using drag-and-drop interaction.

---

# Notes to Task Conversion

A note can generate one or more tasks.

Example:

Note:

Launch New Product

* Create Landing Page
* Develop APIs
* Deploy Application

Convert to:

Task 1 → Create Landing Page

Task 2 → Develop APIs

Task 3 → Deploy Application

This creates a direct relationship between Notes and Tasks.

---

# Categories

Used for organizing work.

Examples:

* Development
* Research
* Learning
* Meetings
* Operations

---

# Tags

Used for quick filtering.

Examples:

* Frontend
* Backend
* API
* Urgent
* Bug
* Feature

---

# Notifications

Users receive notifications for:

* Task Due Soon
* Task Completed
* New Task Created
* Note Updated

---

# Activity Logs

Every important action is recorded.

Examples:

* User created note
* User updated task
* User completed task
* User deleted note

This helps users track activity history.

---

# Analytics Dashboard

The dashboard provides productivity insights.

Metrics:

* Total Notes
* Total Tasks
* Completed Tasks
* Pending Tasks
* Tasks by Category
* Monthly Activity

Charts:

* Bar Charts
* Line Charts
* Pie Charts

---

# Public Holidays API Integration

The platform integrates with a Public Holidays API.

Benefits:

* Display upcoming holidays
* Avoid scheduling deadlines on holidays
* Improve sprint planning
* Better task scheduling

Example:

Task Due Date:
15 August

System Alert:
"Selected date is a public holiday."

---

# Architecture

Frontend communicates with two backend services:

Frontend (Next.js)
|
|
+----> FastAPI
|         |
|         +-- Authentication
|         +-- Notes
|
+----> NestJS
|
+-- Tasks
+-- Categories
+-- Tags
+-- Notifications
+-- Analytics
+-- Activity Logs

Both services share the same JWT authentication system.

---

# API Ownership

## FastAPI Service

Authentication Module

* POST /auth/register
* POST /auth/login
* GET /auth/me

Notes Module

* POST /notes
* GET /notes
* GET /notes/:id
* PUT /notes/:id
* DELETE /notes/:id

---

## NestJS Service

Tasks

* POST /tasks
* GET /tasks
* GET /tasks/:id
* PUT /tasks/:id
* DELETE /tasks/:id

Categories

* POST /categories
* GET /categories

Tags

* POST /tags
* GET /tags

Notifications

* GET /notifications
* PUT /notifications/:id/read

Analytics

* GET /analytics/dashboard

Activity Logs

* GET /activity-logs

---

# Authentication Flow

1. User logs in through FastAPI.
2. FastAPI generates JWT token.
3. Frontend stores JWT securely.
4. Frontend sends JWT to both FastAPI and NestJS.
5. Both services validate the same JWT.
6. User accesses all modules without logging in again.

This provides a Single Login Experience.

---

# Advanced Features

## Role-Based UI

UI changes based on user role.

Admin Dashboard:

* User Analytics
* System Reports
* Global Activity Logs

Member Dashboard:

* Personal Notes
* Personal Tasks
* Personal Analytics

---

## Google Analytics

Tracks:

* Page Views
* Dashboard Visits
* Note Creation
* Task Creation
* User Engagement

---

## Responsive Design

Supports:

* Desktop
* Tablet
* Mobile

---

## UI Animations

Tailwind CSS animations for:

* Cards
* Modals
* Notifications
* Page Transitions

---

# Expected Outcome

The Team Productivity Platform demonstrates:

* Full-Stack Development
* Microservice Integration
* Authentication Across Services
* Modern React & Next.js Development
* FastAPI Development
* NestJS Development
* Database Design
* Analytics & Tracking
* Third-Party API Integration
* Production-Ready Architecture

The final result is a scalable productivity platform that combines note management, task management, analytics, and collaboration features into a single modern application.
