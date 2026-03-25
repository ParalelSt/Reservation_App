'use server';

import { db, users } from '@reservation-app/database';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/helpers/generateId';

interface SyncUserParams {
  auth0Id: string;
  email: string;
  name: string;
  picture: string | null;
}

/** Create or update user in DB on login. Returns the DB user. */
export async function syncUser(params: SyncUserParams) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.auth0Id, params.auth0Id))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(users)
      .set({
        name: params.name,
        email: params.email,
        picture: params.picture,
        updatedAt: new Date(),
      })
      .where(eq(users.auth0Id, params.auth0Id));
    return existing[0];
  }

  const [user] = await db.insert(users).values({
    id: generateId(),
    auth0Id: params.auth0Id,
    email: params.email,
    name: params.name,
    picture: params.picture,
  }).returning();

  return user;
}

export async function isUserAdmin(auth0Id: string): Promise<boolean> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.auth0Id, auth0Id))
    .limit(1);

  return user?.isAdmin ?? false;
}
