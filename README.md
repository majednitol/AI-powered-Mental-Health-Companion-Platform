
```markdown
# AI-powered Mental Health Companion Platform

A full-stack platform that helps users track daily moods, journal experiences, and interact with a context-aware AI chatbot. Includes analytics dashboards, personalized insights, and scalable backend services.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture](#architecture)  
- [Setup & Run](#setup--run)  
- [Environment Variables](#environment-variables)  
- [Key Achievements](#key-achievements)  

---

## Features

### Frontend (Next.js PWA + React Query)
- **Daily mood tracking** using scales, emojis, and categories with streak consistency monitoring  
- **Journaling system** supporting text, tags, and optional media attachments  
- **Real-time AI chatbot** for personalized conversational support  
- **Analytics dashboard** for mood trends, journaling frequency, and triggers  
- **Real-time updates** using WebSockets for chat and notifications  
- Reusable **UI components**: charts, forms, notifications, and modals  

### Backend (NestJS + GraphQL + PostgreSQL + Drizzle ORM)
- **Modular service architecture** for AI, notifications, and analytics  
- **GraphQL APIs** for mood tracking, journaling, and AI interactions  
- **User management and authentication** with role-based access control  
- **Context-aware AI** leveraging OpenAI/Gemini API and vector embeddings  
- **Database schema** for moods, journals, AI conversations, and analytics  
- **Zod-based input validation** and structured error handling  

### DevOps & Infrastructure
- **Neon serverless PostgreSQL** for low-latency, scalable storage  
- **WebSocket pooling** for real-time chat and notifications  
- Middleware for **logging, monitoring, and request tracing**  
- Containerized deployment ready for production  

---

## Tech Stack

- **Frontend:** Next.js (PWA), React Query, Tailwind CSS  
- **Backend:** NestJS, GraphQL, TypeScript, Drizzle ORM, Zod  
- **Database:** PostgreSQL (Neon serverless)  
- **AI Integration:** OpenAI/Gemini API, Vector Embeddings  
- **Real-time:** WebSockets  
- **DevOps:** Docker, Logging & Monitoring  

---

## Architecture

```

User (Browser / Mobile PWA)
|
v
Next.js Frontend <--> NestJS GraphQL API
\|                     |
v                     v
React Query & WebSockets   PostgreSQL (Neon)
|
v
Mood & Journal Data
|
v
AI Chatbot & Analytics Services

````

---

## Setup & Run

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-mental-health-companion.git
cd ai-mental-health-companion
````

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the backend folder:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
SESSION_SECRET=your-session-secret
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Run the Application

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd ../frontend
npm run dev
```

Access the platform at `http://localhost:3000`

---

## Key Achievements

* Delivered **production-ready PWA** for mental health tracking and AI chat support
* Implemented **context-aware AI recommendations** using past journals and mood trends
* Enabled **real-time chat and notifications** with WebSocket integration
* Built **scalable modular backend** supporting AI, analytics, and notifications services

---

## License

MIT License


