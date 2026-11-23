# Kantong Privacy Policy

Last updated: November 23, 2026

Kantong is a personal finance tracker built as a portfolio project by sleepy-daemon. This page explains what data the app collects, how it's used, and how to have it deleted.

## What Kantong collects

**From your Google account, when you sign in:**
- Your name
- Your email address
- Your profile picture

Kantong doesn't get your Google password or access to your Gmail, contacts, Drive, or any other Google data.

**What you enter in the app:**
- Transactions: amount, type (income or expense), category, date, and an optional note
- Your display currency

Kantong doesn't collect your location, contacts, photos, or device identifiers. It has no ads, no analytics, and no tracking.

## How your data is used

Your data is only used to run the app: showing your transactions, balance, and spending summaries back to you. It isn't sold, rented, or shared for advertising or marketing.

## Where your data is stored

- Your account and transactions are stored in a [Supabase](https://supabase.com) database hosted in Singapore.
- Access rules in the database let only your signed-in account read or change your data. Other users of the app can't see it.
- The developer, as the database administrator, can technically access stored data. They don't look at it except when needed to fix a problem or handle a deletion request.
- Your sign-in session is stored on your device in encrypted secure storage. It's removed when you sign out.

## Services Kantong uses

- **Google:** to sign you in. See [Google's Privacy Policy](https://policies.google.com/privacy).
- **Supabase:** to host the database and handle sign-in sessions. See [Supabase's Privacy Policy](https://supabase.com/privacy).

## Deleting your data

The app doesn't have a delete-account button. To have your account and all your transactions permanently deleted, [open an issue](https://github.com/sleepy-daemon/kantong/issues) titled "Delete my account" and include the email address you signed in with. Don't include any other personal details. Your data will be deleted within 30 days, and the issue will be closed to confirm it's done.

You can delete individual transactions yourself at any time from the app.

## Children

Kantong isn't intended for children under 13 and doesn't knowingly collect their data.

## Changes to this policy

If this policy changes, the new version will be posted here with a new "Last updated" date.

## Contact

Questions about this policy: [open an issue](https://github.com/sleepy-daemon/kantong/issues).
