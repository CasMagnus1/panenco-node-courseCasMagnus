import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { UserStore } from "./user.store";
import { UserBody } from "../../../contracts/user.body";
import { validate } from "class-validator";
import { UserView } from "../../../contracts/user.view";

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // transform the plain object to an instance of our UserBody class using the plainToInstance function from the class-transformer package
    const transformed = plainToInstance(UserBody, req.body);
    // now validate the transformed object and retrieve possible errors
    const validationErrors = await validate(transformed, {
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true,
    });
    // if errors were found pass them to the express NextFunction and express will skip any remaining non-error handling middleware and output these errors as the response.
    if (validationErrors.length) {
        return next(validationErrors);
    }
    const user = UserStore.add(transformed);
    // if (req.body.name == null) {
    //     return next({"details":"no user name provided"});
    // }
    // const user = UserStore.add(req.body);
    res.json(plainToInstance(UserView, user));
}