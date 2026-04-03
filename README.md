# Precision CRM

A modern, high-performance Customer Relationship Management pipeline built for speed and clarity. 

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL via Neon
- **ORM:** Prisma
- **Authentication:** Auth.js (NextAuth)

## Local Development
```bash
npm install
npm run dev
```

## Environment Variables
Create a `.env` file in the root with:
```env
DATABASE_URL="your_postgres_connection_string"
AUTH_SECRET="your_32_character_secret"
```

## Features
- Deep dark-mode aesthetic with CSS glassmorphism.
- HTML5 Drag-and-Drop Sales Kanban Board.
- Support Ticketing Queue.
- Internal Task Assignments.
- Role-Based Access Control (Admin, Sales, Support).
