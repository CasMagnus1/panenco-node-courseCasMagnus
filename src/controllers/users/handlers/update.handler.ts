import { UserStore } from "./user.store";
import { NextFunction, Request, Response } from "express";

export const patchById = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const user = UserStore.get(id);
    if (!user) {
      res.status(404);
      return res.json({ error: 'User not found' });
    }
    const updated = UserStore.update(id, req.body);
    res.locals.body = updated; // Set the result on the locals object to pass it to the representation middleware.
    next(); // call next so the representation middleware is actually fired
}