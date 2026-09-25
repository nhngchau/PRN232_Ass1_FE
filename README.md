# TaskTrack Frontend

Next.js App Router frontend for PRN232 Assignment 1. It uses TypeScript, Tailwind CSS, a centralized Fetch API client, public pages, search, and CRUD management pages.

## Prerequisites

- Node.js
- npm
- Running TaskTrack backend API

## Setup

```bash
npm install
```

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Do not commit `.env.local`.

## Run

```bash
npm run dev
npm run build
npm run lint
```

## Pages

- `/`
- `/departments`
- `/departments/[id]`
- `/projects/[id]`
- `/tasks/[id]`
- `/search`
- `/departments/manage`
- `/projects/manage`
- `/tasks/manage`
- `/tags/manage`

## Vercel Deployment

1. Import `StudentID_ClassCode_Ass1_FE` into Vercel.
2. Set `NEXT_PUBLIC_API_URL` to the deployed Render backend URL.
3. Deploy with the default Next.js settings.

## Naming Note

The folder still uses `StudentID_ClassCode`. Replace it with your actual student ID and class code before submission if required.
