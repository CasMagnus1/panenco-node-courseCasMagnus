import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store";

export const deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (UserStore.get(parseInt(req.params.id))) {
        UserStore.delete(parseInt(req.params.id));
        res.send("deleted");
    }
    else {
        res.status(404);
        res.send("id not in use");
    }
}