# Diaspora Track

A responsive, mobile-first remittance expense tracker dashboard for people in the diaspora.

## Features

- Track money sent via remittance providers (Western Union, Remitly, MoneyGram, Wise, etc.)
- Compare received exchange rate against live market rate
- Track hidden fees and visualize spending
- Supabase authentication and database
- Live exchange rates via ExchangeRate-API
- Mobile-first responsive design

## Tech Stack

- **Frontend**: Angular 18+ (Standalone Components), Tailwind CSS, Angular Signals
- **Backend**: Supabase (PostgreSQL + Auth), Vercel Serverless Functions
- **Hosting**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Go to [Supabase Dashboard](https://supabase.com)
2. Open SQL Editor
3. Run the contents of `supabase/schema.sql`
4. This creates the `profiles` and `transactions` tables with Row Level Security

### 3. Environment Variables

The Supabase keys are already configured in `src/environments/environment.ts`.

For Vercel deployment, set:
- `EXCHANGE_RATE_API_KEY` in Vercel dashboard

### 4. Run Development Server

```bash
npm start
```

Navigate to `http://localhost:4200`

### 5. Deploy to Vercel

```bash
npm run build
```

Then connect your GitHub repo to Vercel.

## Database Schema

### Profiles Table
- Links to Supabase Auth users
- Stores preferred currency

### Transactions Table
- Main remittance ledger
- Stores: provider, amounts, rates, fees, categories
- Precision: NUMERIC(18,6) for all money values
- RLS enforced: users can only access their own data

## API Endpoints

### GET /api/rate

Get live exchange rates.

**Query Parameters:**
- `source`: Source currency code (e.g., CAD)
- `target`: Target currency code (e.g., NGN)

**Response:**
```json
{
  "conversion_rate": 1234.567890
}
```

## Architecture

- Standalone Angular components (no NgModules)
- Angular Signals for state management
- Reactive Forms for user inputs
- Row Level Security (RLS) on all tables
- Mobile-first design with bottom navigation

## License

MIT
