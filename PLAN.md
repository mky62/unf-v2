# Developer GitHub Dashboard

## Final System Documentation

```
v1.0 — Architecture · Schema · Data Flow · API
```
Component Technology

Frontend Next.js (App Router) + TypeScript

Authentication Clerk (GitHub OAuth only)

Database PostgreSQL via Prisma v

ORM Prisma (output: ../lib/prisma)

External API GitHub REST API (public repos only)

Hosting Vercel (recommended)


## 1. Product Overview

A web platform that lets developers create a branded public profile backed by their GitHub
repositories. Authentication is handled exclusively via Clerk + GitHub OAuth. Repository data is
fetched from GitHub and cached in PostgreSQL, so all public dashboard requests are served
from the database — no live GitHub API calls on page load.

### 1.1 Core Goals

- Secure GitHub login via Clerk
- Fetch and cache public GitHub repositories into PostgreSQL
- Serve a fast public dashboard from the database cache
- Allow custom developer identity (stage name, bio, social links)
- Separate owner view and public visitor view

### 1.2 Non-Goals (v1)

- Private repository access
- Real-time GitHub event streaming
- Multi-provider OAuth (Google, Twitter, etc.)
- Analytics or insights dashboard


## 2. User Personas

```
Persona Who What They Can Do
```
```
Owner Authenticated developer who logged
in via GitHub
```
```
View private dashboard, trigger sync,
edit profile, see all repos
Public Visitor Any unauthenticated user View public dashboard at /stageName,
see cached public repos only
```
## 3. System Architecture

### 3.1 High-Level Overview

```
The database is the single source of truth for the public dashboard. GitHub API is only
called during owner sync. Visitors never touch the GitHub API.
```
### 3.2 Private Flow (Owner)

- User logs in via Clerk + GitHub OAuth
- Clerk provides the GitHub OAuth token
- Backend checks if repos are stale (lastSyncedAt older than 10 minutes)
- If stale: fetch public repos from GitHub API → upsert into PostgreSQL
- Render dashboard from database

### 3.3 Public Flow (Visitor)

- Visitor hits /{stageName}
- Database lookup by stageName
- If user isPublic = true: fetch cached repos from DB
- Render response — no GitHub API call made

### 3.4 Project Folder Structure

```
app/
├── (auth)/
│ └── sign-in/
```

│ └── page.tsx ← Clerk login page

├── api/
│ ├── webhooks/
│ │ └── clerk/

│ │ └── route.ts ← Save user on Clerk signup
│ └── sync/
│ └── route.ts ← Manual sync trigger

├── dashboard/
│ └── page.tsx ← Owner private view
├── [stageName]/

│ └── page.tsx ← Public profile
└── middleware.ts ← Auth guard

lib/
├── prisma.ts ← Prisma client singleton

├── github.ts ← GitHub API fetch functions
└── sync.ts ← Repo sync logic

prisma/
└── schema.prisma ← Database schema


## 4. Database Schema

### 4.1 Final Schema

```
Prisma v7 is used. The output path is set to ../lib/prisma as required. Run 'npx prisma
migrate dev --name init' then 'npx prisma generate'.
```
#### Generator & Datasource

```
generator client {
provider = "prisma-client"
output = "../lib/prisma" // required in Prisma v
}
```
```
datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}
```
#### SyncStatus Enum

```
enum SyncStatus {
IDLE
SYNCING
SUCCESS
FAILED
}
```
#### User Model

