src/
│
├── app/
│   │
│   ├── page.tsx
│   │   → Public home page (landing)
│   │
│   ├── layout.tsx
│   │   → Root layout
│   │
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx
│   │
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   │   → PRIVATE owner dashboard
│   │   │
│   │   ├── loading.tsx
│   │   │
│   │   └── components/
│   │       ├── OwnerProfile.tsx
│   │       ├── RepoList.tsx
│   │       └── ConnectGithub.tsx
│   │
│   ├── u/
│   │   └── [username]/
│   │       ├── page.tsx
│   │       │   → PUBLIC profile page
│   │       │
│   │       ├── loading.tsx
│   │       └── components/
│   │           ├── PublicProfile.tsx
│   │           └── PublicRepoList.tsx
│   │
│   └── api/
│       │
│       ├── github/
│       │   ├── connect/
│       │   │   └── route.ts
│       │   │       → start GitHub OAuth linking
│       │   │
│       │   ├── refresh/
│       │   │   └── route.ts
│       │   │       → refresh repo snapshot
│       │   │
│       │   └── webhook/
│       │       └── route.ts
│       │       → (future) GitHub webhooks
│       │
│       └── profile/
│           └── update/
│               └── route.ts
│               → owner-only mutations
│
├── components/
│   ├── navbar/
│   │   └── Navbar.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Loader.tsx
│   │
│   └── shared/
│       ├── RepoCard.tsx
│       └── StatsGrid.tsx
│
├── lib/
│   │
│   ├── auth/
│   │   └── requireUser.ts
│   │       → reusable auth guard
│   │
│   ├── clerk/
│   │   └── github-token.ts
│   │       → fetch OAuth token from Clerk
│   │
│   ├── github/
│   │   ├── github-api.ts
│   │   │   → server GitHub fetch logic
│   │   ├── github-transform.ts
│   │   │   → compute stats
│   │   └── github-types.ts
│   │
│   ├── db/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   └── profile/
│       └── snapshot.ts
│           → create/update public profile cache
│
├── types/
│   ├── profile.ts
│   ├── repo.ts
│   └── api.ts
│
├── middleware.ts
│   → Clerk middleware (route protection)
│
└── styles/
    └── globals.css