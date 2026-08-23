# BlockForm

> A production-style form builder SaaS focused on fast form creation and distinctive respondent experiences.

BlockForm is a Typeform-inspired form builder built as a full-stack TypeScript monorepo. Instead of treating forms as plain collections of inputs, BlockForm focuses on a **block-based builder**, **custom respondent themes**, and a foundation for visual workflows and reusable templates.

## ✨ Features

### Form Builder
- Block-based form creation
- Click to add fields
- Inline field editing
- Drag-and-drop field reordering
- Required/optional fields
- Field configuration
- Form preview
- Public form publishing
- Response collection

### Currently Supported Fields
- Text
- Email
- Number
- Dropdown
- Checkbox

### Authentication
- Custom authentication system
- Email/password registration and login
- JWT-based authentication
- HTTP-only authentication cookie
- Protected dashboard and creator operations
- GitHub OAuth
- OAuth identities linked through a generic account model

> BlockForm uses its own authentication implementation and does **not** use Better Auth.

### Respondent Experience
BlockForm separates the form's underlying data from how it is presented to respondents.

Planned/implemented theme directions include:
- Overworld-inspired
- Nether-inspired
- Professional
- College/Festival

Themes are designed as different respondent experiences rather than simple color presets.

### Form Layouts
The architecture supports multiple respondent presentation styles:

- **Journey** — one question at a time
- **Build Sheet** — all fields on one page

Theme and layout are intentionally separate concepts.

### Workflow Builder
A visual workflow mode is being developed alongside the normal content builder.

The same form schema is used by both modes:

```text
                 FORM
                  │
          ┌───────┴───────┐
          │               │
     Content Mode    Workflow Mode
          │               │
          └───────┬───────┘
                  │
          Public Renderer
```

Workflow positions are separate from respondent field order so moving a node visually does not automatically change the order of questions.

### Templates
The project is designed to support reusable seeded templates such as:
- College Fest Registration
- Workshop Registration
- Hackathon Registration
- Customer Feedback
- Job Application
- User Research

A template is cloned into a user's account rather than modified directly.

---

## 🏗️ Architecture

BlockForm is organized as a Turborepo monorepo.

```text
BlockForm
│
├── apps
│   ├── web
│   │   └── Next.js frontend
│   │
│   └── api
│       └── Express + tRPC + OpenAPI server
│
├── packages
│   ├── database
│   │   └── Drizzle ORM + PostgreSQL
│   │
│   ├── services
│   │   └── Business logic
│   │
│   ├── trpc
│   │   └── tRPC procedures/routes
│   │
│   ├── logger
│   │   └── Shared logging
│   │
│   ├── eslint-config
│   └── typescript-config
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### Request flow

```text
Next.js UI
    │
    ▼
Frontend API Hook
    │
    ▼
tRPC
    │
    ▼
Service Layer
    │
    ▼
Drizzle ORM
    │
    ▼
PostgreSQL
```

This separation keeps UI, API procedures, business logic, and database access independent.

---

## 🔐 Authentication Architecture

BlockForm uses a custom JWT-based authentication system.

### Email/password flow

```text
Register / Login
       │
       ▼
   tRPC Auth
       │
       ▼
   UserService
       │
       ├── password hashing
       └── JWT creation
       │
       ▼
 HTTP-only Cookie
       │
       ▼
 authenticatedProcedure
       │
       ▼
     ctx.user
```

Authentication tokens are stored in an HTTP-only cookie named:

```text
authentication-token
```

Protected tRPC procedures verify the JWT before injecting the authenticated user into the request context.

### GitHub OAuth

GitHub OAuth follows the existing authentication system rather than introducing another auth framework.

```text
BlockForm
   │
   ▼
GitHub Authorization
   │
   ▼
OAuth Callback
   │
   ▼
Verify GitHub Identity
   │
   ▼
Find/Create User
   │
   ▼
Create BlockForm JWT Session
   │
   ▼
