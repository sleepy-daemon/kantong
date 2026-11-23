export function errorMessage(e: unknown, fallback = 'Something went wrong.'): string {
  if (e instanceof Error && e.message) return e.message;
  if (typeof e === 'object' && e !== null && 'message' in e && typeof e.message === 'string') {
    return e.message;
  }
  return fallback;
}
