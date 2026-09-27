# SYNERGIA 🚀

> **AI-Powered Team Matchmaker & Collaborative Project Coaching Platform**

SYNERGIA is an educational collaboration platform designed to eliminate friction in student group projects. By analyzing individual skillsets, interests, and preferred roles against project requirements, SYNERGIA automatically generates balanced teams and provides continuous AI coaching through weekly check-in monitoring.

---

## 🌟 Key Features

- **🧠 Intelligent AI Matchmaker**: Analyzes student skills, learning goals, and desired roles to compose balanced teams with explicit, objective formation reasoning.
- **⚡ Project Kickstart Generator**: Automatically generates role-specific starter tasks from project requirements.
- **📊 Interactive Kanban Boards**: Real-time task progress tracking (`TODO`, `DOING`, `DONE`) with role assignments.
- **💬 Weekly Check-Ins & AI Coaching**: Monitors student progress, hours spent, and blockers with automated, actionable coaching feedback.
- **🛡️ Role-Based Access Control**: Tailored workflows and dashboards for both **Teachers** and **Students**.
- **📋 Legal Compliance**: Fully compliant with built-in Privacy Policy, Terms of Service, and Cookie Policy.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/) with JWT session strategy & role-based access
- **Database**: [Google Cloud Firestore / Firebase SDK](https://firebase.google.com/)
- **AI Engine**: [Google Gen AI SDK (`@google/genai`)](https://www.npmjs.com/package/@google/genai) powered by `gemini-2.5-flash`
- **Security**: `bcryptjs` password hashing

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18.17+ or v20+)
- [pnpm](https://pnpm.io/) (v9+)

### 2. Clone and Install Dependencies

```bash
git clone https://github.com/OmChavan-21/SYNERGIA-NEW.git
cd SYNERGIA-NEW
pnpm install
```

### 3. Environment Variables Configuration

Copy `.env.example` to `.env` and configure your credentials:

```bash
cp .env.example .env
```

Required environment variables:

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"

# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key"

# Firebase Configuration
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="your-firebase-admin-email"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Client Firebase Configuration (Optional)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 4. Seed Demo Data (Optional)

To populate sample teachers, students, projects, and cohorts:

```bash
pnpm seed
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
synergia/
├── src/
│   ├── app/                    # Next.js App Router (pages, layouts, API routes)
│   │   ├── (legal)/            # Terms, Privacy, and Cookie policy pages
│   │   ├── api/                # API Route Handlers (auth, matchmaker, tasks, projects)
│   │   ├── dashboard/          # Student and Teacher dashboards
│   │   ├── login/ & signup/    # Authentication portals
│   │   └── page.tsx            # Marketing landing page
│   ├── components/             # Reusable UI & layout components
│   │   ├── layout/             # Navbar, Footer
│   │   └── ui/                 # Button, Card, Badge, Input, Select, etc.
│   ├── lib/                    # Shared libraries (Firebase, Firestore abstraction, AI prompts)
│   └── types/                  # TypeScript interfaces and declarations
├── scripts/                    # Database seeding scripts
├── public/                     # Static assets
└── package.json
```

---

## 📄 License

This project is licensed under the MIT License.
