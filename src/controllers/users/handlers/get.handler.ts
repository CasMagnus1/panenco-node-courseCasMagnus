import { UserStore } from "./user.store";
import { NextFunction, Request, Response } from "express";

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = UserStore.find(req.params.id);
    if (user.length == 0) {
        res.status(404);
        res.json({'details': 'user not found'});
    }
    else res.json(user);
}