Authentication Cookie
```

OAuth identities are represented through an `accounts` table using:

```text
provider + providerAccountId
```

This allows one BlockForm user to eventually have multiple authentication providers.

---

## 🎨 Theme Architecture

Themes are predefined application-level configurations.

The database stores the selected theme identifier rather than an entire theme definition.

Conceptually:

```text
Form
├── metadata
├── settings
├── theme
└── fields
```

For example:

```text
theme = "nether"
```

The frontend resolves that identifier through its theme registry.

This avoids introducing a separate themes table until custom/community themes are actually required.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Package Manager | pnpm |
| Frontend | Next.js |
| UI | React + Tailwind CSS |
| API | Express.js |
| RPC | tRPC |
| Validation | Zod |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| API Documentation | Scalar + OpenAPI |
| Authentication | Custom JWT authentication |
| OAuth | GitHub OAuth |
| API Hosting | Render |
| Frontend Hosting | Vercel |
| Database Hosting | Neon |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Node.js
- pnpm
- PostgreSQL or a hosted PostgreSQL database

Clone the repository:

```bash
git clone <your-repository-url>
cd blockForm
```

Install dependencies:

```bash
pnpm install
```

---

## ⚙️ Environment Variables

Create the required environment files based on the existing environment schemas in the project.

Typical local configuration includes:

```env
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000/trpc
DATABASE_URL=<your-postgresql-url>
JWT_SECRET=<your-secret>
```

For GitHub OAuth:

```env
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
GITHUB_CALLBACK_URL=http://localhost:4000/api/auth/github/callback
```

Do **not** commit `.env` files or OAuth secrets to Git.

For production, replace localhost URLs with the deployed API/frontend URLs.

---

## 🗄️ Database

Generate Drizzle migrations:

```bash
pnpm db:generate
```

Apply migrations:

```bash
pnpm db:migrate
```

The database schema is maintained through Drizzle.

For production, use a separate PostgreSQL database from local development.

---

## 💻 Development

Start the development environment:

```bash
pnpm dev
```

The frontend runs on the Next.js development server and the API runs separately.

Typical local setup:

```text
Frontend
http://localhost:3000

API
http://localhost:4000
```

---

## 🏭 Production Build

Build the monorepo:

```bash
pnpm build
```

The API is compiled with `tsup`:

```text
apps/api
    ↓
tsup
    ↓
apps/api/dist/index.js
```

The frontend is built using Next.js:

```text
apps/web
    ↓
next build
    ↓
.next
```

---

## 📚 API Documentation

The API server exposes OpenAPI documentation through Scalar.

When the API is running locally:

```text
http://localhost:4000/docs
```

The generated OpenAPI specification is available at:

```text
http://localhost:4000/openapi.json
```

tRPC requests are served under:

```text
http://localhost:4000/trpc
```

---

## ☁️ Deployment

The current deployment architecture separates the frontend, API, and database:

```text
                    ┌──────────────┐
                    │    Vercel    │
                    │   Next.js    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Render    │
                    │ Express/tRPC │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     Neon     │
                    │ PostgreSQL   │
                    └──────────────┘
```

### Frontend

The `apps/web` application is deployed to Vercel.

Set:

```env
NEXT_PUBLIC_API_URL=https://<your-api-domain>/trpc
```

### API

The `apps/api` application is deployed as a Node web service.

The API build bundles internal `@repo/*` workspace packages using `tsup`.

### Database

Production PostgreSQL is hosted separately from local development.

Run production migrations against the production database before relying on the deployed API.

---

## 🔗 OAuth Production Configuration

The GitHub OAuth application's callback URL must exactly match the callback URL used by the API.

Example:

```text
https://<your-api-domain>/api/auth/github/callback
```

The frontend URL and API callback URL are intentionally different:

```text
Frontend:
https://<your-web-domain>

OAuth callback:
https://<your-api-domain>/api/auth/github/callback
```

---

## 📁 Development Philosophy

BlockForm is intentionally being developed incrementally rather than as a single generated application.

The preferred feature flow is:

```text
DATABASE
   ↓
SERVICE
   ↓
tRPC PROCEDURE
   ↓
API HOOK
   ↓
UI
```

The project aims to:
- Keep business logic in services
- Keep tRPC procedures thin
- Keep frontend API hooks separate from UI
- Reuse the existing form schema across builder modes and respondent rendering
- Avoid unnecessary abstractions
- Prefer small vertical slices over large rewrites

---

## 🗺️ Roadmap

### Core
- [x] Authentication
- [x] Protected dashboard
- [x] Form creation
- [x] Dynamic form fields
- [x] Public forms
- [x] Public submissions
- [x] Response management
- [x] GitHub OAuth
- [ ] Google OAuth
- [ ] Apple OAuth

### Builder
- [x] Content mode
- [x] Block-based field creation
- [x] Drag-and-drop ordering
- [ ] Workflow mode
- [ ] Conditional logic
- [ ] Additional field types

### Themes
- [ ] Overworld
- [ ] Nether
- [ ] Professional
- [ ] College/Festival
- [ ] Theme persistence and picker refinement

### Templates & Discovery
- [ ] Template gallery
- [ ] Template cloning
- [ ] Explore page
- [ ] Public/unlisted visibility

### Advanced
- [ ] Analytics
- [ ] Email flows
- [ ] CSV export
- [ ] QR sharing
- [ ] Custom slugs
- [ ] Password-protected forms
- [ ] Form expiry
- [ ] Response limits
- [ ] Form cloning/archive
- [ ] API improvements

---

## 🎯 Project Vision

BlockForm is not intended to be:

> "Google Forms with Minecraft colors."

The goal is to combine:

```text
Fast Form Building
        +
Reusable Templates
        +
Distinctive Themes
        +
Interactive Respondent Experiences
```

The underlying form model stays consistent while the experience around it can change dramatically.

A professional business survey, a college festival registration, and an immersive themed questionnaire should all be powered by the same BlockForm form engine.

---

## 📄 License

Add your preferred license here.
