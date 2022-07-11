import { UserStore } from "./user.store";
import { NextFunction, Request, Response } from "express";


export const getList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const users = UserStore.find(req.query.search as string);
    res.json(users);
}