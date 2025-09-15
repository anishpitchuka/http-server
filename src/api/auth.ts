import { Request, Response } from "express";
import { getUsersByEmail } from "../db/queries/users.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { UserResponse } from "./users.js";
import { config } from "../config.js";


type LoginResponse = UserResponse & {
  token: string;
};

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
        expiresIn?: number;
    };

    const params: parameters = req.body;

    const user = await getUsersByEmail(params.email);
    if(!user) {
        throw new UserNotAuthenticatedError(`Invalid username or password`);
    }

    const matching = await checkPasswordHash(params.password, user.hashedPassword);
    if(!matching) {
        throw new UserNotAuthenticatedError(`Invalid username or password`);
    }

    let duration = config.jwt.defaultDuration;
    if(params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
        duration = params.expiresIn;
    }

    const accessToken = makeJWT(user.id, duration, config.jwt.secret);

    respondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: accessToken,
    } satisfies LoginResponse);
}