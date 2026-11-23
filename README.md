# Kantong

A personal finance tracker for iOS and Android. Sign in with Google, log income and expenses, and see where your money goes each month.

*Kantong* is Indonesian for "pocket".

## Features

- **Dashboard.** Your all-time balance, this month's income and expenses, and your five most recent transactions.
- **Transactions.** Add, edit, and delete entries. Search by note or category, and filter by income or expense.
- **Analytics.** A donut chart of spending by category for any month, with amounts and percentages.
- **Categories.** 13 built-in categories, such as Food & Dining, Transportation, and Salary.
- **Currency.** Show amounts in IDR, USD, SGD, MYR, or EUR. Changing the currency only changes how amounts are displayed. Stored amounts are not converted.
- **Flexible amount input.** Type amounts the way you normally write them. Both `1.500.000` and `1,500,000.50` work.

Your data is private to your account. Other users can't read or change your transactions, even through the API. Your sign-in session is stored in the device's encrypted keychain or keystore.

## Tech stack

| Area | Tools |
| --- | --- |
| App | Expo SDK 58, React Native, Expo Router, TypeScript (strict) |
| Data and state | TanStack Query, Zustand, Zod |
| Backend | Supabase: Postgres with row-level security, Auth with Google OAuth |
| UI | react-native-svg (charts), expo-linear-gradient, @expo/vector-icons |

## Run it locally

### Before you start

You need:

- Node.js 22 or later
- A [Supabase](https://supabase.com) project
- A Google Cloud project, to create the OAuth client
- The **Expo Go** app on your phone, or an Android emulator or iOS simulator

### 1. Install dependencies

```sh
git clone https://github.com/sleepy-daemon/kantong.git
cd kantong
npm install
```

### 2. Set up the database

Link the Supabase CLI to your project and apply the migrations:

```sh
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This creates the `profiles`, `categories`, and `transactions` tables with their access rules, and adds the built-in categories.

### 3. Turn on Google sign-in

1. In [Google Cloud Console](https://console.cloud.google.com), go to **APIs & Services → OAuth consent screen** and configure it.
   - Choose **External** and add the `email`, `profile`, and `openid` scopes.
   - While the app is in *Testing*, add your Google account under **Test users**.
2. Go to **Credentials → Create credentials → OAuth client ID** and choose **Web application**.
   - Add this authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. In the Supabase dashboard, go to **Authentication → Sign In / Providers → Google**. Turn it on and paste the client ID and secret.
4. Go to **Authentication → URL Configuration → Redirect URLs** and add:
   - `kantong://google-auth`, for installed builds
   - `exp://**`, for Expo Go

### 4. Add your environment variables

Create a `.env.local` file in the project root. You'll find both values in the Supabase dashboard under **Project Settings → API**.

```sh
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Use the **publishable** key, which is safe to ship inside the app. Never put the secret key or the service role key here.

### 5. Start the app

```sh
npx expo start
```

Scan the QR code with Expo Go. Your phone and computer must be on the same network. Tap **Continue with Google** to sign in.

## Troubleshooting sign-in

| What you see | What to do |
| --- | --- |
| Google shows `redirect_uri_mismatch` | Make sure the OAuth client's redirect URI is exactly `https://<your-project-ref>.supabase.co/auth/v1/callback`. |
| Google shows "Access blocked" | Add your Google account as a test user on the OAuth consent screen. |
| The browser closes and you're back on the login screen | Add `exp://**` (Expo Go) or `kantong://google-auth` (installed build) to Supabase's Redirect URLs. |
| The app fails at startup with "Missing EXPO_PUBLIC_SUPABASE_URL" | Create `.env.local` (see step 4), then restart `npx expo start`. |

## Development

| Command | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm test` | Run the unit tests |
| `npm run typecheck` | Check types with `tsc` |
| `npm run lint` | Run ESLint |

After you change the database schema, add a migration in `supabase/migrations/`, apply it with `npx supabase db push`, and regenerate the types:

```sh
npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.types.ts
```

### Project layout

```
src/
  app/          Screens and navigation (Expo Router, file-based)
  components/   Reusable UI: transaction rows, chart, month picker
  hooks/        Data fetching and mutations
  lib/          Supabase client, query client, secure session storage
  store/        App state: signed-in user, selected month
  utils/        Formatting, parsing, validation, with tests
supabase/
  migrations/   Database schema, access rules, and summary functions
```

## Build for devices

To install the app on a phone without Expo Go, make a build with [EAS](https://docs.expo.dev/build/introduction/):

```sh
npx eas-cli@latest build --profile preview --platform android
```

The `preview` profile produces an `.apk` you can install directly. Before the first build, add the two `EXPO_PUBLIC_*` variables to EAS, because `.env.local` isn't uploaded:

```sh
npx eas-cli@latest env:create --environment preview --visibility plaintext --name EXPO_PUBLIC_SUPABASE_URL --value https://<your-project-ref>.supabase.co
npx eas-cli@latest env:create --environment preview --visibility plaintext --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value sb_publishable_...
```

## Keep the backend awake

Supabase pauses free projects after about a week without activity. The [Keep Supabase awake](.github/workflows/keep-alive.yml) workflow sends one request every 3 days. It needs two repository secrets, `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.

GitHub turns off scheduled workflows in repositories with no activity for 60 days, and emails you first. If that happens, re-enable the workflow from the **Actions** tab.

## Privacy

See the [privacy policy](PRIVACY.md).

## License

[MIT](LICENSE)
