# Kantong

Personal finance tracker for iOS and Android. Built with Expo (SDK 58), Expo Router, TypeScript, React Query, Zustand and Supabase (Postgres with RLS, Google OAuth).

## Setup

1. **Install dependencies.** Run `npm install`.
2. **Create a Supabase project and apply the migrations:**
   ```sh
   npx supabase login
   npx supabase link --project-ref <REF>
   npx supabase db push
   ```
3. **Regenerate the database types:**
   ```sh
   npx supabase gen types typescript --project-id <REF> > src/types/database.types.ts
   ```
4. **Set up Google OAuth:**
   - In Google Cloud Console, create an OAuth **Web** client. Its only authorized redirect URI is `https://<REF>.supabase.co/auth/v1/callback`.
   - In Supabase, go to Auth → Providers → Google and paste the client ID and secret.
   - In Supabase, go to Auth → URL Configuration → Redirect URLs and add `kantong://google-auth`. For Expo Go, also add `exp://**`.
5. **Create `.env.local`** with:
   ```sh
   EXPO_PUBLIC_SUPABASE_URL=https://<REF>.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key from Project Settings → API>
   ```
6. **Start the app.** Run `npx expo start`.

The app uses native modules (secure store, date picker), so a development build is recommended over Expo Go:

```sh
npx eas-cli@latest build --profile development
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm test` | Unit tests for the date and amount helpers |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `expo lint` |

## Differences from blueprint v2

- **Month ranges** are half-open `[1st, 1st of next month)`. The blueprint's `-31` end date fails for shorter months.
- **OAuth** uses PKCE (`flowType: 'pkce'`) so the redirect returns a `code` to exchange for a session.
- **Session storage** is split into chunks across SecureStore keys, because a Supabase session can exceed SecureStore's ~2 KB limit.
- **Edge Functions** are replaced by Postgres functions (`get_period_summary`, `get_category_breakdown`, `get_balance`). They run as the calling user (`security invoker`), so RLS still applies.
- **Cached data** for transactions, summary, breakdown and balance shares a `['finance']` query-key prefix. Every create, update or delete refreshes all of it.
- **RLS:**
  - Policies use `(select auth.uid())` and apply only to signed-in users (`to authenticated`).
  - A transaction can only reference a category the user can see.
  - Deleting a user category sets its transactions to uncategorized.
- **Dependencies dropped:**
  - react-native-paper: the floating add button is a small built-in component.
  - victory-native: the donut chart is drawn with react-native-svg.
  - react-hook-form: the form validates with a zod schema.
- **Amount input** accepts both `1.500.000` and `1,500,000.50`.
- **Screens and features added:** the edit/delete transaction screen, display-currency setting, pull-to-refresh, and loading, error and empty states.
