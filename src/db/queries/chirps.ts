import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
    const [row] = await db
        .insert(chirps)
        .values(chirp)
        .returning();

    return row;
}