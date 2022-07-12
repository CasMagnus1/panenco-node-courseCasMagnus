import { NotFound } from "@panenco/papi";
import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store";

export const deleteById = (id: string) => {
    if (UserStore.get(parseInt(id))) {
        UserStore.delete(parseInt(id));
        return "deleted";
    }
    else {
        throw new NotFound("id not found", "id not found");
    }
}