# ApniSec - Secure Issue Management System

> **⚠️ Email Service Restriction**: Due to Resend's policy, only **202251045@iiitvadodara.ac.in** is eligible for email notifications.

![ApniSec SEO Preview](./public/seo.png)

## Overview

ApniSec is a modern, secure issue management system built with Next.js 15, featuring JWT-based authentication, real-time notifications, and asynchronous email processing.

## Key Features

- **Secure Authentication**: JWT-based auth with refresh token rotation and Redis-backed rate limiting
- **Email Notifications**: Asynchronous email delivery via RabbitMQ and Resend API
- **Issue Management**: Create, track, and manage issues with priority and status workflows
- **Performance**: Server-side rendering, optimized database queries with Prisma
- **Modern UI**: Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Refresh Tokens
- **Caching**: Upstash Redis
- **Message Queue**: RabbitMQ (via amqplib)
- **Email**: Resend API
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Implementation Approach

### Authentication System
- Implemented dual-token JWT strategy with access and refresh tokens
- Refresh tokens stored in PostgreSQL with automatic cleanup
- IP-based tracking for security audit trails
- Bcrypt password hashing with salt rounds

### Email Service
- Decoupled email sending using RabbitMQ message queue
- Consumer service processes emails asynchronously
- HTML email templates for welcome, issue creation, and notifications
- Graceful fallback handling for email failures

### Database Design
- Normalized schema with User, RefreshToken, and Issue models
- Cascade delete for maintaining referential integrity
- UUID primary keys for enhanced security
- Indexed fields for optimized query performance

## Challenges & Solutions

### 1. **Turbopack Crashes on Registration**
**Challenge**: Next.js dev server crashed during user registration due to RabbitMQ initialization in serverless functions.

**Solution**: Moved queue consumer initialization to Next.js instrumentation hook, ensuring it runs once during server startup rather than on each API request.

### 2. **Email Service Rate Limiting**
**Challenge**: Resend's restrictive policy for unverified domains.

**Solution**: Configured whitelist for authorized email address and implemented fallback logging for development environments.

## Setup Instructions

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL database
- RabbitMQ instance
- Resend API key
- Upstash Redis instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kaustubhduse/apnisec-assignment
   cd apnisec
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=
   JWT_SECRET=
   RESEND_API_KEY=
   NEXT_PUBLIC_API_URL=http://localhost:3000
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=
   RABBITMQ_URL=
   EMAIL_FROM_WELCOME=
   EMAIL_FROM_ALERTS=
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
apnisec/
├── app/
│   ├── api/          # API routes (auth, issues)
│   ├── components/   # Reusable UI components
│   ├── dashboard/    # Dashboard pages
│   ├── login/        # Login page
│   ├── register/     # Registration page
│   └── profile/      # User profile
├── lib/
│   ├── services/     # Business logic (AuthService, IssueService)
│   ├── repositories/ # Database access layer
│   ├── queue/        # RabbitMQ setup and consumers
│   ├── email-templates/ # HTML email templates
│   └── utils/        # Utility functions
├── prisma/
│   └── schema.prisma # Database schema
└── public/           # Static assets
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/issues` - Create issue
- `GET /api/issues` - List issues
