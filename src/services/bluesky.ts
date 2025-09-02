// src/services/bluesky.ts

import { AtpAgent } from '@atproto/api';

const client = new AtpAgent({ service: 'https://bsky.social' });
export { client };

export async function login(identifier: string, password: string): Promise<void> {
  await client.login({ identifier, password });
}

export async function obtenerFeedAutor(did: string): Promise<any> {
  const response = await client.api.app.bsky.feed.getAuthorFeed({
    actor: did,
  });
  return response.data;
}