```
model User {
id String @id // Clerk user ID
stageName String @unique // Platform username
username String @unique // GitHub login
avatarUrl String?
description String? // Optional bio
socialLinks Json? // { twitter, linkedin,
website }
isPublic Boolean @default(true)
lastSyncedAt DateTime?
syncStatus SyncStatus @default(IDLE)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

```
repos Repo[]
```
```
@@index([username])
@@index([stageName])
}
```
#### Repo Model

```
model Repo {
id String @id @default(cuid())
githubRepoId Int @unique // GitHub's own ID
userId String
user User @relation(
fields: [userId],
references: [id],
onDelete: Cascade
)
name String
fullName String // owner/name
description String?
language String?
stars Int @default(0)
forks Int @default(0)
isFork Boolean @default(false)
htmlUrl String
homepageUrl String?
isArchived Boolean @default(false)
cachedAt DateTime @default(now())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```
```
@@index([userId])
@@index([language])
@@unique([userId, name])
}
```
### 4.2 Relationships

One User has many Repos. The userId on Repo is a foreign key pointing to User.id (Clerk user
ID). Cascade delete means if a User is deleted, all their Repos are automatically deleted too.


Table Key Field Points To Behavior

Repo userId User.id onDelete: Cascade

Repo githubRepoId GitHub API Prevents duplicate
repos

Repo userId + name Unique constraint No duplicate repo
names per user


## 5. Authentication & Sync Logic

### 5.1 Clerk Webhook — Save User on Signup

When a user signs up via Clerk, a webhook fires to your backend. This is where you create the
User record in PostgreSQL.

```
// app/api/webhooks/clerk/route.ts
export async function POST(req: Request) {
const { type, data } = await req.json()
if (type === 'user.created') {
const github = data.external_accounts
.find((a: any) => a.provider === 'github')
await prisma.user.create({
data: {
id: data.id,
stageName: github.username, // default = GitHub username
username: github.username,
avatarUrl: data.image_url,
}
})
}
return new Response('OK', { status: 200 })
}
```
### 5.2 Repo Sync Function

Fetches public repos from GitHub API and upserts them into the database. Only runs when
lastSyncedAt is older than the TTL (10 minutes).

```
// lib/sync.ts
const SYNC_TTL = 10 * 60 * 1000 // 10 minutes
```
```
export async function syncRepos(userId: string) {
const user = await prisma.user.findUnique({ where: { id: userId } })
if (!user) return
```
```
const isStale = !user.lastSyncedAt ||
Date.now() - user.lastSyncedAt.getTime() > SYNC_TTL
if (!isStale) return
```
```
await prisma.user.update({
```

where: { id: userId },

data: { syncStatus: 'SYNCING' }
})

try {
const res = await fetch(

`https://api.github.com/users/${user.username}/repos?per_page=100`
)

const repos = await res.json()

await Promise.all(repos.map((repo: any) =>
prisma.repo.upsert({
where: { githubRepoId: repo.id },

update: {
name: repo.name, fullName: repo.full_name,
description: repo.description,

stars: repo.stargazers_count,
forks: repo.forks_count,
language: repo.language,

htmlUrl: repo.html_url,
isFork: repo.fork,
isArchived: repo.archived,

cachedAt: new Date()
},
create: {

githubRepoId: repo.id,
userId: user.id,
name: repo.name, fullName: repo.full_name,

description: repo.description,
stars: repo.stargazers_count,
forks: repo.forks_count,

language: repo.language,
htmlUrl: repo.html_url,
isFork: repo.fork,

isArchived: repo.archived,
}
})

))

await prisma.user.update({
where: { id: userId },
data: { syncStatus: 'SUCCESS', lastSyncedAt: new Date() }

})
} catch (e) {


await prisma.user.update({

where: { id: userId },
data: { syncStatus: 'FAILED' }
})

}
}


## 6. Routes & Pages

### 6.1 Middleware — Auth Guard

```
// middleware.ts
import { authMiddleware } from '@clerk/nextjs'
```
```
export default authMiddleware({
publicRoutes: ['/:stageName', '/sign-in']
})
```
### 6.2 Public Dashboard — /[stageName]

```
// app/[stageName]/page.tsx
import { currentUser } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { syncRepos } from '@/lib/sync'
```
```
export default async function ProfilePage({ params }) {
const clerkUser = await currentUser()
const isOwner = clerkUser?.username === params.stageName
```
```
const user = await prisma.user.findUnique({
where: { stageName: params.stageName },
include: { repos: true }
})
```
```
if (!user || !user.isPublic) return <div>Not found</div>
```
```
// Only owner triggers sync
if (isOwner) await syncRepos(user.id)
```
```
return isOwner
? <PrivateDashboard user={user} />
: <PublicProfile user={user} />
}
```
### 6.3 Route Summary

```
Route Who Can Access GitHub API
Called?
```
```
Purpose
```
```
/sign-in Everyone No Clerk login page
```

Route Who Can Access GitHub API
Called?

```
Purpose
```
/dashboard Owner only No Redirect to /stageName

/[stageName] Everyone Only if owner +
stale

```
Main profile page
```
/api/webhooks/clerk Clerk only No Save user on signup

/api/sync Owner only Yes Manual sync trigger


## 7. Environment Variables

```
# .env
```
```
# Prisma / PostgreSQL
DATABASE_URL="your-postgres-connection-string"
```
```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."
```
```
# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
## 8. Migration Plan

### Step 1 — Initial Migration

```
npx prisma migrate dev --name init
npx prisma generate
```
### Step 2 — Verify

```
npx prisma studio // opens visual DB browser
```
## 9. Risks & Mitigations

```
Risk Mitigation
```
```
GitHub rate limiting Cache layer + TTL-based sync (10 min)
Repo renamed on GitHub Use githubRepoId (Int) not name as unique key
```
```
Username changed on GitHub Store both Clerk ID and GitHub login separately
Sync failure SyncStatus enum tracks FAILED state, retry on next visit
```
```
Concurrent sync collisions Check syncStatus === SYNCING before starting
```
```
User not found on public route Graceful 404 if stageName not in DB or isPublic = false
```

## 10. Setup Checklist

- Create GitHub OAuth App in GitHub Developer Settings
- Configure Clerk with GitHub as the only provider
- Set up Clerk webhook pointing to /api/webhooks/clerk
- Create PostgreSQL database (Neon, Railway, or Supabase)
- Add all environment variables to .env
- Run npx prisma migrate dev --name init
- Run npx prisma generate
- Deploy to Vercel and set env vars in dashboard

```
Developer GitHub Dashboard — System Documentation v1.
```

