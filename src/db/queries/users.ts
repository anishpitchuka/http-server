import { db } from "..";
import { NewUser, users } from "../schema";

export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    
    return result;
}