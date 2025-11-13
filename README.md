# Dottin and AI - Position Selector App

質問に対する意見の位置を選択し、統計データを集計・表示するアプリケーションです。

## Features

- 質問に対する回答を0-100のスケールで選択
- 回答データをローカルストレージとNeon DBに保存
- 質問ごとの統計データを可視化（平均値、中央値、分布、ヒストグラム）
- ダークモード対応

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: Neon DB (PostgreSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Neon Database

1. Create a new project at [Neon Console](https://console.neon.tech)
2. Copy your database connection string
3. Create `.env.local` file:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your database URL:

```
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### 3. Run Database Migrations

```bash
npx drizzle-kit push
```

This will create the necessary tables in your Neon database.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Schema

### `responses` table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| question_id | VARCHAR(255) | Question identifier |
| position_value | INTEGER | Response value (0-100) |
| session_id | VARCHAR(255) | Optional session identifier |
| user_agent | TEXT | User agent string |
| created_at | TIMESTAMP | Response timestamp |

## API Endpoints

### POST /api/responses
Save a user response to the database.

**Request Body:**
```json
{
  "questionId": "string",
  "value": number (0-100),
  "sessionId": "string (optional)"
}
```

### GET /api/stats
Get overall statistics for all questions.

**Response:**
```json
{
  "totalResponses": number,
  "questions": [
    {
      "questionId": "string",
      "responseCount": number,
      "average": number
    }
  ]
}
```

### GET /api/stats/[questionId]
Get detailed statistics for a specific question.

**Response:**
```json
{
  "questionId": "string",
  "totalResponses": number,
  "average": number,
  "median": number,
  "distribution": {
    "0-20": number,
    "21-40": number,
    "41-60": number,
    "61-80": number,
    "81-100": number
  },
  "histogram": [
    { "value": number, "count": number }
  ]
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── responses/      # Response save endpoint
│   │   └── stats/          # Statistics endpoints
│   ├── question/[id]/      # Question detail page
│   └── page.tsx            # Home page
├── components/
│   ├── position-area.tsx   # Position selector UI
│   ├── question-detail.tsx # Question detail component
│   ├── question-stats.tsx  # Statistics visualization
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── db/
│   │   ├── client.ts       # Database client
│   │   ├── schema.ts       # Drizzle schema
│   │   └── queries.ts      # Database queries
│   ├── storage.ts          # LocalStorage utilities
│   └── questions.ts        # Question data
└── types/
    ├── question.ts         # Question types
    └── stats.ts            # Statistics types
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Biome

## Deploy on Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com).

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your `DATABASE_URL` environment variable
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
