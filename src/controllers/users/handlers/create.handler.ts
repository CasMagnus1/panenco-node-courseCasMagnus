import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.name == null) {
        return next({"details":"no user name provided"});
    }
    const user = UserStore.add(req.body);
    res.json(user);
}