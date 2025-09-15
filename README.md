AI-powered Mental Health Companion Platform

A full-stack platform that helps users track daily moods, journal experiences, and interact with a context-aware AI chatbot. Includes analytics dashboards, personalized insights, and scalable backend services.

> ⚡️ Available in two backend versions: REST API and GraphQL.




---

Table of Contents

Features

Tech Stack

Architecture

Setup & Run

Environment Variables

Key Achievements



---

Features

Frontend (Next.js PWA + React Query)

Daily mood tracking using scales, emojis, and categories with streak consistency monitoring

Journaling system supporting text, tags, and optional media attachments

Real-time AI chatbot for personalized conversational support

Analytics dashboard for mood trends, journaling frequency, and triggers

Real-time updates using WebSockets for chat and notifications

Reusable UI components: charts, forms, notifications, and modals


Backend (NestJS + REST/GraphQL + PostgreSQL + Drizzle ORM)

Two versions available:

REST API for simpler integrations

GraphQL API for flexible querying and modern client apps


Modular service architecture for AI, notifications, and analytics

User management and authentication with role-based access control

Context-aware AI leveraging OpenAI/Gemini API and vector embeddings

Database schema for moods, journals, AI conversations, and analytics

Zod-based input validation and structured error handling


DevOps & Infrastructure

Neon serverless PostgreSQL for low-latency, scalable storage

WebSocket pooling for real-time chat and notifications

Middleware for logging, monitoring, and request tracing

Containerized deployment ready for production



---

Tech Stack

Frontend: Next.js (PWA), React Query, Tailwind CSS

Backend: NestJS (REST + GraphQL versions), TypeScript, Drizzle ORM, Zod

Database: PostgreSQL (Neon serverless)

AI Integration: OpenAI/Gemini API, Vector Embeddings

Real-time: WebSockets

DevOps: Docker, Logging & Monitoring

