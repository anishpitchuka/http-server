import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
    const [row] = await db
        .insert(chirps)
        .values(chirp)
        .returning();

    return row;
}

export async function getChirps() {
    return db.select().from(chirps);
}

export async function getChirp(id: string) {
    const rows = await db.select().from(chirps).where(eq(chirps.id, id));
    if(rows.length === 0) {
        return;
    }
    return rows[0];
}


export async function deleteChirp(id: string) {
  const rows = await db
    .delete(chirps)
    .where(eq(chirps.id, id))
    .returning();

  return rows.length > 0;
}