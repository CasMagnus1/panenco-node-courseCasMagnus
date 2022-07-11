import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store";

export const deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    UserStore.delete(parseInt(req.params.id));
    res.send("deleted");
}