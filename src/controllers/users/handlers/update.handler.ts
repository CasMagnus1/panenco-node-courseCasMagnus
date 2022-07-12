import { User, UserStore } from "./user.store";
import { NextFunction, Request, Response } from "express";
import { UserBody } from "../../../contracts/user.body";
import { NotFound } from "@panenco/papi";

export const patchById = (id: string, body: UserBody) => {
    const user = UserStore.get(parseInt(id));
    if (!user) {
      throw new NotFound("id not found", "id not found");
    }
    const updated = UserStore.update(parseInt(id), body as User);
    return  updated; // Set the result on the locals object to pass it to the representation middleware.
}