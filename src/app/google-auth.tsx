import { Redirect } from 'expo-router';

// OAuth redirect target (kantong://google-auth). openAuthSessionAsync in
// useAuth normally intercepts it; if the OS delivers the deep link to the
// router instead, send the user back to the app root.
export default function GoogleAuthRedirect() {
  return <Redirect href="/" />;
}
