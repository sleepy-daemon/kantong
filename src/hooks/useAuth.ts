import { useState } from 'react';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { errorMessage } from '@/utils/errors';

WebBrowser.maybeCompleteAuthSession();

// kantong://google-auth in builds; exp://<host>/--/google-auth in Expo Go.
// Both must be listed in Supabase → Auth → URL Configuration → Redirect URLs.
const redirectTo = Linking.createURL('google-auth');

function param(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (oauthError) throw oauthError;

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') return; // user cancelled or dismissed

      const { queryParams } = Linking.parse(result.url);
      const providerError = param(queryParams?.error_description) ?? param(queryParams?.error);
      if (providerError) throw new Error(providerError);

      const code = param(queryParams?.code);
      if (!code) throw new Error('Sign-in did not return an authorization code.');

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;
      // onAuthStateChange in the root layout picks up the new session.
    } catch (e) {
      setError(errorMessage(e, 'Sign-in failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    queryClient.clear(); // drop the previous user's cached data
  }

  return { signInWithGoogle, signOut, loading, error };
}
