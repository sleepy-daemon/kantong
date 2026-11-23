import * as SecureStore from 'expo-secure-store';

// SecureStore values should stay under ~2 KB, but a Supabase session (JWT +
// refresh token + user metadata) can exceed that. Split each value into
// chunks, each stored under its own encrypted key.
const CHUNK_SIZE = 1000; // characters; leaves headroom for multi-byte UTF-8

const countKey = (key: string) => `${key}.chunks`;
const chunkKey = (key: string, i: number) => `${key}.${i}`;

async function removeChunks(key: string): Promise<void> {
  const count = Number(await SecureStore.getItemAsync(countKey(key)));
  const deletes: Promise<void>[] = [SecureStore.deleteItemAsync(countKey(key))];
  for (let i = 0; i < (Number.isFinite(count) ? count : 0); i++) {
    deletes.push(SecureStore.deleteItemAsync(chunkKey(key, i)));
  }
  await Promise.all(deletes);
}

export const chunkedSecureStorage = {
  async getItem(key: string): Promise<string | null> {
    const raw = await SecureStore.getItemAsync(countKey(key));
    if (raw === null) return null;
    const count = Number(raw);
    const chunks = await Promise.all(
      Array.from({ length: count }, (_, i) => SecureStore.getItemAsync(chunkKey(key, i))),
    );
    // A missing chunk means a partial write; treat the value as absent.
    if (chunks.some((c) => c === null)) return null;
    return chunks.join('');
  },

  async setItem(key: string, value: string): Promise<void> {
    await removeChunks(key);
    const count = Math.ceil(value.length / CHUNK_SIZE);
    await Promise.all(
      Array.from({ length: count }, (_, i) =>
        SecureStore.setItemAsync(chunkKey(key, i), value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)),
      ),
    );
    // Write the count last so readers never see a count without its chunks.
    await SecureStore.setItemAsync(countKey(key), String(count));
  },

  removeItem: removeChunks,
};
